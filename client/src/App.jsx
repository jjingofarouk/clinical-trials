import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './components/trials/ClinicalTrialSimulator.css';
import Navbars from './components/Navbars'; // Adjusted to match the provided Navbars component name
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
import ForResearchers from './components/ForResearchers'; // Imported ForResearchers component

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
      <div className="app-error">
        <h1>App Error</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbars />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trials/*" element={<ClinicalTrials />} />
            <Route path="/trials/:nctId" element={<TrialDetailPage />} />
            <Route path="/trials/simulator" element={<ClinicalTrialSimulator />} />
            <Route path="/savedtrials" element={<SavedTrials />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/researchers" element={<ForResearchers />} />
            {/* Nested routes for researcher-specific features */}
            <Route path="/researchers/publish" element={<div>Publish Trials (Placeholder)</div>} />
            <Route path="/researchers/analytics" element={<div>Analytics (Placeholder)</div>} />
            <Route path="/researchers/manage" element={<div>Manage Trials (Placeholder)</div>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<div className="not-found">404: Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;