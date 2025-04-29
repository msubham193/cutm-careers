import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SignupModalProps {
  onClose: () => void;
  onLoginClick: () => void;
}

interface Education {
  educationName: string;
  timeLine: string;
  Percentage: string;
  InstituteName: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onLoginClick }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState<Education[]>([
    { educationName: "", timeLine: "", Percentage: "", InstituteName: "" },
  ]);
  const [resume, setResume] = useState<File | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Image slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const campusImages = ["/cutm1.jpg", "/cutm2.jpg", "/cutm3.jpg", "/cutm4.jpg"];

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === campusImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [campusImages.length]);

  const goToNextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === campusImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? campusImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      email,
      password,
      phoneNumber,
      experience,
      education,
      resume,
      agreeTerms,
    });
    onClose();
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      { educationName: "", timeLine: "", Percentage: "", InstituteName: "" },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const isPersonalInfoValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      experience.trim() !== ""
    );
  };

  const isEducationValid = () => {
    return education.every(
      (edu) =>
        edu.educationName.trim() !== "" &&
        edu.timeLine.trim() !== "" &&
        edu.Percentage.trim() !== "" &&
        edu.InstituteName.trim() !== ""
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl overflow-hidden">
        <div className="flex h-full max-h-[90vh]">
          {/* Left side - Image Slider and Text */}
          <div className="hidden md:block md:w-1/2 relative">
            {/* Image slider container */}
            <div className="relative h-full w-full overflow-hidden">
              {campusImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ zIndex: index === currentImageIndex ? 10 : 0 }}
                >
                  <img
                    src={img}
                    alt={`CUTM Campus ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
                </div>
              ))}

              {/* Content overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Join Our Community
                </h2>
                <p className="text-white text-lg opacity-90 mb-8">
                  Start your journey with Centurion University of Technology and
                  Management and shape your future.
                </p>

                {/* Navigation arrows */}
                <div className="absolute inset-x-0 bottom-20 flex justify-between px-6">
                  <button
                    onClick={goToPrevSlide}
                    className="p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNextSlide}
                    className="p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Indicators */}
                <div className="absolute inset-x-0 bottom-10 flex justify-center space-x-2">
                  {campusImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "w-8 bg-white"
                          : "w-2 bg-white bg-opacity-50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Signup Form */}
          <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Create Account
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Step Indicator */}
              <div className="flex justify-between mb-4 text-sm">
                <div
                  className={`flex-1 text-center  ${
                    step === 1 ? "text-blue-600 font-semibold" : "text-gray-500"
                  }`}
                >
                  Step 1: Personal Info
                </div>
                <div
                  className={`flex-1 text-center ${
                    step === 2 ? "text-blue-600 font-semibold" : "text-gray-500"
                  }`}
                >
                  Step 2: Education
                </div>
                <div
                  className={`flex-1 text-center ${
                    step === 3 ? "text-blue-600 font-semibold" : "text-gray-500"
                  }`}
                >
                  Step 3: Resume & Terms
                </div>
              </div>

              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Experience
                    </label>
                    <textarea
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Describe your experience"
                      rows={2}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!isPersonalInfoValid()}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center mt-4 ${
                      !isPersonalInfoValid()
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Education */}
              {step === 2 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Education
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddEducation}
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
                            onClick={() => handleRemoveEducation(index)}
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
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "educationName",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "timeLine",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "Percentage",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "InstituteName",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., XYZ University"
                          required
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2.5 px-4 rounded-lg transition duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!isEducationValid()}
                      className={`w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 ${
                        !isEducationValid()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Resume and Terms */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Resume
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <div className="flex flex-col items-center justify-center text-center">
                          <p className="text-sm text-gray-600">
                            {resume
                              ? resume.name
                              : "Upload your resume (PDF format)"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Click to browse or drag and drop
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label
                      htmlFor="agree-terms"
                      className="ml-2 text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!resume || !agreeTerms}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center mt-4 ${
                      !resume || !agreeTerms
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2.5 px-4 rounded-lg transition duration-300"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  onClick={onLoginClick}
                  className="font-medium text-blue-600 hover:text-blue-800 transition duration-300"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
