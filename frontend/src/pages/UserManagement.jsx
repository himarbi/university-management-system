import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Mail, 
  User as UserIcon,
  ShieldAlert,
  Key
} from 'lucide-react';

const UserManagement = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE');
  const [selectedUser, setSelectedUser] = useState(null);

  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true') {
      openCreateModal();
    }
  }, [location]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve user catalog.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('CREATE');
    setSelectedUser(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('STUDENT');
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('EDIT');
    setSelectedUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setSuccess('User deleted successfully.');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Could not delete selected user.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      if (modalMode === 'CREATE') {
        await api.post('/users', { username, email, password, role });
        setSuccess('User created successfully.');
      } else {
        await api.put(`/users/${selectedUser.id}`, { 
          username, 
          email, 
          password: password || null, 
          role 
        });
        setSuccess('User updated successfully.');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to submit user information.');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-900/10 text-blue-900 border border-blue-900/20';
      case 'TEACHER':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'STUDENT':
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      default:
        return 'bg-gray-150 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.2s_ease-out]">
      
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f224a] flex items-center gap-3">
            <Users className="h-7 w-7" />
            User Directories
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Create, update roles, and manage institutional credentials for teachers, students, and admins.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-sm font-bold shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Alert Feedbacks */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl border border-emerald-250 bg-emerald-50 text-emerald-800 text-sm font-medium">
          {success}
        </div>
      )}

      {/* Search Filter Box */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
          <Search className="h-4.5 w-4.5" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, email, or role..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all shadow-sm"
        />
      </div>

      {/* Main Table */}
      <div className="navy-card rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex h-48 items-center justify-center bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-[#0f224a]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[#0f224a] uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                  <th className="px-6 py-4 font-bold">User Information</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Assigned Role</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-455 text-sm">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                            <UserIcon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-sm block">
                              {u.username}
                            </span>
                            <span className="text-[10px] text-slate-400">ID: #{u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${getRoleColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-2 rounded-lg text-slate-400 hover:text-[#0f224a] hover:bg-slate-100 transition-all"
                            title="Edit User"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Solid Navy & White */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 relative border border-slate-200 shadow-2xl animate-[scaleUp_0.15s_ease-out] text-slate-800">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#0f224a]"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-black text-[#0f224a] flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <ShieldAlert className="h-5 w-5" />
              {modalMode === 'CREATE' ? 'Add Institutional Account' : 'Edit Credentials'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.com"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {modalMode === 'CREATE' ? 'Password' : 'Password (Leave empty to keep current)'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required={modalMode === 'CREATE'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Institutional Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>{modalMode === 'CREATE' ? 'Save User' : 'Update Credentials'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
