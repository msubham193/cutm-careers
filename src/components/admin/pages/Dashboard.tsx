import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Table, TableHead, TableBody, TableRow, TableCell } from "../ui/Table";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { BarChart, TrendingUp, Briefcase, Users, Calendar } from "lucide-react";
import { dashboardMetrics } from "../../../data/mockData";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserStore } from "../../../store/userStore";
import { BASE_URL } from "../../../utils/Constants";
import {
  JobApplicationWithDetails,

} from "../../../utils/types";

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplicationWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUserStore();

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
        // Sort by appliedAt (newest first)
        const sortedApplications = response.data.response.sort(
          (a: JobApplicationWithDetails, b: JobApplicationWithDetails) =>
            new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        );
        setApplications(sortedApplications);
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
  }, [token]);

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
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Jobs"
          value={dashboardMetrics.totalJobs}
          icon={<Briefcase className="w-8 h-8 text-blue-900" />}
        />
        <MetricCard
          title="Active Jobs"
          value={dashboardMetrics.activeJobs}
          icon={<TrendingUp className="w-8 h-8 text-green-600" />}
        />
        <MetricCard
          title="Total Applications"
          value={dashboardMetrics.totalApplications}
          icon={<Users className="w-8 h-8 text-indigo-600" />}
        />
        <MetricCard
          title="Pending Applications"
          value={dashboardMetrics.pendingApplications}
          icon={<BarChart className="w-8 h-8 text-yellow-600" />}
        />
        <MetricCard
          title="Scheduled Interviews"
          value={dashboardMetrics.scheduledInterviews}
          icon={<Calendar className="w-8 h-8 text-purple-600" />}
        />
      </div>

      {/* All Applications */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-800">
            All Applications
          </h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell header>Applicant</TableCell>
                    <TableCell header>Job</TableCell>
                    <TableCell header>Status</TableCell>
                    <TableCell header>Applied On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.length > 0 ? (
                    applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="ml-2">
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
                          <div className="text-sm text-gray-500">
                            {application.job.campus}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            type="application"
                            status={application.status}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {new Date(
                              application.appliedAt
                            ).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-center py-6 col-span-4">
                        <p className="text-gray-500">No applications found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">
              Applications Overview
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">
                Application statistics chart would appear here
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">
              Jobs by Campus
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">
                Jobs by campus chart would appear here
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="transition-transform duration-300 hover:transform hover:scale-105">
      <CardBody>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div>{icon}</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Dashboard;
