import React, { useState } from 'react';
import Layout from './components/layout/Layout';

function App() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  
  // Mock user for testing
  const user = {
    name: 'John Doe',
    role: 'admin',
    email: 'john@example.com'
  };

  const handleNavigate = (path) => {
    setCurrentPath(path);
    console.log('Navigating to:', path);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    if (action === 'logout') {
      handleLogout();
    }
  };

  return (
    <div className="h-screen">
      <Layout 
        user={user}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onProfileClick={handleProfileAction}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {currentPath.slice(1).charAt(0).toUpperCase() + currentPath.slice(2)}
          </h1>
          <p className="mt-4 text-gray-600">
            Current page: {currentPath}
          </p>
        </div>
      </Layout>
    </div>
  );
}

export default App;