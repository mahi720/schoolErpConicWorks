import React, { useState } from "react";
import { Menu, Moon, Sun, Bell, User, LogOut, Search } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutApi } from "../../api/auth/authApi";
import { useAuthStore } from "../../store/auth/authStore";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { toggleSidebar, notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      await logoutApi();
      clearAuth();
      toast.success("Logout successful");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-gray-600 text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-blue-600">School ERP</h1>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="w-full relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400"
            />
            <input
              type="text"
              placeholder="Search students, classes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 text-gray-300">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-black dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 last:border-b-0"
                      >
                        <p className="text-sm text-black dark:text-white">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      No notifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="User menu"
            >
              <User size={20} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-black dark:text-white">
                    Admin User
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    admin@school.com
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
