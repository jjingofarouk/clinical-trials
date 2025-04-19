import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Users, Calendar, User } from 'lucide-react';

// Keyframes for fade-in and bounce animation
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  background-color: #F5F1E9; /* Secondary: Soft Beige */
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.4s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 640px) {
    border-radius: 16px;
    margin-bottom: 16px;
  }
`;

const Header = styled.div`
  background-color: #1A4A4F; /* Primary: Dark Teal */
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
  color: #FFFFFF; /* Text on Primary: White */
  letter-spacing: -0.02em;
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
  gap: 10px;
  @media (max-width: 640px) {
    padding: 24px;
  }
`;

const NoDataText = styled.p`
  font-size: 14px;
  color: #374151; /* Text on Secondary: Dark Gray */
  opacity: 0.8;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const CardWrapper = styled.div`
  background-color: ${props => props.bgColor || '#1A4A4F'}; /* Dynamic background */
  border-radius: 12px;
  transition: all 0.3s ease-out;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transform: translateY(${props => (props.isVisible ? 0 : '8px')});
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 640px) {
    border-radius: 10px;
  }
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 130px;
  @media (max-width: 640px) {
    padding: 12px;
    height: 120px;
  }
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  transition: background-color 0.2s ease;
  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
  }
`;

const CardValue = styled.span`
  font-size: 26px;
  font-weight: 700;
  color: #FFFFFF; /* Text on Primary: White */
  animation: ${props => props.isNumeric ? bounce : 'none'} 0.5s ease-in-out;
  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

const CardLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  letter-spacing: 0.02em;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const EligibilitySection = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB; /* Borders: Light Gray */
  @media (max-width: 640px) {
    margin-top: 16px;
    padding-top: 12px;
  }
`;

const EligibilityTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #374151; /* Text on Secondary: Dark Gray */
  margin-bottom: 10px;
  letter-spacing: -0.01em;
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const EligibilityText = styled.p`
  font-size: 13px;
  color: #374151; /* Text on Secondary: Dark Gray */
  line-height: 1.6;
  white-space: pre-line;
  opacity: 0.9;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const AnimatedCounter = ({ endValue, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    let frameId = null;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * endValue);
      setCount(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [endValue, duration]);

  return <CardValue isNumeric>{count}</CardValue>;
};

const ParticipantCard = ({ Icon, value, label, delay = 0, bgColor }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const numericValue = parseInt(value);
  const isNumeric = !isNaN(numericValue);

  return (
    <CardWrapper isVisible={isVisible} bgColor={bgColor}>
      <CardContent>
        <IconWrapper>
          <Icon size={20} color="#FFFFFF" />
        </IconWrapper>
        {isNumeric ? (
          <AnimatedCounter endValue={numericValue} />
        ) : (
          <CardValue>{value || 'N/A'}</CardValue>
        )}
        <CardLabel>{label}</CardLabel>
      </CardContent>
    </CardWrapper>
  );
};

const Participants = ({ participants }) => {
  return (
    <Container>
      <Header>
        <Users size={20} color="#FFFFFF" />
        <HeaderText>Participant Information</HeaderText>
      </Header>
      {!participants ? (
        <NoDataContainer>
          <Users size={20} color="#374151" />
          <NoDataText>No participant data available</NoDataText>
        </NoDataContainer>
      ) : (
        <Content>
          <Grid>
            <ParticipantCard
              Icon={Calendar}
              value={participants.ageRange}
              label="Age Range"
              delay={0}
              bgColor="#EF4444" /* Red */
            />
            <ParticipantCard
              Icon={User}
              value={participants.sex}
              label="Sex"
              delay={100}
              bgColor="#1E3A8A" /* Deep Blue */
            />
            <ParticipantCard
              Icon={Users}
              value={participants.enrollment}
              label="Enrollment"
              delay={200}
              bgColor="#2D6A6F" /* Accent/Hover: Light Teal */
            />
          </Grid>
          {participants.eligibility && (
            <EligibilitySection>
              <EligibilityTitle>Eligibility Criteria</EligibilityTitle>
              <EligibilityText>{participants.eligibility}</EligibilityText>
            </EligibilitySection>
          )}
        </Content>
      )}
    </Container>
  );
};

export default Participants;