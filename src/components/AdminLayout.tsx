import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  LogOut, 
  Menu, 
  X, 
  Settings,
  ArrowLeftRight,
  Home,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user || !userData || !['admin', 'owner', 'staff', 'student'].includes(userData.role)) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  let navItems = [];
  
  if (userData.role === 'student') {
    navItems = [
      { name: 'My Attendance', path: '/admin/attendance', icon: CalendarCheck },
      { name: 'My In/Out Logs', path: '/admin/logs', icon: ArrowLeftRight },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];
  } else {
    navItems = [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Residents', path: '/admin/residents', icon: Users },
      { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
      { name: 'In/Out Logs', path: '/admin/logs', icon: ArrowLeftRight },
    ];
    
    if (userData.role === 'admin') {
      navItems.push({ name: 'User Management', path: '/admin/staff', icon: Shield });
    }
    navItems.push({ name: 'Settings', path: '/admin/settings', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="bg-white shadow-xl z-20 hidden md:flex flex-col h-screen sticky top-0"
      >
        <div className="h-20 flex items-center justify-center border-b border-gray-100 px-4">
          {isSidebarOpen ? (
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent truncate w-full text-center">
              LGH Admin
            </span>
          ) : (
            <span className="text-xl font-bold text-pink-600">LGH</span>
          )}
        </div>

        <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 font-medium shadow-sm border border-pink-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <item.icon 
                  size={20} 
                  className={`shrink-0 ${isActive ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                />
                {isSidebarOpen && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center ${isSidebarOpen ? 'mb-4' : 'justify-center mb-4'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
              {userData.displayName?.charAt(0).toUpperCase() || userData.email.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{userData.displayName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{userData.role}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${
              !isSidebarOpen && 'justify-center'
            }`}
            title={!isSidebarOpen ? "Logout" : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30 flex items-center justify-between px-4">
        <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          LGH Admin
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-600 hover:text-pink-600 focus:outline-none"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute top-0 bottom-0 left-0 w-64 bg-white shadow-2xl flex flex-col pt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                                (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-pink-50 text-pink-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} className={`mr-3 ${isActive ? 'text-pink-600' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0">
        {/* Desktop Header */}
        <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {location.pathname === '/admin' ? 'Dashboard Overview' : location.pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <Home size={14} className="mr-1.5" />
              View Website
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
