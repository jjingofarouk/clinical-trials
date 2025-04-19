import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Activity, Users, Target, Layers } from 'lucide-react';

// Keyframes for fade-in and bounce animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
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

const StatsGrid = styled.div`
  padding: 16px;
  display: flex;
  gap: 16px;
  @media (max-width: 640px) {
    padding: 12px;
    flex-direction: column;
    gap: 12px;
  }
`;

const StatCardWrapper = styled.div`
  flex: 1;
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

const StatContent = styled.div`
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

const StatValue = styled.span`
  font-size: 26px;
  font-weight: 700;
  color: #FFFFFF; /* Text on Primary: White */
  animation: ${bounce} 0.5s ease-in-out;
  display: flex;
  align-items: center;
  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

const StatValueSuffix = styled.span`
  font-size: 16px;
  font-weight: 500;
  margin-left: 6px;
  opacity: 0.8;
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  letter-spacing: 0.02em;
  @media (max-width: 640px) {
    font-size: 11px;
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

  return (
    <StatValue>
      {count}
      <StatValueSuffix>+</StatValueSuffix>
    </StatValue>
  );
};

const StatCard = ({ Icon, value, label, delay = 0, bgColor }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <StatCardWrapper isVisible={isVisible} bgColor={bgColor}>
      <StatContent>
        <IconWrapper>
          <Icon size={20} color="#FFFFFF" />
        </IconWrapper>
        <AnimatedCounter endValue={value} />
        <StatLabel>{label}</StatLabel>
      </StatContent>
    </StatCardWrapper>
  );
};

const Statistics = ({ stats = { enrollment: 0, primary: 0, secondary: 0 } }) => {
  return (
    <Container>
      <Header>
        <Activity size={20} color="#FFFFFF" />
        <HeaderText>Study Analytics</HeaderText>
      </Header>
      <StatsGrid>
        <StatCard
          Icon={Users}
          value={stats.enrollment}
          label="Participants"
          delay={0}
          bgColor="#8B5CF6" /* Purple */
        />
        <StatCard
          Icon={Target}
          value={stats.primary}
          label="Primary Outcomes"
          delay={100}
          bgColor="#3B82F6" /* Blue */
        />
        <StatCard
          Icon={Layers}
          value={stats.secondary}
          label="Secondary Outcomes"
          delay={200}
          bgColor="#F59E0B" /* Amber */
        />
      </StatsGrid>
    </Container>
  );
};

export default Statistics;