import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Dwaliro</h1>
        <p>Discover clinical trials with ease and precision.</p>
        <Link to="/trials" className="cta-button" aria-label="Explore Clinical Trials">
          Explore Trials
        </Link>
      </div>
    </div>
  );
};

export default Home;