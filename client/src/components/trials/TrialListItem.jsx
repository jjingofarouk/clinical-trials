import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

const TrialListItem = ({ trial, isSaved, saveTrial }) => {
  const navigate = useNavigate();
  const protocolSection = trial.protocolSection;
  const nctId = protocolSection?.identificationModule?.nctId || 'N/A';
  const title = protocolSection?.identificationModule?.briefTitle || 'No Title';
  const status = protocolSection?.statusModule?.overallStatus || 'Unknown';
  const phase = protocolSection?.designModule?.phases?.join(', ') || 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="trial-list-item"
      onClick={() => navigate(`/trials/${nctId}`)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && navigate(`/trials/${nctId}`)}
      aria-label={`View trial ${title}`}
    >
      <div className="trial-list-content">
        <h3 className="trial-title">{title}</h3>
        <p className="trial-meta nct-id">NCT ID: {nctId}</p>
        <p className="trial-meta status">Status: {status}</p>
        <p className="trial-meta phase">Phase: {phase}</p>
        <button
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            saveTrial(trial);
          }}
          aria-label={isSaved ? 'Remove from saved trials' : 'Save trial'}
        >
          <Bookmark size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default TrialListItem;