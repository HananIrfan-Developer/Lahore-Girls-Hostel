import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Shield, Wifi, Wind, Droplet, ArrowRight, CheckCircle2, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hostel Building" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-pink-700 text-sm font-semibold mb-6">
                Premium Girls Hostel in Lahore
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Your Safe Haven <br />
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Away From Home
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Experience comfort, security, and a vibrant community at Lahore Girls Hostel. Designed exclusively for students and professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/contact" 
                  className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-pink-600 hover:bg-pink-700 transition-all hover:-translate-y-1"
                >
                  Book Your Room
                  <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                </Link>
                <Link 
                  to="/facilities" 
                  className="inline-flex justify-center items-center px-8 py-3.5 border-2 border-pink-200 text-base font-medium rounded-full text-pink-700 bg-white hover:bg-pink-50 transition-all"
                >
                  Explore Facilities
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Modern Hostel Building" 
                className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">24/7 Security</p>
                  <p className="text-xs text-gray-500">CCTV & Guards</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide everything you need for a comfortable and productive stay.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Top Security', desc: 'Round-the-clock security guards and CCTV surveillance.' },
              { icon: Wifi, title: 'High-Speed WiFi', desc: 'Uninterrupted internet access for your studies and work.' },
              { icon: Wind, title: 'Air Conditioning', desc: 'Comfortable AC rooms available for hot summer days.' },
              { icon: Droplet, title: 'Laundry Service', desc: 'On-site laundry facilities and ironing services.' },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Residents Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from the girls who call Lahore Girls Hostel their second home.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ayesha Khan', role: 'Medical Student', text: 'The security and environment here are unmatched. I can study late at night without any worries. Highly recommended!', rating: 5 },
              { name: 'Fatima Ali', role: 'Software Engineer', text: 'The high-speed WiFi is a lifesaver for my remote work. The staff is incredibly cooperative and the facilities are top-notch.', rating: 5 },
              { name: 'Zainab Tariq', role: 'University Student', text: 'I love the community here. It feels like a family. The laundry service saves me so much time during exam season.', rating: 4 },
            ].map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-pink-100 relative"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience the best hostel life?</h2>
          <p className="text-lg text-pink-100 mb-10">Join our community of ambitious and bright young women today.</p>
          <Link 
            to="/contact" 
            className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-purple-900 bg-white hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
}
