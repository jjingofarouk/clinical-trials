import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Shuffle, Eye, Layout, Target, Columns, AlertCircle } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
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

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 640px) {
    padding: 10px 0;
  }
`;

const ItemLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const LabelText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const ValueText = styled.span`
  font-size: 14px;
  color: #6b7280;
  text-align: right;
  flex: 1;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #f3f4f6;
  border-radius: 8px;
  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
  }
`;

const DesignItem = ({ Icon, label, value }) => (
  <ItemWrapper>
    <ItemLabel>
      <IconWrapper>
        <Icon size={16} color="#6b7280" />
      </IconWrapper>
      <LabelText>{label}</LabelText>
    </ItemLabel>
    <ValueText>{value || 'Not specified'}</ValueText>
  </ItemWrapper>
);

const StudyDesign = ({ design }) => {
  const designItems = [
    { Icon: Shuffle, label: 'Allocation', value: design?.allocation },
    { Icon: Eye, label: 'Masking', value: design?.masking },
    { Icon: Layout, label: 'Model', value: design?.model },
    { Icon: Target, label: 'Endpoint', value: design?.endpoint },
  ];

  return (
    <Container>
      <Header>
        <Columns size={20} color="#ffffff" />
        <HeaderText>Study Design</HeaderText>
      </Header>
      {!design ? (
        <NoDataContainer>
          <AlertCircle size={20} color="#6b7280" />
          <NoDataText>No study design data available</NoDataText>
        </NoDataContainer>
      ) : (
        <Content>
          {designItems.map((item, index) => (
            <DesignItem key={index} Icon={item.Icon} label={item.label} value={item.value} />
          ))}
        </Content>
      )}
    </Container>
  );
};

export default StudyDesign;