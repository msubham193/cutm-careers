import React from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "./Dashboard";
import Jobs from "./jobs/Jobs";
import JobForm from "./jobs/JobForm";
import JobDetail from "./jobs/JobDetail";
import Applications from "./applications/Applications";
import ApplicationDetail from "./applications/ApplicationDetail";
import Interviews from "./interviews/Interviews";

const AdminRoot = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />

      <Route index element={<Dashboard />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="jobs/create" element={<JobForm />} />
      <Route path="jobs/:id" element={<JobDetail />} />
      <Route path="jobs/:id/edit" element={<JobForm />} />

      {/* Application Routes */}
      <Route path="applications" element={<Applications />} />
      <Route path="applications/:id" element={<ApplicationDetail />} />

      {/* Interview Routes */}
      <Route path="interviews" element={<Interviews />} />

      {/* Settings Route (placeholder) */}
      <Route
        path="settings"
        element={<div className="p-4">Settings Page</div>}
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AdminRoot;
