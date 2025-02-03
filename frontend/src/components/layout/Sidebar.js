import React, { useState } from 'react';
import { 
  Home,
  Users,
  FolderOpen,
  BarChart,
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';

const Sidebar = ({ 
  role = 'team', 
  currentPath = '/dashboard',
  onNavigate,
  onLogout 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = {
    admin: [
      { name: 'Dashboard', icon: Home, path: '/dashboard' },
      { name: 'Projects', icon: FolderOpen, path: '/projects' },
      { name: 'Team', icon: Users, path: '/team' },
      { name: 'Analytics', icon: BarChart, path: '/analytics' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ],
    team: [
      { name: 'Dashboard', icon: Home, path: '/dashboard' },
      { name: 'Projects', icon: FolderOpen, path: '/projects' },
      { name: 'Team', icon: Users, path: '/team' },
    ],
    client: [
      { name: 'Dashboard', icon: Home, path: '/dashboard' },
      { name: 'Projects', icon: FolderOpen, path: '/projects' },
    ],
  };

  const currentMenuItems = menuItems[role] || menuItems.team;

  return (
    <div 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out relative`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        {isCollapsed ? (
          <div className="text-2xl font-bold text-blue-600">RM</div>
        ) : (
          <div className="text-2xl font-bold text-blue-600">ResourceManager</div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="mt-6">
        <div className="px-4 space-y-3">
          {currentMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.name}
                onClick={() => onNavigate?.(item.path)}
                className={`flex items-center w-full p-3 space-x-3 transition-colors rounded-lg
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon size={24} />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center w-full p-3 space-x-3 text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
        >
          <LogOut size={24} />
          {!isCollapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-3 bg-white border border-gray-200 rounded-full p-1.5 text-gray-400 hover:text-gray-600"
      >
        <ChevronLeft 
          size={16}
          className={`transform transition-transform ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
};

export default Sidebar;