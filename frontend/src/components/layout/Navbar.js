import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';

const Navbar = ({ user, onProfileClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifications = [
    { id: 1, text: 'New project assigned', time: '5m ago' },
    { id: 2, text: 'Meeting scheduled', time: '1h ago' },
    { id: 3, text: 'Project deadline updated', time: '2h ago' },
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4">
        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-600">
                    Notifications
                  </div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 space-y-1 cursor-pointer rounded-lg hover:bg-gray-50"
                    >
                      <div className="text-sm text-gray-800">
                        {notification.text}
                      </div>
                      <div className="text-xs text-gray-500">
                        {notification.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-700"
            >
              <User size={32} />
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{user?.name || 'User Name'}</div>
                <div className="text-xs text-gray-500">{user?.role || 'Role'}</div>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-1">
                  <button
                    onClick={() => onProfileClick?.('settings')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => onProfileClick?.('support')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Help & Support
                  </button>
                  <button
                    onClick={() => onProfileClick?.('logout')}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 rounded-lg hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;