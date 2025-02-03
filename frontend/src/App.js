import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import Profile from './components/Profile';
import api from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    if (token) {
      api.get('/users/profile')
        .then((res) => {
          setUserRole(res.data.role);
        })
        .catch((err) => {
          console.error(err);
          setToken('');
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserRole('');
  };

  return (
    <Router>
      <div className="App max-w-4xl mx-auto p-4">
        <nav className="bg-gray-800 text-white p-4 rounded flex justify-between items-center">
          <h2 className="text-xl font-bold">Resource Management System</h2>
          <ul className="flex space-x-4">
            {token ? (
              <>
                <li>
                  <Link className="hover:text-gray-300" to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link className="hover:text-gray-300" to="/projects">Projects</Link>
                </li>
                <li>
                  <Link className="hover:text-gray-300" to="/profile">Profile</Link>
                </li>
                <li>
                  <button className="hover:text-gray-300" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="hover:text-gray-300" to="/login">Login</Link>
                </li>
                <li>
                  <Link className="hover:text-gray-300" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="mt-6">
          <Routes>
            <Route path="/" element={token ? <Dashboard token={token} userRole={userRole} /> : <Navigate to="/login" />} />
            <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} />
            <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={token ? <Dashboard token={token} userRole={userRole} /> : <Navigate to="/login" />} />
            <Route path="/projects" element={token ? <ProjectList token={token} /> : <Navigate to="/login" />} />
            <Route path="/projects/:projectId" element={token ? <ProjectDetail token={token} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={token ? <Profile token={token} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;