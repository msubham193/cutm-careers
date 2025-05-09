import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "../../ui/Card";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../store/userStore";
import { BASE_URL } from "../../../../utils/Constants";
import {
  JobApplication,
  Job,
  Interview,
  ApplicationStatus,
  InterviewStatus,
  ModeOfInterview,
  InterviewResult,
  UserApplicationResponse,
} from "../../../../utils/types";
import {
  Calendar,
  FileText,
  ExternalLink,
  Clock,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// Define API response interfaces
interface ApplicationResponse {
  message: string;
  response: {
    id: number;
    jobId: number;
    status: string;
    appliedAt: string;
    updatedAt: string;
    submittedAt: string | null;
    user: {
      id: number;
      name: string;
      email: string;
      phoneNumber: string;
      resumeUrl: string;
    };
    job: Job;
  };
}

interface InterviewResponse {
  message: string;
  response: UserApplicationResponse[];
}

interface StatusUpdateResponse {
  success: string;
  response: boolean;
}

interface InterviewApiResponse {
  success: string;
  response: Interview & { jobApplication?: JobApplication };
}

interface InterviewResultResponse {
  success: string;
  response: { updatedInterviewData: Interview; jobApplication: JobApplication };
}

// Error response interface for Axios errors
interface ErrorResponse {
  message?: string;
}

// Centralized error handling
const handleAxiosError = (error: AxiosError<ErrorResponse>): string => {
  if (error.response) {
    if (error.response.status === 401) {
      return "Unauthorized. Please log in again.";
    }
    if (error.response.status === 404) {
      return "Application not found";
    }
    return error.response.data?.message || "An error occurred";
  }
  if (error.request) {
    return "Unable to reach the server. Please check your network or contact support.";
  }
  return error.message || "An unexpected error occurred";
};

// Enum validation
const isValidApplicationStatus = (
  status: string
): status is ApplicationStatus =>
  Object.values(ApplicationStatus).includes(status as ApplicationStatus);

const isValidInterviewStatus = (status: string): status is InterviewStatus =>
  Object.values(InterviewStatus).includes(status as InterviewStatus);

const isValidModeOfInterview = (mode: string): mode is ModeOfInterview =>
  Object.values(ModeOfInterview).includes(mode as ModeOfInterview);

const isValidInterviewResult = (result: string): result is InterviewResult =>
  Object.values(InterviewResult).includes(result as InterviewResult);

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useUserStore();

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(
    ApplicationStatus.PENDING
  );

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [interviewTime, setInterviewTime] = useState<string>("");
  const [interviewerName, setInterviewerName] = useState<string>("");
  const [interviewerEmail, setInterviewerEmail] = useState<string>("");
  const [interviewerPhone, setInterviewerPhone] = useState<string>("");
  const [interviewMode, setInterviewMode] = useState<ModeOfInterview>(
    ModeOfInterview.ONLINE
  );
  const [interviewResult, setInterviewResult] = useState<InterviewResult>(
    InterviewResult.SELECTED
  );

  // Fetch application and interview data
  const fetchApplicationData = async () => {
    if (!id || isNaN(parseInt(id))) {
      setError("Invalid application ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const appResponse = await axios.get<ApplicationResponse>(
        `${BASE_URL}/application/apd/${id}`,
        { headers: { "x-access-token": token } }
      );

      if (
        appResponse.data.message === "fetched all Data" &&
        appResponse.data.response
      ) {
        const { user, job, ...appData } = appResponse.data.response;
        const mappedApp: JobApplication = {
          id: appData.id,
          jobId: appData.jobId,
          applicantName: user.name,
          applicantEmail: user.email,
          applicantPhone: user.phoneNumber,
          resumeURL: user.resumeUrl,
          status: isValidApplicationStatus(appData.status)
            ? appData.status
            : ApplicationStatus.PENDING,
          createdAt: appData.appliedAt,
          updatedAt: appData.updatedAt,
          submittedAt: appData.submittedAt ? new Date(appData.submittedAt) : null,
          userId: user.id,
        };
        setApplication(mappedApp);
        setNewStatus(mappedApp.status);
        setJob(job);

        try {
          const interviewResponse = await axios.get<InterviewResponse>(
            `${BASE_URL}/application/interview/user/${user.id}`,
            { headers: { "x-access-token": token } }
          );

          if (
            interviewResponse.data.message === "fetched all Data" &&
            Array.isArray(interviewResponse.data.response)
          ) {
            const targetApp = interviewResponse.data.response.find(
              (app) => app.id === parseInt(id)
            );
            setInterviews(
              (targetApp?.Interview ?? []).map((int) => ({
                ...int,
                status: isValidInterviewStatus(int.status)
                  ? int.status
                  : InterviewStatus.SCHEDULED,
                modeOfInterview: isValidModeOfInterview(int.modeOfInterview)
                  ? int.modeOfInterview
                  : ModeOfInterview.ONLINE,
                interviewResult: int.interviewResult
                  ? isValidInterviewResult(int.interviewResult)
                    ? int.interviewResult
                    : InterviewResult.SELECTED
                  : undefined,
              }))
            );
            if (!targetApp) {
              toast.warn("Application not found in user interviews", {
                position: "top-right",
                autoClose: 5000,
              });
            }
          } else {
            throw new Error("Unexpected interview response format");
          }
        } catch (interviewError) {
          const errorMessage = handleAxiosError(
            interviewError as AxiosError<ErrorResponse>
          );
          toast.warn(errorMessage, { position: "top-right", autoClose: 5000 });
          setInterviews([]);
        }
      } else {
        throw new Error("Unexpected application response format");
      }
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosError<ErrorResponse>);
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const handleStatusChange = async () => {
    if (!application || !job || !token) {
      toast.error("Missing required data", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put<StatusUpdateResponse>(
        `${BASE_URL}/application/change-status/${application.id}`,
        {
          applicationId: application.id,
          status: newStatus,
          jobTitle: job.title,
        },
        { headers: { "x-access-token": token } }
      );

      if (response.data.success === "ok" && response.data.response) {
        setApplication({ ...application, status: newStatus });
        toast.success("Application status updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowStatusModal(false);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosError<ErrorResponse>);
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Schedule or reschedule interview
  const handleScheduleInterview = async () => {
    if (!application || !token || !interviewDate || !interviewTime) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const scheduleDate = new Date(`${interviewDate}T${interviewTime}:00.000Z`);
    if (isNaN(scheduleDate.getTime())) {
      toast.error("Invalid date or time", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      let response: { data: InterviewApiResponse };
      if (selectedInterview) {
        response = await axios.put<InterviewApiResponse>(
          `${BASE_URL}/api/interview/${selectedInterview.id}`,
          {
            interviewerName,
            interviewerEmail,
            interviewerPhone,
            jobApplicationId: application.id,
            modeOfInterview: interviewMode,
            scheduledAt: scheduleDate.toISOString(),
            status: InterviewStatus.SCHEDULED,
          },
          { headers: { "x-access-token": token } }
        );
      } else {
        response = await axios.post<InterviewApiResponse>(
          `${BASE_URL}/application/schedule-interview/cutm`,
          {
            interviewerName,
            interviewerEmail,
            interviewerPhone,
            jobApplicationId: application.id,
            modeOfInterview: interviewMode,
            scheduleDate: scheduleDate.toISOString(),
          },
          { headers: { "x-access-token": token } }
        );
      }

      if (response.data.success === "ok" && response.data.response) {
        const updatedInterview: Interview = {
          id: response.data.response.id,
          jobApplicationId: response.data.response.jobApplicationId,
          scheduledAt: response.data.response.scheduledAt,
          status: isValidInterviewStatus(response.data.response.status)
            ? response.data.response.status
            : InterviewStatus.SCHEDULED,
          interviewerName: response.data.response.interviewerName,
          interviewerEmail: response.data.response.interviewerEmail,
          interviewerPhone: response.data.response.interviewerPhone,
          modeOfInterview: isValidModeOfInterview(
            response.data.response.modeOfInterview
          )
            ? response.data.response.modeOfInterview
            : ModeOfInterview.ONLINE,
          interviewResult: response.data.response.interviewResult
            ? isValidInterviewResult(response.data.response.interviewResult)
              ? response.data.response.interviewResult
              : InterviewResult.SELECTED
            : undefined,
          createdAt: response.data.response.createdAt,
          updatedAt: response.data.response.updatedAt,
        };
        setInterviews((prev) =>
          selectedInterview
            ? prev.map((int) =>
                int.id === updatedInterview.id ? updatedInterview : int
              )
            : [...prev, updatedInterview]
        );
        setApplication({
          ...application,
          status:
            response.data.response.jobApplication?.status || application.status,
        });
        setNewStatus(
          response.data.response.jobApplication?.status || application.status
        );
        toast.success(
          selectedInterview
            ? "Interview rescheduled successfully!"
            : "Interview scheduled successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        setShowInterviewModal(false);
        setSelectedInterview(null);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosError<ErrorResponse>);
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Update interview result
  const handleUpdateResult = async () => {
    if (!selectedInterview || !token) {
      toast.error("No interview selected", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put<InterviewResultResponse>(
        `${BASE_URL}/application/interview-result/${selectedInterview.id}`,
        { status: interviewResult },
        { headers: { "x-access-token": token } }
      );

      if (response.data.success === "ok" && response.data.response) {
        const { updatedInterviewData, jobApplication } = response.data.response;
        setInterviews((prev) =>
          prev.map((int) =>
            int.id === updatedInterviewData.id ? updatedInterviewData : int
          )
        );
        setApplication((prev) =>
          prev ? { ...prev, status: jobApplication.status } : prev
        );
        setNewStatus(jobApplication.status);
        toast.success("Interview result updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowResultModal(false);
        setShowConfirmModal(false);
        setSelectedInterview(null);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      const errorMessage = handleAxiosError(error as AxiosError<ErrorResponse>);
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Open interview modal for scheduling or rescheduling
  const openInterviewModal = (interview?: Interview) => {
    setSelectedInterview(interview || null);
    if (interview) {
      const date = new Date(interview.scheduledAt);
      if (!isNaN(date.getTime())) {
        setInterviewDate(date.toISOString().split("T")[0]);
        setInterviewTime(date.toISOString().split("T")[1].substring(0, 5));
      } else {
        setInterviewDate("");
        setInterviewTime("");
      }
      setInterviewerName(interview.interviewerName || "");
      setInterviewerEmail(interview.interviewerEmail || "");
      setInterviewerPhone(interview.interviewerPhone || "");
      setInterviewMode(
        isValidModeOfInterview(interview.modeOfInterview)
          ? interview.modeOfInterview
          : ModeOfInterview.ONLINE
      );
    } else {
      setInterviewDate("");
      setInterviewTime("");
      setInterviewerName("");
      setInterviewerEmail("");
      setInterviewerPhone("");
      setInterviewMode(ModeOfInterview.ONLINE);
    }
    setShowInterviewModal(true);
  };

  // Open result modal
  const openResultModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setInterviewResult(
      interview.interviewResult &&
        isValidInterviewResult(interview.interviewResult)
        ? interview.interviewResult
        : InterviewResult.SELECTED
    );
    setShowResultModal(true);
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid application ID");
      setLoading(false);
      return;
    }
    fetchApplicationData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !application || !job) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-red-600 mb-4">
          {error || "Application not found"}
        </h2>
        <Button onClick={() => navigate("/admin/applications")}>
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Application: {application.applicantName ?? "Unknown"}
        </h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={<Clock className="w-4 h-4" />}
            onClick={() => setShowStatusModal(true)}
            disabled={loading}
          >
            Update Status
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Application Details */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                Applicant Information
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Name
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {application.applicantName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-gray-900">
                    {application.applicantEmail}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 text-gray-900">
                    {application.applicantPhone}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Resume</h3>
                  <p className="mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FileText className="w-4 h-4" />}
                      className="mt-1"
                      onClick={() =>
                        application.resumeURL &&
                        window.open(application.resumeURL, "_blank")
                      }
                      disabled={!application.resumeURL}
                    >
                      View Resume
                    </Button>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Applied On
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <Badge type="application" status={application.status} />
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Interview Section */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Interview Information
              </h2>
              <Button
                size="sm"
                icon={<Calendar className="w-4 h-4" />}
                onClick={() => openInterviewModal()}
                disabled={loading}
              >
                Schedule Interview
              </Button>
            </CardHeader>
            <CardBody>
              {interviews.length > 0 ? (
                <div className="space-y-6">
                  {interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Status
                          </h3>
                          <Badge type="interview" status={interview.status} />
                        </div>
                        {interview.interviewResult && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              Result
                            </h3>
                            <Badge
                              type="interviewResult"
                              status={interview.interviewResult}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Scheduled For
                          </h3>
                          <p className="mt-1 text-gray-900">
                            {new Date(interview.scheduledAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Mode
                          </h3>
                          <p className="mt-1">
                            <Badge
                              type="interviewMode"
                              status={interview.modeOfInterview}
                            />
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Interviewer
                          </h3>
                          <p className="mt-1 text-gray-900">
                            {interview.interviewerName || "Not assigned"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Interviewer Contact
                          </h3>
                          <p className="mt-1 text-gray-900">
                            {interview.interviewerEmail &&
                            interview.interviewerPhone
                              ? `${interview.interviewerEmail} | ${interview.interviewerPhone}`
                              : "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {interview.status !== InterviewStatus.COMPLETED && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openInterviewModal(interview)}
                            disabled={loading}
                          >
                            Reschedule
                          </Button>
                        )}
                        {interview.status === InterviewStatus.SCHEDULED && (
                          <Button
                            size="sm"
                            onClick={() => openResultModal(interview)}
                            disabled={loading}
                          >
                            Update Result
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    No interviews scheduled yet
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                Job Information
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Position
                  </h3>
                  <p className="mt-1 font-medium text-gray-900">{job.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Campus</h3>
                  <p className="mt-1 text-gray-900">{job.campus}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Job Type
                  </h3>
                  <p className="mt-1">
                    <Badge type="jobType" status={job.jobType} />
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Salary Range
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {job.salaryRange || "Not specified"}
                  </p>
                </div>
                <div className="pt-2">
                  <Link to={`/admin/jobs/${job.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ExternalLink className="w-4 h-4" />}
                      className="w-full"
                    >
                      View Job
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                Quick Actions
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {application.status === ApplicationStatus.PENDING && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setNewStatus(ApplicationStatus.UNDER_REVIEW);
                      handleStatusChange();
                    }}
                    disabled={loading}
                  >
                    Mark as Under Review
                  </Button>
                )}

                {application.status === ApplicationStatus.UNDER_REVIEW && (
                  <Button
                    className="w-full"
                    onClick={() => openInterviewModal()}
                    disabled={loading}
                  >
                    Schedule Interview
                  </Button>
                )}

                {application.status === ApplicationStatus.INTERVIEW_SCHEDULED &&
                  interviews.some(
                    (int) => int.status === InterviewStatus.SCHEDULED
                  ) && (
                    <Button
                      className="w-full"
                      onClick={() => {
                        const scheduledInterview = interviews.find(
                          (int) => int.status === InterviewStatus.SCHEDULED
                        );
                        if (scheduledInterview) {
                          openResultModal(scheduledInterview);
                        }
                      }}
                      disabled={loading}
                    >
                      Update Interview Result
                    </Button>
                  )}

                {(application.status === ApplicationStatus.UNDER_REVIEW ||
                  application.status === ApplicationStatus.PENDING) && (
                  <>
                    <Button
                      className="w-full"
                      variant="success"
                      icon={<ThumbsUp className="w-4 h-4" />}
                      onClick={() => {
                        setNewStatus(ApplicationStatus.ACCEPTED);
                        handleStatusChange();
                      }}
                      disabled={loading}
                    >
                      Accept Application
                    </Button>

                    <Button
                      className="w-full"
                      variant="danger"
                      icon={<ThumbsDown className="w-4 h-4" />}
                      onClick={() => {
                        setNewStatus(ApplicationStatus.REJECTED);
                        handleStatusChange();
                      }}
                      disabled={loading}
                    >
                      Reject Application
                    </Button>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                Update Application Status
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Status
                  </label>
                  <Badge type="application" status={application.status} />
                </div>

                <div>
                  <label
                    htmlFor="newStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Status
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewStatus(e.target.value as ApplicationStatus)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    {Object.values(ApplicationStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleStatusChange} disabled={loading}>
                Update Status
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedInterview
                  ? "Reschedule Interview"
                  : "Schedule Interview"}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="interviewDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date*
                    </label>
                    <input
                      type="date"
                      id="interviewDate"
                      value={interviewDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInterviewDate(e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="interviewTime"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Time*
                    </label>
                    <input
                      type="time"
                      id="interviewTime"
                      value={interviewTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInterviewTime(e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="interviewMode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mode of Interview*
                  </label>
                  <select
                    id="interviewMode"
                    value={interviewMode}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setInterviewMode(e.target.value as ModeOfInterview)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  >
                    {Object.values(ModeOfInterview).map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="interviewerName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Interviewer Name
                  </label>
                  <input
                    type="text"
                    id="interviewerName"
                    value={interviewerName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInterviewerName(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="interviewerEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Interviewer Email
                  </label>
                  <input
                    type="email"
                    id="interviewerEmail"
                    value={interviewerEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInterviewerEmail(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="interviewerPhone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Interviewer Phone
                  </label>
                  <input
                    type="tel"
                    id="interviewerPhone"
                    value={interviewerPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInterviewerPhone(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInterviewModal(false);
                  setSelectedInterview(null);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleScheduleInterview} disabled={loading}>
                {selectedInterview
                  ? "Reschedule Interview"
                  : "Schedule Interview"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Interview Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                Update Interview Result
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="interviewResult"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Interview Result*
                  </label>
                  <select
                    id="interviewResult"
                    value={interviewResult}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setInterviewResult(e.target.value as InterviewResult)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  >
                    {Object.values(InterviewResult).map((result) => (
                      <option key={result} value={result}>
                        {result}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Note:</strong> Updating the interview result
                        will also update the application status accordingly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResultModal(false);
                  setShowConfirmModal(false);
                  setSelectedInterview(null);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateResult} disabled={loading}>
                Update Result
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Update
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600">
                Do you want to update the interview result?
              </p>
            </CardBody>
            <CardFooter className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowResultModal(false);
                  setSelectedInterview(null);
                }}
                disabled={loading}
              >
                No
              </Button>
              <Button onClick={handleUpdateResult} disabled={loading}>
                Yes
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;
