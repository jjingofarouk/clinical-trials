import { motion } from 'framer-motion';
import { Github, Linkedin, X, MessageSquare } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <>
    {/* JavaScript Disabled Fallback */}
    <noscript>
      <div className="noscript-warning">
        <p>
          JavaScript is disabled in your browser. Please enable JavaScript or switch to a supported browser to continue using Dwaliro. See the{' '}
          <a
            href="https://help.x.com/en/using-x/supported-browsers"
            target="_blank"
            rel="noopener noreferrer"
            className="noscript-link"
          >
            X Help Center
          </a>{' '}
          for supported browsers.
        </p>
        <p>Some privacy extensions may cause issues. Try disabling them and refreshing.</p>
      </div>
    </noscript>

    <footer className="footer">
      <div className="footer-container">
        {/* Project Links */}
        <div className="footer-projects">
          <h3 className="footer-section-title">Explore Our Projects</h3>
          <ul className="footer-project-list">
            <motion.li
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/projects/clinical-calculators"
                aria-label="Clinical Calculators"
                className="footer-project-link"
              >
                Clinical Calculators
              </a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/projects/drug-interaction-checker"
                aria-label="Drug Interaction Checker"
                className="footer-project-link"
              >
                Drug Interaction Checker
              </a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/projects/history-taking-app"
                aria-label="History Taking App"
                className="footer-project-link"
              >
                History Taking App
              </a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/projects"
                aria-label="More Projects"
                className="footer-project-link"
              >
                More Projects
              </a>
            </motion.li>
          </ul>
        </div>

        {/* Navigation and Social Links */}
        <div className="footer-links">
          <div className="footer-nav">
            <h3 className="footer-section-title">Navigation</h3>
            <ul className="footer-nav-list">
              <motion.li
                whileHover={{ scale: 1.05, x: 5 }}
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
                whileHover={{ scale: 1.05, x: 5 }}
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
                whileHover={{ scale: 1.05, x: 5 }}
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
          </div>
          <div className="footer-social">
            <h3 className="footer-section-title">Connect</h3>
            <div className="footer-social-icons">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://github.com/faroukj"
                aria-label="GitHub Profile"
                title="Visit our GitHub profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} className="footer-social-icon" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://www.linkedin.com/in/farouk-jjingo-0341b01a5"
                aria-label="LinkedIn Profile"
                title="Visit our LinkedIn profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} className="footer-social-icon" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://x.com/farouq_jjingo"
                aria-label="X Profile"
                title="Visit our X profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <X size={20} className="footer-social-icon" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://wa.me/+256751360385"
                aria-label="WhatsApp Contact"
                title="Contact us on WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare size={20} className="footer-social-icon" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p className="footer-text">© 2025 Dwaliro. All rights reserved.</p>
      </div>
    </footer>
  </>
);

export default Footer;