import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import './App.css';
import './components/trials/ClinicalTrialSimulator.css';
import Navbars from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ClinicalTrials from './components/trials/ClinicalTrials';
import TrialDetailPage from './components/trials/TrialDetailPage';
import SavedTrials from './components/trials/SavedTrials';
import ClinicalTrialSimulator from './components/trials/ClinicalTrialSimulator';
import AuthPage from './components/AuthPage';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import ForResearchers from './components/ForResearchers';

function App() {
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }
    } catch (err) {
      setError(`App failed to initialize: ${err.message}`);
    }
  }, []);

  if (error && process.env.REACT_APP_DEBUG_MODE === 'true') {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" color="error" gutterBottom>
          App Error
        </Typography>
        <Typography variant="body1" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reload Page
        </Button>
      </Container>
    );
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbars />
        <Box component="main" sx={{ flex: 1, py: 3 }}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trials/*" element={<ClinicalTrials />} />
              <Route path="/trials/:nctId" element={<TrialDetailPage />} />
              <Route path="/trials/simulator" element={<ClinicalTrialSimulator />} />
              <Route path="/savedtrials" element={<SavedTrials />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/researchers" element={<ForResearchers />} />
              <Route
                path="/researchers/publish"
                element={
                  <Typography variant="h5">Publish Trials (Placeholder)</Typography>
                }
              />
              <Route
                path="/researchers/analytics"
                element={
                  <Typography variant="h5">Analytics (Placeholder)</Typography>
                }
              />
              <Route
                path="/researchers/manage"
                element={
                  <Typography variant="h5">Manage Trials (Placeholder)</Typography>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route
                path="*"
                element={
                  <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}>
                    404: Page Not Found
                  </Typography>
                }
              />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;