import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  Clock, 
  Users, 
  Beaker, 
  MapPin, 
  Target, 
  ChartBar, 
  Shield, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StudyDetails from './StudyDetails';
import StudyDesign from './StudyDesign';
import Participants from './Participants';
import Interventions from './Interventions';
import Locations from './Locations';
import Outcomes from './Outcomes';
import Statistics from './Statistics';
import RegulatoryInfo from './RegulatoryInfo';
import Results from './Results';
import './TrialCard.css';

const TrialCard = ({ trial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  
  const protocolSection = trial.protocolSection;
  const nctId = protocolSection?.identificationModule?.nctId;

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const openTrialDetails = (e) => {
    e.stopPropagation();
    window.open(`https://clinicaltrials.gov/study/${nctId}`, '_blank');
  };

  // Data extraction
  const studyData = {
    title: protocolSection?.identificationModule?.briefTitle,
    type: protocolSection?.designModule?.studyType,
    phase: protocolSection?.designModule?.phases?.join(', '),
    description: protocolSection?.descriptionModule?.briefSummary,
    startDate: protocolSection?.statusModule?.startDateStruct?.date,
    completionDate: protocolSection?.statusModule?.completionDateStruct?.date,
    status: protocolSection?.statusModule?.overallStatus
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'Recruiting': 'status-recruiting',
      'Active, not recruiting': 'status-active',
      'Completed': 'status-completed',
      'Not yet recruiting': 'status-upcoming',
      'Terminated': 'status-terminated',
      'Withdrawn': 'status-terminated',
      'Suspended': 'status-suspended'
    };
    return statusClasses[status] || 'status-default';
  };

  const getStatusIcon = (status) => {
    if (status === 'Recruiting') return <AlertCircle size={14} className="status-icon" />;
    return null;
  };

  const tabs = [
    { id: 'design', label: 'Study Design', icon: Beaker },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'interventions', label: 'Interventions', icon: Target },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'outcomes', label: 'Outcomes', icon: ChartBar },
    { id: 'regulatory', label: 'Regulatory', icon: Shield },
    { id: 'results', label: 'Results', icon: FileText }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card className={`trial-card ${isExpanded ? 'expanded' : ''}`}>
      <CardContent className="trial-card-content">
        <div 
          onClick={toggleExpand}
          className="trial-card-header"
        >
          <div className="trial-card-main">
            <div className="trial-card-top">
              <div className="trial-badges">
                <span className={`status-badge ${getStatusClass(studyData.status)}`}>
                  {getStatusIcon(studyData.status)}
                  {studyData.status}
                </span>
                {studyData.phase && (
                  <span className="phase-badge">
                    Phase {studyData.phase}
                  </span>
                )}
              </div>
              <div className="trial-actions">
                <button
                  onClick={openTrialDetails}
                  className="action-button"
                  aria-label="View on ClinicalTrials.gov"
                >
                  <ExternalLink size={18} />
                </button>
                <button 
                  className="expand-button"
                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                >
                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>
            
            <h3 className="trial-title">{studyData.title}</h3>
            
            <div className="trial-meta">
              <div className="meta-item">
                <Clock size={16} />
                <span>{formatDate(studyData.startDate)} - {studyData.completionDate ? formatDate(studyData.completionDate) : 'Ongoing'}</span>
              </div>
              <div className="meta-item nct-id">
                <span>NCT{nctId}</span>
              </div>
            </div>

            {studyData.description && (
              <p className={`trial-description ${isExpanded ? 'expanded' : ''}`}>
                {studyData.description}
              </p>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="trial-details">
            <div className="trial-tabs-container">
              <div className="trial-tabs">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`tab-button ${activeTab === id ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="tab-content">
              {activeTab === 'design' && <StudyDesign design={trial?.protocolSection?.designModule} />}
              {activeTab === 'participants' && <Participants participants={trial?.protocolSection?.eligibilityModule} />}
              {activeTab === 'interventions' && <Interventions interventions={trial?.protocolSection?.armsInterventionsModule} />}
              {activeTab === 'locations' && <Locations locations={trial?.protocolSection?.contactsLocationsModule} />}
              {activeTab === 'outcomes' && <Outcomes outcomes={trial?.protocolSection?.outcomesModule} />}
              {activeTab === 'regulatory' && <RegulatoryInfo regulatory={trial?.protocolSection?.oversightModule} />}
              {activeTab === 'results' && <Results results={trial?.resultsSection} />}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrialCard;