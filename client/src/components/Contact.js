import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare } from 'lucide-react';
import './Contact.css';

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
      className="contact-container"
    >
      <h1 className="contact-title">Contact Us</h1>
      <div className="contact-grid">
        <div className="contact-info">
          <p className="contact-text">
            Reach out to our team for assistance with clinical trials, partnerships, or general inquiries. We're here to help you navigate your research journey.
          </p>
          <div className="contact-links">
            <div className="contact-link-item">
              <Mail size={16} className="contact-icon" />
              <a href="mailto:support@dwaliro.com" className="contact-link" title="Email us">
                support@dwaliro.com
              </a>
            </div>
            <div className="contact-link-item">
              <MessageSquare size={16} className="contact-icon" />
              <a href="https://wa.me/+256751360385" className="contact-link" title="Message us on WhatsApp">
                +256 751 360385
              </a>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <div className="form-input-wrapper">
              <User size={16} className="form-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Your name"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <div className="form-input-wrapper">
              <Mail size={16} className="form-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Your email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              rows="5"
              placeholder="Your message"
              required
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="form-submit"
          >
            <Send size={14} />
            Send Message
          </motion.button>
          {status && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="form-status"
            >
              {status}
            </motion.p>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default Contact;