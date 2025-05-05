import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "../../ui/Card";
import Button from "../../ui/Button";
import { JobStatus, JobType, Job } from "../../../../utils/types";
import { jobs } from "../../../../data/mockData";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../store/userStore";
import { BASE_URL } from "../../../../utils/Constants";
import { X } from "lucide-react";

const JobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { token, user } = useUserStore();

  console.log(token);

  const emptyJob: Partial<Job> = {
    title: "",
    description: "",
    companyName: "Centurion University",
    campus: "",
    salaryRange: "",
    imageURL: "",
    jobType: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    adminId: user?.id || 1,
    Qualification: "",
    department: "",
    applicationDeadline: "",
  };

  const [job, setJob] = useState<Partial<Job>>(emptyJob);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const jobToEdit = jobs.find((j) => j.id === parseInt(id));
      if (jobToEdit) {
        // Convert ISO-8601 DateTime to YYYY-MM-DD for input type="date"
        const formattedJob = {
          ...jobToEdit,
          applicationDeadline: jobToEdit.applicationDeadline
            ? jobToEdit.applicationDeadline.split("T")[0]
            : "",
        };
        setJob(formattedJob);
        setImagePreview(jobToEdit.imageURL || null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setImageError("Please select a valid image file (JPEG, PNG, or GIF)");
        setImageFile(null);
        setImagePreview(null);
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setImageError("Image file size must be less than 5MB");
        setImageFile(null);
        setImagePreview(null);
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    setJob((prev) => ({ ...prev, imageURL: "" }));
    const fileInput = document.getElementById("poster") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageError(null);

    if (!token) {
      setLoading(false);
      toast.error("Authentication token missing. Please log in again.", {
        position: "top-right",
        autoClose: 5000,
      });
      navigate("/");
      return;
    }

    if (
      !job.title ||
      !job.description ||
      !job.campus ||
      !job.Qualification ||
      !job.department ||
      !job.applicationDeadline
    ) {
      setLoading(false);
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Validate applicationDeadline
    const isValidDate = !isNaN(new Date(job.applicationDeadline).getTime());
    if (!isValidDate) {
      setLoading(false);
      setError("Invalid application deadline date");
      toast.error("Invalid application deadline date", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", job.title || "");
      formData.append("description", job.description || "");
      formData.append("companyName", job.companyName || "Centurion University");
      formData.append("campus", job.campus || "");
      formData.append("salaryrange", job.salaryRange || "");
      formData.append("jobType", job.jobType || JobType.FULL_TIME);
      formData.append("status", job.status || JobStatus.ACTIVE);
      formData.append("adminId", job.adminId?.toString() || "1");
      formData.append("qualification", job.Qualification || "");
      formData.append("department", job.department || "");
      // Convert YYYY-MM-DD to ISO-8601 DateTime
      formData.append(
        "applicationDeadline",
        new Date(job.applicationDeadline + "T00:00:00.000Z").toISOString()
      );
      if (imageFile) {
        formData.append("poster", imageFile);
      } else if (!isEditing || (isEditing && !job.imageURL)) {
        formData.append("imageurl", "");
      }

      const response = await axios({
        method: isEditing ? "PUT" : "POST",
        url: isEditing ? `${BASE_URL}/job/${id}` : `${BASE_URL}/job`,
        data: formData,
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === "ok" && response.data.response) {
        toast.success(
          isEditing ? "Job updated successfully!" : "Job created successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        if (imagePreview && imageFile) {
          URL.revokeObjectURL(imagePreview);
        }
        navigate("/admin/jobs");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      let errorMessage = isEditing
        ? "Failed to update job"
        : "Failed to create job";
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
          .map((err: any) => {
            const constraints = Object.values(err.constraints || {}).join(", ");
            return `${err.property}: ${constraints}`;
          })
          .join("; ");
        errorMessage = validationErrors || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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

  if (error && !loading) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <Button onClick={() => navigate("/admin/jobs")}>Back to Jobs</Button>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                  disabled={loading}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department*
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={job.department || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                  disabled={loading}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                  disabled={loading}
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
                  placeholder="e.g., ₹6,00,000 - ₹8,00,000 per annum"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="applicationDeadline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Application Deadline*
                </label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  value={job.applicationDeadline || ""}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                  disabled={loading}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                  disabled={loading}
                >
                  {Object.values(JobStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="poster"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Poster
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="poster"
                  name="poster"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  disabled={loading}
                />
                {imagePreview && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center space-x-1"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                    <span>Remove</span>
                  </Button>
                )}
              </div>
              {imageError && (
                <p className="mt-2 text-sm text-red-600">{imageError}</p>
              )}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Poster Preview
                  </p>
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-md border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Job poster preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="Qualification"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Qualification*
              </label>
              <textarea
                id="Qualification"
                name="Qualification"
                value={job.Qualification || ""}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                required
                disabled={loading}
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                required
                disabled={loading}
              />
            </div>
          </CardBody>

          <CardFooter className="flex justify-end space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/admin/jobs")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
              ) : null}
              {isEditing ? "Update Job" : "Create Job"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default JobForm;
