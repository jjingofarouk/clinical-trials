import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Shield, Hash, CheckSquare, Briefcase, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Keyframes for fade-in and pulse animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
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

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #E5E7EB; /* Borders: Light Gray */
  transition: background-color 0.2s ease;
  animation: ${fadeIn} 0.5s ease-out;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(45, 106, 111, 0.05); /* Accent/Hover: Light Teal with opacity */
  }

  @media (max-width: 640px) {
    padding: 12px 0;
  }
`;

const ItemLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LabelText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #374151; /* Text on Secondary: Dark Gray */
  letter-spacing: -0.01em;
  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const ValueText = styled.span`
  font-size: 14px;
  color: #374151; /* Text on Secondary: Dark Gray */
  text-align: right;
  max-width: 50%;
  opacity: 0.9;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  background-color: ${props => (props.isYes ? '#10B981' : '#EF4444')}; /* Green for Yes, Red for No */
  animation: ${pulse} 0.5s ease-in-out;
  @media (max-width: 640px) {
    padding: 3px 8px;
  }
`;

const StatusText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF; /* White for contrast */
  margin-left: 6px;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const RegulatoryItem = ({ label, value, icon: Icon, isStatus = false }) => (
  <ItemWrapper>
    <ItemLabel>
      <Icon size={18} color="#2D6A6F" /> {/* Accent/Hover: Light Teal */}
      <LabelText>{label}</LabelText>
    </ItemLabel>
    {isStatus ? (
      <StatusBadge isYes={value === 'Yes'}>
        {value === 'Yes' ? (
          <CheckCircle size={14} color="#FFFFFF" />
        ) : (
          <XCircle size={14} color="#FFFFFF" />
        )}
        <StatusText>{value}</StatusText>
      </StatusBadge>
    ) : (
      <ValueText>{value || 'Not specified'}</ValueText>
    )}
  </ItemWrapper>
);

const RegulatoryInfo = ({ regulatory }) => {
  return (
    <Container>
      <Header>
        <Shield size={20} color="#FFFFFF" />
        <HeaderText>Regulatory Information</HeaderText>
      </Header>
      {!regulatory ? (
        <NoDataContainer>
          <AlertCircle size={20} color="#374151" />
          <NoDataText>No regulatory data available</NoDataText>
        </NoDataContainer>
      ) : (
        <Content>
          <RegulatoryItem label="NCT ID" value={regulatory.nctId} icon={Hash} />
          <RegulatoryItem
            label="FDA Regulated"
            value={regulatory.fdaRegulated ? 'Yes' : 'No'}
            icon={CheckSquare}
            isStatus
          />
          <RegulatoryItem label="Sponsor" value={regulatory.sponsor} icon={Briefcase} />
        </Content>
      )}
    </Container>
  );
};

export default RegulatoryInfo;