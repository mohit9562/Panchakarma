import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    
    <div className="min-h-screen flex flex-col">
      

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-gray-50">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Project X
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-indigo-100">
          Your platform for amazing things. Join our community today!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-white hover:bg-indigo-100 text-indigo-600 px-6 py-3 rounded-md font-medium text-lg transition-colors duration-300"
          >
            Log In
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-700 text-gray-50 text-center p-4">
        <p>&copy; 2025 Project X. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
