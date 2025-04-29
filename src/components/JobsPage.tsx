import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import JobCard from "./JobCard";

const JobsPage = () => {
  // Sample jobs data from your provided jobListings
  const allJobs = [
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
    {
      id: 7,
      title: "Research Scientist",
      department: "Biotechnology",
      location: "Bhubaneswar Campus",
      type: "Full-time",
      deadline: "July 25, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1532092367458-62dd322becf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      title: "Administrative Assistant",
      department: "Administration",
      location: "Paralakhemundi Campus",
      type: "Part-time",
      deadline: "June 22, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 9,
      title: "Librarian",
      department: "Library Science",
      location: "Vizianagaram Campus",
      type: "Full-time",
      deadline: "July 5, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Get unique departments, locations and job types for filters
  const departments = [...new Set(allJobs.map((job) => job.department))];
  const locations = [...new Set(allJobs.map((job) => job.location))];
  const jobTypes = [...new Set(allJobs.map((job) => job.type))];

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const [showFilters, setShowFilters] = useState(false);

  // Filter jobs based on search term and selected filters
  useEffect(() => {
    const results = allJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "" || job.department === selectedDepartment;
      const matchesLocation =
        selectedLocation === "" || job.location === selectedLocation;
      const matchesJobType =
        selectedJobType === "" || job.type === selectedJobType;

      return (
        matchesSearch && matchesDepartment && matchesLocation && matchesJobType
      );
    });

    setFilteredJobs(results);
  }, [searchTerm, selectedDepartment, selectedLocation, selectedJobType]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedDepartment("");
    setSelectedLocation("");
    setSelectedJobType("");
    setSearchTerm("");
  };

  // Toggle mobile filters display
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="bg-gray-50 relative min-h-screen  ">
      {/* Page Header */}
      <div className="bg-blue-900 text-white pt-32 pb-10">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-3xl font-bold mb-4">
            Career Opportunities
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Explore current job openings at Centurion University and find your
            perfect role
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for jobs by title or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            className="w-full md:hidden flex items-center justify-between bg-gray-100 p-3 rounded-md mb-4"
            onClick={toggleFilters}
          >
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              <span>Filters</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                showFilters ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* Filters - Hidden on mobile until toggled */}
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campus Location
                </label>
                <select
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"}{" "}
            Available
          </h2>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-12">
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No jobs found matching your criteria
            </h3>
            <p className="text-gray-600 mb-4">
              Try changing your search terms or clearing filters
            </p>
            <button
              onClick={clearFilters}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Don't see a position that matches your skills?
            </h3>
            <p className="text-gray-600">
              Submit your resume for future opportunities
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
            Submit Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
