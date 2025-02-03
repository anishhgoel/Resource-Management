// src/components/Notifications.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

    socket.on('projectUpdated', (data) => {
      setNotifications((prev) => [
        ...prev,
        { message: `Project "${data.title}" has been updated.`, time: new Date() },
      ]);
    });

    socket.on('teamMemberAdded', (data) => {
      setNotifications((prev) => [
        ...prev,
        { message: `New team member added to project "${data.title}".`, time: new Date() },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="list-disc list-inside">
          {notifications.map((notif, index) => (
            <li key={index}>
              {notif.message}{' '}
              <span className="text-gray-500 text-xs">
                ({notif.time.toLocaleTimeString()})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;