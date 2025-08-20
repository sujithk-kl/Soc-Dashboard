// client/src/pages/placeholder/RbacPage.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { listUsers, updateUserPassword, adminCreateUser } from '../../services/api';

const RbacPage = () => {
  const { user, ROLES } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({});
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Viewer' });
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    const load = async () => {
      if (!isAdmin) { setLoading(false); return; }
      try {
        const data = await listUsers(user.role);
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin, user]);

  const onChangePassword = async (id) => {
    const newPassword = passwords[id];
    if (!newPassword) return;
    await updateUserPassword(id, newPassword, user.role);
    setPasswords(prev => ({ ...prev, [id]: '' }));
    alert('Password updated');
  };

  const onCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;
    await adminCreateUser(newUser, user.role);
    setNewUser({ name: '', email: '', password: '', role: 'Viewer' });
    const data = await listUsers(user.role);
    setUsers(data);
    alert('User created');
  };

  if (!isAdmin) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-light">User Management</h1>
      <p className="text-gray-text mt-2">Admins can update passwords for Analysts and Viewers.</p>
      <form onSubmit={onCreateUser} className="mt-6 border border-border rounded-md p-4 grid md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Full name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="px-3 py-2 bg-dark border border-border rounded-md text-light"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="px-3 py-2 bg-dark border border-border rounded-md text-light"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="px-3 py-2 bg-dark border border-border rounded-md text-light"
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="px-3 py-2 bg-dark border border-border rounded-md text-light"
        >
          <option value="Viewer">Viewer</option>
          <option value="Analyst">Analyst</option>
          <option value="Admin">Admin</option>
        </select>
        <div className="md:col-span-4">
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">Create User</button>
        </div>
      </form>
      {loading ? (
        <p className="text-gray-text mt-6">Loading...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {users.map(u => (
            <div key={u._id} className="border border-border rounded-md p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="text-light font-semibold">{u.name} <span className="text-gray-text">({u.email})</span></div>
                <div className="text-xs text-gray-text">Role: {u.role}</div>
              </div>
              {u.role !== ROLES.ADMIN && (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder="New password"
                    value={passwords[u._id] || ''}
                    onChange={(e) => setPasswords(prev => ({ ...prev, [u._id]: e.target.value }))}
                    className="px-3 py-2 bg-dark border border-border rounded-md text-light"
                  />
                  <button
                    onClick={() => onChangePassword(u._id)}
                    className="bg-primary text-white px-3 py-2 rounded-md"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default RbacPage;