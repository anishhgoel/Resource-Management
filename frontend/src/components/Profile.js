import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Profile({ token }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    api.get('/users/profile')
      .then((res) => {
        setProfile(res.data);
        setFormData({ name: res.data.name, email: res.data.email, password: '' });
      })
      .catch((err) => setError(err.response?.data?.msg || 'Error fetching profile'));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    api.put('/users/profile', formData)
      .then((res) => {
        setProfile(res.data);
        setEditing(false);
      })
      .catch((err) => setError(err.response?.data?.msg || 'Error updating profile'));
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {error && <p className="text-red-500">{error}</p>}
      {profile ? (
        <div>
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Password:</label>
                <input
                  type="password"
                  name="password"
                  className="w-full p-2 border rounded"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Update Profile
                </button>
                <button type="button" onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-2"><strong>Name:</strong> {profile.name}</p>
              <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
              <p className="mb-4"><strong>Role:</strong> {profile.role}</p>
              <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;