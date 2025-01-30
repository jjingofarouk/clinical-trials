import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMapMarkerAlt, FaMap, FaMapPin } from 'react-icons/fa';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.98); }
  to { transform: scale(1); }
`;

// Styled components
const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  overflow: hidden;
`;

const HeaderGradient = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
`;

const HeaderText = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-left: 12px;
  color: #ffffff;
  flex: 1;
`;

const Badge = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
`;

const BadgeText = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 16px;
`;

const NoDataText = styled.p`
  color: #9ca3af;
  font-size: 16px;
  margin-top: 12px;
  text-align: center;
`;

const LocationsGrid = styled.div`
  padding: 16px;
`;

const LocationCardWrapper = styled.div`
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;

  &:active {
    transform: scale(0.98);
  }
`;

const CardGradient = styled.div`
  border-radius: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #ffffff, #f8f9ff);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const FacilityName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-left: 8px;
`;

const AddressContainer = styled.div`
  padding-left: 24px;
`;

const AddressText = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 20px;
`;

const Separator = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin-top: 16px;
  margin-bottom: 12px;
`;

// LocationCard Component
const LocationCard = ({ location, index, totalLocations }) => {
  return (
    <LocationCardWrapper>
      <CardGradient>
        <CardHeader>
          <FaMapPin size={16} color="#4f46e5" />
          <FacilityName>
            {location.name || 'Facility Name Not Specified'}
          </FacilityName>
        </CardHeader>
        <AddressContainer>
          <AddressText>
            {[location.city, location.state, location.country]
              .filter(Boolean)
              .join(', ')}
          </AddressText>
        </AddressContainer>
        {index < totalLocations - 1 && <Separator />}
      </CardGradient>
    </LocationCardWrapper>
  );
};

// Locations Component
const Locations = ({ locations }) => {
  const [fadeAnim, setFadeAnim] = useState(0);

  useEffect(() => {
    setFadeAnim(1);
  }, []);

  if (!locations || locations.length === 0) {
    return (
      <EmptyContainer>
        <FaMapMarkerAlt size={32} color="#9ca3af" />
        <NoDataText>No location data available</NoDataText>
      </EmptyContainer>
    );
  }

  return (
    <Container style={{ opacity: fadeAnim, transition: 'opacity 0.5s ease-in-out' }}>
      <Header>
        <HeaderGradient>
          <FaMap size={24} color="#ffffff" />
          <HeaderText>Study Locations</HeaderText>
          <Badge>
            <BadgeText>{locations.length}</BadgeText>
          </Badge>
        </HeaderGradient>
      </Header>
      <LocationsGrid>
        {locations.map((location, index) => (
          <LocationCard
            key={index}
            location={location}
            index={index}
            totalLocations={locations.length}
          />
        ))}
      </LocationsGrid>
    </Container>
  );
};

export default Locations;