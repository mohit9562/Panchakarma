import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaChartLine,
  FaUser,
  FaHome,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);

    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setIsMenuOpen(false);
      navigate("/login");
    }
  };

  if (isLoading || !isAuthenticated) return null;

  return (
    <nav className="w-full fixed top-0 left-0 flex justify-between items-center px-6 py-3 bg-indigo-600 text-white shadow-md z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <Link
          to="/dashboard"
          className="flex items-center hover:text-indigo-200 transition-colors"
        >
          <FaHome className="mr-2" />
          Home
        </Link>
      </div>

      {/* Right Section - User Menu */}
      <div className="relative user-menu">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-2 focus:outline-none hover:text-indigo-200 transition-colors"
          aria-label="User menu"
          aria-expanded={isMenuOpen}
        >
          <FaUserCircle className="text-2xl" />
          <span className="hidden md:inline">Account</span>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
            <Link
              to="/profile"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUser className="mr-3 text-indigo-500" />
              Profile
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaChartLine className="mr-3 text-indigo-500" />
              Dashboard
            </Link>
            <Link
              to="/register-patient"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaChartLine className="mr-3 text-indigo-500" />
              Register
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaCog className="mr-3 text-indigo-500" />
              Settings
            </Link>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors"
            >
              <FaSignOutAlt className="mr-3 text-indigo-500" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
