import React from "react";

import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Building2,
  FileText,
} from "lucide-react";
import { useParams } from "react-router-dom";

const JobDetails: React.FC = () => {
  const { id } = useParams();
  // const navigate = useNavigate();

  // In a real application, fetch job details using the ID
  const job = {
    id: parseInt(id || "1"),
    title: "Junior Research Fellow (JRF)",
    department: "Computer Science",
    location: "Bhubaneswar Campus",
    type: "Full-time",
    deadline: "June 30, 2025",
    salary: "₹31,000 - ₹35,000 per month",
    education: "M.Tech/ME in Computer Science or related field",
    experience: "0-2 years of research experience",
    description:
      "We are seeking a motivated Junior Research Fellow to join our Computer Science department. The selected candidate will work on cutting-edge research projects in collaboration with industry partners.",
    requirements: [
      "M.Tech/ME in Computer Science with minimum 60% marks",
      "Strong programming skills in Python and Java",
      "Knowledge of Machine Learning and Data Science",
      "Good analytical and problem-solving skills",
      "Excellent written and verbal communication skills",
    ],
    responsibilities: [
      "Conduct research under the guidance of senior faculty members",
      "Develop and implement algorithms for research projects",
      "Write research papers and present findings at conferences",
      "Assist in laboratory sessions and student projects",
      "Maintain research documentation and progress reports",
    ],
    benefits: [
      "Competitive stipend",
      "Access to state-of-the-art research facilities",
      "Opportunity to pursue Ph.D",
      "Conference travel support",
      "Professional development workshops",
    ],
    imageUrl: "https://www.dbtjrf.gov.in/dbtJRFSlideshow/img3.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Professional Header Section with consistent background */}
      <div className="bg-blue-900 relative text-white pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>{job.type}</span>
                </div>
              </div>
              <p className="text-blue-100 max-w-2xl">
                Apply for this exciting opportunity to join our research team
                and work on cutting-edge projects in the field of Computer
                Science.
              </p>
            </div>
            <div className="md:w-1/3 relative">
              <div className="rounded-lg overflow-hidden shadow-lg border-4 border-white">
                <img
                  src={job.imageUrl}
                  alt={job.title}
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>
              <p className="text-gray-700 mb-6">{job.description}</p>

              {/* Requirements */}
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                {job.requirements.map((req, index) => (
                  <li key={index} className="mb-2">
                    {req}
                  </li>
                ))}
              </ul>

              {/* Responsibilities */}
              <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="mb-2">
                    {resp}
                  </li>
                ))}
              </ul>

              {/* Benefits */}
              <h3 className="text-xl font-semibold mb-3">Benefits</h3>
              <ul className="list-disc list-inside text-gray-700">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="mb-2">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Application Deadline
                    </p>
                    <p className="font-medium">{job.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium">{job.type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="font-medium">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Education</p>
                    <p className="font-medium">{job.education}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Apply Now
            </button>

            {/* Share Job */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Share This Job</h3>
              <div className="flex space-x-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </button>
                <button className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
