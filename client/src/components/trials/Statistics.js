import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Activity, Users, Target, Layers } from 'lucide-react';

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

const StatsGrid = styled.div`
  padding: 16px;
  display: flex;
  gap: 12px;
  @media (max-width: 640px) {
    padding: 12px;
    flex-direction: column;
    gap: 8px;
  }
`;

const StatCardWrapper = styled.div`
  flex: 1;
  background-color: #000000;
  border-radius: 12px;
  transition: all 0.3s ease-out;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transform: translateY(${props => (props.isVisible ? 0 : '4px')});
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

const StatValue = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
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
      <span style={{ fontSize: '14px', fontWeight: 500, marginLeft: '4px' }}>+</span>
    </StatValue>
  );
};

const StatCard = ({ Icon, value, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <StatCardWrapper isVisible={isVisible}>
      <StatContent>
        <IconWrapper>
          <Icon size={18} color="#ffffff" />
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
        <Activity size={20} color="#ffffff" />
        <HeaderText>Study Analytics</HeaderText>
      </Header>
      <StatsGrid>
        <StatCard
          Icon={Users}
          value={stats.enrollment}
          label="Participants"
          delay={0}
        />
        <StatCard
          Icon={Target}
          value={stats.primary}
          label="Primary Outcomes"
          delay={100}
        />
        <StatCard
          Icon={Layers}
          value={stats.secondary}
          label="Secondary Outcomes"
          delay={200}
        />
      </StatsGrid>
    </Container>
  );
};

export default Statistics;