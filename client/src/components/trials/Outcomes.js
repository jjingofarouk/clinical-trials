import React, { useState } from 'react';
import { FaChevronDown, FaBullseye, FaClipboard } from 'react-icons/fa';
import { FaAward, FaLayerGroup, FaClock } from 'react-icons/fa';
import { useSpring, animated } from '@react-spring/web';
import './Outcomes.css';

const OutcomeSection = ({ title, content, icon, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const rotate = useSpring({ transform: `rotate(${expanded ? 180 : 0}deg)` });

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className={`outcome-section ${isLast ? '' : 'with-separator'}`}>
      <button onClick={toggleExpand} className="section-content">
        <div className="section-header">
          <div className="icon-wrapper">
            {icon === 'award' && <FaAward size={18} />}
            {icon === 'layers' && <FaLayerGroup size={18} />}
            {icon === 'clock' && <FaClock size={18} />}
          </div>
          <span className="section-title">{title}</span>
          <animated.div style={rotate}>
            <FaChevronDown size={16} />
          </animated.div>
        </div>
        {expanded && (
          <div className="expanded-content">
            <p className="outcome-text">{content}</p>
          </div>
        )}
      </button>
    </div>
  );
};

const Outcomes = ({ outcomes }) => {
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 400 } });

  if (!outcomes || (!outcomes.primary && !outcomes.secondary && !outcomes.timeFrames)) {
    return (
      <animated.div style={fadeIn} className="outcomes-container">
        <div className="header">
          <FaBullseye size={20} />
          <span className="header-text">Study Outcomes</span>
        </div>
        <div className="no-data">
          <FaClipboard size={20} />
          <p className="no-data-text">No outcome data available</p>
        </div>
      </animated.div>
    );
  }

  return (
    <animated.div style={fadeIn} className="outcomes-container">
      <div className="header">
        <FaBullseye size={20} />
        <span className="header-text">Study Outcomes</span>
      </div>
      <div className="outcomes-list">
        {outcomes.primary && (
          <OutcomeSection
            title="Primary Outcomes"
            content={outcomes.primary}
            icon="award"
            isLast={!outcomes.secondary && !outcomes.timeFrames}
          />
        )}
        {outcomes.secondary && (
          <OutcomeSection
            title="Secondary Outcomes"
            content={outcomes.secondary}
            icon="layers"
            isLast={!outcomes.timeFrames}
          />
        )}
        {outcomes.timeFrames && (
          <OutcomeSection
            title="Time Frames"
            content={outcomes.timeFrames}
            icon="clock"
            isLast
          />
        )}
      </div>
    </animated.div>
  );
};

export default Outcomes;