import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="py-20 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Lahore Girls Hostel</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A premier living space dedicated to providing a secure, comfortable, and empowering environment for women.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Lahore Girls Hostel, our mission is to create a home away from home. We understand the challenges faced by female students and professionals moving to a new city. Our goal is to alleviate those concerns by offering a sanctuary that prioritizes safety, hygiene, and community.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We believe that a supportive living environment is crucial for academic and professional success. That's why we've designed our facilities to cater to the modern woman's needs, fostering independence while ensuring peace of mind for both residents and their families.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Core Values</h3>
            <ul className="space-y-4">
              {[
                'Uncompromising Security & Safety',
                'Cleanliness and Hygiene',
                'Respect and Inclusivity',
                'Continuous Improvement'
              ].map((value, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <CheckCircle2 className="text-pink-600 mr-3 shrink-0" size={20} />
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-3xl transform rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Students studying together" 
              className="relative rounded-2xl shadow-xl object-cover h-[500px] w-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
