import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ClinicalTrials from './components/trials/ClinicalTrials';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trials" element={<ClinicalTrials />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;