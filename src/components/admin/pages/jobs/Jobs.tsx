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
import { Plus, Filter, Search } from "lucide-react";
import { jobs } from "../../../../data/mockData";
import { JobStatus, JobType } from "../../../../utils/types";

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "">("");
  const [filterType, setFilterType] = useState<JobType | "">("");

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.campus.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? job.status === filterStatus : true;
    const matchesType = filterType ? job.jobType === filterType : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
        <Link to="/admin/jobs/create">
          <Button icon={<Plus className="w-4 h-4" />}>Add New Job</Button>
        </Link>
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
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  className="pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as JobStatus | "")
                  }
                >
                  <option value="">All Statuses</option>
                  {Object.values(JobStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  className="pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as JobType | "")
                  }
                >
                  <option value="">All Types</option>
                  {Object.values(JobType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardBody className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Job Title</TableCell>
                <TableCell header>Campus</TableCell>
                <TableCell header>Type</TableCell>
                <TableCell header>Salary Range</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Created At</TableCell>
                <TableCell header>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-md">
                      {job.description.length > 80
                        ? `${job.description.substring(0, 80)}...`
                        : job.description}
                    </div>
                  </TableCell>
                  <TableCell>{job.campus}</TableCell>
                  <TableCell>
                    <Badge type="jobType" status={job.jobType} />
                  </TableCell>
                  <TableCell>{job.salaryRange || "Not specified"}</TableCell>
                  <TableCell>
                    <Badge type="job" status={job.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/admin/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link to={`/admin/jobs/${job.id}/edit`}>
                        <Button variant="primary" size="sm">
                          Edit
                        </Button>
                      </Link>
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

export default Jobs;
