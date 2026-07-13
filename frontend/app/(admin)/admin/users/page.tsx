'use client';

import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Trash2, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'user' | 'host' | 'admin';
  createdAt?: string;
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== 'admin') { setLoading(false); return; }
      try {
        const res = await api.get('/users/admin/all');
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchUsers();
  }, [user, authLoading]);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'host' ? 'user' : 'host';
    const action = newRole === 'host' ? 'upgrade to Host' : 'downgrade to User';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    setActionLoading(userId);
    try {
      await api.put(`/users/admin/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole as UserData['role'] } : u));
    } catch (error) {
      console.error('Error changing user role:', error);
      alert('Failed to change user role.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) return;
    setActionLoading(userId + '-delete');
    try {
      await api.delete(`/users/admin/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. The backend may not support this operation yet.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-500 text-sm mt-1">Manage all registered guests, vendors, and admins ({users.length} total).</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4">{u.email || '—'}</td>
                  <td className="px-6 py-4">{u.phoneNumber || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'host' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.role !== 'admin' && (
                        <>
                          <button 
                            onClick={() => handleRoleChange(u._id, u.role)}
                            disabled={actionLoading === u._id}
                            className={`p-1.5 transition-colors disabled:opacity-50 ${
                              u.role === 'host' 
                                ? 'text-blue-400 hover:text-orange-500' 
                                : 'text-gray-400 hover:text-green-500'
                            }`}
                            title={u.role === 'host' ? 'Downgrade to User' : 'Upgrade to Host'}
                          >
                            {actionLoading === u._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : u.role === 'host' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            disabled={actionLoading === u._id + '-delete'}
                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50" 
                            title="Delete User"
                          >
                            {actionLoading === u._id + '-delete' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      )}
                      {u.role === 'admin' && (
                        <span title="Admin (Protected)">
                          <Shield className="w-4 h-4 text-purple-400" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
