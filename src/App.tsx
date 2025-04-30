import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "./components/Navbar";
import JobCard from "./components/JobCard";
import JobDetails from "./components/JobDetails";
import JobsPage from "./components/JobsPage";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import AdminPanel from "./components/AdminPanel";
import Layout from "./components/admin/layout/Layout";
import Jobs from "./components/admin/pages/jobs/Jobs";
import JobForm from "./components/admin/pages/jobs/JobForm";
import JobDetail from "./components/admin/pages/jobs/JobDetail";
import Applications from "./components/admin/pages/applications/Applications";
import ApplicationDetail from "./components/admin/pages/applications/ApplicationDetail";
import Interviews from "./components/admin/pages/interviews/Interviews";
import Dashboard from "./components/admin/pages/Dashboard";
import AdminRoot from "./components/admin/pages/AdminRoot";
import { useUserStore } from "./store/userStore";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { loadUserFromStorage } = useUserStore();

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const toggleLoginModal = () => setIsLoginOpen(!isLoginOpen);
  const toggleSignupModal = () => setIsSignupOpen(!isSignupOpen);

  const jobListings = [
    {
      id: 1,
      title: "Junior Research Fellow (JRF)",
      department: "Computer Science",
      location: "Bhubaneswar Campus",
      type: "Full-time",
      deadline: "June 30, 2025",
      imageUrl: "https://www.dbtjrf.gov.in/dbtJRFSlideshow/img3.jpg",
    },
    {
      id: 2,
      title: "Assistant Professor",
      department: "Mechanical Engineering",
      location: "Paralakhemundi Campus",
      type: "Full-time",
      deadline: "July 15, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Lab Assistant",
      department: "Biotechnology",
      location: "Vizianagaram Campus",
      type: "Part-time",
      deadline: "June 25, 2025",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR96mBvgDEAMplNeLH0iEyo6v8sUvbSyWhJ-Q&s",
    },
    {
      id: 4,
      title: "Research Associate",
      department: "Physics",
      location: "Bhubaneswar Campus",
      type: "Full-time",
      deadline: "July 20, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Teaching Assistant",
      department: "Mathematics",
      location: "Paralakhemundi Campus",
      type: "Part-time",
      deadline: "June 28, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Senior Professor",
      department: "Chemistry",
      location: "Vizianagaram Campus",
      type: "Full-time",
      deadline: "July 10, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const HomePage = () => (
    <>
      {/* Hero Section - Centered content with video */}
      <div className="relative bg-blue-900 text-white py-16 pt-32">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-4xl font-bold mb-4 animate-fadeIn">
                Join Our Team at Centurion University
              </h1>
              <p className="text-lg mb-8 opacity-90 animate-slideUp">
                Discover exciting career opportunities and be part of our
                mission to transform education
              </p>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-8 rounded-md transition duration-300 flex items-center mx-auto md:mx-0 animate-pulse">
                Browse Openings <ChevronRight className="ml-2" size={20} />
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end relative">
              <div className="relative w-full max-w-lg h-64 md:h-72 overflow-hidden rounded-xl shadow-2xl">
                <video
                  src="/cutmvideo.mp4"
                  className="absolute top-0 left-0 w-full h-full object-cover transform scale-125"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
      </div>

      {/* Featured Job Advertisements */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Featured Opportunities
        </h2>
        <p className="text-gray-600 mb-8">
          Explore our current openings across departments
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobListings.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Why Join Centurion University?
        </h2>
        <p className="text-gray-600 mb-12">
          Discover the benefits of being part of our academic community
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              State-of-the-art Facilities
            </h3>
            <p className="text-gray-600">
              Access to modern laboratories, research centers, and
              infrastructure to support your academic and professional growth.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Research Opportunities
            </h3>
            <p className="text-gray-600">
              Collaborate on cutting-edge research projects with industry
              partners and government organizations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Career Growth
            </h3>
            <p className="text-gray-600">
              Professional development programs, mentorship, and opportunities
              for advancement in your academic career.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-poppins">
        <Navbar
          onLoginClick={toggleLoginModal}
          onSignupClick={toggleSignupModal}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/job/:id" element={<JobDetails />} />

          {/* Admin Routes - All protected with the Layout component */}
          <Route path="/admin" element={<Layout />}>
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

            {/* Settings Route */}
            <Route
              path="settings"
              element={<div className="p-4">Settings Page</div>}
            />

            {/* Fallback route for admin section */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Global fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />

        {isLoginOpen && (
          <LoginModal
            onClose={toggleLoginModal}
            onSignupClick={() => {
              toggleLoginModal();
              toggleSignupModal();
            }}
          />
        )}

        {isSignupOpen && (
          <SignupModal
            onClose={toggleSignupModal}
            onLoginClick={() => {
              toggleSignupModal();
              toggleLoginModal();
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
