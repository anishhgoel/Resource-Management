import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AddProject({ token, userRole }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [clientId, setClientId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // For non-admin users, if no clientId provided, the backend will default to req.user.id.
    const payload = {
      title,
      description,
      deadline,
      clientId: clientId || null,
    };
    try {
      const res = await api.post('/projects', payload);
      navigate(`/projects/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating project');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description:</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Deadline:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        {userRole === 'admin' && (
          <div>
            <label className="block mb-1">Client ID:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Optional: Enter a client ID"
            />
          </div>
        )}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Create Project
        </button>
      </form>
    </div>
  );
}

export default AddProject;