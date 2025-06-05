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
import { styled } from '@mui/material/styles';

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
      <LoadingContainer aria-live="polite">
        <CircularProgress sx={{ color: 'var(--primary-color)' }} />
        <Typography variant="body2" color="var(--text-secondary)">
          Loading trial...
        </Typography>
      </LoadingContainer>
    );
  }

  if ((error || !trial) && process.env.REACT_APP_DEBUG_MODE === 'true') {
    return (
      <ErrorContainer aria-live="polite">
        <AlertCircle size={20} color="var(--text-secondary)" />
        <Typography variant="body2" color="var(--text-secondary)">
          {error || 'Trial not found.'}
        </Typography>
        <StyledIconButton
          onClick={() => navigate('/trials')}
          aria-label="Back to trials list"
        >
          <ChevronLeft size={16} />
          <Typography variant="body2">Back to Trials</Typography>
        </StyledIconButton>
      </ErrorContainer>
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
    <StyledContainer
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledIconButton
        onClick={() => navigate('/trials')}
        aria-label="Back to trials list"
      >
        <ChevronLeft size={16} />
        <Typography variant="body2">Back to Trials</Typography>
      </StyledIconButton>
      <Box className="trial-detail-content">
        <StudyDetails study={studyData} />
        <Button
          variant="contained"
          onClick={handleSaveTrial}
          disabled={saving || isSaved}
          sx={{
            backgroundColor: isSaved ? 'var(--status-completed)' : 'var(--primary-color)',
            color: '#FFFFFF',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            mb: 2,
            '&:hover': {
              backgroundColor: isSaved ? 'var(--status-completed)' : 'var(--secondary-color)',
            },
            '&:disabled': {
              backgroundColor: 'var(--status-completed)',
              opacity: 0.7,
            },
          }}
        >
          {saving ? 'Saving...' : isSaved ? 'Trial Saved' : 'Save Trial'}
        </Button>
        <StudyDesign design={designData} />
        <Participants participants={participantsData} />
        <Interventions interventions={interventionsData} />
        <Locations locations={locationsData} />
        <Outcomes outcomes={outcomesData} />
        <Statistics stats={statsData} />
        <RegulatoryInfo regulatory={regulatoryData} />
        <Results results={resultsData} />
      </Box>
    </StyledContainer>
  );
};

// Material-UI styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  padding: theme.spacing(1),
  margin: 0,
  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  minHeight: '100vh',
  '& .trial-detail-content': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  '& .trial-detail-content > div': {
    background: '#f9fafb',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    border: '1px solid var(--border-color)',
  },
  '& .trial-detail-content h2, & .trial-detail-content h3': {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: theme.spacing(1),
  },
  '& .trial-detail-content p, & .trial-detail-content li': {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  '& .trial-detail-content ul': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  '& .trial-detail-content li': {
    padding: theme.spacing(0.5, 0),
    borderBottom: '1px solid var(--border-color)',
  },
  '& .trial-detail-content li:last-child': {
    borderBottom: 'none',
  },
  '& .trial-detail-content table': {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: theme.spacing(1),
  },
  '& .trial-detail-content th, & .trial-detail-content td': {
    padding: theme.spacing(0.75),
    textAlign: 'left',
    borderBottom: '1px solid var(--border-color)',
  },
  '& .trial-detail-content th': {
    fontWeight: 500,
    color: 'var(--text-primary)',
    background: 'var(--border-color)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
    '& .trial-detail-content > div': {
      padding: theme.spacing(1),
    },
    '& .trial-detail-content h2, & .trial-detail-content h3': {
      fontSize: '1rem',
    },
    '& .trial-detail-content p, & .trial-detail-content li': {
      fontSize: '0.75rem',
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: 'var(--text-secondary)',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'var(--border-color)',
    color: 'var(--primary-color)',
  },
  '&:focus': {
    outline: '2px solid var(--primary-color)',
    outlineOffset: '2px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    padding: theme.spacing(0.5),
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: 'var(--text-secondary)',
  margin: theme.spacing(4, 'auto'),
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: 'var(--text-secondary)',
  margin: theme.spacing(4, 'auto'),
  textAlign: 'center',
}));

export default TrialDetailPage;