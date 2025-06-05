import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, db, signOut, doc, getDoc } from './trials/firebase';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from './logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const generateRandomId = () => 'ID-' + Math.random().toString(36).substr(2, 8);

const Navbars = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [randomId, setRandomId] = useState(generateRandomId());
  const [loading, setLoading] = useState(true);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        try {
          setRandomId(generateRandomId());
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          setUserData(userDoc.exists() ? userDoc.data() : { name: currentUser.displayName || 'User', email: currentUser.email });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData({ name: currentUser.displayName || 'User', email: currentUser.email });
        }
      } else {
        setUserData(null);
        setRandomId(generateRandomId());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(!(currentScrollY > prevScrollY && currentScrollY > 50));
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
      if (event.key === 'Escape' && expanded) setExpanded(false);
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
      className="navbar fixed-top"
      style={{
        backgroundColor: user ? 'var(--primary-color)' : 'var(--text-primary)',
        boxShadow: 'var(--shadow)',
        transition: 'top 0.3s ease-in-out',
        top: visible ? '0' : '-64px',
        height: '64px', // Fixed height
        margin: 0,
        padding: 0,
        width: '100%',
        zIndex: 1000,
      }}
      variant="dark"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      ref={navbarRef}
    >
      <Container
        style={{
          height: '100%',
          margin: 0,
          padding: '0 15px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Navbar.Brand as={NavLink} to="/" style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0 }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'var(--background)',
              marginRight: '0.5rem',
            }}
          >
            <img
              src={logo}
              alt="Dwaliro Logo"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
            />
          </div>
          <span
            style={{
              color: 'var(--background)',
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            Dwaliro
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ marginLeft: 'auto', borderColor: 'var(--border-color)' }}
        />
        <Navbar.Collapse id="basic-navbar-nav" style={{ backgroundColor: user ? 'var(--primary-color)' : 'var(--text-primary)' }}>
          <Nav className="me-auto">
            {[
              { text: 'Home', path: '/' },
              { text: 'Find Trials', path: '/trials' },
              { text: 'Saved Trials', path: '/savedtrials' },
              { text: 'For Researchers', path: '/researchers' },
              { text: 'About Us', path: '/about' },
              { text: 'Contact', path: '/contact' },
            ].map(({ text, path }, idx) => (
              <Nav.Link
                key={idx}
                as={NavLink}
                to={path}
                style={{
                  color: 'var(--background)',
                  fontSize: '1rem',
                  display: user || text !== 'Saved Trials' ? 'block' : 'none',
                  padding: '0.5rem 1rem',
                }}
                className="nav-link-custom"
              >
                {text}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {loading ? (
              <span
                style={{
                  color: 'var(--background)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--status-recruiting)',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  marginRight: '10px',
                }}
              >
                Loading...
              </span>
            ) : user && userData ? (
              <>
                <span
                  style={{
                    color: 'var(--background)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--status-recruiting)',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    marginRight: '10px',
                  }}
                >
                  {userData.name} ({randomId})
                </span>
                <Button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'var(--cta-color)',
                    borderColor: 'var(--cta-color)',
                    color: 'var(--background)',
                    fontWeight: 600,
                    padding: '0.5rem 1rem',
                    transition: 'var(--transition)',
                  }}
                  className="cta-button-custom"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                as={NavLink}
                to="/auth"
                style={{
                  backgroundColor: 'var(--cta-color)',
                  borderColor: 'var(--cta-color)',
                  color: 'var(--background)',
                  fontWeight: 600,
                  padding: '0.5rem 1rem',
                  transition: 'var(--transition)',
                }}
                className="cta-button-custom"
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style jsx>{`
        .nav-link-custom:hover {
          color: var(--secondary-color) !important;
          transition: color 0.2s ease;
        }
        .nav-link-custom.active {
          color: var(--background) !important;
          font-weight: 600;
          border-bottom: 2px solid var(--secondary-color);
        }
        .cta-button-custom {
          background-color: var(--cta-color) !important;
          border-color: var(--cta-color) !important;
        }
        .cta-button-custom:hover {
          background-color: var(--cta-hover) !important;
          border-color: var(--cta-hover) !important;
          transform: scale(1.05);
        }
        .navbar-dark .navbar-toggler {
          border-color: var(--border-color) !important;
        }
        @media (max-width: 991px) {
          .navbar-collapse {
            background-color: ${user ? 'var(--primary-color)' : 'var(--text-primary)'};
            padding: 1rem;
            margin: 0;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default Navbars;