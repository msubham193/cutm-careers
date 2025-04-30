import React from "react";
import { Trash2, Plus } from "lucide-react";

interface Education {
  educationName: string;
  timeLine: string;
  Percentage: string;
  InstituteName: string;
}

interface EducationFormProps {
  education: Education[];
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
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Education</h3>
        <button
          type="button"
          onClick={onAdd}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Education
        </button>
      </div>

      {education.map((edu, index) => (
        <div
          key={index}
          className="p-3 border border-gray-200 rounded-lg space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Education #{index + 1}
            </span>
            {education.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Degree/Qualification
            </label>
            <input
              type="text"
              value={edu.educationName}
              onChange={(e) => onChange(index, "educationName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., B.Tech Computer Science"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Timeline
            </label>
            <input
              type="text"
              value={edu.timeLine}
              onChange={(e) => onChange(index, "timeLine", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2018-2022"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Percentage/CGPA
            </label>
            <input
              type="text"
              value={edu.Percentage}
              onChange={(e) => onChange(index, "Percentage", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 85%"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Institute Name
            </label>
            <input
              type="text"
              value={edu.InstituteName}
              onChange={(e) => onChange(index, "InstituteName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., XYZ University"
              required
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationForm;
