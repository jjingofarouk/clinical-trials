import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db, doc, setDoc, getDoc } from './firebase';
import { motion } from 'framer-motion';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import Interventions from './Interventions';
import Locations from './Locations';
import Outcomes from './Outcomes';
import Participants from './Participants';
import RegulatoryInfo from './RegulatoryInfo';
import Results from './Results';
import Statistics from './Statistics';
import StudyDesign from './StudyDesign';
import StudyDetails from './StudyDetails';
import {
  Container,
  Button,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import './TrialDetailPage.css';

const TrialDetailPage = () => {
  const { nctId } = useParams();
  const navigate = useNavigate();
  const [trial, setTrial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchTrial = async (retries = 3) => {
      setLoading(true);
      setError(null);
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_CLINICAL_TRIALS_API}/studies/${encodeURIComponent(nctId)}?format=json`,
            { headers: { 'Accept': 'application/json' } }
          );
          if (!response.ok) {
            if (response.status === 429 && attempt < retries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
              continue;
            }
            throw new Error(`Failed to fetch trial: HTTP ${response.status} - ${response.statusText}`);
          }
          const data = await response.json();
          if (!data || !data.protocolSection) {
            throw new Error('Invalid trial data received');
          }
          setTrial(data);
          setLoading(false);
          return;
        } catch (err) {
          if (attempt === retries) {
            setError(`Error fetching trial: ${err.message}`);
            setLoading(false);
          }
        }
      }
    };

    const checkIfSaved = async () => {
      if (auth.currentUser) {
        try {
          const savedTrialDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'savedTrials', nctId));
          setIsSaved(savedTrialDoc.exists());
        } catch (err) {
          console.error('Error checking saved trial:', err);
        }
      }
    };

    fetchTrial();
    checkIfSaved();
  }, [nctId]);

  const handleSaveTrial = async () => {
    if (!auth.currentUser) {
      navigate('/auth');
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'savedTrials', nctId), {
        id: nctId,
        title: trial.protocolSection?.identificationModule?.briefTitle || 'Untitled Trial',
        savedAt: new Date().toISOString(),
      });
      setIsSaved(true);
      alert('Trial saved successfully!');
    } catch (err) {
      setError(`Failed to save trial: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" aria-live="polite">
        <CircularProgress className="spinner" />
        <Typography variant="body2" className="loading-text">
          Loading trial...
        </Typography>
      </div>
    );
  }

  if ((error || !trial) && process.env.REACT_APP_DEBUG_MODE === 'true') {
    return (
      <div className="error-container" aria-live="polite">
        <AlertCircle size={20} className="error-icon" />
        <Typography variant="body2" className="error-text">
          {error || 'Trial not found.'}
        </Typography>
        <IconButton
          className="back-btn"
          onClick={() => navigate('/trials')}
          aria-label="Back to trials list"
        >
          <ChevronLeft size={16} />
          <Typography variant="body2">Back to Trials</Typography>
        </IconButton>
      </div>
    );
  }

  if (!trial) {
    return null;
  }

  const protocolSection = trial.protocolSection;
  const studyData = {
    title: protocolSection?.identificationModule?.briefTitle || 'No Title',
    type: protocolSection?.designModule?.studyType || 'Unknown',
    phase: protocolSection?.designModule?.phases?.join(', ') || 'N/A',
    description: protocolSection?.descriptionModule?.briefSummary || 'No Description',
    startDate: protocolSection?.statusModule?.startDateStruct?.date || 'N/A',
    completionDate: protocolSection?.statusModule?.completionDateStruct?.date || 'N/A',
    status: protocolSection?.statusModule?.overallStatus || 'Unknown',
  };

  const interventionsData = protocolSection?.armsInterventionsModule?.interventions || [];
  const locationsData = protocolSection?.contactsLocationsModule?.locations || [];
  const outcomesData = {
    primary:
      protocolSection?.outcomesModule?.primaryOutcomes?.map((o) => o.measure).join(', ') ||
      'N/A',
    secondary:
      protocolSection?.outcomesModule?.secondaryOutcomes?.map((o) => o.measure).join(', ') ||
      'N/A',
    timeFrames:
      protocolSection?.outcomesModule?.primaryOutcomes?.map((o) => o.timeFrame).join(', ') ||
      'N/A',
  };

  const participantsData = {
    eligibility: protocolSection?.eligibilityModule?.eligibilityCriteria || 'N/A',
    ageRange: `${protocolSection?.eligibilityModule?.minimumAge || 'N/A'} - ${
      protocolSection?.eligibilityModule?.maximumAge || 'N/A'
    }`,
    sex: protocolSection?.eligibilityModule?.sex || 'N/A',
    enrollment: protocolSection?.designModule?.enrollmentInfo?.count || 'N/A',
  };

  const regulatoryData = {
    nctId: protocolSection?.identificationModule?.nctId || 'N/A',
    fdaRegulated: protocolSection?.oversightModule?.isFdaRegulatedDrug ? 'Yes' : 'No',
    sponsor: protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name || 'N/A',
  };

  const resultsData = {
    adverseEvents: protocolSection?.resultsSection?.adverseEventsModule?.description || 'N/A',
    studyResults: protocolSection?.resultsSection?.baselineModule?.description || 'N/A',
    publications:
      protocolSection?.referencesModule?.references?.map((r) => r.citation).join(', ') ||
      'N/A',
  };

  const statsData = {
    enrollment: protocolSection?.designModule?.enrollmentInfo?.count || 0,
    primary: protocolSection?.outcomesModule?.primaryOutcomes?.length || 0,
    secondary: protocolSection?.outcomesModule?.secondaryOutcomes?.length || 0,
  };

  const designData = {
    allocation: protocolSection?.designModule?.allocation || 'N/A',
    masking: protocolSection?.designModule?.masking?.masking || 'N/A',
    model: protocolSection?.designModule?.interventionModel || 'N/A',
    endpoint: protocolSection?.designModule?.primaryPurpose || 'N/A',
  };

  return (
    <Container
      className="trial-detail-page"
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <IconButton
        className="back-btn"
        onClick={() => navigate('/trials')}
        aria-label="Back to trials list"
      >
        <ChevronLeft size={16} />
        <Typography variant="body2">Back to Trials</Typography>
      </IconButton>
      <Box className="trial-detail-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StudyDetails study={studyData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            variant="contained"
            className="save-btn"
            onClick={handleSaveTrial}
            disabled={saving || isSaved}
            aria-label={saving ? 'Saving trial' : isSaved ? 'Trial saved' : 'Save trial'}
          >
            {saving ? 'Saving...' : isSaved ? 'Trial Saved' : 'Save Trial'}
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StudyDesign design={designData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Participants participants={participantsData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Interventions interventions={interventionsData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Locations locations={locationsData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Outcomes outcomes={outcomesData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Statistics stats={statsData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <RegulatoryInfo regulatory={regulatoryData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <Results results={resultsData} />
        </motion.div>
      </Box>
    </Container>
  );
};

export default TrialDetailPage;