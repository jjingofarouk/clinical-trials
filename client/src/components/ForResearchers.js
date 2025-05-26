import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './trials/firebase'; // Assuming firebase.js is in the trials directory
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, BarChart, Upload } from 'lucide-react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForResearchers.css';

const ForResearchers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCTAClick = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/researchers/publish'); // Example route for authenticated users
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner" aria-live="polite">
        <div className="spinner" />
        Loading...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="for-researchers-page"
    >
      <Container>
        <button
          className="back-btn"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Home
        </button>

        <header className="researchers-header">
          <h1>Resources for Researchers</h1>
          <p>
            Access tools and data to advance clinical trial research, publish studies, and analyze trial outcomes.
          </p>
          <Button
            onClick={handleCTAClick}
            className="cta-button"
            aria-label={user ? 'Publish a Trial' : 'Log in to Access Tools'}
          >
            {user ? 'Publish a Trial' : 'Log in to Access Tools'}
          </Button>
        </header>

        <section className="researchers-content">
          <Card className="resource-card">
            <Card.Body>
              <FileText size={24} className="resource-icon" />
              <Card.Title>Publish Trials</Card.Title>
              <Card.Text>
                Submit your clinical trial data to our platform for review and publication. Share your research with the global community.
              </Card.Text>
              <Button
                variant="link"
                className="resource-link"
                onClick={() => navigate(user ? '/researchers/publish' : '/auth')}
                aria-label="Learn more about publishing trials"
              >
                Learn More
              </Button>
            </Card.Body>
          </Card>

          <Card className="resource-card">
            <Card.Body>
              <BarChart size={24} className="resource-icon" />
              <Card.Title>Analyze Data</Card.Title>
              <Card.Text>
                Access advanced analytics tools to explore trial outcomes, patient demographics, and statistical insights.
              </Card.Text>
              <Button
                variant="link"
                className="resource-link"
                onClick={() => navigate(user ? '/researchers/analytics' : '/auth')}
                aria-label="Learn more about analytics tools"
              >
                Learn More
              </Button>
            </Card.Body>
          </Card>

          <Card className="resource-card">
            <Card.Body>
              <Upload size={24} className="resource-icon" />
              <Card.Title>Manage Trials</Card.Title>
              <Card.Text>
                Track and manage your ongoing trials, update statuses, and collaborate with your research team.
              </Card.Text>
              <Button
                variant="link"
                className="resource-link"
                onClick={() => navigate(user ? '/researchers/manage' : '/auth')}
                aria-label="Learn more about managing trials"
              >
                Learn More
              </Button>
            </Card.Body>
          </Card>
        </section>
      </Container>
    </motion.div>
  );
};

export default ForResearchers;