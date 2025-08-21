// client/src/pages/placeholder/RbacPage.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { listUsers, updateUserPassword, adminCreateUser, deleteUser, toggleUserStatus } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBan, faCheck, faUserSlash, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

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
    try {
      await updateUserPassword(id, newPassword, user.role);
      setPasswords(prev => ({ ...prev, [id]: '' }));
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  const onCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;
    try {
      await adminCreateUser(newUser, user.role);
      setNewUser({ name: '', email: '', password: '', role: 'Viewer' });
      const data = await listUsers(user.role);
      setUsers(data);
      toast.success('User created successfully');
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to create user';
      if (/admin limit/i.test(msg)) {
        alert(msg);
      } else {
        toast.error(msg);
      }
    }
  };

  const onDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteUser(userId, user.role);
      const data = await listUsers(user.role);
      setUsers(data);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const onToggleUserStatus = async (userId, userName, currentStatus) => {
    const action = currentStatus === 'active' ? 'block' : 'unblock';
    if (!confirm(`Are you sure you want to ${action} user "${userName}"?`)) {
      return;
    }
    
    try {
      await toggleUserStatus(userId, user.role);
      const data = await listUsers(user.role);
      setUsers(data);
      const newStatus = currentStatus === 'active' ? 'blocked' : 'unblocked';
      toast.success(`User ${newStatus} successfully`);
    } catch (error) {
      toast.error(error.message || `Failed to ${action} user`);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-light">User Management</h1>
      <p className="text-gray-text mt-2">Admins can create, update, block, and delete users. Blocked users cannot log in.</p>
      <form onSubmit={onCreateUser} className="mt-6 border border-border rounded-md p-4 grid md:grid-cols-4 gap-3" autoComplete="on">
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
          name="username"
          autoComplete="username"
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
           autoComplete="new-password"
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
            <div key={u._id} className={`border border-border rounded-md p-4 flex items-center gap-4 ${u.status === 'blocked' ? 'opacity-60 bg-dark-gray/20' : ''}`}>
              <div className="flex-1">
                <div className="text-light font-semibold flex items-center gap-2">
                  {u.name} 
                  <span className="text-gray-text">({u.email})</span>
                  {u.status === 'blocked' && (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
                      <FontAwesomeIcon icon={faUserSlash} />
                      Blocked
                    </span>
                  )}
                  {u.status === 'active' && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                      <FontAwesomeIcon icon={faUserCheck} />
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-text">Role: {u.role}</div>
              </div>
              
              <div className="flex items-center gap-2">
                                 {/* Password Update (for non-admin users) */}
                 {u.role !== ROLES.ADMIN && (
                   <form onSubmit={(e) => { e.preventDefault(); onChangePassword(u._id); }} className="flex items-center gap-2" autoComplete="on">
                     {/* Hidden username field for accessibility and browser heuristics */}
                     <input type="text" name="username" autoComplete="username" defaultValue={u.email} className="hidden" readOnly aria-hidden="true" tabIndex={-1} />
                     <input
                       type="password"
                       name="new-password"
                       placeholder="New password"
                       value={passwords[u._id] || ''}
                       onChange={(e) => setPasswords(prev => ({ ...prev, [u._id]: e.target.value }))}
                       className="px-3 py-2 bg-dark border border-border rounded-md text-light text-sm"
                       autoComplete="new-password"
                     />
                     <button
                       type="submit"
                       className="bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary/80 transition-colors"
                     >
                       Update
                     </button>
                   </form>
                 )}
                
                                 {/* Block/Unblock Button (not for admins) */}
                 {u.role !== ROLES.ADMIN && (
                   <button
                     onClick={() => onToggleUserStatus(u._id, u.name, u.status)}
                     className={`px-3 py-2 rounded-md text-sm transition-colors ${
                       u.status === 'active' 
                         ? 'bg-red-500 text-white hover:bg-red-600' 
                         : 'bg-green-500 text-white hover:bg-green-600'
                     }`}
                     title={u.status === 'active' ? 'Block User' : 'Unblock User'}
                   >
                     <FontAwesomeIcon icon={u.status === 'active' ? faBan : faCheck} />
                   </button>
                 )}
                 
                 {/* Delete Button (not for admins) */}
                 {u.role !== ROLES.ADMIN && (
                   <button
                     onClick={() => onDeleteUser(u._id, u.name)}
                     className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                     title="Delete User"
                   >
                     <FontAwesomeIcon icon={faTrash} />
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default RbacPage;