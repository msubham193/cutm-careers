import {
  Job,
  JobApplication,
  Interview,
  ApplicationStatus,
  InterviewStatus,
  JobStatus,
  JobType,
  ModeOfInterview,
  InterviewResult,
  DashboardMetrics,
} from "../utils/types";

// Mock Jobs
export const jobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    description:
      "We are looking for a skilled software engineer to join our development team. The ideal candidate will have experience with React, Node.js, and TypeScript.",
    companyName: "Centurion University",
    campus: "Main Campus",
    salaryRange: "₹8,00,000 - ₹12,00,000 per annum",
    imageURL:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    jobType: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    adminId: 1,
    createdAt: "2023-09-15T10:30:00Z",
    updatedAt: "2023-09-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Data Scientist",
    description:
      "Join our data science team to analyze and interpret complex data sets. Experience with Python, R, and machine learning required.",
    companyName: "Centurion University",
    campus: "Tech Campus",
    salaryRange: "₹10,00,000 - ₹15,00,000 per annum",
    imageURL:
      "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    jobType: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    adminId: 1,
    createdAt: "2023-09-16T14:45:00Z",
    updatedAt: "2023-09-16T14:45:00Z",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    description:
      "Design intuitive and engaging user experiences for our products. Proficiency in Figma, Adobe XD, and user research methodologies required.",
    companyName: "Centurion University",
    campus: "Design Campus",
    salaryRange: "₹7,00,000 - ₹11,00,000 per annum",
    imageURL:
      "https://images.pexels.com/photos/3194518/pexels-photo-3194518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    jobType: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    adminId: 1,
    createdAt: "2023-09-17T09:15:00Z",
    updatedAt: "2023-09-17T09:15:00Z",
  },
  {
    id: 4,
    title: "Marketing Intern",
    description:
      "Support our marketing team in creating engaging content and managing social media campaigns.",
    companyName: "Centurion University",
    campus: "Business Campus",
    salaryRange: "₹15,000 - ₹20,000 per month",
    imageURL:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    jobType: JobType.INTERNSHIP,
    status: JobStatus.ACTIVE,
    adminId: 1,
    createdAt: "2023-09-18T11:30:00Z",
    updatedAt: "2023-09-18T11:30:00Z",
  },
  {
    id: 5,
    title: "Remote Content Writer",
    description:
      "Create engaging content for our blog and social media platforms. Strong writing skills and SEO knowledge required.",
    companyName: "Centurion University",
    campus: "Virtual",
    salaryRange: "₹5,00,000 - ₹7,00,000 per annum",
    imageURL:
      "https://images.pexels.com/photos/3059747/pexels-photo-3059747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    jobType: JobType.REMOTE,
    status: JobStatus.ACTIVE,
    adminId: 1,
    createdAt: "2023-09-19T13:45:00Z",
    updatedAt: "2023-09-19T13:45:00Z",
  },
];

// Mock Job Applications
export const jobApplications: JobApplication[] = [
  {
    id: 1,
    jobId: 1,
    applicantName: "Rahul Sharma",
    applicantEmail: "rahul.sharma@example.com",
    applicantPhone: "+91 9876543210",
    resumeURL: "https://example.com/resumes/rahul_sharma.pdf",
    status: ApplicationStatus.INTERVIEW_SCHEDULED,
    createdAt: "2023-09-20T09:30:00Z",
    updatedAt: "2023-09-22T14:15:00Z",
  },
  {
    id: 2,
    jobId: 1,
    applicantName: "Priya Patel",
    applicantEmail: "priya.patel@example.com",
    applicantPhone: "+91 9876543211",
    resumeURL: "https://example.com/resumes/priya_patel.pdf",
    status: ApplicationStatus.UNDER_REVIEW,
    createdAt: "2023-09-21T10:45:00Z",
    updatedAt: "2023-09-23T11:30:00Z",
  },
  {
    id: 3,
    jobId: 2,
    applicantName: "Amit Kumar",
    applicantEmail: "amit.kumar@example.com",
    applicantPhone: "+91 9876543212",
    resumeURL: "https://example.com/resumes/amit_kumar.pdf",
    status: ApplicationStatus.PENDING,
    createdAt: "2023-09-22T08:15:00Z",
    updatedAt: "2023-09-22T08:15:00Z",
  },
  {
    id: 4,
    jobId: 3,
    applicantName: "Sneha Gupta",
    applicantEmail: "sneha.gupta@example.com",
    applicantPhone: "+91 9876543213",
    resumeURL: "https://example.com/resumes/sneha_gupta.pdf",
    status: ApplicationStatus.ACCEPTED,
    createdAt: "2023-09-23T16:20:00Z",
    updatedAt: "2023-09-28T13:45:00Z",
  },
  {
    id: 5,
    jobId: 4,
    applicantName: "Vikram Singh",
    applicantEmail: "vikram.singh@example.com",
    applicantPhone: "+91 9876543214",
    resumeURL: "https://example.com/resumes/vikram_singh.pdf",
    status: ApplicationStatus.REJECTED,
    createdAt: "2023-09-24T11:10:00Z",
    updatedAt: "2023-09-29T10:30:00Z",
  },
  {
    id: 6,
    jobId: 5,
    applicantName: "Neha Verma",
    applicantEmail: "neha.verma@example.com",
    applicantPhone: "+91 9876543215",
    resumeURL: "https://example.com/resumes/neha_verma.pdf",
    status: ApplicationStatus.INTERVIEW_SCHEDULED,
    createdAt: "2023-09-25T14:30:00Z",
    updatedAt: "2023-09-27T09:45:00Z",
  },
];

// Mock Interviews
export const interviews: Interview[] = [
  {
    id: 1,
    scheduledAt: "2023-09-25T10:00:00Z",
    status: InterviewStatus.COMPLETED,
    jobApplicationId: 1,
    interviewerName: "Dr. Rajesh Kumar",
    interviewerEmail: "rajesh.kumar@centurion.edu",
    interviewerPhone: "+91 9876543220",
    modeOfInterview: ModeOfInterview.ONLINE,
    interviewResult: InterviewResult.SELECTED,
    createdAt: "2023-09-22T14:15:00Z",
    updatedAt: "2023-09-25T11:30:00Z",
  },
  {
    id: 2,
    scheduledAt: "2023-09-30T14:30:00Z",
    status: InterviewStatus.SCHEDULED,
    jobApplicationId: 6,
    interviewerName: "Prof. Anita Desai",
    interviewerEmail: "anita.desai@centurion.edu",
    interviewerPhone: "+91 9876543221",
    modeOfInterview: ModeOfInterview.OFFLINE,
    createdAt: "2023-09-27T09:45:00Z",
    updatedAt: "2023-09-27T09:45:00Z",
  },
];

// Mock Dashboard Metrics
export const dashboardMetrics: DashboardMetrics = {
  totalJobs: 5,
  activeJobs: 5,
  totalApplications: 6,
  pendingApplications: 3,
  scheduledInterviews: 1,
};

// Get job applications with job details
export const getJobApplicationsWithDetails = (): (JobApplication & {
  job: Job;
  interview?: Interview;
})[] => {
  return jobApplications.map((application) => {
    const job = jobs.find((j) => j.id === application.jobId)!;
    const interview = interviews.find(
      (i) => i.jobApplicationId === application.id
    );

    return {
      ...application,
      job,
      interview,
    };
  });
};

// Helper to update application status
export const updateApplicationStatus = (
  applicationId: number,
  newStatus: ApplicationStatus
): JobApplication => {
  const appIndex = jobApplications.findIndex((app) => app.id === applicationId);
  if (appIndex !== -1) {
    jobApplications[appIndex] = {
      ...jobApplications[appIndex],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
  }
  return jobApplications[appIndex];
};

// Helper to update interview status or result
export const updateInterview = (
  interviewId: number,
  updates: Partial<Interview>
): Interview => {
  const interviewIndex = interviews.findIndex((int) => int.id === interviewId);
  if (interviewIndex !== -1) {
    interviews[interviewIndex] = {
      ...interviews[interviewIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }
  return interviews[interviewIndex];
};
