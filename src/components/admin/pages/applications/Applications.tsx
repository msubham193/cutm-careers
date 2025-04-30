import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { getJobApplicationsWithDetails } from "../../../../data/mockData";
import { ApplicationStatus } from "../../../../utils/types";

const Applications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "">("");

  const applicationsWithDetails = getJobApplicationsWithDetails();

  // Filter applications based on search term and status filter
  const filteredApplications = applicationsWithDetails.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? app.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

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
              />
            </div>

            <div className="relative">
              <select
                className="pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as ApplicationStatus | "")
                }
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
                  </TableCell>
                  <TableCell>{application.job.campus}</TableCell>
                  <TableCell>
                    <Badge type="application" status={application.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(application.createdAt).toLocaleDateString()}
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
        </CardBody>
      </Card>
    </div>
  );
};

export default Applications;
