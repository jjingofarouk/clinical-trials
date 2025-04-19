import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from './logo.jpg'; // Adjust path to your logo
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbars = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const navbarRef = useRef(null);

  const styles = {
    navbar: {
      backgroundColor: '#1A4A4F', // Primary: Dark Teal
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'top 0.3s ease-in-out',
      position: 'sticky',
      top: visible ? '0' : '-100px',
      left: 0,
      width: '100%',
      zIndex: 1000,
    },
    navLink: { 
      color: '#FFFFFF', // Text on Primary: White
      fontSize: '1rem',
    },
    donateButton: {
      backgroundColor: '#2D6A6F', // Accent/Hover: Light Teal
      borderColor: '#2D6A6F',
      color: '#FFFFFF',
      fontWeight: 600,
      padding: '0.5rem 1rem',
      transition: 'all 0.2s ease',
    },
    brandText: {
      color: '#FFFFFF', // Text on Primary: White
      fontSize: '1.2rem',
      fontWeight: 700,
      letterSpacing: '1px',
      marginLeft: '0.5rem',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
  };

  // Scroll effect for hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setVisible(false);
      } else if (currentScrollY < prevScrollY) {
        setVisible(true);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // Click outside and Escape key handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && expanded) {
        setExpanded(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && expanded) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [expanded]);

  return (
    <Navbar
      expand="lg"
      style={styles.navbar}
      variant="dark"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      ref={navbarRef}
    >
      <Container className="d-flex align-items-center">
        <Navbar.Brand as={NavLink} to="/" style={styles.navLink}>
          <img
            src={logo}
            alt="CS Logo"
            height="25"
            width="50"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        {/* Brand Name - Visible on mobile only */}
        <div className="brand-name d-flex d-lg-none flex-grow-1 justify-content-center">
          <span style={styles.brandText}>CS</span>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" style={styles.navLink} className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/trials" style={styles.navLink} className="nav-link-custom">
              Trials
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" style={styles.navLink} className="nav-link-custom">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" style={styles.navLink} className="nav-link-custom">
              Contact
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Button
              as={NavLink}
              to="/donate"
              style={styles.donateButton}
              className="donate-button-custom ms-2"
            >
              Donate Now
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
        .nav-link-custom:hover {
          color: #F5F1E9 !important; // Secondary: Soft Beige
          transition: color 0.2s ease;
        }
        .nav-link-custom.active {
          color: #FFFFFF !important; // Text on Primary: White
          fontWeight: 600;
        }
        .donate-button-custom {
          background-color: #2D6A6F !important; // Accent/Hover: Light Teal
          border-color: #2D6A6F !important;
        }
        .donate-button-custom:hover {
          background-color: #1A4A4F !important; // Primary: Dark Teal
          border-color: #1A4A4F !important;
          transform: scale(1.05);
        }
        .brand-name span:hover {
          color: #F5F1E9 !important; // Secondary: Soft Beige
          transition: color 0.2s ease;
        }
        .navbar-dark .navbar-toggler {
          border-color: #E5E7EB !important; // Borders: Light Gray
        }
        .navbar-collapse {
          background-color: #1A4A4F; // Primary: Dark Teal (for mobile collapse)
        }
      `}</style>
    </Navbar>
  );
};

export default Navbars;