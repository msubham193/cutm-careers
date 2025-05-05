import React from "react";
import { X } from "lucide-react";

interface Education {
  educationName: string;
  timeLine: string;
  Percentage: string;
  InstituteName: string;
}

interface EducationFormProps {
  education: Education[] | undefined;
  onChange: (index: number, field: keyof Education, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onChange,
  onAdd,
  onRemove,
}) => {
  // Guard against undefined or non-array education
  if (!Array.isArray(education) || education.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 text-sm">
          No education entries found. Add one to continue.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="w-full bg-blue-100 text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-200 transition duration-300"
        >
          + Add Education
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 space-y-3 relative"
        >
          {/* Remove Button */}
          {education.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label={`Remove education entry ${index + 1}`}
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div>
            <label
              htmlFor={`educationName-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Education Name
            </label>
            <input
              type="text"
              id={`educationName-${index}`}
              value={edu.educationName}
              onChange={(e) => onChange(index, "educationName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Bachelor's in Computer Science"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`timeLine-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Timeline
            </label>
            <input
              type="text"
              id={`timeLine-${index}`}
              value={edu.timeLine}
              onChange={(e) => onChange(index, "timeLine", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2018 - 2022"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`Percentage-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Percentage/CGPA
            </label>
            <input
              type="text"
              id={`Percentage-${index}`}
              value={edu.Percentage}
              onChange={(e) => onChange(index, "Percentage", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 85% or 8.5 CGPA"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`InstituteName-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Institute Name
            </label>
            <input
              type="text"
              id={`InstituteName-${index}`}
              value={edu.InstituteName}
              onChange={(e) => onChange(index, "InstituteName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Centurion University"
              required
            />
          </div>
        </div>
      ))}

      {/* Add Education Button */}
      <button
        type="button"
        onClick={onAdd}
        className="w-full bg-blue-100 text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-200 transition duration-300"
      >
        + Add Another Education
      </button>
    </div>
  );
};

export default EducationForm;
