import { motion } from 'framer-motion';
import { Github, Linkedin, X, MessageSquare } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <p className="footer-text">© 2025 Dwaliro. All rights reserved.</p>
      <div className="footer-links">
        <ul className="footer-nav">
          <motion.li
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/about"
              aria-label="About Dwaliro"
              className="footer-nav-link"
            >
              About
            </a>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/contact"
              aria-label="Contact Us"
              className="footer-nav-link"
            >
              Contact
            </a>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/privacy"
              aria-label="Privacy Policy"
              className="footer-nav-link"
            >
              Privacy
            </a>
          </motion.li>
        </ul>
        <div className="footer-social">
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.linkedin.com/in/farouk-jjingo-0341b01a5"
            aria-label="LinkedIn Profile"
            title="Visit our LinkedIn profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={18} className="footer-social-icon" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            href="https://x.com/farouq_jjingo"
            aria-label="X Profile"
            title="Visit our X profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <X size={18} className="footer-social-icon" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            href="https://wa.me/+256751360385"
            aria-label="WhatsApp Contact"
            title="Contact us on WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare size={18} className="footer-social-icon" />
          </motion.a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;