import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import { FaChevronDown, FaPills, FaBox, FaUsers, FaRunning, FaClock, FaCalendar, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';
import { LinearGradient } from 'react-gradient';

// Individual InterventionCard component
const InterventionCard = ({ intervention, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const [fadeAnim, setFadeAnim] = useState(0);
  const [translateY, setTranslateY] = useState(20);
  const rotateAnim = expanded ? 1 : 0;

  const rotate = rotateAnim === 1 ? '180deg' : '0deg';

  useEffect(() => {
    setFadeAnim(1);
    setTranslateY(0);
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getInterventionIcon = (type) => {
    const iconMap = {
      'DRUG': <FaPills />,
      'DEVICE': <FaBox />,
      'PROCEDURE': <FaRunning />,
      'BEHAVIORAL': <FaUsers />,
      'OTHER': <FaBox />
    };
    return iconMap[type?.toUpperCase()] || <FaBox />;
  };

  const getGradientColors = (status) => {
    const gradientMap = {
      'ACTIVE': ['#059669', '#047857'],
      'PENDING': ['#D97706', '#B45309'],
      'COMPLETED': ['#2563EB', '#1D4ED8'],
      'SUSPENDED': ['#DC2626', '#B91C1C']
    };
    return gradientMap[status?.toUpperCase()] || ['#6B7280', '#4B5563'];
  };

  return (
    <div
      style={{
        opacity: fadeAnim,
        transform: `translateY(${translateY}px)`,
        marginBottom: !isLast ? '16px' : 0,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'opacity 0.6s, transform 0.6s',
      }}
    >
      <div onClick={toggleExpand} style={{ cursor: 'pointer' }}>
        <LinearGradient
          gradients={[getGradientColors(intervention.status)]}
          style={{
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          {/* Header Section */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
              }}
            >
              {getInterventionIcon(intervention.type)}
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#FFF' }}>{intervention.name || 'Unnamed Intervention'}</h3>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginRight: '8px' }}>
                  {intervention.type || 'Type not specified'}
                </span>
                {intervention.status && (
                  <div
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#FFF',
                    }}
                  >
                    {intervention.status}
                  </div>
                )}
              </div>
            </div>
            <div style={{ transform: `rotate(${rotate})`, transition: 'transform 0.3s' }}>
              <FaChevronDown size={20} color="#FFF" />
            </div>
          </div>

          {/* Expanded Content */}
          {expanded && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              {intervention.dosage && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <FaPills size={16} color="#FFF" />
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginLeft: '8px' }}>Dosage:</span>
                  <span style={{ fontSize: '14px', color: '#FFF', flex: 1 }}>{intervention.dosage}</span>
                </div>
              )}
              {intervention.route && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <FaArrowRight size={16} color="#FFF" />
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginLeft: '8px' }}>Route:</span>
                  <span style={{ fontSize: '14px', color: '#FFF', flex: 1 }}>{intervention.route}</span>
                </div>
              )}
              {intervention.frequency && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <FaClock size={16} color="#FFF" />
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginLeft: '8px' }}>Frequency:</span>
                  <span style={{ fontSize: '14px', color: '#FFF', flex: 1 }}>{intervention.frequency}</span>
                </div>
              )}
              {intervention.duration && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <FaCalendar size={16} color="#FFF" />
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginLeft: '8px' }}>Duration:</span>
                  <span style={{ fontSize: '14px', color: '#FFF', flex: 1 }}>{intervention.duration}</span>
                </div>
              )}
              {intervention.description && (
                <div style={{ marginTop: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#FFF', lineHeight: '20px' }}>{intervention.description}</span>
                </div>
              )}
            </div>
          )}
        </LinearGradient>
      </div>
    </div>
  );
};

// Main Interventions component
const Interventions = ({ interventions }) => {
  const [fadeAnim, setFadeAnim] = useState(0);
  const [scaleAnim, setScaleAnim] = useState(0.95);

  useEffect(() => {
    setFadeAnim(1);
    setScaleAnim(1);
  }, []);

  if (!interventions || interventions.length === 0) {
    return (
      <div style={{ opacity: fadeAnim, transform: `scale(${scaleAnim})`, transition: 'opacity 0.6s, transform 0.6s' }}>
        <LinearGradient
          gradients={['#4A90E2', '#357ABD']}
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <FaExclamationCircle size={28} color="#FFF" style={{ marginRight: '12px' }} />
          <span style={{ fontSize: '24px', fontWeight: '800', color: '#FFF', flex: 1, letterSpacing: '0.5px' }}>
            Trial Interventions
          </span>
        </LinearGradient>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <FaExclamationCircle size={24} color="#94A3B8" />
          <span style={{ fontSize: '16px', color: '#94A3B8', marginTop: '8px' }}>No intervention data available</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ opacity: fadeAnim, transform: `scale(${scaleAnim})`, transition: 'opacity 0.6s, transform 0.6s' }}>
      <LinearGradient
        gradients={['#4A90E2', '#357ABD']}
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <FaExclamationCircle size={28} color="#FFF" style={{ marginRight: '12px' }} />
        <span style={{ fontSize: '24px', fontWeight: '800', color: '#FFF', flex: 1, letterSpacing: '0.5px' }}>
          Trial Interventions
        </span>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '6px 12px', borderRadius: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFF' }}>
            {interventions.length}
          </span>
        </div>
      </LinearGradient>

      <div style={{ padding: '16px', backgroundColor: '#FFF' }}>
        {interventions.map((intervention, index) => (
          <InterventionCard
            key={index}
            intervention={intervention}
            isLast={index === interventions.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Interventions;
