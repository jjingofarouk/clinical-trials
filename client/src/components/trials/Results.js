import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertOctagon, FileText, BookOpen, AlertCircle } from 'lucide-react';

// Keyframes for fade-in and subtle scale animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
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

const ResultsList = styled.div`
  padding: 16px;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const SectionWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
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
    border-radius: 10px;
  }
`;

const SectionContent = styled.div`
  padding: 14px;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 640px) {
    gap: 10px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: ${props => props.bgColor || '#2D6A6F'}; /* Dynamic background */
  border-radius: 10px;
  color: #FFFFFF; /* White for contrast */
  transition: background-color 0.2s ease;
  animation: ${pulse} 0.5s ease-in-out;

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #374151; /* Text on Secondary: Dark Gray */
  letter-spacing: -0.01em;
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const SectionText = styled.p`
  font-size: 13px;
  color: #374151; /* Text on Secondary: Dark Gray */
  line-height: 1.6;
  padding: 0 14px 14px 60px;
  opacity: 0.9;
  @media (max-width: 640px) {
    font-size: 12px;
    padding: 0 12px 12px 48px;
  }
`;

const Section = ({ icon: Icon, title, content, bgColor }) => (
  <SectionWrapper>
    <SectionContent>
      <SectionHeader>
        <IconWrapper bgColor={bgColor}>
          <Icon size={20} />
        </IconWrapper>
        <SectionTitle>{title}</SectionTitle>
      </SectionHeader>
      <SectionText>{content}</SectionText>
    </SectionContent>
  </SectionWrapper>
);

const Results = ({ results }) => {
  return (
    <Container>
      <Header>
        <AlertOctagon size={20} color="#FFFFFF" />
        <HeaderText>Study Results</HeaderText>
      </Header>
      {!results || Object.keys(results).length === 0 ? (
        <NoDataContainer>
          <AlertCircle size={20} color="#374151" />
          <NoDataText>No results available at this time.</NoDataText>
        </NoDataContainer>
      ) : (
        <ResultsList>
          {results.adverseEvents && (
            <Section
              icon={AlertOctagon}
              title="Adverse Events"
              content={results.adverseEvents}
              bgColor="#EF4444" /* Red */
            />
          )}
          {results.studyResults && (
            <Section
              icon={FileText}
              title="Study Results"
              content={results.studyResults}
              bgColor="#3B82F6" /* Blue */
            />
          )}
          {results.publications && (
            <Section
              icon={BookOpen}
              title="Publications"
              content={results.publications}
              bgColor="#F59E0B" /* Amber */
            />
          )}
        </ResultsList>
      )}
    </Container>
  );
};

export default Results;