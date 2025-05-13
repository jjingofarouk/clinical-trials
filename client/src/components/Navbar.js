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
      style={{
        backgroundColor: user ? '#1A3C34' : '#2C3E50',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'top 0.3s ease-in-out',
        position: 'sticky',
        top: visible ? '0' : '-100px',
        left: 0,
        width: '100%',
        zIndex: 1000,
      }}
      variant="dark"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      ref={navbarRef}
    >
      <Container className="d-flex align-items-center">
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <img src={logo} alt="Dwaliro Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px', marginLeft: '0.5rem', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Dwaliro</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {['Home', 'Find Trials', 'Trial Simulator', 'Saved Trials', 'For Researchers', 'About Us', 'Contact'].map((text, idx) => (
              <Nav.Link
                key={idx}
                as={NavLink}
                to={text === 'Home' ? '/' : text === 'Trial Simulator' ? '/trials/simulator' : `/${text.toLowerCase().replace(/\s/g, '')}`}
                style={{ color: '#FFFFFF', fontSize: '1rem', display: user || text !== 'Saved Trials' ? 'block' : 'none' }}
                className="nav-link-custom"
              >
                {text}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {loading ? (
              <span style={{ color: '#FFFFFF', fontSize: '0.9rem', backgroundColor: '#26A69A', padding: '5px 10px', borderRadius: '4px', marginRight: '10px' }}>Loading...</span>
            ) : user && userData ? (
              <>
                <span style={{ color: '#FFFFFF', fontSize: '0.9rem', backgroundColor: '#26A69A', padding: '5px 10px', borderRadius: '4px', marginRight: '10px' }}>
                  {userData.name} ({randomId})
                </span>
                <Button
                  onClick={handleLogout}
                  style={{ backgroundColor: '#FF8C00', borderColor: '#FF8C00', color: '#FFFFFF', fontWeight: 600, padding: '0.5rem 1rem', transition: 'all 0.2s ease' }}
                  className="cta-button-custom ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                as={NavLink}
                to="/auth"
                style={{ backgroundColor: '#FF8C00', borderColor: '#FF8C00', color: '#FFFFFF', fontWeight: 600, padding: '0.5rem 1rem', transition: 'all 0.2s ease' }}
                className="cta-button-custom ms-2"
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style jsx>{`
        .nav-link-custom:hover { color: #3498DB !important; transition: color 0.2s ease; }
        .nav-link-custom.active { color: #FFFFFF !important; fontWeight: 600; borderBottom: 2px solid #3498DB; }
        .cta-button-custom { backgroundColor: #FF8C00 !important; borderColor: #FF8C00 !important; }
        .cta-button-custom:hover { backgroundColor: #FF7000 !important; borderColor: #FF7000 !important; transform: scale(1.05); }
        .navbar-dark .navbar-toggler { borderColor: #E5E7EB !important; }
        .navbar-collapse { backgroundColor: ${user ? '#1A3C34' : '#2C3E50'}; }
      `}</style>
    </Navbar>
  );
};

export default Navbars;