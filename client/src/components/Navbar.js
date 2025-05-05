import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, db, signOut, collection, query, where, getDocs } from './trials/firebase';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from './logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const generateRandomId = () => {
  return 'ID-' + Math.random().toString(36).substr(2, 8);
};

const Navbars = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [randomId, setRandomId] = useState(generateRandomId());
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setRandomId(generateRandomId());
        const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email)));
        if (!userDoc.empty) {
          setUserData(userDoc.docs[0].data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      alert(`Logout failed: ${err.message}`);
    }
  };

  const styles = {
    navbar: {
      backgroundColor: user ? '#1A3C34' : '#2C3E50',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'top 0.3s ease-in-out',
      position: 'sticky',
      top: visible ? '0' : '-100px',
      left: 0,
      width: '100%',
      zIndex: 1000,
    },
    navLink: {
      color: '#FFFFFF',
      fontSize: '1rem',
    },
    ctaButton: {
      backgroundColor: '#FF8C00',
      borderColor: '#FF8C00',
      color: '#FFFFFF',
      fontWeight: 600,
      padding: '0.5rem 1rem',
      transition: 'all 0.2s ease',
    },
    userInfo: {
      color: '#FFFFFF',
      fontSize: '0.9rem',
      backgroundColor: '#26A69A',
      padding: '5px 10px',
      borderRadius: '4px',
      marginRight: '10px',
    },
    brandText: {
      color: '#FFFFFF',
      fontSize: '1.2rem',
      fontWeight: 700,
      letterSpacing: '1px',
      marginLeft: '0.5rem',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
    logoContainer: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    logo: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'cover',
    },
  };

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
        <Navbar.Brand as={NavLink} to="/" style={styles.navLink} className="d-flex align-items-center">
          <div style={styles.logoContainer}>
            <img
              src={logo}
              alt="Dwaliro Logo"
              style={styles.logo}
            />
          </div>
          <span style={styles.brandText} className="ms-2">Dwaliro</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" style={styles.navLink} className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/trials" style={styles.navLink} className="nav-link-custom">
              Find Trials
            </Nav.Link>
            <Nav.Link as={NavLink} to="/researchers" style={styles.navLink} className="nav-link-custom">
              For Researchers
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" style={styles.navLink} className="nav-link-custom">
              About Us
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" style={styles.navLink} className="nav-link-custom">
              Contact
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            {user && userData ? (
              <>
                <span style={styles.userInfo}>
                  {userData.name} ({randomId})
                </span>
                <Button
                  onClick={handleLogout}
                  style={styles.ctaButton}
                  className="cta-button-custom ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                as={NavLink}
                to="/auth"
                style={styles.ctaButton}
                className="cta-button-custom ms-2"
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
        .nav-link-custom:hover {
          color: #3498DB !important;
          transition: color 0.2s ease;
        }
        .nav-link-custom.active {
          color: #FFFFFF !important;
          font-weight: 600;
          border-bottom: 2px solid #3498DB;
        }
        .cta-button-custom {
          background-color: #FF8C00 !important;
          border-color: #FF8C00 !important;
        }
        .cta-button-custom:hover {
          background-color: #FF7000 !important;
          border-color: #FF7000 !important;
          transform: scale(1.05);
        }
        .navbar-dark .navbar-toggler {
          border-color: #E5E7EB !important;
        }
        .navbar-collapse {
          background-color: ${user ? '#1A3C34' : '#2C3E50'};
        }
      `}</style>
    </Navbar>
  );
};

export default Navbars;