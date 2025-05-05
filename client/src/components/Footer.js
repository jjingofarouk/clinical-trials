import React from 'react';
import { Github, Linkedin, X, MessageSquare, ChevronRight, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      {/* NoScript Warning */}
      <noscript>
        <div className="noscript-warning">
          <p>
            JavaScript is disabled in your browser. Please enable JavaScript or switch to a supported browser to continue using Dwaliro.
          </p>
          <p>Some privacy extensions may cause issues. Try disabling them and refreshing.</p>
        </div>
      </noscript>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Company & Mission */}
          <div className="footer-company">
            <h2 className="footer-title">Dwaliro</h2>
            <p className="footer-description">
              Empowering healthcare professionals with innovative digital tools for better patient care.
            </p>
            <div className="footer-social-bar">
              <a href="https://github.com/faroukj" 
                 className="social-icon"
                 aria-label="GitHub Profile" 
                 title="Visit our GitHub"
                 target="_blank" 
                 rel="noopener noreferrer">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/farouk-jjingo-0341b01a5" 
                 className="social-icon"
                 aria-label="LinkedIn Profile" 
                 title="Visit our LinkedIn"
                 target="_blank" 
                 rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
              <a href="https://x.com/farouq_jjingo" 
                 className="social-icon"
                 aria-label="X Profile" 
                 title="Visit our X profile"
                 target="_blank" 
                 rel="noopener noreferrer">
                <X size={20} />
              </a>
              <a href="https://wa.me/+256751360385" 
                 className="social-icon"
                 aria-label="WhatsApp Contact" 
                 title="Contact us on WhatsApp"
                 target="_blank" 
                 rel="noopener noreferrer">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>

          {/* Projects */}
          <div className="footer-projects">
            <h3 className="footer-subtitle">Our Projects</h3>
            <ul className="footer-list">
              <li className="footer-list-item">
                <a href="/projects/clinical-calculators" className="footer-link">
                  <ChevronRight size={16} className="link-arrow" />
                  <span>Clinical Calculators</span>
                </a>
              </li>
              <li className="footer-list-item">
                <a href="/projects/drug-interaction-checker" className="footer-link">
                  <ChevronRight size={16} className="link-arrow" />
                  <span>Drug Interaction Checker</span>
                </a>
              </li>
              <li className="footer-list-item">
                <a href="/projects/history-taking-app" className="footer-link">
                  <ChevronRight size={16} className="link-arrow" />
                  <span>History Taking App</span>
                </a>
              </li>
              <li className="footer-list-item">
                <a href="/projects" className="footer-link">
                  <ChevronRight size={16} className="link-arrow" />
                  <span>Explore All Projects</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="footer-subtitle">Quick Links</h3>
            <ul className="footer-list">
              <li className="footer-list-item">
                <a href="/about" className="footer-link">
                  <ChevronRight size={16} className="link-arrow" />
                  <span>About Us</span>
                </a>
              </li>
              <li className="footer-list-item">
                <a href="/contact" className="footer-link">
                  <ChevronRight size={16} className="link-arrow" />
                  <span>Contact</span>
                </a>
              </li>
              <li className="footer-list-item">
                <a href="/privacy" className="footer-link">
                  <ChevronRight size={16} className="link-arrow" />
                  <span>Privacy Policy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} Dwaliro. All rights reserved.
          </p>
          <p className="footer-tagline">
            Made with <Heart size={14} className="heart-icon" /> in Uganda
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;