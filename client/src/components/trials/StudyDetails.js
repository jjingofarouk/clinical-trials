import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Info,
  FileText,
  Calendar,
  Activity,
  Layers,
  UserPlus,
  Clock,
  CheckCircle,
  CheckSquare,
  XCircle,
  MinusCircle,
  HelpCircle,
} from 'lucide-react';

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
  flex-direction: column;
  gap: 8px;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const Content = styled.div`
  padding: 16px;
  @media (max-width: 640px) {
    padding: 12px;
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

const StatusBadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.15);
  @media (max-width: 640px) {
    padding: 3px 6px;
  }
`;

const StatusText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  margin-left: 4px;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const InfoCardWrapper = styled.div`
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  border: 1px solid #e5e7eb;
  @media (max-width: 640px) {
    border-radius: 10px;
    padding: 10px;
  }
`;

const InfoIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  background-color: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
  }
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #111827;
  margin-bottom: 4px;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const DateInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  @media (max-width: 640px) {
    padding: 6px;
    border-radius: 10px;
  }
`;

const DateIconWrapper = styled.div`
  width: 28px;
  height: 28px;
  background-color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  @media (max-width: 640px) {
    width: 24px;
    height: 24px;
  }
`;

const DateLabel = styled.span`
  font-size: 12px;
  color: #111827;
  flex: 1;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const DateValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #111827;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const AccordionWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
  @media (max-width: 640px) {
    border-radius: 10px;
    margin-bottom: 6px;
  }
`;

const AccordionButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: none;
  border: none;
  cursor: pointer;
  @media (max-width: 640px) {
    padding: 10px;
  }
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AccordionIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  background-color: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
  }
`;

const AccordionTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const AccordionContent = styled.div`
  padding: 0 12px 12px;
  @media (max-width: 640px) {
    padding: 0 10px 10px;
  }
`;

const DescriptionContainer = styled.div`
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 12px;
  @media (max-width: 640px) {
    border-radius: 10px;
    padding: 10px;
  }
`;

const DescriptionText = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const DescriptionNoData = styled.div`
  text-align: center;
  padding: 16px;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const DescriptionNoDataText = styled.span`
  font-size: 12px;
  color: #6b7280;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const StatusBadge = ({ status }) => {
  const getStatusConfig = status => {
    const configs = {
      Recruiting: { icon: UserPlus },
      'Not Yet Recruiting': { icon: Clock },
      'Active, not recruiting': { icon: CheckCircle },
      Completed: { icon: CheckSquare },
      Terminated: { icon: XCircle },
      Withdrawn: { icon: MinusCircle },
      Unknown: { icon: HelpCircle },
    };
    return configs[status] || configs['Unknown'];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <StatusBadgeWrapper>
      <Icon size={12} color="#ffffff" />
      <StatusText>{status}</StatusText>
    </StatusBadgeWrapper>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <InfoCardWrapper>
    <InfoIconWrapper>
      <Icon size={16} color="#6b7280" />
    </InfoIconWrapper>
    <InfoLabel>{label}</InfoLabel>
    <InfoValue>{value || 'Not specified'}</InfoValue>
  </InfoCardWrapper>
);

const DateInfo = ({ icon: Icon, label, date }) => (
  <DateInfoWrapper>
    <DateIconWrapper>
      <Icon size={14} color="#6b7280" />
    </DateIconWrapper>
    <DateLabel>{label}</DateLabel>
    <DateValue>{date || 'Not specified'}</DateValue>
  </DateInfoWrapper>
);

const AccordionSection = ({ title, icon: Icon, children, initiallyExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <AccordionWrapper>
      <AccordionButton onClick={() => setIsExpanded(!isExpanded)}>
        <AccordionHeader>
          <AccordionIconWrapper>
            <Icon size={16} color="#6b7280" />
          </AccordionIconWrapper>
          <AccordionTitle>{title}</AccordionTitle>
        </AccordionHeader>
        {isExpanded ? (
          <ChevronUp size={16} color="#6b7280" />
        ) : (
          <ChevronDown size={16} color="#6b7280" />
        )}
      </AccordionButton>
      {isExpanded && <AccordionContent>{children}</AccordionContent>}
    </AccordionWrapper>
  );
};

const StudyDetails = ({ study }) => {
  return (
    <Container>
      {!study ? (
        <NoDataContainer>
          <AlertCircle size={20} color="#6b7280" />
          <NoDataText>No study details available</NoDataText>
        </NoDataContainer>
      ) : (
        <>
          <Header>
            <Title>{study.title}</Title>
            <StatusBadge status={study.status} />
          </Header>
          <Content>
            <AccordionSection title="Overview" icon={Info} initiallyExpanded>
              <div style={{ display: 'flex', gap: '12px', flexDirection: 'row' }}>
                <InfoCard icon={Activity} label="Study Type" value={study.type} />
                <InfoCard icon={Layers} label="Phase" value={study.phase} />
              </div>
            </AccordionSection>
            <AccordionSection title="Description" icon={FileText}>
              {study.description ? (
                <DescriptionContainer>
                  <DescriptionText>{study.description}</DescriptionText>
                </DescriptionContainer>
              ) : (
                <DescriptionNoData>
                  <DescriptionNoDataText>No description available</DescriptionNoDataText>
                </DescriptionNoData>
              )}
            </AccordionSection>
            <AccordionSection title="Timeline" icon={Calendar}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <DateInfo icon={Calendar} label="Start Date" date={study.startDate} />
                <DateInfo icon={Calendar} label="Primary Completion" date={study.primaryCompletionDate} />
                <DateInfo icon={Calendar} label="Study Completion" date={study.completionDate} />
                <DateInfo icon={Calendar} label="First Posted" date={study.firstPostedDate} />
                <DateInfo icon={Calendar} label="Last Updated" date={study.lastUpdateDate} />
              </div>
            </AccordionSection>
          </Content>
        </>
      )}
    </Container>
  );
};

export default StudyDetails;