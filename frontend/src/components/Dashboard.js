import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ token, userRole }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="mb-4">Welcome! You are logged in as <span className="font-semibold">{userRole}</span>.</p>
      <div>
        <h3 className="text-xl mb-2">Quick Links:</h3>
        <ul className="list-disc list-inside">
          <li>
            <Link className="text-blue-500 hover:underline" to="/projects">View Projects</Link>
          </li>
          <li>
            <Link className="text-blue-500 hover:underline" to="/profile">View Profile</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;