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
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      <div className="loading-spinner" aria-live="polite">
        <div className="spinner" />
        Loading trial...
      </div>
    );
  }

  if ((error || !trial) && process.env.REACT_APP_DEBUG_MODE === 'true') {
    return (
      <div className="error-message" aria-live="polite">
        <AlertCircle size={20} className="text-gray-400" />
        <p className="text-sm text-gray-400 mt-2">
          {error || 'Trial not found.'}
        </p>
        <button
          className="back-btn"
          onClick={() => navigate('/trials')}
          aria-label="Back to trials list"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Trials
        </button>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="trial-detail-page"
    >
      <button
        className="back-btn"
        onClick={() => navigate('/trials')}
        aria-label="Back to trials list"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Trials
      </button>
      <div className="trial-detail-content">
        <StudyDetails study={studyData} />
        <Button
          onClick={handleSaveTrial}
          disabled={saving || isSaved}
          style={{
            backgroundColor: isSaved ? '#6b7280' : '#6c63ff',
            borderColor: isSaved ? '#6b7280' : '#6c63ff',
            color: '#FFFFFF',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            marginBottom: '16px',
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
      </div>
      <style jsx>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .trial-detail-page {
          max-width: 800px;
          margin: 16px auto;
          padding: 16px;
        }
        .back-btn {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .back-btn:hover {
          color: #111827;
        }
        .trial-detail-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          margin-top: 32px;
        }
        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #e5e5e5;
          border-top: 2px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .error-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          margin-top: 32px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .trial-detail-page {
            padding: 12px;
            margin: 12px;
          }
          .text-sm {
            font-size: 12px;
          }
          .text-xs {
            font-size: 11px;
          }
          .back-btn {
            font-size: 12px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default TrialDetailPage;