export enum ApplicationStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum InterviewResult {
  SELECTED = "SELECTED",
  REJECTED = "REJECTED",
  WAITLISTED = "WAITLISTED",
}

export enum ModeOfInterview {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum JobStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  REMOTE = "REMOTE",
}

export interface Job {
  id: number;
  title: string;
  description: string;
  companyName: string;
  campus: string;
  salaryRange?: string;
  imageURL?: string;
  jobType: JobType;
  status: JobStatus;
  adminId: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeURL: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  interview?: Interview;
}

export interface Interview {
  id: number;
  scheduledAt: string;
  status: InterviewStatus;
  jobApplicationId: number;
  interviewerName?: string;
  interviewerEmail?: string;
  interviewerPhone?: string;
  modeOfInterview: ModeOfInterview;
  interviewResult?: InterviewResult;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
}

export interface DashboardMetrics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  scheduledInterviews: number;
}
