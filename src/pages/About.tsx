import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Users, Heart, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">About Lahore Girls Hostel</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A premier living space dedicated to providing a secure, comfortable, and empowering environment for women.
            </p>
          </motion.div>

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
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center text-gray-700"
                  >
                    <CheckCircle2 className="text-pink-600 mr-3 shrink-0" size={20} />
                    <span className="font-medium">{value}</span>
                  </motion.li>
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
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Happy Residents' },
              { number: '50+', label: 'Rooms Available' },
              { number: '24/7', label: 'Security' },
              { number: '100%', label: 'Satisfaction' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-4xl font-extrabold text-pink-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Started Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Founded with a vision to revolutionize accommodation in Lahore.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'The Vision', desc: 'To create a space where women can focus entirely on their goals without worrying about basic living necessities or safety.' },
              { icon: Heart, title: 'The Passion', desc: 'Driven by a passion for hospitality and a deep understanding of the cultural and practical needs of Pakistani women.' },
              { icon: Users, title: 'The Community', desc: 'Building a network of strong, independent women who support and uplift each other during their stay and beyond.' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mx-auto mb-6">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
