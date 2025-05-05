import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRecommendations } from './RecommendationLogic';
import TrialListItem from './TrialListItem';

const RecommendationResults = ({ assessmentData }) => {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const recommendedTrials = await getRecommendations(assessmentData);
        setTrials(recommendedTrials);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load recommendations: ${err.message}`);
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [assessmentData]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading recommendations...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Recommended Trials</h2>
      {trials.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No trials match your criteria. Try adjusting your preferences.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {trials.map((trial) => (
            <TrialListItem
              key={trial.protocolSection?.identificationModule?.nctId}
              trial={trial}
              isSaved={false}
              saveTrial={() => {}}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecommendationResults;
