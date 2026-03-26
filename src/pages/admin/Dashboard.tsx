import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Resident, Attendance, InOutLog } from '../../types';
import { Users, UserCheck, UserMinus, Activity, ArrowRight, Clock, MapPin, ShieldCheck, DoorOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Link } from 'react-router';

export default function Dashboard() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [recentLogs, setRecentLogs] = useState<InOutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    if (userData?.role === 'student' || userData?.role === 'staff') return;

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
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'attendance');
    });

    const qLogs = query(collection(db, 'inOutLogs'), orderBy('timestamp', 'desc'), limit(5));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const logsData: InOutLog[] = [];
      snapshot.forEach((doc) => {
        logsData.push({ id: doc.id, ...doc.data() } as InOutLog);
      });
      setRecentLogs(logsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'inOutLogs');
      setLoading(false);
    });

    return () => {
      unsubResidents();
      unsubAttendance();
      unsubLogs();
    };
  }, []);

  if (userData?.role === 'student' || userData?.role === 'staff') {
    return <Navigate to="/admin/attendance" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const totalResidents = residents.length;
  const insideHostel = residents.filter(r => r.status === 'inside').length;
  const outsideHostel = residents.filter(r => r.status === 'outside').length;
  
  const occupancyRate = totalResidents > 0 ? Math.round((insideHostel / totalResidents) * 100) : 0;

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Overview</h2>
          <p className="text-gray-500 text-lg">Welcome back, {userData?.displayName?.split(' ')[0] || 'Admin'}. Here's your daily summary.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
          <Clock className="text-pink-500" size={20} />
          <span className="text-sm font-semibold text-gray-700">{format(new Date(), 'EEEE, MMMM d')}</span>
        </div>
      </div>

      {/* Primary Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Stat Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-gray-400 font-medium tracking-wide uppercase text-sm mb-1">Current Occupancy</p>
              <div className="flex items-baseline space-x-4">
                <h3 className="text-6xl font-light tracking-tighter">{insideHostel}</h3>
                <span className="text-2xl text-gray-400 font-light">/ {totalResidents}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Capacity Utilization</span>
                <span className="font-bold text-pink-400">{occupancyRate}%</span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  style={{ width: `${occupancyRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Stat Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
            <DoorOpen size={24} />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Currently Outside</p>
            <h3 className="text-4xl font-bold text-gray-900">{outsideHostel}</h3>
            <p className="text-sm text-gray-400 mt-2">Residents signed out</p>
          </div>
        </motion.div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-4"
        >
          <h3 className="text-lg font-bold text-gray-900 px-2">Quick Actions</h3>
          
          <Link to="/admin/residents" className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-bold text-gray-900">Manage Residents</h4>
              <p className="text-xs text-gray-500">Add or update profiles</p>
            </div>
            <ArrowRight size={20} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
          </Link>

          <Link to="/admin/attendance" className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity size={24} />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-bold text-gray-900">Mark Attendance</h4>
              <p className="text-xs text-gray-500">Daily roll call</p>
            </div>
            <ArrowRight size={20} className="text-gray-300 group-hover:text-purple-600 transition-colors" />
          </Link>

          <Link to="/admin/logs" className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MapPin size={24} />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-bold text-gray-900">In/Out Logs</h4>
              <p className="text-xs text-gray-500">Track movements</p>
            </div>
            <ArrowRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
          </Link>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900">Live Activity</h3>
            <Link to="/admin/logs" className="text-sm font-medium text-pink-600 hover:text-pink-700 flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {recentLogs.length > 0 ? (
            <div className="space-y-6">
              {recentLogs.map((log, idx) => {
                const resident = residents.find(r => r.id === log.residentId);
                return (
                  <div key={log.id} className="flex items-start relative">
                    {idx !== recentLogs.length - 1 && (
                      <div className="absolute top-10 left-5 bottom-[-24px] w-px bg-gray-200"></div>
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      log.type === 'entry' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {log.type === 'entry' ? <UserCheck size={20} /> : <UserMinus size={20} />}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {resident?.name || 'Unknown Resident'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {log.type === 'entry' ? 'Checked in' : 'Checked out'} • Room {resident?.roomNumber || 'N/A'}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                          {log.timestamp?.toDate ? format(log.timestamp.toDate(), 'h:mm a') : 'Just now'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <Activity size={32} />
              </div>
              <p className="text-gray-500 font-medium">No recent activity</p>
              <p className="text-sm text-gray-400 mt-1">Movement logs will appear here in real-time.</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
