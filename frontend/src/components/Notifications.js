import React, { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket(process.env.REACT_APP_SOCKET_URL);

  // On mount, load stored notifications
  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  //  notifications update, save to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (socket) {
      socket.on('teamMemberAdded', (data) => {
        console.log("Received notification:", data);
        const newNotification = { message: data.message, time: new Date() };
        setNotifications((prev) => [...prev, newNotification]);
      });
      return () => {
        socket.off('teamMemberAdded');
      };
    }
  }, [socket]);

  // test button to simulate a notification locally
  const sendTestNotificationLocally = () => {
    const testNotification = {
      message: 'Test notification (client only)',
      time: new Date()
    };
    setNotifications((prev) => [...prev, testNotification]);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <button
        onClick={sendTestNotificationLocally}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Send Test Notification Locally
      </button>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="list-disc list-inside">
          {notifications.map((notif, index) => (
            <li key={index}>
              {notif.message}{' '}
              <span className="text-gray-500 text-xs">
                ({new Date(notif.time).toLocaleTimeString()})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;