import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Users, Calendar, User } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.3s ease-out;
  @media (max-width: 640px) {
    border-radius: 12px;
    margin-bottom: 12px;
  }
`;

const Header = styled.div`
  background-color: #000000;
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
  color: #ffffff;
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
  color: #6b7280;
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
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const CardWrapper = styled.div`
  background-color: #000000;
  border-radius: 12px;
  transition: all 0.3s ease-out;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transform: translateY(${props => (props.isVisible ? 0 : '4px')});
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
  height: 120px;
  @media (max-width: 640px) {
    padding: 12px;
    height: 110px;
  }
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
  }
`;

const CardValue = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const CardLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const EligibilitySection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  @media (max-width: 640px) {
    margin-top: 12px;
    padding-top: 12px;
  }
`;

const EligibilityTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const EligibilityText = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  white-space: pre-line;
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

  return <CardValue>{count}</CardValue>;
};

const ParticipantCard = ({ Icon, value, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const numericValue = parseInt(value);
  const isNumeric = !isNaN(numericValue);

  return (
    <CardWrapper isVisible={isVisible}>
      <CardContent>
        <IconWrapper>
          <Icon size={18} color="#ffffff" />
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
        <Users size={20} color="#ffffff" />
        <HeaderText>Participant Information</HeaderText>
      </Header>
      {!participants ? (
        <NoDataContainer>
          <Users size={20} color="#6b7280" />
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
            />
            <ParticipantCard
              Icon={User}
              value={participants.sex}
              label="Sex"
              delay={100}
            />
            <ParticipantCard
              Icon={Users}
              value={participants.enrollment}
              label="Enrollment"
              delay={200}
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