import React, { useState, useEffect } from "react";
import { X, LogIn } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserStore } from "../store/userStore";
import { BASE_URL, CAMPUSES } from "../utils/Constants";

interface LoginModalProps {
  onClose: () => void;
  onSignupClick: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSignupClick }) => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [campus, setCampus] = useState(CAMPUSES[0]); // Default to first campus
  const [rememberMe, setRememberMe] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();

  const images = ["/cutm1.jpg", "/cutm2.jpg", "/cutm3.jpg", "/cutm4.jpg"];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleRegularSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/user/login`, {
        email,
        password,
      });

      if (response.data.success === "ok" && response.data.response.user) {
        const userData = {
          id: response.data.response.user.id,
          name: response.data.response.user.name,
          email: response.data.response.user.email,
          phoneNumber: response.data.response.user.phoneNumber,
          role: response.data.response.user.role,
          experience: response.data.response.user.exprience, // Handle API typo
          createdAt: response.data.response.user.createdAt,
          updatedAt: response.data.response.user.updatedAt,
          campus: response.data.response.user.campus, // Optional
        };

        setUser(userData);
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        localStorage.setItem("token", response.data.response.token);

        toast.success("Successfully logged in!", {
          position: "top-right",
          autoClose: 3000,
        });

        onClose();
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      let errorMessage = "Failed to log in";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage =
          "Unable to reach the server. Please check your network or contact support.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/user/admin-login`, {
        name,
        email,
        password,
        campus,
      });

      if (response.data.success === "ok" && response.data.response.user) {
        const userData = {
          id: response.data.response.user.id,
          name: response.data.response.user.name,
          email: response.data.response.user.email,
          phoneNumber: response.data.response.user.phoneNumber,
          role: response.data.response.user.role,
          experience: response.data.response.user.exprience, // Handle API typo
          createdAt: response.data.response.user.createdAt,
          updatedAt: response.data.response.user.updatedAt,
          campus: response.data.response.user.campus, // Include campus
        };

        setUser(userData);
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        localStorage.setItem("token", response.data.response.token);

        toast.success("Successfully logged in as admin!", {
          position: "top-right",
          autoClose: 3000,
        });

        onClose();
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      let errorMessage = "Failed to log in as admin";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage =
          "Unable to reach the server. Please check your network or contact support.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    // Reset form fields when switching
    setEmail("");
    setPassword("");
    setName("");
    setCampus(CAMPUSES[0]);
    setRememberMe(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-hidden">
        <div className="flex h-[600px]">
          {/* Left side - Image Slider and Text */}
          <div className="hidden md:block md:w-1/2 relative">
            {images.map((src, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={src}
                  alt={`Campus View ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-blue-900 bg-opacity-60 flex flex-col justify-center p-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome Back!
              </h2>
              <p className="text-white text-lg opacity-90">
                Join Centurion University of Technology and Management and be
                part of our mission to transform education.
              </p>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleIndicatorClick(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-white w-6"
                        : "bg-white bg-opacity-50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {isAdminLogin ? "Admin Login" : "Login"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={isAdminLogin ? handleAdminSubmit : handleRegularSubmit}
              className="space-y-6"
            >
              {isAdminLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>

              {isAdminLogin && (
                <div>
                  <label
                    htmlFor="campus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Campus
                  </label>
                  <select
                    id="campus"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={isLoading}
                  >
                    {CAMPUSES.map((campusOption) => (
                      <option key={campusOption} value={campusOption}>
                        {campusOption}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !email ||
                  !password ||
                  (isAdminLogin && (!name || !campus))
                }
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center ${
                  isLoading ||
                  !email ||
                  !password ||
                  (isAdminLogin && (!name || !campus))
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
                  <LogIn className="w-5 h-5 mr-2" />
                )}
                {isLoading ? "Processing..." : "Sign In"}
              </button>

              <div className="relative my-6">
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
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              {isAdminLogin ? (
                <>
                  Not an admin?{" "}
                  <button
                    onClick={toggleAdminLogin}
                    className="font-medium text-blue-600 hover:text-blue-800 transition duration-300"
                    disabled={isLoading}
                  >
                    Regular Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={onSignupClick}
                    className="font-medium text-blue-600 hover:text-blue-800 transition duration-300"
                    disabled={isLoading}
                  >
                    Sign up
                  </button>{" "}
                  |{" "}
                  <button
                    onClick={toggleAdminLogin}
                    className="font-medium text-blue-600 hover:text-blue-800 transition duration-300"
                    disabled={isLoading}
                  >
                    Admin Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
