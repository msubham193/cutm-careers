import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, LogIn, ChevronDown } from "lucide-react";
import { useUserStore } from "../store/userStore";

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignupClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, clearUser } = useUserStore();

  console.log(user);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileDropdownOpen(false); // Close profile dropdown when toggling mobile menu
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("user");
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and University Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <img
                src={isScrolled ? "/logo.png" : "/logowhite.png"}
                alt="Centurion University Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1
                className={`font-bold text-lg md:text-xl ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              >
                Centurion University
              </h1>
              <p
                className={`text-xs md:text-sm ${
                  isScrolled ? "text-gray-600" : "text-gray-200"
                }`}
              >
                of Technology and Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className={`font-medium ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600"
                  : "text-white hover:text-gray-200"
              } transition duration-300`}
            >
              Home
            </a>
            <a
              href="/jobs"
              className={`font-medium ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600"
                  : "text-white hover:text-gray-200"
              } transition duration-300`}
            >
              Jobs
            </a>
            <a
              href="#"
              className={`font-medium ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600"
                  : "text-white hover:text-gray-200"
              } transition duration-300`}
            >
              About
            </a>
            <a
              href="#"
              className={`font-medium ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600"
                  : "text-white hover:text-gray-200"
              } transition duration-300`}
            >
              Contact
            </a>
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className={`flex items-center font-medium ${
                    isScrolled
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white hover:text-gray-200"
                  } transition duration-300`}
                >
                  <User className="w-5 h-5 mr-1" />
                  {user.name}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === "ADMIN" && (
                      <a
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Admin Section
                      </a>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className={`flex items-center font-medium ${
                    isScrolled
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-white hover:text-gray-200"
                  } transition duration-300`}
                >
                  <LogIn className="w-4 h-4 mr-1" /> Login
                </button>
                <button
                  onClick={onSignupClick}
                  className={`px-4 py-2 rounded-md font-medium ${
                    isScrolled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-blue-600 hover:bg-gray-100"
                  } transition duration-300`}
                >
                  <User className="w-4 h-4 inline mr-1" /> Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg animate-fadeIn">
            <div className="flex flex-col space-y-4 px-4">
              <a
                href="/"
                className="font-medium text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Home
              </a>
              <a
                href="/jobs"
                className="font-medium text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Jobs
              </a>
              <a
                href="#"
                className="font-medium text-gray-700 hover:text-blue-600 transition duration-300"
              >
                About
              </a>
              <a
                href="#"
                className="font-medium text-gray-700 hover:text-blue-600 transition duration-300"
              >
                Contact
              </a>
              {user ? (
                <div className="border-t pt-4">
                  <div className="pb-4 text-sm text-gray-700">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {user.role === "ADMIN" && (
                    <a
                      href="/admin"
                      className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    >
                      Admin Section
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center py-2 border border-blue-600 rounded-md font-medium text-blue-600 hover:bg-blue-50 transition duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 flex flex-col space-y-3">
                  <button
                    onClick={onLoginClick}
                    className="w-full flex justify-center items-center py-2 border border-blue-600 rounded-md font-medium text-blue-600 hover:bg-blue-50 transition duration-300"
                  >
                    <LogIn className="w-4 h-4 mr-2" /> Login
                  </button>
                  <button
                    onClick={onSignupClick}
                    className="w-full flex justify-center items-center py-2 bg-blue-600 rounded-md font-medium text-white hover:bg-blue-700 transition duration-300"
                  >
                    <User className="w-4 h-4 mr-2" /> Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
