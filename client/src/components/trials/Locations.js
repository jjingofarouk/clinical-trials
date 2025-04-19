import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMapMarkerAlt, FaMap, FaMapPin } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  @media (max-width: 640px) {
    margin-bottom: 12px;
    border-radius: 12px;
  }
`;

const Header = styled.div`
  background-color: #000000;
  padding: 16px;
  display: flex;
  align-items: center;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const HeaderText = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  margin-left: 12px;
  @media (max-width: 640px) {
    font-size: 16px;
    margin-left: 8px;
  }
`;

const Badge = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 4px 8px;
  border-radius: 10px;
  @media (max-width: 640px) {
    padding: 3px 6px;
  }
`;

const BadgeText = styled.span`
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 16px;
  @media (max-width: 640px) {
    padding: 24px;
    border-radius: 12px;
  }
`;

const NoDataText = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const LocationsGrid = styled.div`
  padding: 16px;
  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const LocationCardWrapper = styled.div`
  border-radius: 12px;
  margin-bottom: 12px;
  background-color: #ffffff;
  transition: transform 0.2s ease-in-out;
  &:active {
    transform: scale(0.98);
  }
  @media (max-width: 640px) {
    margin-bottom: 8px;
    border-radius: 10px;
  }
`;

const CardContent = styled.div`
  padding: 12px;
  @media (max-width: 640px) {
    padding: 10px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const FacilityName = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-left: 8px;
  @media (max-width: 640px) {
    font-size: 14px;
    margin-left: 6px;
  }
`;

const AddressContainer = styled.div`
  padding-left: 24px;
  @media (max-width: 640px) {
    padding-left: 20px;
  }
`;

const AddressText = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 18px;
  @media (max-width: 640px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 12px 0;
  @media (max-width: 640px) {
    margin: 8px 0;
  }
`;

const LocationCard = ({ location, index, totalLocations }) => {
  return (
    <LocationCardWrapper>
      <CardContent>
        <CardHeader>
          <FaMapPin size={14} color="#000000" />
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
      </CardContent>
    </LocationCardWrapper>
  );
};

const Locations = ({ locations }) => {
  const [fadeAnim, setFadeAnim] = useState(0);

  useEffect(() => {
    setFadeAnim(1);
  }, []);

  if (!locations || locations.length === 0) {
    return (
      <EmptyContainer>
        <FaMapMarkerAlt size={24} color="#6b7280" />
        <NoDataText>No location data available</NoDataText>
      </EmptyContainer>
    );
  }

  return (
    <Container style={{ opacity: fadeAnim, transition: 'opacity 0.5s ease-in-out' }}>
      <Header>
        <FaMap size={20} color="#ffffff" />
        <HeaderText>Study Locations</HeaderText>
        <Badge>
          <BadgeText>{locations.length}</BadgeText>
        </Badge>
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