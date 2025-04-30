import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Table, TableHead, TableBody, TableRow, TableCell } from "../ui/Table";
import Badge from "../ui/Badge";
import { BarChart, TrendingUp, Briefcase, Users, Calendar } from "lucide-react";
import {
  dashboardMetrics,
  getJobApplicationsWithDetails,
} from "../../../data/mockData";

const Dashboard: React.FC = () => {
  const recentApplications = getJobApplicationsWithDetails().slice(0, 5);

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

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Applications
          </h2>
        </CardHeader>
        <CardBody className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Applicant</TableCell>
                <TableCell header>Job</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="ml-2">
                        <div className="font-medium text-gray-900">
                          {application.applicantName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.applicantEmail}
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
                    <Badge type="application" status={application.status} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
