import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { BASE_URL } from "../utils/Constants";
import { Application, ApplicationStatus } from "../utils/types";
import { AlertCircle, Loader2 } from "lucide-react";

const MyApplications: React.FC = () => {
  const { user, token } = useUserStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user applications
  const fetchApplications = async () => {
    if (!user || !token) {
      setError("Please log in to view your applications");
      setLoading(false);
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
        setApplications(response.data.response.applications);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch applications";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.message || errorMessage;
          if (error.response.status === 401) {
            errorMessage = "Unauthorized. Please log in again.";
          } else if (error.response.status === 404) {
            errorMessage = "User not found";
          }
        } else if (error.request) {
          errorMessage =
            "Unable to reach the server. Please check your network or contact support.";
        }
      } else if (error instanceof Error) {
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

  useEffect(() => {
    // Wait for user and token to be initialized
    if (user === null || token === null) {
      // Keep loading state until user store is resolved
      return;
    }

    fetchApplications();
  }, [user, token]);

  console.log(applications);
  // Render status badge
  const renderStatusBadge = (status: ApplicationStatus) => {
    const styles: Record<ApplicationStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      UNDER_REVIEW: "bg-blue-100 text-blue-800",
      INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-800", // Added missing status
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  // Show loading state while user and token are being initialized
  if (user === null || token === null || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={fetchApplications}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-900 text-white pt-32 pb-10">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-3xl font-bold mb-4">
            My Applications
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            View the status of your job applications at Centurion University
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {applications.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {applications.length} Application
              {applications.length !== 1 ? "s" : ""}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cover Letter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Link
                          to={`/job/${app.jobId}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Job #{app.jobId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.coverLetter || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/job/${app.jobId}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Job
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't applied for any jobs yet. Explore opportunities now!
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
