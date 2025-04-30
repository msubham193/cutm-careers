import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "../../ui/Card";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import {
  jobApplications,
  jobs,
  interviews,
  updateApplicationStatus,
  updateInterview,
} from "../../../../data/mockData";
import {
  JobApplication,
  Job,
  Interview,
  ApplicationStatus,
  InterviewStatus,
  ModeOfInterview,
  InterviewResult,
} from "../../../../utils/types";
import {
  Calendar,
  FileText,
  ExternalLink,
  Clock,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(
    ApplicationStatus.PENDING
  );

  // Interview form state
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [interviewTime, setInterviewTime] = useState<string>("");
  const [interviewerName, setInterviewerName] = useState<string>("");
  const [interviewerEmail, setInterviewerEmail] = useState<string>("");
  const [interviewerPhone, setInterviewerPhone] = useState<string>("");
  const [interviewMode, setInterviewMode] = useState<ModeOfInterview>(
    ModeOfInterview.ONLINE
  );

  // Interview result state
  const [interviewResult, setInterviewResult] = useState<InterviewResult>(
    InterviewResult.SELECTED
  );

  useEffect(() => {
    if (id) {
      const appId = parseInt(id);
      const foundApp = jobApplications.find((a) => a.id === appId);

      if (foundApp) {
        setApplication(foundApp);
        setNewStatus(foundApp.status);

        // Get job details
        const foundJob = jobs.find((j) => j.id === foundApp.jobId);
        if (foundJob) {
          setJob(foundJob);
        }

        // Get interview if exists
        const foundInterview = interviews.find(
          (i) => i.jobApplicationId === appId
        );
        if (foundInterview) {
          setInterview(foundInterview);

          // Set interview form values from existing interview
          const date = new Date(foundInterview.scheduledAt);
          setInterviewDate(date.toISOString().split("T")[0]);
          setInterviewTime(date.toISOString().split("T")[1].substring(0, 5));
          setInterviewerName(foundInterview.interviewerName || "");
          setInterviewerEmail(foundInterview.interviewerEmail || "");
          setInterviewerPhone(foundInterview.interviewerPhone || "");
          setInterviewMode(foundInterview.modeOfInterview);
          if (foundInterview.interviewResult) {
            setInterviewResult(foundInterview.interviewResult);
          }
        }
      } else {
        setError("Application not found");
      }

      setLoading(false);
    }
  }, [id]);

  const handleStatusChange = () => {
    if (application) {
      const updatedApp = updateApplicationStatus(application.id, newStatus);
      setApplication(updatedApp);
      setShowStatusModal(false);
    }
  };

  const handleScheduleInterview = () => {
    const scheduledAt = new Date(`${interviewDate}T${interviewTime}`);

    // If interview exists, update it
    if (interview) {
      const updatedInterview = updateInterview(interview.id, {
        scheduledAt: scheduledAt.toISOString(),
        status: InterviewStatus.SCHEDULED,
        interviewerName,
        interviewerEmail,
        interviewerPhone,
        modeOfInterview: interviewMode,
      });
      setInterview(updatedInterview);
    } else {
      // Create new interview
      const newInterview: Interview = {
        id: interviews.length + 1,
        scheduledAt: scheduledAt.toISOString(),
        status: InterviewStatus.SCHEDULED,
        jobApplicationId: application!.id,
        interviewerName,
        interviewerEmail,
        interviewerPhone,
        modeOfInterview: interviewMode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      interviews.push(newInterview);
      setInterview(newInterview);

      // Update application status
      if (application) {
        const updatedApp = updateApplicationStatus(
          application.id,
          ApplicationStatus.INTERVIEW_SCHEDULED
        );
        setApplication(updatedApp);
        setNewStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
      }
    }

    setShowInterviewModal(false);
  };

  const handleUpdateResult = () => {
    if (interview) {
      // Update interview result
      const updatedInterview = updateInterview(interview.id, {
        interviewResult,
        status: InterviewStatus.COMPLETED,
      });
      setInterview(updatedInterview);

      // Update application status based on result
      if (application) {
        let newAppStatus = application.status;

        if (interviewResult === InterviewResult.SELECTED) {
          newAppStatus = ApplicationStatus.ACCEPTED;
        } else if (interviewResult === InterviewResult.REJECTED) {
          newAppStatus = ApplicationStatus.REJECTED;
        }

        const updatedApp = updateApplicationStatus(
          application.id,
          newAppStatus
        );
        setApplication(updatedApp);
        setNewStatus(newAppStatus);
      }

      setShowResultModal(false);
    }
  };

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
          Application: {application.applicantName}
        </h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={<Clock className="w-4 h-4" />}
            onClick={() => setShowStatusModal(true)}
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
                        window.open(application.resumeURL, "_blank")
                      }
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
              {interview ? (
                <div className="flex space-x-2">
                  {interview.status !== InterviewStatus.COMPLETED && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowInterviewModal(true)}
                    >
                      Reschedule
                    </Button>
                  )}
                  {interview.status === InterviewStatus.SCHEDULED && (
                    <Button size="sm" onClick={() => setShowResultModal(true)}>
                      Update Result
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  icon={<Calendar className="w-4 h-4" />}
                  onClick={() => setShowInterviewModal(true)}
                >
                  Schedule Interview
                </Button>
              )}
            </CardHeader>
            <CardBody>
              {interview ? (
                <div className="space-y-4">
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
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    No interview scheduled yet
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
                  >
                    Mark as Under Review
                  </Button>
                )}

                {application.status === ApplicationStatus.UNDER_REVIEW && (
                  <Button
                    className="w-full"
                    onClick={() => setShowInterviewModal(true)}
                  >
                    Schedule Interview
                  </Button>
                )}

                {application.status === ApplicationStatus.INTERVIEW_SCHEDULED &&
                  interview?.status === InterviewStatus.SCHEDULED && (
                    <Button
                      className="w-full"
                      onClick={() => setShowResultModal(true)}
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
                    onChange={(e) =>
                      setNewStatus(e.target.value as ApplicationStatus)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              >
                Cancel
              </Button>
              <Button onClick={handleStatusChange}>Update Status</Button>
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
                {interview ? "Reschedule Interview" : "Schedule Interview"}
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
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
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
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
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
                    onChange={(e) =>
                      setInterviewMode(e.target.value as ModeOfInterview)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
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
                    onChange={(e) => setInterviewerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    onChange={(e) => setInterviewerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    onChange={(e) => setInterviewerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowInterviewModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleScheduleInterview}>
                {interview ? "Update Interview" : "Schedule Interview"}
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
                    onChange={(e) =>
                      setInterviewResult(e.target.value as InterviewResult)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
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
                onClick={() => setShowResultModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateResult}>Update Result</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;
