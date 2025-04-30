import React from "react";
import {
  ApplicationStatus,
  JobStatus,
  JobType,
  InterviewStatus,
  InterviewResult,
  ModeOfInterview,
} from "../../../utils/types";

interface BadgeProps {
  type:
    | "application"
    | "job"
    | "jobType"
    | "interview"
    | "interviewResult"
    | "interviewMode";
  status: string;
}

const Badge: React.FC<BadgeProps> = ({ type, status }) => {
  let className = "px-2 py-1 text-xs font-medium rounded-full inline-block";

  if (type === "application") {
    switch (status) {
      case ApplicationStatus.PENDING:
        className += " bg-yellow-100 text-yellow-800";
        break;
      case ApplicationStatus.UNDER_REVIEW:
        className += " bg-blue-100 text-blue-800";
        break;
      case ApplicationStatus.INTERVIEW_SCHEDULED:
        className += " bg-purple-100 text-purple-800";
        break;
      case ApplicationStatus.ACCEPTED:
        className += " bg-green-100 text-green-800";
        break;
      case ApplicationStatus.REJECTED:
        className += " bg-red-100 text-red-800";
        break;
      default:
        className += " bg-gray-100 text-gray-800";
    }
  } else if (type === "job") {
    switch (status) {
      case JobStatus.ACTIVE:
        className += " bg-green-100 text-green-800";
        break;
      case JobStatus.CLOSED:
        className += " bg-gray-100 text-gray-800";
        break;
      default:
        className += " bg-gray-100 text-gray-800";
    }
  } else if (type === "jobType") {
    switch (status) {
      case JobType.FULL_TIME:
        className += " bg-blue-100 text-blue-800";
        break;
      case JobType.PART_TIME:
        className += " bg-teal-100 text-teal-800";
        break;
      case JobType.CONTRACT:
        className += " bg-indigo-100 text-indigo-800";
        break;
      case JobType.INTERNSHIP:
        className += " bg-orange-100 text-orange-800";
        break;
      case JobType.REMOTE:
        className += " bg-violet-100 text-violet-800";
        break;
      default:
        className += " bg-gray-100 text-gray-800";
    }
  } else if (type === "interview") {
    switch (status) {
      case InterviewStatus.SCHEDULED:
        className += " bg-blue-100 text-blue-800";
        break;
      case InterviewStatus.COMPLETED:
        className += " bg-green-100 text-green-800";
        break;
      case InterviewStatus.CANCELED:
        className += " bg-red-100 text-red-800";
        break;
      default:
        className += " bg-gray-100 text-gray-800";
    }
  } else if (type === "interviewResult") {
    switch (status) {
      case InterviewResult.SELECTED:
        className += " bg-green-100 text-green-800";
        break;
      case InterviewResult.REJECTED:
        className += " bg-red-100 text-red-800";
        break;
      case InterviewResult.WAITLISTED:
        className += " bg-yellow-100 text-yellow-800";
        break;
      default:
        className += " bg-gray-100 text-gray-800";
    }
  } else if (type === "interviewMode") {
    switch (status) {
      case ModeOfInterview.ONLINE:
        className += " bg-cyan-100 text-cyan-800";
        break;
      case ModeOfInterview.OFFLINE:
        className += " bg-amber-100 text-amber-800";
        break;
      default:
        className += " bg-gray-100 text-gray-800";
    }
  }

  return <span className={className}>{status.replace("_", " ")}</span>;
};

export default Badge;
