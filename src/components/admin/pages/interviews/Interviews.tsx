import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody } from "../../ui/Card";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../../ui/Table";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import { Filter, Calendar, Search } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../store/userStore";
import { BASE_URL } from "../../../../utils/Constants";
import {
  InterviewStatus,
  ModeOfInterview,
  Job,
  JobApplication,
  Interview,
} from "../../../../utils/types";

interface InterviewWithDetails {
  id: number;
  scheduledAt: string;
  status: InterviewStatus;
  jobApplicationId: number;
  interviewerName?: string;
  interviewerEmail?: string;
  interviewerPhone?: string;
  modeOfInterview: ModeOfInterview;
  interviewResult?: string;
  createdAt: string;
  updatedAt: string;
  jobApplication: JobApplication;
  job: Job;
}

const Interviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<InterviewStatus | "">("");
  const [filterMode, setFilterMode] = useState<ModeOfInterview | "">("");
  const [interviews, setInterviews] = useState<InterviewWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUserStore();

  // Fetch interviews and job details
  const fetchInterviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${BASE_URL}/application/interview/schedule`,
        {
          headers: { "x-access-token": token },
        }
      );

      console.log(response.data.response);
      if (
        response.data.message === "ok" &&
        Array.isArray(response.data.response)
      ) {
        const interviewsData: Interview[] = response.data.response;

        // Fetch job details for each interview
        const interviewsWithDetails: InterviewWithDetails[] = await Promise.all(
          interviewsData.map(async (interview) => {
            try {
              const jobResponse = await axios.get(
                `${BASE_URL}/job/${interview.jobApplication.jobId}`
              );
              if (
                jobResponse.data.success === "ok" &&
                jobResponse.data.response
              ) {
                return {
                  ...interview,
                  jobApplication: {
                    ...interview.jobApplication,
                    applicantName: "Unknown Applicant", // API doesn't provide name
                    applicantEmail: "unknown@example.com", // API doesn't provide email
                  },
                  job: jobResponse.data.response,
                };
              } else {
                throw new Error("Unexpected job response format");
              }
            } catch (jobError) {
              console.error(
                `Failed to fetch job ${interview.jobApplication.jobId}:`,
                jobError
              );
              return {
                ...interview,
                jobApplication: {
                  ...interview.jobApplication,
                  applicantName: "Unknown Applicant",
                  applicantEmail: "unknown@example.com",
                },
                job: {
                  id: interview.jobApplication.jobId,
                  title: "Unknown Job",
                  campus: "Unknown Campus",
                  description: "",
                  companyName: "",
                  jobType: JobType.FULL_TIME,
                  status: JobStatus.ACTIVE,
                  adminId: 0,
                  Qualification: "",
                  department: "",
                  applicationDeadline: new Date().toISOString(),
                },
              };
            }
          })
        );

        setInterviews(interviewsWithDetails);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch interviews";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInterviews();
    } else {
      setError("Please log in to view interviews");
      setIsLoading(false);
    }
  }, [token]);

  // Filter interviews
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.jobApplication.applicantName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      interview.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (interview.interviewerName &&
        interview.interviewerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus
      ? interview.status === filterStatus
      : true;
    const matchesMode = filterMode
      ? interview.modeOfInterview === filterMode
      : true;

    return matchesSearch && matchesStatus && matchesMode;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchInterviews} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Interviews</h1>
        <div className="flex gap-2">
          <Button icon={<Calendar className="w-4 h-4" />} variant="outline">
            Calendar View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  className="pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as InterviewStatus | "")
                  }
                >
                  <option value="">All Statuses</option>
                  {Object.values(InterviewStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  className="pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={filterMode}
                  onChange={(e) =>
                    setFilterMode(e.target.value as ModeOfInterview | "")
                  }
                >
                  <option value="">All Modes</option>
                  {Object.values(ModeOfInterview).map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Interviews Table */}
      <Card>
        <CardBody className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Applicant</TableCell>
                <TableCell header>Job Position</TableCell>
                <TableCell header>Date & Time</TableCell>
                <TableCell header>Interviewer</TableCell>
                <TableCell header>Mode</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInterviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {interview.jobApplication.applicantName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {interview.jobApplication.applicantEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {interview.job.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {interview.job.campus}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {new Date(interview.scheduledAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(interview.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {interview.interviewerName || "Not assigned"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      type="interviewMode"
                      status={interview.modeOfInterview}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge type="interview" status={interview.status} />
                    {interview.interviewResult && (
                      <div className="mt-1">
                        <Badge
                          type="interviewResult"
                          status={interview.interviewResult}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/applications/${interview.jobApplicationId}`}
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInterviews.length === 0 && (
                <TableRow>
                  <td colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">
                      No interviews found matching your filters
                    </div>
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Interviews;
