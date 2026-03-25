import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Shield, User, UserCheck, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'owner' | 'staff' | 'student' | 'public';
  createdAt: any;
}

export default function Staff() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { userData } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: UserData[] = [];
      snapshot.forEach((doc) => {
        usersData.push({ ...doc.data() } as UserData);
      });
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userData?.role !== 'admin') {
      toast.error('Only admins can change user roles.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      toast.success('User role updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
      toast.error('Failed to update user role');
    }
  };

  const handleDelete = async (userId: string) => {
    if (userData?.role !== 'admin') {
      toast.error('Only admins can delete users.');
      return;
    }

    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        toast.success('User deleted successfully');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
        toast.error('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage staff and admin access to the dashboard.</p>
        </div>
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">User</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Email</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Current Role</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mr-3">
                          <User size={16} />
                        </div>
                        <span className="font-medium text-gray-900">{user.displayName || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'student' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                        {user.role === 'staff' && <UserCheck size={12} className="mr-1" />}
                        {user.role === 'student' && <User size={12} className="mr-1" />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                          disabled={userData?.role !== 'admin' || user.email === 'hananirfan91@gmail.com' || user.email === 'hananirfa91@gmail.com' || user.email === 'hananirfan81@gmail.com'}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:bg-gray-100"
                        >
                          <option value="public">Public (No Access)</option>
                          <option value="student">Student (Resident)</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleDelete(user.uid)}
                          disabled={userData?.role !== 'admin' || user.email === 'hananirfan91@gmail.com' || user.email === 'hananirfa91@gmail.com' || user.email === 'hananirfan81@gmail.com'}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
