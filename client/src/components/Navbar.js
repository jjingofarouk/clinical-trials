import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav className="navbar">
      <div
        className={`navbar-menu ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Main navigation"
      >
        <div className="navbar-logo">
          <span className="logo-text">CS</span>
        </div>
        {isExpanded && (
          <ul className="navbar-links">
            <li>
              <Link to="/" aria-label="Home page">
                Home
              </Link>
            </li>
            <li>
              <Link to="/trials" aria-label="Clinical Trials page">
                Trials
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;