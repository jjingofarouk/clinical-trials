import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Shield, Hash, CheckSquare, Briefcase, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  max-width: 50%;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  @media (max-width: 640px) {
    padding: 3px 6px;
  }
`;

const StatusText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #111827;
  margin-left: 4px;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const RegulatoryItem = ({ label, value, icon: Icon, isStatus = false }) => (
  <ItemWrapper>
    <ItemLabel>
      <Icon size={16} color="#6b7280" />
      <LabelText>{label}</LabelText>
    </ItemLabel>
    {isStatus ? (
      <StatusBadge>
        {value === 'Yes' ? (
          <CheckCircle size={12} color="#111827" />
        ) : (
          <XCircle size={12} color="#111827" />
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
        <Shield size={20} color="#ffffff" />
        <HeaderText>Regulatory Information</HeaderText>
      </Header>
      {!regulatory ? (
        <NoDataContainer>
          <AlertCircle size={20} color="#6b7280" />
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