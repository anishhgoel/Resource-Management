import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ 
  children, 
  user, 
  currentPath,
  onNavigate,
  onLogout,
  onProfileClick 
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        role={user?.role} 
        currentPath={currentPath}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          user={user} 
          onProfileClick={onProfileClick}
        />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;