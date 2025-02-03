import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditProject({ token }) {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');
  const [clientId, setClientId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/projects/${projectId}`)
      .then((res) => {
        setProject(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setDeadline(new Date(res.data.deadline).toISOString().split('T')[0]);
        setStatus(res.data.status);
        setClientId(res.data.client ? res.data.client._id : '');
      })
      .catch((err) => setError(err.response?.data?.msg || 'Error fetching project'));
  }, [projectId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, deadline, status, clientId };
      const res = await api.put(`/projects/${projectId}`, payload);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating project');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      {error && <p className="text-red-500">{error}</p>}
      {project ? (
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
          <div>
            <label className="block mb-1">Status:</label>
            <select
              className="w-full p-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Client ID:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Update Project
          </button>
        </form>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}

export default EditProject;