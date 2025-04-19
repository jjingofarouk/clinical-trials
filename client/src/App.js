import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ClinicalTrials from './components/trials/ClinicalTrials';
import TrialDetailPage from './components/trials/TrialDetailPage';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trials" element={<ClinicalTrials />} />
            <Route path="/trials/:nctId" element={<TrialDetailPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;