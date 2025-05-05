import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { Plus, Filter, Search } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../store/userStore";
import { BASE_URL } from "../../../../utils/Constants";
import { JobStatus, JobType, Job } from "../../../../utils/types";

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "">("");
  const [filterType, setFilterType] = useState<JobType | "">("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUserStore();
  const location = useLocation();

  // Fetch jobs from backend
  const fetchJobs = async () => {
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      toast.error("Authentication token missing. Please log in again.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/job`, {
        headers: {
          "x-access-token": token,
        },
      });

      if (
        response.data.success === "ok" &&
        Array.isArray(response.data.response)
      ) {
        setJobs(response.data.response);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      let errorMessage = "Failed to fetch jobs";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        if (error.response.status === 401) {
          errorMessage = "Unauthorized. Please log in again.";
        }
      } else if (error.request) {
        errorMessage =
          "Unable to reach the server. Please check your network or contact support.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on mount and when navigating back to /admin/jobs
  useEffect(() => {
    fetchJobs();
  }, [token, location.pathname]);

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.campus.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? job.status === filterStatus : true;
    const matchesType = filterType ? job.jobType === filterType : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="text-center p-8">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 mx-auto"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <p className="mt-2 text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <Button onClick={fetchJobs}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
        <Link to="/admin/jobs/create">
          <Button icon={<Plus className="w-4 h-4" />}>Add New Job</Button>
        </Link>
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
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  className="pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as JobStatus | "")
                  }
                  disabled={loading}
                >
                  <option value="">All Statuses</option>
                  {Object.values(JobStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
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
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as JobType | "")
                  }
                  disabled={loading}
                >
                  <option value="">All Types</option>
                  {Object.values(JobType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
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

      {/* Jobs Table */}
      <Card>
        <CardBody className="p-0">
          {filteredJobs.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-600">No jobs found.</p>
              <Link to="/admin/jobs/create">
                <Button className="mt-4" icon={<Plus className="w-4 h-4" />}>
                  Create a Job
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Job Title</TableCell>
                  <TableCell header>Campus</TableCell>
                  <TableCell header>Type</TableCell>
                  <TableCell header>Salary Range</TableCell>
                  <TableCell header>Status</TableCell>
                  <TableCell header>Created At</TableCell>
                  <TableCell header>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-md">
                        {job.description.length > 80
                          ? `${job.description.substring(0, 80)}...`
                          : job.description}
                      </div>
                    </TableCell>
                    <TableCell>{job.campus}</TableCell>
                    <TableCell>
                      <Badge type="jobType" status={job.jobType} />
                    </TableCell>
                    <TableCell>{job.salaryRange || "Not specified"}</TableCell>
                    <TableCell>
                      <Badge type="job" status={job.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link to={`/admin/jobs/${job.id}`} state={{ job }}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link to={`/admin/jobs/${job.id}/edit`}>
                          <Button variant="primary" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Jobs;
