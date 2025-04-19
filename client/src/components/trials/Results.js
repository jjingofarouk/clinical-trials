import React from 'react';
import styled from 'styled-components';
import { AlertOctagon, FileText, BookOpen, AlertCircle } from 'lucide-react';

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

const ResultsList = styled.div`
  padding: 12px;
  @media (max-width: 640px) {
    padding: 8px;
  }
`;

const SectionWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 640px) {
    border-radius: 10px;
  }
`;

const SectionContent = styled.div`
  padding: 12px;
  @media (max-width: 640px) {
    padding: 10px;
  }
`;

const SectionHeader = styled.div`
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
  background-color: #f3f4f6;
  border-radius: 8px;
  color: #000000;
  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const SectionText = styled.p`
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  padding: 0 12px 12px 56px;
  @media (max-width: 640px) {
    font-size: 12px;
    padding: 0 10px 10px 46px;
  }
`;

const Section = ({ icon: Icon, title, content }) => (
  <SectionWrapper>
    <SectionContent>
      <SectionHeader>
        <IconWrapper>
          <Icon size={18} />
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
        <AlertOctagon size={20} color="#ffffff" />
        <HeaderText>Study Results</HeaderText>
      </Header>
      {!results || Object.keys(results).length === 0 ? (
        <NoDataContainer>
          <AlertCircle size={20} color="#6b7280" />
          <NoDataText>No results available at this time.</NoDataText>
        </NoDataContainer>
      ) : (
        <ResultsList>
          {results.adverseEvents && (
            <Section
              icon={AlertOctagon}
              title="Adverse Events"
              content={results.adverseEvents}
            />
          )}
          {results.studyResults && (
            <Section
              icon={FileText}
              title="Study Results"
              content={results.studyResults}
            />
          )}
          {results.publications && (
            <Section
              icon={BookOpen}
              title="Publications"
              content={results.publications}
            />
          )}
        </ResultsList>
      )}
    </Container>
  );
};

export default Results;