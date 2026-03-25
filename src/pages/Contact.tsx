import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        timestamp: Timestamp.now(),
        status: 'unread'
      });
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contactMessages');
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you. Reach out to us for bookings or inquiries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Fill out the form below and our team will get back to you within 24 hours. For urgent inquiries, please call us directly.
              </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white shadow-sm"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white shadow-sm"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white shadow-sm"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white shadow-sm resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-pink-600 hover:bg-pink-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send className="ml-2 w-5 h-5" />
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 shrink-0 mr-4">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Our Location</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Street no 4 Babar Colony<br />
                      Rahim Yar Khan, Punjab, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 shrink-0 mr-4">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone Number</h3>
                    <p className="text-gray-600 leading-relaxed">
                      +92 308 1060759
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0 mr-4">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Address</h3>
                    <p className="text-gray-600 leading-relaxed">
                      irfannoreen99@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 shrink-0 mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Monday - Saturday: 9:00 AM - 8:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-gray-500 text-sm italic text-center">
                "We are committed to providing a safe and comfortable environment for all our residents."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We are conveniently located in the heart of the city.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full h-[400px] bg-gray-200 rounded-3xl overflow-hidden shadow-inner relative"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.53235372483!2d70.22105155!3d28.4201565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375c712ecf4653%3A0x6a052a22212978c4!2sRahim%20Yar%20Khan%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions about staying with us.</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'What are the visiting hours for guests?', a: 'Female guests are allowed between 10:00 AM and 8:00 PM. Male guests are only permitted in the designated reception area.' },
              { q: 'Is there a curfew or timing restriction?', a: 'For security reasons, the main gates are locked at 10:00 PM. Late entries require prior permission from the warden.' },
              { q: 'Are meals included in the rent?', a: 'Yes, we provide 3 nutritious meals a day (Breakfast, Lunch, and Dinner) which are included in the standard package.' },
              { q: 'How is the security managed?', a: 'We have 24/7 armed security guards, CCTV surveillance covering all common areas, and biometric access control at the main entrance.' },
            ].map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="text-pink-600 shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 shrink-0" size={20} />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
