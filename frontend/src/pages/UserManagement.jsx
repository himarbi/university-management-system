import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { Users, Search, Shield, User, GraduationCap, Loader2, Info } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve user directory.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200"><Shield className="h-3 w-3" /> Admin</span>;
      case 'TEACHER':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200"><User className="h-3 w-3" /> Faculty</span>;
      case 'STUDENT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"><GraduationCap className="h-3 w-3" /> Student</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-bold">{role}</span>;
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.2s_ease-out]">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#0f224a] flex items-center gap-3">
          <Users className="h-7 w-7" />
          University User Directory & Access Control
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage system user accounts, filter by role, and inspect assigned permissions.
        </p>
      </div>

      {/* Demo & Section Explanation Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800 text-xs leading-relaxed space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#0f224a] text-sm">
          <Info className="h-4 w-4 text-blue-600" />
          Feature Demo Guide: User Directory & Access Control
        </div>
        <p>
          Administrators can inspect all registered user accounts, filter by role (ADMIN, TEACHER, STUDENT), search usernames/emails, and verify role-based permissions across the university platform.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] text-sm text-slate-800 shadow-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] text-sm text-slate-800 shadow-sm"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">System Admins</option>
          <option value="TEACHER">Faculty Members</option>
          <option value="STUDENT">Students</option>
        </select>
      </div>

      {/* Table */}
      <div className="navy-card rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-extrabold text-[#0f224a] text-base">Registered System Users</h3>
          <span className="text-xs font-bold text-slate-500">{filteredUsers.length} Users Found</span>
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center bg-white">
            <Loader2 className="h-6 w-6 animate-spin text-[#0f224a]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm bg-white">
            No users match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-[#0f224a] font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Username</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-medium">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{u.id}</td>
                    <td className="px-6 py-4 font-bold text-[#0f224a]">{u.username}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{u.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserManagement;
