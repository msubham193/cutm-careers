import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "../../ui/Card";
import Button from "../../ui/Button";
import { JobStatus, JobType, Job } from "../../../../utils/types";
import { jobs } from "../../../../data/mockData";

const JobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const emptyJob: Partial<Job> = {
    title: "",
    description: "",
    companyName: "Centurion University",
    campus: "",
    salaryRange: "",
    imageURL: "",
    jobType: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    adminId: 1, // Default admin ID
  };

  const [job, setJob] = useState<Partial<Job>>(emptyJob);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const jobToEdit = jobs.find((j) => j.id === parseInt(id));
      if (jobToEdit) {
        setJob(jobToEdit);
      } else {
        setError("Job not found");
      }
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/jobs");
    }, 800);
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Job" : "Create New Job"}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">Job Details</h2>
          </CardHeader>

          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={job.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="campus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Campus*
                </label>
                <input
                  type="text"
                  id="campus"
                  name="campus"
                  value={job.campus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Type*
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={job.jobType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {Object.values(JobType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="salaryRange"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salary Range
                </label>
                <input
                  type="text"
                  id="salaryRange"
                  name="salaryRange"
                  value={job.salaryRange || ""}
                  onChange={handleChange}
                  placeholder="e.g., ₹8,00,000 - ₹12,00,000 per annum"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status*
                </label>
                <select
                  id="status"
                  name="status"
                  value={job.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {Object.values(JobStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="imageURL"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Image URL
                </label>
                <input
                  type="url"
                  id="imageURL"
                  name="imageURL"
                  value={job.imageURL || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={job.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </CardBody>

          <CardFooter className="flex justify-end space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/jobs")}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={loading}>
              {isEditing ? "Update Job" : "Create Job"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default JobForm;
