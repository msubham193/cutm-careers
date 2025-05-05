import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useUserStore } from "../../../store/userStore";
import { toast } from "react-toastify";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearUser } = useUserStore();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Jobs",
      path: "/admin/jobs",
      icon: <Briefcase className="w-5 h-5" />,
      badge: "5",
    },
    {
      name: "Applications",
      path: "/admin/applications",
      icon: <Users className="w-5 h-5" />,
      badge: "12",
    },
    {
      name: "Interviews",
      path: "/admin/interviews",
      icon: <Calendar className="w-5 h-5" />,
      badge: "3",
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Reset user store
    clearUser();

    // Show toast notification
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
    });

    // Navigate to home
    navigate("/");
  };

  return (
    <>
      {/* Mobile sidebar backdrop with blur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:static lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-blue-800/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold">CUTM Admin</span>
          </div>
          <button
            className="p-1.5 rounded-md lg:hidden bg-blue-800/50 hover:bg-blue-700/50 transition-colors"
            onClick={toggle}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-white/10 text-white font-medium"
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {/* {item.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-white/20 rounded-full">
                      {item.badge}
                    </span>
                  )} */}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full border-t border-blue-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-4 text-sm text-blue-100 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
