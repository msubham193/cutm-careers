import React, { useState } from 'react';
import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Theme implementation would go here
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="p-2 rounded-md lg:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="ml-4 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 lg:ml-0">
            Centurion University Admin Panel
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search with animation */}
          <div className="relative hidden md:block group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out group-hover:bg-white"
              placeholder="Search..."
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-gray-900">New application received</p>
                      <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="flex items-center group relative">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="font-semibold">AD</span>
            </div>
            <div className="ml-2 hidden md:block group-hover:text-blue-900 transition-colors">
              <div className="text-sm font-semibold text-gray-700">Admin User</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;