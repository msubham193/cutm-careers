import { useState } from "react";

import JobManagement from "./JobManagement";
import ApplicationManagement from "./ApplicationManagement";
import InterviewManagement from "./InterviewManagement";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-900 text-white p-4">
        <h1 className="text-2xl font-bold">Centurion University Admin Panel</h1>
      </header>
      <nav className="flex space-x-4 p-4 border-b">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "jobs" ? "bg-blue-900 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("jobs")}
        >
          Jobs
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "applications"
              ? "bg-blue-900 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "interviews"
              ? "bg-blue-900 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("interviews")}
        >
          Interviews
        </button>
      </nav>
      <main className="p-6">
        {activeTab === "jobs" && <JobManagement />}
        {activeTab === "applications" && <ApplicationManagement />}
        {activeTab === "interviews" && <InterviewManagement />}
      </main>
    </div>
  );
}
