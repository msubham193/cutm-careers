import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Filter, Search, Download } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../store/userStore";
import { BASE_URL } from "../../../../utils/Constants";
import {
  ApplicationStatus,
  JobApplicationWithDetails,
} from "../../../../utils/types";

const Applications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "">("");
  const [applications, setApplications] = useState<JobApplicationWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUserStore();
  const navigate = useNavigate();

  // Fetch applications from backend
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/application`, {
        headers: {
          "x-access-token": token,
        },
      });

      if (
        response.data.success === "ok" &&
        Array.isArray(response.data.response)
      ) {
        setApplications(response.data.response);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch applications";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        if (error.response.status === 401) {
          errorMessage = "Unauthorized. Please log in again.";
        }
      } else if (axios.isAxiosError(error) && error.request) {
        errorMessage =
          "Unable to reach the server. Please check your network or contact support.";
      } else {
        if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        }
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

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
  }, [token, navigate]);

  // Filter applications based on search term and status filter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? app.status === filterStatus : true;

    return matchesSearch && matchesStatus;
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
        <p className="mt-2 text-gray-600">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <Button onClick={fetchApplications}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
        <Button icon={<Download className="w-4 h-4" />} variant="outline">
          Export
        </Button>
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
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="relative">
              <select
                className="pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as ApplicationStatus | "")
                }
                disabled={loading}
              >
                <option value="">All Statuses</option>
                {Object.values(ApplicationStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardBody className="p-0">
          {filteredApplications.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-600">No applications found.</p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Applicant</TableCell>
                  <TableCell header>Job</TableCell>
                  <TableCell header>Campus</TableCell>
                  <TableCell header>Status</TableCell>
                  <TableCell header>Applied On</TableCell>
                  <TableCell header>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {application.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {application.job.title}
                      </div>
                    </TableCell>
                    <TableCell>{application.job.campus}</TableCell>
                    <TableCell>
                      <Badge type="application" status={application.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link to={`/admin/applications/${application.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        {application.status === ApplicationStatus.PENDING && (
                          <Button variant="primary" size="sm">
                            Review
                          </Button>
                        )}
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

export default Applications;
