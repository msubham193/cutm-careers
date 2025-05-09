import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Building2,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../store/userStore";
import { BASE_URL } from "../utils/Constants";
import { Job } from "../utils/types";

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useUserStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch job details
  const fetchJobDetails = async () => {
    if (!id) {
      setError("Invalid job ID");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/job/${id}`);

      if (response.data.success === "ok" && response.data.response) {
        setJob(response.data.response);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Failed to fetch job details";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user applications to check if applied
  const fetchUserApplications = async () => {
    if (!user || !token || user.role === "ADMIN") {
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/user/${user.id}`, {
        headers: { "x-access-token": token },
      });

      if (
        response.data.response &&
        Array.isArray(response.data.response.applications)
      ) {
        const applied = response.data.response.applications.some(
          (app: { jobId: number }) => app.jobId === parseInt(id || "0")
        );
        setHasApplied(applied);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err: unknown) {
      console.error("Failed to fetch user applications:", err);
      // Silently fail to avoid disrupting the page
    }
  };

  useEffect(() => {
    fetchJobDetails();
    // Only fetch applications if user and token are available
    if (user !== null && token !== null) {
      fetchUserApplications();
    }
  }, [id, user, token]);

  const handleApply = async () => {
    if (!token) {
      toast.error("Please log in to apply for this job", {
        position: "top-right",
        autoClose: 5000,
      });
      navigate("/login");
      return;
    }

    if (!job) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/application/${job.id}`,
        {},
        {
          headers: { "x-access-token": token },
        }
      );

      if (response.data.success === "ok" && response.data.response) {
        setHasApplied(true);
        setShowModal(true);
        toast.success("Application submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Failed to submit application";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/jobs");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-600 mb-4">
            {error || "Job not found"}
          </h2>
          <button
            onClick={() => navigate("/jobs")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  // Transform Qualification into requirements list
  const requirements = job.Qualification.split("\r\n")
    .map((req) => req.trim())
    .filter((req) => req);

  // Mock responsibilities and benefits
  const responsibilities = [
    "Collaborate with team members to execute project tasks",
    "Coordinate project activities and ensure timely delivery",
    "Prepare reports and presentations for stakeholders",
    "Assist in data analysis and documentation",
  ];
  const benefits = [
    "Competitive salary",
    "Professional development opportunities",
    "Collaborative work environment",
    "Access to university resources",
  ];

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">
                Application Submitted
              </h2>
            </div>
            <p className="text-gray-700 mb-6">
              Successfully applied for the position:{" "}
              <strong>{job.title}</strong>
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-blue-900 relative text-white pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{job.campus}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>{job.jobType.replace("_", " ")}</span>
                </div>
              </div>
              <p className="text-blue-100 max-w-2xl">
                Apply for this exciting opportunity to join our team at{" "}
                {job.companyName}.
              </p>
            </div>
            <div className="md:w-1/3 relative">
              <div className="rounded-lg overflow-hidden shadow-lg border-4 border-white">
                <img
                  src={job.imageURL}
                  alt={job.title}
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>
              <p className="text-gray-700 mb-6">{job.description}</p>

              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                {requirements.map((req, index) => (
                  <li key={index} className="mb-2">
                    {req}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                {responsibilities.map((resp, index) => (
                  <li key={index} className="mb-2">
                    {resp}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-3">Benefits</h3>
              <ul className="list-disc list-inside text-gray-700">
                {benefits.map((benefit, index) => (
                  <li key={index} className="mb-2">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Application Deadline
                    </p>
                    <p className="font-medium">
                      {new Date(job.applicationDeadline).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium">
                      {job.jobType.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="font-medium">₹{job.salaryRange} per month</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Qualification</p>
                    <p className="font-medium">{requirements[0]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={
                isAdmin || hasApplied || loading || job.status !== "ACTIVE"
              }
              className={`w-full flex items-center justify-center font-bold py-3 px-6 rounded-lg transition duration-300 ${
                hasApplied
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : isAdmin
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : job.status !== "ACTIVE"
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {hasApplied ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Already Applied
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5 mr-2" />
                  {isAdmin
                    ? "Admin Cannot Apply"
                    : job.status !== "ACTIVE"
                    ? "Job Not Active"
                    : "Apply Now"}
                </>
              )}
            </button>

            {/* Share Job */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Share This Job</h3>
              <div className="flex space-x-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 448 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </button>
                <button className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2c3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
