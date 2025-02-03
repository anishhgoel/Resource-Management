import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ProjectList({ token }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.response?.data?.msg || 'Error fetching projects'));
  }, [token]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      {error && <p className="text-red-500">{error}</p>}
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="list-disc list-inside">
          {projects.map((project) => (
            <li key={project._id}>
              <Link className="text-blue-500 hover:underline" to={`/projects/${project._id}`}>
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProjectList;