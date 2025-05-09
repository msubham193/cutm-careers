import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EducationForm from "./EducationForm";
import { useUserStore } from "../store/userStore";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/localStorage";
import { BASE_URL } from "../utils/Constants";

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

interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  experience: string;
  education: Education[];
  resume: File | null;
  agreeTerms: boolean;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onLoginClick }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const campusImages = ["/cutm1.jpg", "/cutm2.jpg", "/cutm3.jpg", "/cutm4.jpg"];
  const { setUser } = useUserStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    experience: "",
    education: [
      { educationName: "", timeLine: "", Percentage: "", InstituteName: "" },
    ],
    resume: null,
    agreeTerms: false,
  });

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = getFromLocalStorage<FormData>("signupForm");
    console.log("Loaded from localStorage:", savedData); // Debug
    if (savedData) {
      // Ensure education is an array
      const validatedData = {
        ...savedData,
        education: Array.isArray(savedData.education)
          ? savedData.education
          : [
              {
                educationName: "",
                timeLine: "",
                Percentage: "",
                InstituteName: "",
              },
            ],
      };
      setFormData(validatedData);
    }
  }, []);

  // Save form data to localStorage on change (1 hour TTL)
  useEffect(() => {
    console.log("Saving to localStorage:", formData); // Debug
    saveToLocalStorage("signupForm", formData, 60 * 60 * 1000);
  }, [formData]);

  // Image slider auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === campusImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [campusImages.length]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | File | Education[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    handleInputChange("education", newEducation);
  };

  const handleAddEducation = () => {
    handleInputChange("education", [
      ...formData.education,
      { educationName: "", timeLine: "", Percentage: "", InstituteName: "" },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...formData.education];
    newEducation.splice(index, 1);
    handleInputChange("education", newEducation);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange("resume", e.target.files[0]);
    }
  };

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

  const isPersonalInfoValid = () => {
    console.log("Validating personal info:", formData); // Debug
    return (
      formData.name?.trim() !== "" &&
      formData.email?.trim() !== "" &&
      formData.password?.trim() !== "" &&
      formData.phoneNumber?.trim() !== "" &&
      formData.experience?.trim() !== ""
    );
  };

  const isEducationValid = () => {
    console.log("Validating education:", formData.education); // Debug
    return formData.education?.every(
      (edu) =>
        edu.educationName?.trim() !== "" &&
        edu.timeLine?.trim() !== "" &&
        edu.Percentage?.trim() !== "" &&
        edu.InstituteName?.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    if (formData.resume) {
      data.append("resume", formData.resume);
    }
    data.append(
      "basicInformation",
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        experience: formData.experience,
      })
    );
    data.append("educationArray", JSON.stringify(formData.education));

    try {
      const response = await axios.post(`${BASE_URL}/user`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success === "ok" && response.data.response.user) {
        const userData = {
          id: response.data.response.user.id,
          name: response.data.response.user.name,
          email: response.data.response.user.email,
          resumeUrl: response.data.response.user.resumeUrl,
          phoneNumber: response.data.response.user.phoneNumber,
          role: response.data.response.user.role,
          experience: response.data.response.user.exprience, // Handle API typo
          createdAt: response.data.response.user.createdAt,
          updatedAt: response.data.response.user.updatedAt,
        };

        setUser(userData, response.data.response.token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.removeItem("signupForm");

        toast.success("Successfully signed up!", {
          position: "bottom-center",
          autoClose: 3000,
        });

        onClose();
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to sign up";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (axios.isAxiosError(error) && error.request) {
        errorMessage =
          "Unable to reach the server. Please check your network or contact support.";
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage, {
        position: "bottom-center",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  const handleContinue = () => {
    console.log("Continuing to step", step + 1); // Debug
    setStep(step + 1);
  };

  const handleBack = () => {
    console.log("Going back to step", step - 1); // Debug
    setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl overflow-hidden">
        <div className="flex h-full max-h-[90vh]">
          {/* Left side - Image Slider */}
          <div className="hidden md:block md:w-1/2 relative">
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
                    alt={`Campus ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
                </div>
              ))}
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Join Our Community
                </h2>
                <p className="text-white text-lg opacity-90 mb-8">
                  Start your journey with Centurion University.
                </p>
                <div className="absolute inset-x-0 bottom-20 flex justify-between px-6">
                  <button
                    onClick={goToPrevSlide}
                    className="p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNextSlide}
                    className="p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
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
                  className={`flex-1 text-center ${
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

              {/* Debug Step */}
              {(() => {
                console.log("Current step:", step);
                return null;
              })()}

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
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
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
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
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
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
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
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
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
                  <h3 className="text-lg font-semibold text-gray-800">
                    Education Details
                  </h3>
                  <EducationForm
                    education={formData.education}
                    onChange={handleEducationChange}
                    onAdd={handleAddEducation}
                    onRemove={handleRemoveEducation}
                  />
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
                            {formData.resume
                              ? formData.resume.name
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
                      checked={formData.agreeTerms}
                      onChange={(e) =>
                        handleInputChange("agreeTerms", e.target.checked)
                      }
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
                    disabled={
                      !formData.resume || !formData.agreeTerms || isLoading
                    }
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center mt-4 ${
                      !formData.resume || !formData.agreeTerms || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    ) : (
                      <UserPlus className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? "Processing..." : "Create Account"}
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
                        d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z"
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
