import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Info,
  FileText,
  Calendar,
  Activity,
  Layers,
  UserPlus,
  Clock,
  CheckCircle,
  CheckSquare,
  XCircle,
  MinusCircle,
  HelpCircle,
} from 'lucide-react';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const expand = keyframes`
  from { max-height: 0; opacity: 0; }
  to { max-height: 500px; opacity: 1; }
`;

const Container = styled.div`
  background-color: #F5F1E9; /* Secondary: Soft Beige */
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 640px) {
    border-radius: 18px;
    margin-bottom: 18px;
  }
`;

const Header = styled.div`
  background-color: #1A4A4F; /* Primary: Dark Teal */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF; /* Text on Primary: White */
  line-height: 1.3;
  letter-spacing: -0.02em;
  @media (max-width: 640px) {
    font-size: 18px;
  }
`;

const Content = styled.div`
  padding: 20px;
  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  @media (max-width: 640px) {
    padding: 32px;
  }
`;

const NoDataText = styled.p`
  font-size: 15px;
  color: #374151; /* Text on Secondary: Dark Gray */
  opacity: 0.8;
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const StatusBadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 16px;
  background-color: ${props => props.bgColor || 'rgba(255, 255, 255, 0.2)'};
  animation: ${pulse} 0.5s ease-in-out;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.hoverColor || 'rgba(255, 255, 255, 0.3)'};
  }

  @media (max-width: 640px) {
    padding: 5px 10px;
  }
`;

const StatusText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  margin-left: 6px;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const InfoCardWrapper = styled.div`
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 1px solid #E5E7EB; /* Borders: Light Gray */
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 640px) {
    border-radius: 10px;
    padding: 12px;
  }
`;

const InfoIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  background-color: ${props => props.bgColor || '#2D6A6F'}; /* Dynamic background */
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  animation: ${pulse} 0.5s ease-in-out;
  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
  }
`;

const InfoLabel = styled.div`
  font-size: 13px;
  color: #374151; /* Text on Secondary: Dark Gray */
  margin-bottom: 6px;
  opacity: 0.8;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const InfoValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #374151; /* Text on Secondary: Dark Gray */
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const DateInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #E5E7EB; /* Borders: Light Gray */
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(45, 106, 111, 0.05); /* Accent/Hover: Light Teal with opacity */
  }

  @media (max-width: 640px) {
    padding: 8px;
    border-radius: 10px;
  }
`;

const DateIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  background-color: #2D6A6F; /* Accent/Hover: Light Teal */
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
  }
`;

const DateLabel = styled.span`
  font-size: 13px;
  color: #374151; /* Text on Secondary: Dark Gray */
  flex: 1;
  opacity: 0.8;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const DateValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #374151; /* Text on Secondary: Dark Gray */
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const AccordionWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid #E5E7EB; /* Borders: Light Gray */
  background-color: #FFFFFF;
  transition: box-shadow 0.2s ease;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 640px) {
    border-radius: 10px;
    margin-bottom: 10px;
  }
`;

const AccordionButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(45, 106, 111, 0.05); /* Accent/Hover: Light Teal with opacity */
  }

  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AccordionIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  background-color: ${props => props.bgColor || '#2D6A6F'}; /* Dynamic background */
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 0.5s ease-in-out;
  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
  }
`;

const AccordionTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #374151; /* Text on Secondary: Dark Gray */
  letter-spacing: -0.01em;
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const AccordionContent = styled.div`
  padding: 0 14px 14px;
  animation: ${expand} 0.3s ease-out;
  overflow: hidden;
  @media (max-width: 640px) {
    padding: 0 12px 12px;
  }
`;

const DescriptionContainer = styled.div`
  background-color: #F5F1E9; /* Secondary: Soft Beige */
  border-radius: 12px;
  padding: 14px;
  @media (max-width: 640px) {
    border-radius: 10px;
    padding: 12px;
  }
`;

const DescriptionText = styled.p`
  font-size: 14px;
  color: #374151; /* Text on Secondary: Dark Gray */
  line-height: 1.6;
  opacity: 0.9;
  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const DescriptionNoData = styled.div`
  text-align: center;
  padding: 20px;
  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const DescriptionNoDataText = styled.span`
  font-size: 13px;
  color: #374151; /* Text on Secondary: Dark Gray */
  opacity: 0.8;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const StatusBadge = ({ status }) => {
  const getStatusConfig = status => {
    const configs = {
      Recruiting: { icon: UserPlus, bgColor: '#10B981', hoverColor: '#059669' }, /* Green */
      'Not Yet Recruiting': { icon: Clock, bgColor: '#F59E0B', hoverColor: '#D97706' }, /* Amber */
      'Active, not recruiting': { icon: CheckCircle, bgColor: '#3B82F6', hoverColor: '#2563EB' }, /* Blue */
      Completed: { icon: CheckSquare, bgColor: '#10B981', hoverColor: '#059669' }, /* Green */
      Terminated: { icon: XCircle, bgColor: '#EF4444', hoverColor: '#DC2626' }, /* Red */
      Withdrawn: { icon: MinusCircle, bgColor: '#EF4444', hoverColor: '#DC2626' }, /* Red */
      Unknown: { icon: HelpCircle, bgColor: '#6B7280', hoverColor: '#4B5563' }, /* Gray */
    };
    return configs[status] || configs['Unknown'];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <StatusBadgeWrapper bgColor={config.bgColor} hoverColor={config.hoverColor}>
      <Icon size={14} color="#FFFFFF" />
      <StatusText>{status}</StatusText>
    </StatusBadgeWrapper>
  );
};

const InfoCard = ({ icon: Icon, label, value, bgColor }) => (
  <InfoCardWrapper>
    <InfoIconWrapper bgColor={bgColor}>
      <Icon size={18} color="#FFFFFF" />
    </InfoIconWrapper>
    <InfoLabel>{label}</InfoLabel>
    <InfoValue>{value || 'Not specified'}</InfoValue>
  </InfoCardWrapper>
);

const DateInfo = ({ icon: Icon, label, date }) => (
  <DateInfoWrapper>
    <DateIconWrapper>
      <Icon size={16} color="#FFFFFF" />
    </DateIconWrapper>
    <DateLabel>{label}</DateLabel>
    <DateValue>{date || 'Not specified'}</DateValue>
  </DateInfoWrapper>
);

const AccordionSection = ({ title, icon: Icon, children, initiallyExpanded = false, bgColor }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <AccordionWrapper>
      <AccordionButton onClick={() => setIsExpanded(!isExpanded)}>
        <AccordionHeader>
          <AccordionIconWrapper bgColor={bgColor}>
            <Icon size={18} color="#FFFFFF" />
          </AccordionIconWrapper>
          <AccordionTitle>{title}</AccordionTitle>
        </AccordionHeader>
        {isExpanded ? (
          <ChevronUp size={18} color="#2D6A6F" />
        ) : (
          <ChevronDown size={18} color="#2D6A6F" />
        )}
      </AccordionButton>
      {isExpanded && <AccordionContent>{children}</AccordionContent>}
    </AccordionWrapper>
  );
};

const StudyDetails = ({ study }) => {
  return (
    <Container>
      {!study ? (
        <NoDataContainer>
          <AlertCircle size={24} color="#374151" />
          <NoDataText>No study details available</NoDataText>
        </NoDataContainer>
      ) : (
        <>
          <Header>
            <Title>{study.title}</Title>
            <StatusBadge status={study.status} />
          </Header>
          <Content>
            <AccordionSection
              title="Overview"
              icon={Info}
              initiallyExpanded
              bgColor="#8B5CF6" /* Purple */
            >
              <div style={{ display: 'flex', gap: '16px', flexDirection: 'row', flexWrap: 'wrap' }}>
                <InfoCard
                  icon={Activity}
                  label="Study Type"
                  value={study.type}
                  bgColor="#2D6A6F" /* Accent/Hover: Light Teal */
                />
                <InfoCard
                  icon={Layers}
                  label="Phase"
                  value={study.phase}
                  bgColor="#2D6A6F" /* Accent/Hover: Light Teal */
                />
              </div>
            </AccordionSection>
            <AccordionSection title="Description" icon={FileText} bgColor="#3B82F6" /* Blue */>
              {study.description ? (
                <DescriptionContainer>
                  <DescriptionText>{study.description}</DescriptionText>
                </DescriptionContainer>
              ) : (
                <DescriptionNoData>
                  <DescriptionNoDataText>No description available</DescriptionNoDataText>
                </DescriptionNoData>
              )}
            </AccordionSection>
            <AccordionSection title="Timeline" icon={Calendar} bgColor="#F59E0B" /* Amber */>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <DateInfo icon={Calendar} label="Start Date" date={study.startDate} />
                <DateInfo icon={Calendar} label="Primary Completion" date={study.primaryCompletionDate} />
                <DateInfo icon={Calendar} label="Study Completion" date={study.completionDate} />
                <DateInfo icon={Calendar} label="First Posted" date={study.firstPostedDate} />
                <DateInfo icon={Calendar} label="Last Updated" date={study.lastUpdateDate} />
              </div>
            </AccordionSection>
          </Content>
        </>
      )}
    </Container>
  );
};

export default StudyDetails;