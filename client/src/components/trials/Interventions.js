import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ChevronDown, Pill, Box, Users, Activity, ArrowRight, AlertCircle } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  background-color: #F5F1E9; /* Soft Beige */
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.5s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  @media (max-width: 640px) {
    border-radius: 12px;
    margin-bottom: 12px;
  }
`;

const Header = styled.div`
  background-color: #1A4A4F; /* Dark Teal */
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const HeaderText = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF; /* White */
  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  gap: 8px;
  @media (max-width: 640px) {
    padding: 24px;
  }
`;

const NoDataText = styled.p`
  font-size: 14px;
  color: #374151; /* Dark Gray */
  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const Content = styled.div`
  padding: 16px;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const CardWrapper = styled.div`
  border-radius: 12px;
  margin-bottom: ${props => (props.isLast ? '0' : '12px')};
  background-color: #1A4A4F; /* Dark Teal */
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  border: 1px solid #E5E7EB; /* Light Gray */
  &:hover {
    background-color: #2D6A6F; /* Light Teal */
  }
  &:active {
    transform: scale(0.98);
  }
  @media (max-width: 640px) {
    margin-bottom: ${props => (props.isLast ? '0' : '8px')};
    border-radius: 10px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  @media (max-width: 640px) {
    padding: 10px;
  }
`;

const CardHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 640px) {
    gap: 8px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
  }
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF; /* White */
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const CardSubtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const TypeText = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const StatusBadge = styled.span`
  padding: 2px 8px;
  border-radius: 10px;
  background-color: #2D6A6F; /* Light Teal */
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF; /* White */
  @media (max-width: 640px) {
    font-size: 11px;
    padding: 2px 6px;
  }
`;

const ExpandedContent = styled.div`
  padding: 12px;
  border-top: 1px solid #E5E7EB; /* Light Gray */
  background-color: rgba(255, 255, 255, 0.05);
  @media (max-width: 640px) {
    padding: 10px;
  }
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #FFFFFF; /* White */
  &:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 640px) {
    margin-bottom: 6px;
  }
`;

const DetailLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #FFFFFF; /* White */
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const DetailValue = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const getInterventionIcon = type => {
  const iconMap = {
    DRUG: Pill,
    DEVICE: Box,
    PROCEDURE: Activity,
    BEHAVIORAL: Users,
    OTHER: Box,
  };
  return iconMap[type?.toUpperCase()] || Box;
};

const InterventionCard = ({ intervention, isLast }) => {
  const [expanded, setExpanded] = React.useState(false);
  const Icon = getInterventionIcon(intervention.type);

  return (
    <CardWrapper isLast={isLast}>
      <CardHeader onClick={() => setExpanded(!expanded)}>
        <CardHeaderContent>
          <IconWrapper>
            <Icon size={16} color="#D1D5DB" /* Light Gray for contrast */ />
          </IconWrapper>
          <div>
            <CardTitle>{intervention.name || 'Unnamed Intervention'}</CardTitle>
            <CardSubtitle>
              <TypeText>{intervention.type || 'Type not specified'}</TypeText>
              {intervention.status && (
                <StatusBadge>{intervention.status}</StatusBadge>
              )}
            </CardSubtitle>
          </div>
        </CardHeaderContent>
        <ChevronDown
          size={16}
          color="#FFFFFF" /* White */
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
        />
      </CardHeader>
      {expanded && (
        <ExpandedContent>
          {intervention.dosage && (
            <DetailRow>
              <Pill size={14} color="#D1D5DB" /* Light Gray */ />
              <DetailLabel>Dosage:</DetailLabel>
              <DetailValue>{intervention.dosage}</DetailValue>
            </DetailRow>
          )}
          {intervention.route && (
            <DetailRow>
              <ArrowRight size={14} color="#D1D5DB" /* Light Gray */ />
              <DetailLabel>Route:</DetailLabel>
              <DetailValue>{intervention.route}</DetailValue>
            </DetailRow>
          )}
        </ExpandedContent>
      )}
    </CardWrapper>
  );
};

const Interventions = ({ interventions = [] }) => {
  return (
    <Container>
      <Header>
        <AlertCircle size={20} color="#FFFFFF" /* White */ />
        <HeaderText>Trial Interventions</HeaderText>
      </Header>
      {interventions.length === 0 ? (
        <NoDataContainer>
          <AlertCircle size={20} color="#374151" /* Dark Gray */ />
          <NoDataText>No intervention data available</NoDataText>
        </NoDataContainer>
      ) : (
        <Content>
          {interventions.map((intervention, index) => (
            <InterventionCard
              key={intervention.id || index}
              intervention={intervention}
              isLast={index === interventions.length - 1}
            />
          ))}
        </Content>
      )}
    </Container>
  );
};

export default Interventions;