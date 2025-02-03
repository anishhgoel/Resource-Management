import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function ProjectDetail({ token }) {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [newTeamID, setNewTeamID] = useState('');
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
  }, [projectId]); // Removed token since it's not used in fetchProject

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/projects/${projectId}/team`, {
        userID: newTeamID,
        role: newTeamRole,
        hoursAllocated: parseInt(newTeamHours) || 0,
      });
      setProject(res.data);
      setNewTeamID('');
      setNewTeamRole('');
      setNewTeamHours('');
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding team member');
    }
  };

  const handleRemoveTeamMember = async (userID) => {
    try {
      const res = await api.delete(`/projects/${projectId}/team`, {
        data: { userID },
      });
      setProject(res.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.msg || 'Error removing team member');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Project Detail</h2>
        {project && token && (
          <Link 
            to={`/projects/edit/${project._id}`} 
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
          >
            Edit Project
          </Link>
        )}
      </div>
      {error && (
        <p className="text-red-500 p-2 mb-4 bg-red-50 rounded border border-red-200">
          {error}
        </p>
      )}
      {project ? (
        <div>
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <p className="mb-2">{project.description}</p>
          <p className="mb-2">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
          <p className="mb-4">Status: {project.status}</p>
          
          <section className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Team Members</h4>
            {project.team && project.team.length > 0 ? (
              <ul className="space-y-2">
                {project.team.map((member) => (
                  <li key={member._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    {member.user ? (
                      <span>
                        {member.user.name} ({member.user.email}) - {member.role}
                        {member.hoursAllocated ? ` - ${member.hoursAllocated} hrs` : ''}
                      </span>
                    ) : (
                      <span className="text-gray-500">Invalid team member</span>
                    )}
                    {member.user && (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        onClick={() => handleRemoveTeamMember(member.user._id)}
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No team members assigned.</p>
            )}
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-2">Add Team Member</h4>
            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div>
                <label className="block mb-1">User ID:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  value={newTeamID}
                  onChange={(e) => setNewTeamID(e.target.value)}
                  required
                />
                <small className="text-gray-500 mt-1">
                  Enter the user's ID (this can be improved later to use a dropdown or email lookup)
                </small>
              </div>
              <div>
                <label className="block mb-1">Role:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  value={newTeamRole}
                  onChange={(e) => setNewTeamRole(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Hours Allocated:</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  value={newTeamHours}
                  onChange={(e) => setNewTeamHours(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
              >
                Add Team Member
              </button>
            </form>
          </section>
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}

export default ProjectDetail;