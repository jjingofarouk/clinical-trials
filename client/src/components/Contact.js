import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 my-4 bg-white rounded-2xl shadow-sm"
    >
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Reach out to our team for assistance with clinical trials, partnerships, or general inquiries. We're here to help you navigate your research journey.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-600" />
              <a href="mailto:support@clinsearch.com" className="text-xs text-gray-600 hover:text-gray-900">
                support@clinsearch.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-600" />
              <a href="https://wa.me/+256751360385" className="text-xs text-gray-600 hover:text-gray-900">
                +256 751 360385
              </a>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-1">
              Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 p-2 border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Your name"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 p-2 border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Your email"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
              rows="5"
              placeholder="Your message"
              required
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-[#000000] text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center justify-center gap-2"
          >
            <Send size={14} />
            Send Message
          </motion.button>
          {status && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-600"
            >
              {status}
            </motion.p>
          )}
        </form>
      </div>
      <style jsx>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @media (max-width: 640px) {
          .max-w-4xl {
            margin-left: 12px;
            margin-right: 12px;
          }

          .p-6 {
            padding: 16px;
          }

          .my-4 {
            margin-top: 12px;
            margin-bottom: 12px;
          }

          .rounded-2xl {
            border-radius: 12px;
          }

          .text-2xl {
            font-size: 1.5rem;
          }

          .text-sm {
            font-size: 12px;
          }

          .text-xs {
            font-size: 11px;
          }

          .mb-6 {
            margin-bottom: 16px;
          }

          .mb-4 {
            margin-bottom: 12px;
          }

          .gap-6 {
            gap: 16px;
          }

          .space-y-4 {
            gap: 12px;
          }

          .space-y-3 {
            gap: 8px;
          }

          .p-2 {
            padding: 8px;
          }

          .px-4 {
            padding-left: 16px;
            padding-right: 16px;
          }

          .py-2 {
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .rounded-2xl {
            border-radius: 14px;
          }

          .p-6 {
            padding: 20px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Contact;