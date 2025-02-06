import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSocket from '../hooks/useSocket';

function Dashboard({ token, userRole }) {
  const socket = useSocket(process.env.REACT_APP_SOCKET_URL);

  useEffect(() => {
    if (socket) {
      socket.on('projectUpdated', (updatedProject) => {
        console.log('Project updated in real time:', updatedProject);
      });
    }
  }, [socket]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="mb-4">
        Welcome! You are logged in as <span className="font-semibold">{userRole}</span>.
      </p>
      <div>
        <h3 className="text-xl mb-2">Quick Links:</h3>
        <ul className="list-disc list-inside">
          <li>
            <Link className="text-blue-500 hover:underline" to="/projects">View Projects</Link>
          </li>
          <li>
            <Link className="text-blue-500 hover:underline" to="/profile">View Profile</Link>
          </li>
          {userRole === 'admin' && (
            <li>
              <Link className="text-blue-500 hover:underline" to="/admin/users">Manage Users</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;