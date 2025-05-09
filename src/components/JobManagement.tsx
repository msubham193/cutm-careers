"use client";

import { useState } from "react";
import { Job, JobStatus, JobType } from "../utils/types";

let jobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Develop web applications",
    companyName: "Centurion University",
    campus: "Bhubaneswar",
    salaryRange: "5-7 LPA",
    jobType: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    adminId: 1,
    location: "Bhubaneswar, Odisha",
    Qualification: "B.Tech in Computer Science",
    department: "Engineering",
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
  },
];

export default function JobManagement() {
  const [showForm, setShowForm] = useState(false);

  const handleUpdateStatus = (jobId: number, newStatus: JobStatus) => {
    jobs = jobs.map((job) =>
      job.id === jobId ? { ...job, status: newStatus } : job
    );
    alert(`Job status updated to ${newStatus}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Job Listings</h2>
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Post New Job
        </button>
      </div>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p>{job.description}</p>
            <p>
              <strong>Campus:</strong> {job.campus}
            </p>
            <p>
              <strong>Type:</strong> {job.jobType}
            </p>
            <p>
              <strong>Status:</strong> {job.status}
            </p>
            <select
              className="border p-2 mt-2"
              value={job.status}
              onChange={(e) =>
                handleUpdateStatus(job.id, e.target.value as JobStatus)
              }
            >
              {Object.values(JobStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {showForm && <JobForm closeForm={() => setShowForm(false)} />}
    </div>
  );
}

function JobForm({ closeForm }: { closeForm: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    campus: "",
    salaryRange: "",
    jobType: JobType.FULL_TIME,
    imageURL: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: jobs.length + 1,
      ...formData,
      companyName: "Centurion University",
      status: JobStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      adminId: 1,
      location: "Default Location", // Replace with appropriate value
      Qualification: "Default Qualification", // Replace with appropriate value
      department: "Default Department", // Replace with appropriate value
      applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // Example deadline
    };
    jobs.push(newJob);
    closeForm();
    alert("Job posted successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Post New Job</h2>
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full border p-2 mb-2"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border p-2 mb-2"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <label className="block mb-1">Campus</label>
          <input
            type="text"
            className="w-full border p-2 mb-2"
            value={formData.campus}
            onChange={(e) =>
              setFormData({ ...formData, campus: e.target.value })
            }
          />
          <label className="block mb-1">Salary Range</label>
          <input
            type="text"
            className="w-full border p-2 mb-2"
            value={formData.salaryRange}
            onChange={(e) =>
              setFormData({ ...formData, salaryRange: e.target.value })
            }
          />
          <label className="block mb-1">Job Type</label>
          <select
            className="w-full border p-2 mb-2"
            value={formData.jobType}
            onChange={(e) =>
              setFormData({ ...formData, jobType: e.target.value as JobType })
            }
          >
            {Object.values(JobType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label className="block mb-1">Image URL (Optional)</label>
          <input
            type="text"
            className="w-full border p-2 mb-2"
            value={formData.imageURL}
            onChange={(e) =>
              setFormData({ ...formData, imageURL: e.target.value })
            }
          />
          <div className="flex justify-end space-x-2">
            <button
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={closeForm}
            >
              Cancel
            </button>
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
