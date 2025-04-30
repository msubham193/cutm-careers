import React, { useState } from "react";
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
import { interviews, jobApplications, jobs } from "../../../../data/mockData";
import {
  InterviewStatus,
  ModeOfInterview,
  Job,
  JobApplication,
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
  application: JobApplication;
  job: Job;
}

const Interviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<InterviewStatus | "">("");
  const [filterMode, setFilterMode] = useState<ModeOfInterview | "">("");

  // Get interviews with application and job details
  const interviewsWithDetails: InterviewWithDetails[] = interviews.map(
    (interview) => {
      const application = jobApplications.find(
        (app) => app.id === interview.jobApplicationId
      )!;
      const job = jobs.find((j) => j.id === application.jobId)!;

      return {
        ...interview,
        application,
        job,
      };
    }
  );

  // Filter interviews
  const filteredInterviews = interviewsWithDetails.filter((interview) => {
    const matchesSearch =
      interview.application.applicantName
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
                      {interview.application.applicantName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {interview.application.applicantEmail}
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
                      <Link to={`/admin/applications/${interview.jobApplicationId}`}>
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
