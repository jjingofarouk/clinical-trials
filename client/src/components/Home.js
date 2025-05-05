import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  User, 
  Users, 
  Database, 
  Heart, 
  Stethoscope, 
  FlaskConical 
} from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section with Video */}
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          src="/hospital.mp4"
        />
        <div className="hero-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1>Empower Medical Innovation with Dwaliro</h1>
          <p>Revolutionizing clinical trials through seamless collaboration and cutting-edge technology.</p>
          <div className="cta-buttons">
            <Link to="/trials" className="cta-button primary" aria-label="Discover Clinical Trials">
              Discover Trials
            </Link>
            <Link to="/auth" className="cta-button secondary" aria-label="Join Dwaliro">
              Join Now
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Solutions Section */}
      <section className="solutions">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Enterprise Solutions
        </motion.h2>
        <div className="solutions-grid">
          {[
            {
              title: 'Intelligent Trial Discovery',
              description: 'Leverage AI-driven search to uncover relevant clinical trials instantly.',
              icon: <Search size={48} />,
              bg: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c3a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            },
            {
              title: 'Unified Profiles',
              description: 'Centralized, secure profiles for patients, researchers, and clinicians.',
              icon: <User size={48} />,
              bg: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            },
            {
              title: 'Global Collaboration',
              description: 'Connect with research networks worldwide for unparalleled trial efficiency.',
              icon: <Users size={48} />,
              bg: 'https://images.unsplash.com/photo-1585435557343-3b0929fb7806?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            },
            {
              title: 'Data Integrity',
              description: 'Real-time, verified trial data for informed decision-making.',
              icon: <Database size={48} />,
              bg: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            },
          ].map((solution, idx) => (
            <motion.div
              key={idx}
              className="solution-card"
              style={{ backgroundImage: `url(${solution.bg})` }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="solution-overlay" />
              <div className="solution-content">
                <span className="solution-icon">{solution.icon}</span>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Global Impact
        </motion.h2>
        <div className="impact-grid">
          {[
            { value: '50,000+', label: 'Trials Indexed', icon: <FlaskConical size={40} /> },
            { value: '25,000+', label: 'Active Users', icon: <Heart size={40} /> },
            { value: '500+', label: 'Research Partners', icon: <Stethoscope size={40} /> },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="impact-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <span className="impact-icon">{stat.icon}</span>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Trusted by Leaders
        </motion.h2>
        <div className="testimonial-grid">
          {[
            {
              quote: 'Dwaliro’s platform is a game-changer for clinical trial discovery and management.',
              author: 'Dr. Laura Bennett, Chief Researcher',
              bg: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            },
            {
              quote: 'The enterprise tools have streamlined our global trial operations significantly.',
              author: 'James Carter, Pharma Executive',
              bg: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            },
            {
              quote: 'Dwaliro empowers patients with unmatched access to cutting-edge trials.',
              author: 'Emma Ruiz, Patient Advocate',
              bg: 'https://images.unsplash.com/photo-1576091160397-57d6c9a0af77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            },
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="testimonial-card"
              style={{ backgroundImage: `url(${testimonial.bg})` }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-overlay" />
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
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Shape the Future of Medicine</h2>
          <p>Join a global network driving innovation in clinical research.</p>
          <Link to="/auth" className="cta-button primary" aria-label="Get Started with Dwaliro">
            Get Started
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;