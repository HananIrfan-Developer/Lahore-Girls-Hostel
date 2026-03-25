import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings as SettingsIcon, Save, Key, User, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Settings() {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [fatherName, setFatherName] = useState(userData?.fatherName || '');
  const [cnicNumber, setCnicNumber] = useState(userData?.cnicNumber || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [address, setAddress] = useState(userData?.address || '');
  const [roomNumber, setRoomNumber] = useState(userData?.roomNumber || '');
  
  // Password Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      await updateDoc(doc(db, 'users', user.uid), { 
        displayName,
        fatherName,
        cnicNumber,
        phoneNumber,
        address,
        roomNumber
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in to change your password.');
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="mr-3 text-pink-600" />
          Settings
        </h2>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'profile' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={18} className="mr-3" />
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'security' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Shield size={18} className="mr-3" />
              Security
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    placeholder="Father's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Number</label>
                  <input
                    type="text"
                    value={cnicNumber}
                    onChange={(e) => setCnicNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    placeholder="e.g. 12345-1234567-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow resize-none"
                    placeholder="Your permanent address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    placeholder="e.g. 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 capitalize font-medium">
                    {userData?.role}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2.5 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    <Key size={18} className="mr-2" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
