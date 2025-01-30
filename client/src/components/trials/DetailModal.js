import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaHospital, FaUser } from 'react-icons/fa'; // For icons

const TrialDetailModal = ({ selectedTrial, detailModalVisible, setDetailModalVisible }) => {
  return (
    <ModalOverlay visible={detailModalVisible}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Trial Details</ModalTitle>
          <CloseButton onClick={() => setDetailModalVisible(false)}>
            <FaTimes size={24} color="#6b7280" />
          </CloseButton>
        </ModalHeader>

        <ScrollView>
          {selectedTrial && (
            <>
              <TrialHeader>
                <StatusBadge status={selectedTrial.Status}>
                  <StatusText status={selectedTrial.Status}>
                    {selectedTrial.Status}
                  </StatusText>
                </StatusBadge>
              </TrialHeader>

              <TrialTitle>{selectedTrial.Title}</TrialTitle>

              <DetailSection>
                <DetailSectionTitle>CTA Number</DetailSectionTitle>
                <DetailText>{selectedTrial.CTA}</DetailText>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Principal Investigator</DetailSectionTitle>
                <InfoRow>
                  <FaUser size={20} color="#6b7280" />
                  <InfoText>{selectedTrial.Principal_Investigator}</InfoText>
                </InfoRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Institution</DetailSectionTitle>
                <InfoRow>
                  <FaHospital size={20} color="#6b7280" />
                  <InfoText>{selectedTrial.Institution}</InfoText>
                </InfoRow>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Sponsor</DetailSectionTitle>
                <DetailText>{selectedTrial.Sponsor || 'Not specified'}</DetailText>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Date of Initial Authorization</DetailSectionTitle>
                <DetailText>{selectedTrial.Date_of_Initial_Authorization}</DetailText>
              </DetailSection>
            </>
          )}
        </ScrollView>

        <ModalFooter>
          <CloseButton onClick={() => setDetailModalVisible(false)}>
            <ButtonText>Close</ButtonText>
          </CloseButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TrialDetailModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  overflow-y: auto;
  max-height: 80vh;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 24px;
  font-weight: 500;
  color: #1e293b;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const TrialHeader = styled.div`
  margin-bottom: 16px;
`;

const StatusBadge = styled.div`
  background-color: ${({ status }) =>
    status === 'Completed' ? '#34D399' : status === 'Ongoing' ? '#F59E0B' : '#EF4444'};
  padding: 8px 12px;
  border-radius: 16px;
`;

const StatusText = styled.span`
  color: #ffffff;
  font-weight: 600;
`;

const TrialTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
`;

const DetailSection = styled.div`
  margin-bottom: 12px;
`;

const DetailSectionTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
`;

const DetailText = styled.p`
  font-size: 16px;
  color: #1e293b;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
`;

const InfoText = styled.p`
  font-size: 16px;
  margin-left: 8px;
  color: #1e293b;
`;

const ModalFooter = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const ButtonText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #2563eb;
  }
`;

const ScrollView = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
`;
