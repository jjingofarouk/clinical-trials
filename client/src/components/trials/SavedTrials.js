import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, collection, getDocs, query } from './firebase';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const SavedTrials = () => {
  const [savedTrials, setSavedTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedTrials = async () => {
      if (!auth.currentUser) {
        setError('Please log in to view saved trials.');
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'users', auth.currentUser.uid, 'savedTrials'));
        const querySnapshot = await getDocs(q);
        const trials = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedTrials(trials);
      } catch (err) {
        setError(`Failed to load saved trials: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTrials();
  }, []);

  if (loading) {
    return <Container style={{ padding: '40px 20px', textAlign: 'center' }}>Loading...</Container>;
  }

  if (error) {
    return (
      <Container style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <Button onClick={() => navigate('/auth')} variant="primary">
          Log In
        </Button>
      </Container>
    );
  }

  return (
    <Container style={{ padding: '40px 20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Saved Trials</h2>
      {savedTrials.length === 0 ? (
        <p>No saved trials found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {savedTrials.map((trial) => (
            <div
              key={trial.id}
              style={{
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/trials/${trial.id}`)}
            >
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px' }}>{trial.title || 'Untitled Trial'}</h3>
              <p style={{ fontSize: '1rem', margin: 0 }}>NCT ID: {trial.id}</p>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default SavedTrials;