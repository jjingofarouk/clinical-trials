import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 ClinSearch</p>
        <ul className="footer-links">
          <li>
            <a href="/about" aria-label="About ClinSearch">
              About
            </a>
          </li>
          <li>
            <a href="/contact" aria-label="Contact Us">
              Contact
            </a>
          </li>
          <li>
            <a href="/privacy" aria-label="Privacy Policy">
              Privacy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;