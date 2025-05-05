import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1>Advance Medical Research with Dwaliro</h1>
          <p>Seamlessly connect patients, researchers, and clinicians to drive clinical trial innovation.</p>
          <div className="cta-buttons">
            <Link to="/trials" className="cta-button primary" aria-label="Explore Clinical Trials">
              Find Trials
            </Link>
            <Link to="/auth" className="cta-button secondary" aria-label="Sign Up or Log In">
              Sign Up
            </Link>
          </div>
        </motion.div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1585435557343-3b0929fb7806?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Clinical trial research environment"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Solutions
        </motion.h2>
        <div className="feature-grid">
          {[
            {
              title: 'Advanced Trial Discovery',
              description: 'Explore thousands of clinical trials with powerful search and filtering tools.',
              icon: '🔎',
            },
            {
              title: 'Personalized Profiles',
              description: 'Save trials, track interests, and manage your research securely.',
              icon: '👤',
            },
            {
              title: 'Researcher Collaboration',
              description: 'Efficient tools for trial management and participant engagement.',
              icon: '🤝',
            },
            {
              title: 'Trusted Data',
              description: 'Access reliable, up-to-date trial information from verified sources.',
              icon: '📊',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <motion.div
          className="impact-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Our Impact</h2>
          <div className="impact-stats">
            <div className="stat">
              <h3>10,000+</h3>
              <p>Trials Indexed</p>
            </div>
            <div className="stat">
              <h3>5,000+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat">
              <h3>100+</h3>
              <p>Research Partners</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonials">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Voices of Our Community
        </motion.h2>
        <div className="testimonial-grid">
          {[
            {
              quote: 'Dwaliro transformed how I find and track clinical trials. It’s intuitive and reliable.',
              author: 'Sarah Miller, Patient Advocate',
            },
            {
              quote: 'The platform’s tools have accelerated our recruitment and trial management processes.',
              author: 'Dr. Emily Chen, Lead Researcher',
            },
            {
              quote: 'As a clinician, I rely on Dwaliro for accurate trial data to inform patient care.',
              author: 'Dr. Michael Patel, Oncologist',
            },
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <p className="quote">“{testimonial.quote}”</p>
              <p className="author">— {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Be Part of the Future</h2>
          <p>Join Dwaliro to explore, save, and contribute to cutting-edge clinical research.</p>
          <Link to="/auth" className="cta-button primary" aria-label="Join Dwaliro Now">
            Join Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;