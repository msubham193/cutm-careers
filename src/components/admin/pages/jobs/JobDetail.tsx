import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Card, CardHeader, CardBody } from "../../ui/Card";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../store/userStore";
import { BASE_URL } from "../../../../utils/Constants";
import { Job, JobStatus } from "../../../../utils/types";
export interface JobApplication {
  id: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    createdAt: string;
  };
  // other properties
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useUserStore();

  const [job, setJob] = useState<Job | null>(location.state?.job || null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch job and applications
  const fetchJobData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/job/applicants/${id}`, {});

      if (response.data.success === "ok" && response.data.response) {
        const { JobApplication, ...jobData } = response.data.response;
        setJob(jobData);
        console.log(JobApplication);
        setApplications(JobApplication || []);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      let errorMessage = "Failed to fetch job details";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        if (error.response.status === 401) {
          errorMessage = "Unauthorized. Please log in again.";
        } else if (error.response.status === 404) {
          errorMessage = "Job not found";
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

  // Handle job status update (Close/Reopen)
  const handleStatusUpdate = async () => {
    if (!job || !token) return;

    const newStatus =
      job.status === JobStatus.ACTIVE ? JobStatus.CLOSED : JobStatus.ACTIVE;

    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}/api/job/${id}`,
        { status: newStatus },
        {
          headers: { "x-access-token": token },
        }
      );

      if (response.data.success === "ok" && response.data.response) {
        setJob({ ...job, status: newStatus });
        toast.success(
          `Job ${
            newStatus === JobStatus.ACTIVE ? "reopened" : "closed"
          } successfully!`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      let errorMessage = `Failed to ${
        newStatus === JobStatus.ACTIVE ? "reopen" : "close"
      } job`;
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage =
          "Unable to reach the server. Please check your network or contact support.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!job || !token) return;

    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      setLoading(true);
      const response = await axios.delete(`${BASE_URL}/api/job/${id}`, {
        headers: { "x-access-token": token },
      });

      if (response.data.success === "ok") {
        toast.success("Job deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/admin/jobs");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      let errorMessage = "Failed to delete job";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage =
          "Unable to reach the server. Please check your network or contact support.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [id, token]);

  if (loading && !job) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-red-600 mb-4">
          {error || "Job not found"}
        </h2>
        <Button onClick={() => navigate("/admin/jobs")}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
        <div className="flex space-x-3">
          <Link to={`/admin/jobs/${job.id}/edit`}>
            <Button>Edit Job</Button>
          </Link>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">
                Job Details
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Campus
                  </h3>
                  <p className="text-gray-600">{job.campus}</p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Salary Range
                  </h3>
                  <p className="text-gray-600">
                    {job.salaryRange || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Job Type
                  </h3>
                  <Badge type="jobType" status={job.jobType} />
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Status
                  </h3>
                  <Badge type="job" status={job.status} />
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Created At
                  </h3>
                  <p className="text-gray-600">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Last Updated
                  </h3>
                  <p className="text-gray-600">
                    {new Date(job.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Applications */}
          <Card className="mt-6">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Applications ({applications.length})
              </h2>
              <Link to="/admin/applications">
                <Button variant="outline" size="sm">
                  View All Applications
                </Button>
              </Link>
            </CardHeader>
            <CardBody>
              {applications.length > 0 ? (
                <div className="divide-y">
                  {applications.map((app) => (
                    <div key={app.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {app.user.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {app.user.email}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Applied on{" "}
                            {app.user.createdAt
                              ? new Date(
                                  app.user.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Badge type="application" status={app.status} />
                        </div>
                      </div>
                      <div className="mt-2 flex">
                        <Link to={`/admin/applications/${app.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4 text-center">
                  No applications yet
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Job Image and Summary */}
        <div>
          <Card>
            <CardBody className="p-0">
              {job.imageURL && (
                <img
                  src={job.imageURL}
                  alt={job.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="font-bold text-gray-900 mb-2">Job Summary</h2>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <span className="font-medium w-24">Company:</span>
                    <span className="text-gray-600">{job.companyName}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="font-medium w-24">Campus:</span>
                    <span className="text-gray-600">{job.campus}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="font-medium w-24">Job Type:</span>
                    <Badge type="jobType" status={job.jobType} />
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="font-medium w-24">Status:</span>
                    <Badge type="job" status={job.status} />
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="font-medium w-24">Applications:</span>
                    <span className="text-gray-600">{applications.length}</span>
                  </li>
                </ul>

                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full"
                    variant={
                      job.status === JobStatus.ACTIVE ? "warning" : "success"
                    }
                    onClick={handleStatusUpdate}
                    disabled={loading}
                  >
                    {job.status === JobStatus.ACTIVE
                      ? "Close Job"
                      : "Reopen Job"}
                  </Button>
                  <Button
                    className="w-full"
                    variant="danger"
                    onClick={handleDeleteJob}
                    disabled={loading}
                  >
                    Delete Job
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
