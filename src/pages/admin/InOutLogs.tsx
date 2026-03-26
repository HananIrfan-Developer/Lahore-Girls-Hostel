import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, setDoc, updateDoc, Timestamp, orderBy, limit, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../firebase';
import { UserData, InOutLog } from '../../types';
import { LogIn, LogOut, Search, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

export default function InOutLogs() {
  const [residents, setResidents] = useState<UserData[]>([]);
  const [logs, setLogs] = useState<InOutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { userData } = useAuth();

  useEffect(() => {
    let unsubResidents: () => void;
    
    if (userData?.role === 'student' || userData?.role === 'staff') {
      unsubResidents = onSnapshot(doc(db, 'users', userData.uid), (docSnap) => {
        if (docSnap.exists()) {
          setResidents([{ uid: docSnap.id, ...docSnap.data() } as UserData]);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
      });
    } else {
      const qResidents = query(collection(db, 'users'), where('role', 'in', ['student', 'staff']));
      unsubResidents = onSnapshot(qResidents, (snapshot) => {
        const residentsData: UserData[] = [];
        snapshot.forEach((docSnap) => {
          residentsData.push({ uid: docSnap.id, ...docSnap.data() } as UserData);
        });
        setResidents(residentsData);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
      });
    }

    // Fetch logs
    let qLogs = query(collection(db, 'inOutLogs'), orderBy('timestamp', 'desc'), limit(100));
    
    // If student or staff, only fetch their own logs
    if (userData?.role === 'student' || userData?.role === 'staff') {
      qLogs = query(collection(db, 'inOutLogs'), where('residentId', '==', userData.uid), orderBy('timestamp', 'desc'), limit(100));
    }

    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const logsData: InOutLog[] = [];
      snapshot.forEach((doc) => {
        logsData.push({ id: doc.id, ...doc.data() } as InOutLog);
      });
      setLogs(logsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'inOutLogs');
    });

    return () => {
      unsubResidents();
      unsubLogs();
    };
  }, [userData]);

  const handleMarkEntryExit = async (resident: UserData, type: 'entry' | 'exit') => {
    if (!auth.currentUser) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    try {
      const now = Timestamp.now();
      const logId = crypto.randomUUID();
      
      // 1. Create Log
      const logData: InOutLog = {
        id: logId,
        residentId: resident.uid,
        type,
        timestamp: now,
        markedBy: auth.currentUser.uid
      };
      
      await setDoc(doc(db, 'inOutLogs', logId), logData);

      // 2. Update Resident Status
      const newStatus = type === 'entry' ? 'inside' : 'outside';
      await updateDoc(doc(db, 'users', resident.uid), {
        status: newStatus
      });

      // 3. Send to Google Sheets
      const scriptUrl = (import.meta as any).env.VITE_GOOGLE_SHEETS_URL;
      if (scriptUrl) {
        try {
          const params = new URLSearchParams();
          params.append('type', 'InOut');
          params.append('name', resident.displayName || resident.email || 'Unknown');
          params.append('fatherName', resident.fatherName || '');
          params.append('roomNumber', resident.roomNumber || '');
          params.append('cnic', resident.cnicNumber || '');
          params.append('phone', resident.phoneNumber || '');
          params.append('address', resident.address || '');
          params.append('action', type === 'entry' ? 'In' : 'Out');
          params.append('timestamp', new Date().toISOString());

          await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
          });
        } catch (sheetError) {
          console.error('Failed to sync to Google Sheets:', sheetError);
          // Don't show error to user as the main operation succeeded
        }
      }

      toast.success(`${resident.displayName || resident.email} marked as ${type === 'entry' ? 'entered' : 'exited'}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'inOutLogs/users');
      toast.error('Failed to update status');
    }
  };

  const filteredResidents = residents.filter(r => {
    if ((userData?.role === 'student' || userData?.role === 'staff') && r.uid !== userData.uid) return false;
    return (r.displayName || r.email).toLowerCase().includes(searchTerm.toLowerCase()) ||
           (r.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getResidentName = (id: string) => {
    const r = residents.find(res => res.uid === id);
    return r ? (r.displayName || r.email) : 'Unknown Resident';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Quick Mark Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Quick Entry/Exit</h2>
        
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search resident to mark..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {filteredResidents.map(resident => (
            <div key={resident.uid} className="border border-gray-100 rounded-xl p-4 flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="font-bold text-gray-900">{resident.displayName || resident.email}</h3>
                <p className="text-sm text-gray-500">Room: {resident.roomNumber || 'N/A'}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    resident.status === 'inside' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    Currently: {resident.status === 'inside' ? 'Inside' : 'Outside'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkEntryExit(resident, 'entry')}
                  disabled={resident.status === 'inside'}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <LogIn size={16} className="mr-1.5" />
                  Mark Entry
                </button>
                <button
                  onClick={() => handleMarkEntryExit(resident, 'exit')}
                  disabled={resident.status === 'outside'}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <LogOut size={16} className="mr-1.5" />
                  Mark Exit
                </button>
              </div>
            </div>
          ))}
          {filteredResidents.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No residents found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center font-serif">
            <Clock className="mr-2 text-pink-600" size={24} />
            Recent Activity Logs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Date & Time</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Resident Name</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600 text-sm">
                      {format(log.timestamp.toDate(), 'MMM dd, yyyy - hh:mm a')}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {getResidentName(log.residentId)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        log.type === 'entry' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {log.type === 'entry' ? (
                          <><LogIn size={12} className="mr-1" /> ENTERED</>
                        ) : (
                          <><LogOut size={12} className="mr-1" /> EXITED</>
                        )}
                      </span>
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
