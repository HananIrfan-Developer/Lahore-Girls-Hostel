import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { UserData } from '../../types';
import { Users, Search, Plus, Edit2, Trash2, X, MapPin, Phone, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router';

export default function Residents() {
  const [residents, setResidents] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<UserData | null>(null);
  const { userData } = useAuth();

  const [formData, setFormData] = useState({
    roomNumber: '',
    contactDetails: '',
    guardianInfo: '',
    status: 'inside' as 'inside' | 'outside'
  });

  useEffect(() => {
    if (userData?.role === 'student' || userData?.role === 'staff') return;
    
    const q = query(collection(db, 'users'), where('role', 'in', ['student', 'staff']));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const residentsData: UserData[] = [];
      snapshot.forEach((doc) => {
        residentsData.push({ uid: doc.id, ...doc.data() } as UserData);
      });
      setResidents(residentsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => unsubscribe();
  }, [userData]);

  const handleOpenModal = (resident?: UserData) => {
    if (resident) {
      setEditingResident(resident);
      setFormData({
        roomNumber: resident.roomNumber || '',
        contactDetails: resident.contactDetails || '',
        guardianInfo: resident.guardianInfo || '',
        status: resident.status || 'inside'
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResident(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingResident) {
        await updateDoc(doc(db, 'users', editingResident.uid), {
          ...formData
        });
        toast.success('Resident updated successfully');
        handleCloseModal();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
      toast.error('Failed to save resident');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this resident?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        toast.success('Resident deleted successfully');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${id}`);
        toast.error('Failed to delete resident');
      }
    }
  };

  const filteredResidents = residents.filter(r => 
    (r.displayName || r.email).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (userData?.role === 'student' || userData?.role === 'staff') {
    return <Navigate to="/admin/attendance" replace />;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 font-serif">Residents</h2>
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search residents by name or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          />
        </div>
        
        {userData && ['admin', 'owner'].includes(userData.role) && (
          <button
            onClick={() => toast.info("To add a resident, go to User Management and change a user's role to Student.")}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-medium shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add Resident
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Room</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Contact</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No residents found.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((resident) => (
                  <tr key={resident.uid} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{resident.displayName || 'No Name'}</div>
                      <div className="text-sm text-gray-500">{resident.email}</div>
                    </td>
                    <td className="p-4 text-gray-600">{resident.roomNumber || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{resident.contactDetails || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        resident.status === 'inside' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {resident.status === 'inside' ? 'Inside' : 'Outside'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {userData && ['admin', 'owner'].includes(userData.role) && (
                        <>
                          <button
                            onClick={() => handleOpenModal(resident)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(resident.uid)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Resident Details
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {editingResident && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Name: {editingResident.displayName || 'No Name'}</p>
                  <p className="text-sm text-gray-500">Email: {editingResident.email}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
                <input
                  type="text"
                  required
                  value={formData.contactDetails}
                  onChange={(e) => setFormData({...formData, contactDetails: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Info (Name & Phone)</label>
                <input
                  type="text"
                  required
                  value={formData.guardianInfo}
                  onChange={(e) => setFormData({...formData, guardianInfo: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'inside' | 'outside'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="inside">Inside Hostel</option>
                  <option value="outside">Outside Hostel</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-xl font-medium transition-colors flex items-center"
                >
                  <Check size={18} className="mr-2" />
                  Save Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
