"use client";
import { useState } from "react";
import {

  JobApplication,
  ApplicationStatus,
  ModeOfInterview,
  InterviewStatus,
} from "../utils/types";

const jobs = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Develop and maintain software applications.",
  },
  {
    id: 2,
    title: "Product Manager",
    description: "Oversee product development and strategy.",
  },
];

let applications: JobApplication[] = [
  {
    id: 1,
    jobId: 1,
    userId: 101, // Added userId property
    applicantName: "John Doe",
    applicantEmail: "johndoe@example.com",
    applicantPhone: "123-456-7890",
    resumeURL: "https://example.com/resume/johndoe",
    status: ApplicationStatus.PENDING,
    submittedAt: new Date(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const interviews: {
  id: number;
  scheduledAt: Date;
  interviewerName: string;
  interviewerEmail: string;
  interviewerPhone: string;
  modeOfInterview: ModeOfInterview;
  status: InterviewStatus;
  jobApplicationId: number;
  createdAt: Date;
}[] = [];

export default function ApplicationManagement() {
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);

  const handleUpdateStatus = (appId: number, newStatus: ApplicationStatus) => {
    applications = applications.map((app) =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    alert(`Application status updated to ${newStatus}`);
  };

  const handleScheduleInterview = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowInterviewForm(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
      <div className="grid gap-4">
        {applications.map((app) => {
          const job = jobs.find((j) => j.id === app.jobId);
          return (
            <div key={app.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{app.applicantName}</h3>
              <p>
                <strong>Job:</strong> {job?.title}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <select
                className="border p-2 mt-2"
                value={app.status}
                onChange={(e) =>
                  handleUpdateStatus(
                    app.id,
                    e.target.value as ApplicationStatus
                  )
                }
              >
                {Object.values(ApplicationStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded mt-2 ml-2"
                onClick={() => handleScheduleInterview(app)}
              >
                Schedule Interview
              </button>
            </div>
          );
        })}
      </div>
      {showInterviewForm && selectedApplication && (
        <InterviewForm
          application={selectedApplication}
          closeForm={() => setShowInterviewForm(false)}
        />
      )}
    </div>
  );
}

function InterviewForm({
  application,
  closeForm,
}: {
  application: JobApplication;
  closeForm: () => void;
}) {
  const [formData, setFormData] = useState({
    scheduledAt: "",
    interviewerName: "",
    interviewerEmail: "",
    interviewerPhone: "",
    modeOfInterview: ModeOfInterview.ONLINE,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInterview = {
      id: interviews.length + 1,
      ...formData,
      scheduledAt: new Date(formData.scheduledAt),
      status: InterviewStatus.SCHEDULED,
      jobApplicationId: application.id,
      createdAt: new Date(),
    };
    interviews.push(newInterview);
    applications = applications.map((app) =>
      app.id === application.id
        ? { ...app, status: ApplicationStatus.INTERVIEW_SCHEDULED }
        : app
    );
    closeForm();
    alert("Interview scheduled successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>
        <div>
          <label className="block mb-1">Scheduled Date & Time</label>
          <input
            type="datetime-local"
            className="w-full border p-2 mb-2"
            value={formData.scheduledAt}
            onChange={(e) =>
              setFormData({ ...formData, scheduledAt: e.target.value })
            }
          />
          <label className="block mb-1">Interviewer Name</label>
          <input
            type="text"
            className="w-full border p-2 mb-2"
            value={formData.interviewerName}
            onChange={(e) =>
              setFormData({ ...formData, interviewerName: e.target.value })
            }
          />
          <label className="block mb-1">Interviewer Email</label>
          <input
            type="email"
            className="w-full border p-2 mb-2"
            value={formData.interviewerEmail}
            onChange={(e) =>
              setFormData({ ...formData, interviewerEmail: e.target.value })
            }
          />
          <label className="block mb-1">Interviewer Phone</label>
          <input
            type="tel"
            className="w-full border p-2 mb-2"
            value={formData.interviewerPhone}
            onChange={(e) =>
              setFormData({ ...formData, interviewerPhone: e.target.value })
            }
          />
          <label className="block mb-1">Mode of Interview</label>
          <select
            className="w-full border p-2 mb-2"
            value={formData.modeOfInterview}
            onChange={(e) =>
              setFormData({
                ...formData,
                modeOfInterview: e.target.value as ModeOfInterview,
              })
            }
          >
            {Object.values(ModeOfInterview).map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
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
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
