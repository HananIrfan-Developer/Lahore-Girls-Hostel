import React from 'react';
import { motion } from 'motion/react';
import { Shield, Wifi, Coffee, BookOpen, Tv, Wind, Zap, Droplet } from 'lucide-react';

export default function Facilities() {
  const facilities = [
    { icon: Shield, title: '24/7 Security', desc: 'CCTV surveillance, biometric access, and trained security personnel.' },
    { icon: Wifi, title: 'High-Speed Internet', desc: 'Reliable fiber-optic Wi-Fi available throughout the premises.' },
    { icon: Tv, title: 'Common Room', desc: 'Lounge area with TV and comfortable seating for relaxation.' },
    { icon: Wind, title: 'Air Conditioning', desc: 'AC rooms available for comfort during hot summers.' },
    { icon: Zap, title: 'Power Backup', desc: 'Uninterrupted power supply with heavy-duty generators.' },
    { icon: Droplet, title: 'Laundry Service', desc: 'On-site laundry facilities and ironing services.' },
  ];

  return (
    <div className="py-20 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Facilities</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of amenities designed to make your stay comfortable, secure, and productive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {facilities.map((facility, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6">
                <facility.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{facility.title}</h3>
              <p className="text-gray-600 leading-relaxed">{facility.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-10 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Need something specific?</h2>
          <p className="text-lg text-pink-100 mb-8 max-w-2xl mx-auto">
            We are always looking to improve our services. If you have specific requirements, let us know!
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-pink-600 font-bold py-3 px-8 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
          >
            Contact Administration
          </a>
        </div>
      </div>
    </div>
  );
}
