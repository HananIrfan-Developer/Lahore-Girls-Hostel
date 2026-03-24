import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Resident, Attendance } from '../../types';
import { Users, UserCheck, UserMinus, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Link } from 'react-router';

export default function Dashboard() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    if (userData?.role === 'student') return;

    const qResidents = query(collection(db, 'residents'));
    const unsubResidents = onSnapshot(qResidents, (snapshot) => {
      const residentsData: Resident[] = [];
      snapshot.forEach((doc) => {
        residentsData.push({ id: doc.id, ...doc.data() } as Resident);
      });
      setResidents(residentsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'residents');
    });

    const today = format(new Date(), 'yyyy-MM-dd');
    const qAttendance = query(collection(db, 'attendance'), where('date', '==', today));
    const unsubAttendance = onSnapshot(qAttendance, (snapshot) => {
      const attendanceData: Attendance[] = [];
      snapshot.forEach((doc) => {
        attendanceData.push({ id: doc.id, ...doc.data() } as Attendance);
      });
      setAttendance(attendanceData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'attendance');
    });

    return () => {
      unsubResidents();
      unsubAttendance();
    };
  }, []);

  if (userData?.role === 'student') {
    return <Navigate to="/admin/attendance" replace />;
  }

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading dashboard data...</div>;
  }

  const totalResidents = residents.length;
  const insideHostel = residents.filter(r => r.status === 'inside').length;
  const outsideHostel = residents.filter(r => r.status === 'outside').length;
  const presentToday = attendance.filter(a => a.status === 'present').length;

  const stats = [
    { title: 'Total Residents', value: totalResidents, icon: Users, color: 'bg-blue-500' },
    { title: 'Inside Hostel', value: insideHostel, icon: UserCheck, color: 'bg-green-500' },
    { title: 'Outside Hostel', value: outsideHostel, icon: UserMinus, color: 'bg-orange-500' },
    { title: 'Present Today', value: presentToday, icon: Activity, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${stat.color} mr-4 shrink-0 shadow-sm`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Activity logs will appear here.
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/residents" className="p-4 bg-pink-50 text-pink-700 rounded-xl font-medium hover:bg-pink-100 transition-colors text-sm flex flex-col items-center justify-center gap-2">
              <Users size={20} />
              Manage Residents
            </Link>
            <Link to="/admin/attendance" className="p-4 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-colors text-sm flex flex-col items-center justify-center gap-2">
              <Activity size={20} />
              Mark Attendance
            </Link>
            <Link to="/admin/logs" className="p-4 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors text-sm flex flex-col items-center justify-center gap-2 col-span-2">
              <UserCheck size={20} />
              In/Out Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
