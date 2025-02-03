import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '' });

  const fetchUsers = () => {
    api.get('/users')
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.msg || 'Error fetching users'));
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = (userId) => {
    api.delete(`/users/${userId}`)
      .then(() => fetchUsers())
      .catch((err) => setError(err.response?.data?.msg || 'Error deleting user'));
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    api.put(`/users/${editingUserId}`, formData)
      .then(() => {
        setEditingUserId(null);
        fetchUsers();
      })
      .catch((err) => setError(err.response?.data?.msg || 'Error updating user'));
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="divide-y">
        {users.map((user) => (
          <li key={user._id} className="py-2 flex justify-between items-center">
            {editingUserId === user._id ? (
              <form onSubmit={handleUpdate} className="w-full flex flex-col space-y-2">
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  className="p-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <select
                  className="p-2 border rounded"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="client">Client</option>
                  <option value="team">Team</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="password"
                  className="p-2 border rounded"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep unchanged"
                />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingUserId(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p>{user.email}</p>
                  <p className="text-sm text-gray-600">Role: {user.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(user)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;