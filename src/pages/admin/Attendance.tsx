import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, setDoc, Timestamp, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../firebase';
import { UserData, Attendance } from '../../types';
import { Calendar, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

export default function AttendancePage() {
  const [residents, setResidents] = useState<UserData[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { userData } = useAuth();

  useEffect(() => {
    let unsubResidents: () => void;
    
    if (userData?.role === 'student' || userData.role === 'staff') {
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

    // Fetch attendance for selected date
    let qAttendance = query(collection(db, 'attendance'), where('date', '==', selectedDate));
    
    // If student or staff, only fetch their own attendance
    if (userData?.role === 'student' || userData?.role === 'staff') {
      qAttendance = query(collection(db, 'attendance'), where('date', '==', selectedDate), where('residentId', '==', userData.uid));
    }

    const unsubAttendance = onSnapshot(qAttendance, (snapshot) => {
      const attendanceData: Attendance[] = [];
      snapshot.forEach((doc) => {
        attendanceData.push({ id: doc.id, ...doc.data() } as Attendance);
      });
      setAttendanceRecords(attendanceData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'attendance');
    });

    return () => {
      unsubResidents();
      unsubAttendance();
    };
  }, [selectedDate, userData]);

  const handleMarkAttendance = async (residentId: string, status: 'present' | 'absent') => {
    if (!auth.currentUser) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    try {
      const now = Timestamp.now();
      // Use a composite ID to ensure one record per resident per day
      const attendanceId = `${residentId}_${selectedDate}`;
      
      const attendanceData: Attendance = {
        id: attendanceId,
        residentId,
        date: selectedDate,
        status,
        markedBy: auth.currentUser.uid,
        timestamp: now
      };

      await setDoc(doc(db, 'attendance', attendanceId), attendanceData);

      // Send to Google Sheets
      const scriptUrl = (import.meta as any).env.VITE_GOOGLE_SHEETS_URL;
      if (scriptUrl) {
        try {
          const resident = residents.find(r => r.uid === residentId);
          await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
              type: 'Attendance',
              date: selectedDate,
              name: resident?.displayName || resident?.email || 'Unknown',
              fatherName: resident?.fatherName || '',
              roomNumber: resident?.roomNumber || '',
              cnic: resident?.cnicNumber || '',
              phone: resident?.phoneNumber || '',
              address: resident?.address || '',
              status: status
            })
          });
        } catch (sheetError) {
          console.error('Failed to sync to Google Sheets:', sheetError);
        }
      }

      toast.success(`Marked as ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'attendance');
      toast.error('Failed to mark attendance');
    }
  };

  const getAttendanceStatus = (residentId: string) => {
    const record = attendanceRecords.find(a => a.residentId === residentId);
    return record ? record.status : null;
  };

  const filteredResidents = residents.filter(r => {
    if ((userData?.role === 'student' || userData?.role === 'staff') && r.uid !== userData.uid) return false;
    return (r.displayName || r.email).toLowerCase().includes(searchTerm.toLowerCase()) ||
           (r.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
  const absentCount = attendanceRecords.filter(a => a.status === 'absent').length;
  const unmarkedCount = residents.length - presentCount - absentCount;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="mr-3 text-pink-600" size={28} />
              Daily Attendance
            </h2>
            <p className="text-gray-500 mt-1">Manage and track daily resident presence.</p>
          </div>
          
          <div className="flex items-center bg-gray-50 rounded-xl p-2 border border-gray-200">
            <label htmlFor="date-picker" className="text-sm font-medium text-gray-700 mr-3 ml-2">Select Date:</label>
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 mb-1">Present</p>
              <p className="text-2xl font-bold text-green-900">{presentCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800 mb-1">Absent</p>
              <p className="text-2xl font-bold text-red-900">{absentCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <XCircle size={24} />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unmarked</p>
              <p className="text-2xl font-bold text-gray-900">{unmarkedCount}</p>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <span className="text-xl font-bold">?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Resident Name</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Room</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Current Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-center">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No residents found.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((resident) => {
                  const status = getAttendanceStatus(resident.uid);
                  
                  return (
                    <tr key={resident.uid} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{resident.displayName || resident.email}</div>
                      </td>
                      <td className="p-4 text-gray-600">{resident.roomNumber || 'N/A'}</td>
                      <td className="p-4">
                        {status === 'present' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" /> Present
                          </span>
                        )}
                        {status === 'absent' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle size={14} className="mr-1" /> Absent
                          </span>
                        )}
                        {!status && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Unmarked
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleMarkAttendance(resident.uid, 'present')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                              status === 'present' 
                                ? 'bg-green-600 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(resident.uid, 'absent')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                              status === 'absent' 
                                ? 'bg-red-600 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
