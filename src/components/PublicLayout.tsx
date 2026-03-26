import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Menu, X, MapPin, Phone, Mail, Home, Info, Image, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import InstallPWA from './InstallPWA';

export default function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, userData } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Facilities', path: '/facilities', icon: MapPin },
    { name: 'Contact', path: '/contact', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Top Bar */}
      <div className="bg-pink-600 text-white py-2 px-4 text-sm hidden md:flex justify-between items-center">
        <div className="flex space-x-6">
          <span className="flex items-center"><Phone size={14} className="mr-2" /> +92 308 1060759</span>
          <span className="flex items-center"><Mail size={14} className="mr-2" /> irfannoreen99@gmail.com</span>
        </div>
        <div>
          <span className="flex items-center"><MapPin size={14} className="mr-2" /> Street no 4 Babar Colony Lahore</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Lahore Girls Hostel Logo" className="h-12 w-auto mr-3 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Lahore Girls Hostel
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <InstallPWA />
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                    location.pathname === link.path ? 'text-pink-600' : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {userData && ['admin', 'owner', 'staff'].includes(userData.role) ? (
                <Link
                  to="/admin"
                  className="bg-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-pink-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-pink-600 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <link.icon size={18} className="mr-3" />
                    {link.name}
                  </div>
                </Link>
              ))}
              <Link
                to={userData && ['admin', 'owner', 'staff'].includes(userData.role) ? "/admin" : "/login"}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center mt-4 bg-pink-600 text-white px-5 py-3 rounded-md text-base font-medium hover:bg-pink-700 transition-colors"
              >
                {userData && ['admin', 'owner', 'staff'].includes(userData.role) ? "Dashboard" : "Login"}
              </Link>
              <div className="mt-4 flex justify-center">
                <InstallPWA />
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Lahore Girls Hostel
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Providing a safe, comfortable, and modern living environment for female students and professionals in the heart of Lahore.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-pink-400 transition-colors">About Us</Link></li>
                <li><Link to="/facilities" className="hover:text-pink-400 transition-colors">Facilities</Link></li>
                <li><Link to="/contact" className="hover:text-pink-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 text-pink-400 shrink-0 mt-0.5" />
                  <span>Street no 4 Babar Colony Lahore</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-3 text-pink-400 shrink-0" />
                  <span>+92 308 1060759</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-3 text-pink-400 shrink-0" />
                  <span>irfannoreen99@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Lahore Girls Hostel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
