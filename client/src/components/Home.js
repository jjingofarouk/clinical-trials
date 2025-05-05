```jsx
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
import HeroBg from '../images/hero-bg.jpeg';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: `url(${HeroBg})` }}>
        <div className="hero-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1>Transforming Clinical Trials with Dwaliro</h1>
          <p>Empowering researchers, clinicians, and patients with cutting-edge technology.</p>
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

      <section className="solutions">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Advanced Solutions
        </motion.h2>
        <div className="solutions-grid">
          {[
            {
              title: 'AI-Powered Discovery',
              description: 'Instantly find relevant trials with intelligent search tools.',
              icon: <Search size={48} />,
              bg: '/images/trial-discovery.jpeg',
            },
            {
              title: 'Secure Profiles',
              description: 'Manage research and patient data with enterprise-grade security.',
              icon: <User size={48} />,
              bg: '/images/secure-profiles.jpeg',
            },
            {
              title: 'Global Collaboration',
              description: 'Connect with international research networks seamlessly.',
              icon: <Users size={48} />,
              bg: '/images/collaboration.jpeg',
            },
            {
              title: 'Verified Data',
              description: 'Access trusted, real-time trial data for informed decisions.',
              icon: <Database size={48} />,
              bg: '/images/data-integrity.jpeg',
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

      <section className="impact">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Our Impact
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

      <section className="testimonials">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Voices of Excellence
        </motion.h2>
        <div className="testimonial-grid">
          {[
            {
              quote: 'Dwaliro has redefined how we approach clinical trial discovery.',
              author: 'Dr. Sophia Lee, Head Researcher',
              bg: '/images/testimonial-1.jpeg',
            },
            {
              quote: 'The platform’s tools have transformed our trial operations.',
              author: 'Mark Thompson, Pharma Director',
              bg: '/images/testimonial-2.jpeg',
            },
            {
              quote: 'Dwaliro empowers patients with unparalleled trial access.',
              author: 'Clara Evans, Patient Advocate',
              bg: '/images/testimonial-3.jpeg',
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

      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Lead the Future of Medicine</h2>
          <p>Join a global platform driving innovation in clinical research.</p>
          <Link to="/auth" className="cta-button primary" aria-label="Get Started with Dwaliro">
            Get Started
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;