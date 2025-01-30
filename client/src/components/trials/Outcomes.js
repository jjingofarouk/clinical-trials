import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { FaChevronDown, FaAward, FaLayers, FaClock, FaClipboard } from 'react-icons/fa';
import './Outcomes.css';
import { FaBullseye as FaTarget } from 'react-icons/fa'  // FaBullseye is a similar target icon
import { FaLayerGroup } from "react-icons/fa";

const OutcomeSection = ({ title, content, icon, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const rotate = useSpring({ transform: `rotate(${expanded ? 180 : 0}deg)` });

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`outcomeSection ${!isLast ? 'withSeparator' : ''}`}>
      <button onClick={toggleExpand} className="sectionContent">
        <div className="sectionHeader">
          <div className="iconContainer">
            {icon === 'award' && <FaAward size={20} color="#2563EB" />}
            {icon === 'layers' && <FaLayerGroup size={20} color="#2563EB" />}
            {icon === 'clock' && <FaClock size={20} color="#2563EB" />}
          </div>
          <span className="sectionTitle">{title}</span>
          <animated.div style={rotate}>
            <FaChevronDown size={20} color="#2563EB" />
          </animated.div>
        </div>
        
        {expanded && (
          <div className="expandedContent">
            <p className="outcomeText">{content}</p>
          </div>
        )}
      </button>
    </div>
  );
};

const Outcomes = ({ outcomes }) => {
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, duration: 600 });
  const scaleIn = useSpring({ transform: 'scale(1)', from: { transform: 'scale(0.95)' } });

  if (!outcomes || (!outcomes.primary && !outcomes.secondary)) {
    return (
      <animated.div style={{ ...fadeIn, ...scaleIn }} className="container">
        <div className="headerGradient">
          <FaTarget size={28} color="#FFF" className="headerIcon" />
          <span className="headerText">Study Outcomes</span>
        </div>
        <div className="noDataContainer">
          <FaClipboard size={24} color="#94A3B8" />
          <p className="noDataText">No outcome data available</p>
        </div>
      </animated.div>
    );
  }

  return (
    <animated.div style={{ ...fadeIn, ...scaleIn }} className="container">
      <div className="headerGradient">
        <FaTarget size={28} color="#FFF" className="headerIcon" />
        <span className="headerText">Study Outcomes</span>
      </div>

      <div className="scrollContainer">
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
            isLast={true}
          />
        )}
      </div>
    </animated.div>
  );
};

export default Outcomes;
