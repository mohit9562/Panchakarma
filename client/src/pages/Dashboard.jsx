import React from "react";
 // Import useHistory for navigation
import Navbar from "./Navbar";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <p className="mt-4">
        This is a protected route. Only authenticated users can access it.
      </p>
      <div className="mt-6 p-4 bg-gray-200 rounded-lg">
        <h2 className="text-xl">Your Stats</h2>
        <ul>
          <li>
            <strong>Total Posts:</strong> 10
          </li>
          <li>
            <strong>Active Sessions:</strong> 2
          </li>
          <li>
            <strong>Last Login:</strong> 2025-04-15
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
