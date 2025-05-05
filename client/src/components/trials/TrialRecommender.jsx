import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAssessmentForm from './UserAssessmentForm';
import RecommendationResults from './RecommendationResults';

const TrialRecommender = ({ user }) => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Clinical Trial Recommender</h1>
      {assessmentData ? (
        <RecommendationResults assessmentData={assessmentData} />
      ) : (
        <UserAssessmentForm setAssessmentData={setAssessmentData} />
      )}
    </div>
  );
};

export default TrialRecommender;