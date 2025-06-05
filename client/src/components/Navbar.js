import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, db, signOut, doc, getDoc } from './trials/firebase';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from './logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Import the external CSS file

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
      className={`navbar-hospital ${!visible ? 'hidden' : ''}`}
      variant="dark"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      ref={navbarRef}
    >
      <Container className="navbar-container">
        <Navbar.Brand as={NavLink} to="/">
          <div className="logo-container">
            <img src={logo} alt="Dwaliro Logo" className="logo-image" />
          </div>
          <span className="brand-text">Dwaliro</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
        
        <Navbar.Collapse id="basic-navbar-nav">
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
                className="nav-link-hospital"
                style={{ display: user || text !== 'Saved Trials' ? 'block' : 'none' }}
              >
                {text}
              </Nav.Link>
            ))}
          </Nav>
          
          <Nav className="ms-auto">
            <div className="user-section">
              {loading ? (
                <span className="loading-badge">Loading...</span>
              ) : user && userData ? (
                <>
                  <span className="user-badge">
                    {userData.name} ({randomId})
                  </span>
                  <Button
                    onClick={handleLogout}
                    className="btn-hospital-logout"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  as={NavLink}
                  to="/auth"
                  className="btn-hospital-primary"
                >
                  Login
                </Button>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbars;