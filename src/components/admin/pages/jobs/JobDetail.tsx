import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardBody } from "../../ui/Card";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import { jobs, jobApplications } from "../../../../data/mockData";
import { Job, JobApplication } from "../../../../utils/types";

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      if (id) {
        const foundJob = jobs.find((j) => j.id === parseInt(id));
        if (foundJob) {
          setJob(foundJob);

          // Get applications for this job
          const jobApps = jobApplications.filter(
            (app) => app.jobId === parseInt(id)
          );
          setApplications(jobApps);
        } else {
          setError("Job not found");
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
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
                            {app.applicantName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {app.applicantEmail}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Applied on{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
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
                    variant={job.status === "ACTIVE" ? "warning" : "success"}
                  >
                    {job.status === "ACTIVE" ? "Close Job" : "Reopen Job"}
                  </Button>
                  <Button className="w-full" variant="danger">
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
