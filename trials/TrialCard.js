import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CustomSelect from '../../../../utils/CustomSelect';
import { BlurView } from 'expo-blur';
import {
  COLORS,
  RADII,
  TYPOGRAPHY,
  SPACING,
  SHADOWS,
  styles

 } from './TrialsStyles';
import { filterOptions } from './Filter';
import Interventions from './Interventions';
import Locations from './Locations';
import Outcomes from './Outcomes';
import Participants from './Participants';
import RegulatoryInfo from './RegulatoryInfo';
import Results from './Results';
import Statistics from './Statistics';
import StudyDesign from './StudyDesign';
import StudyDetails from './StudyDetails';


export   const TrialCard = ({ trial }) => {
    const protocolSection = trial.protocolSection;
    const nctId = protocolSection?.identificationModule?.nctId;
    const isExpanded = expandedTrialId === nctId;

    const toggleExpand = () => {
      setExpandedTrialId(isExpanded ? null : nctId);
    };

    const openTrialDetails = () => {
      const url = `https://clinicaltrials.gov/study/${nctId}`;
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    };

    // Extract all required data from protocolSection
    const studyData = {
      title: protocolSection?.identificationModule?.briefTitle,
      type: protocolSection?.designModule?.studyType,
      phase: protocolSection?.designModule?.phases?.join(', '),
      description: protocolSection?.descriptionModule?.briefSummary,
      startDate: protocolSection?.statusModule?.startDateStruct?.date,
      completionDate: protocolSection?.statusModule?.completionDateStruct?.date,
      status: protocolSection?.statusModule?.overallStatus
    };

    const interventionsData = protocolSection?.armsInterventionsModule?.interventions || [];

    const locationsData = protocolSection?.contactsLocationsModule?.locations || [];

    const outcomesData = {
      primary: protocolSection?.outcomesModule?.primaryOutcomes?.map(o => o.measure).join(', '),
      secondary: protocolSection?.outcomesModule?.secondaryOutcomes?.map(o => o.measure).join(', '),
      timeFrames: protocolSection?.outcomesModule?.primaryOutcomes?.map(o => o.timeFrame).join(', ')
    };

    const participantsData = {
      eligibility: protocolSection?.eligibilityModule?.eligibilityCriteria,
      ageRange: `${protocolSection?.eligibilityModule?.minimumAge} - ${protocolSection?.eligibilityModule?.maximumAge}`,
      sex: protocolSection?.eligibilityModule?.sex,
      enrollment: protocolSection?.designModule?.enrollmentInfo?.count
    };

    const regulatoryData = {
      nctId: nctId,
      fdaRegulated: protocolSection?.oversightModule?.isFdaRegulatedDrug,
      sponsor: protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name
    };

    const resultsData = {
      adverseEvents: protocolSection?.resultsSection?.adverseEventsModule?.description,
      studyResults: protocolSection?.resultsSection?.baselineModule?.description,
      publications: protocolSection?.referencesModule?.references?.map(r => r.citation).join(', ')
    };

    const statsData = {
      enrollment: protocolSection?.designModule?.enrollmentInfo?.count,
      primary: protocolSection?.outcomesModule?.primaryOutcomes?.length,
      secondary: protocolSection?.outcomesModule?.secondaryOutcomes?.length
    };

    const designData = {
      allocation: protocolSection?.designModule?.allocation,
      masking: protocolSection?.designModule?.masking?.masking,
      model: protocolSection?.designModule?.interventionModel,
      endpoint: protocolSection?.designModule?.primaryPurpose
    };

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={toggleExpand} style={styles.cardHeader}>
          <StudyDetails study={studyData} />
          <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#666" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <StudyDesign design={designData} />
            <Participants participants={participantsData} />
            <Interventions interventions={interventionsData} />
            <Locations locations={locationsData} />
            <Outcomes outcomes={outcomesData} />
            <Statistics stats={statsData} />
            <RegulatoryInfo regulatory={regulatoryData} />
            <Results results={resultsData} />
          </View>
        )}
      </View>
    );
  };