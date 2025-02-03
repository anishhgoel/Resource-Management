import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function ProjectDetail({ token }) {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('');
  const [newTeamHours, setNewTeamHours] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setProject(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching project');
      }
    };

    fetchProject();
  }, [projectId]);

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/projects/${projectId}/team`, {
        userID: newTeamEmail,
        role: newTeamRole,
        hoursAllocated: newTeamHours
      });
      setProject(res.data);
      setNewTeamEmail('');
      setNewTeamRole('');
      setNewTeamHours('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding team member');
    }
  };

  const handleRemoveTeamMember = async (userID) => {
    try {
      const res = await api.delete(`/projects/${projectId}/team`, {
        data: { userID }
      });
      setProject(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error removing team member');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Project Detail</h2>
      {error && <p className="text-red-500">{error}</p>}
      {project ? (
        <div>
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <p className="mb-2">{project.description}</p>
          <p className="mb-2">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
          <p className="mb-4">Status: {project.status}</p>
          <h4 className="text-lg font-semibold mb-2">Team Members:</h4>
          {project.team && project.team.length > 0 ? (
            <ul className="list-disc list-inside mb-4">
              {project.team.map((member) => (
                <li key={member._id} className="flex items-center justify-between">
                  {member.user ? (
                    <span>
                      {member.user.name} ({member.user.email}) - {member.role}{" "}
                      {member.hoursAllocated ? `- ${member.hoursAllocated} hrs` : ""}
                    </span>
                  ) : (
                    <span>Invalid team member</span>
                  )}
                  {member.user && (
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleRemoveTeamMember(member.user._id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members assigned.</p>
          )}
          <h4 className="text-lg font-semibold mb-2">Add Team Member</h4>
          <form onSubmit={handleAddTeamMember} className="space-y-4">
            <div>
              <label className="block mb-1">User ID:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newTeamEmail}
                onChange={(e) => setNewTeamEmail(e.target.value)}
                required
              />
              <small className="text-gray-500">Enter the user's ID (frontend can later be improved to use email lookup).</small>
            </div>
            <div>
              <label className="block mb-1">Role:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newTeamRole}
                onChange={(e) => setNewTeamRole(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Hours Allocated:</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newTeamHours}
                onChange={(e) => setNewTeamHours(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Add Team Member
            </button>
          </form>
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}

export default ProjectDetail;