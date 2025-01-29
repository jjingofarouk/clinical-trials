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
 import Interventions from './Interventions';
 import Locations from './Locations';
 import Outcomes from './Outcomes';
 import Participants from './Participants';
 import RegulatoryInfo from './RegulatoryInfo';
 import Results from './Results';
 import Statistics from './Statistics';
 import StudyDesign from './StudyDesign';
 import StudyDetails from './StudyDetails';

 
export   const filterOptions = {
    status: [
      { label: 'Recruiting', value: 'RECRUITING' },
      { label: 'Not Yet Recruiting', value: 'NOT_YET_RECRUITING' },
      { label: 'Active, not recruiting', value: 'ACTIVE_NOT_RECRUITING' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Enrolling by invitation', value: 'ENROLLING_BY_INVITATION' },
      { label: 'Suspended', value: 'SUSPENDED' },
      { label: 'Terminated', value: 'TERMINATED' },
      { label: 'Withdrawn', value: 'WITHDRAWN' }
    ],
    phase: [
      { label: 'All Phases', value: '' },
      { label: 'Early Phase 1', value: 'EARLY_PHASE1' },
      { label: 'Phase 1', value: 'PHASE1' },
      { label: 'Phase 1/Phase 2', value: 'PHASE1_PHASE2' },
      { label: 'Phase 2', value: 'PHASE2' },
      { label: 'Phase 2/Phase 3', value: 'PHASE2_PHASE3' },
      { label: 'Phase 3', value: 'PHASE3' },
      { label: 'Phase 4', value: 'PHASE4' }
    ],
    studyType: [
      { label: 'All Types', value: '' },
      { label: 'Interventional', value: 'INTERVENTIONAL' },
      { label: 'Observational', value: 'OBSERVATIONAL' },
      { label: 'Patient Registry', value: 'PATIENT_REGISTRY' },
      { label: 'Expanded Access', value: 'EXPANDED_ACCESS' }
    ],
    ageGroup: [
      { label: 'All Ages', value: '' },
      { label: 'Child (0-17)', value: 'CHILD' },
      { label: 'Adult (18-64)', value: 'ADULT' },
      { label: 'Older Adult (65+)', value: 'OLDER_ADULT' }
    ],
    gender: [
      { label: 'All', value: '' },
      { label: 'Male', value: 'MALE' },
      { label: 'Female', value: 'FEMALE' },
      { label: 'All Genders', value: 'ALL' }
    ],
    fundingType: [
      { label: 'All', value: '' },
      { label: 'NIH', value: 'NIH' },
      { label: 'Industry', value: 'INDUSTRY' },
      { label: 'Other U.S. Federal Agency', value: 'OTHER_US_FED' },
      { label: 'Academic/University', value: 'ACADEMIC' }
    ],
    interventionType: [
      { label: 'All', value: '' },
      { label: 'Drug', value: 'DRUG' },
      { label: 'Device', value: 'DEVICE' },
      { label: 'Biological', value: 'BIOLOGICAL' },
      { label: 'Procedure', value: 'PROCEDURE' },
      { label: 'Behavioral', value: 'BEHAVIORAL' },
      { label: 'Dietary Supplement', value: 'DIETARY_SUPPLEMENT' }
    ]
  };

 export  const FilterModal = () => (
    
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <BlurView intensity={90} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Advanced Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="x" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScroll}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Basic Information</Text>
              <CustomSelect
                label="Status"
                options={filterOptions.status}
                value={filters.status}
                onSelect={(option) => setFilters({...filters, status: option.value})}
              />
              <CustomSelect
                label="Phase"
                options={filterOptions.phase}
                value={filters.phase}
                onSelect={(option) => setFilters({...filters, phase: option.value})}
              />
              <CustomSelect
                label="Study Type"
                options={filterOptions.studyType}
                value={filters.studyType}
                onSelect={(option) => setFilters({...filters, studyType: option.value})}
              />
              <View style={styles.distanceContainer}>
                <Icon name="map-pin" size={20} color="#666" />
                <TextInput
                  style={styles.distanceInput}
                  placeholder="Distance (miles)"
                  value={filters.distance}
                  onChangeText={(value) => setFilters({...filters, distance: value})}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Participant Criteria</Text>
              <CustomSelect
                label="Age Group"
                options={filterOptions.ageGroup}
                value={filters.ageGroup}
                onSelect={(option) => setFilters({...filters, ageGroup: option.value})}
              />
              <CustomSelect
                label="Gender"
                options={filterOptions.gender}
                value={filters.gender}
                onSelect={(option) => setFilters({...filters, gender: option.value})}
              />
              <View style={styles.rangeInputContainer}>
                <Text style={styles.rangeLabel}>Enrollment Count</Text>
                <View style={styles.rangeInputs}>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Min"
                    value={filters.enrollmentCount.min}
                    onChangeText={(value) => setFilters({
                      ...filters,
                      enrollmentCount: { ...filters.enrollmentCount, min: value }
                    })}
                    keyboardType="numeric"
                  />
                  <Text style={styles.rangeSeparator}>-</Text>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Max"
                    value={filters.enrollmentCount.max}
                    onChangeText={(value) => setFilters({
                      ...filters,
                      enrollmentCount: { ...filters.enrollmentCount, max: value }
                    })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Study Details</Text>
              <CustomSelect
                label="Funding Type"
                options={filterOptions.fundingType}
                value={filters.fundingType}
                onSelect={(option) => setFilters({...filters, fundingType: option.value})}
              />
              <CustomSelect
                label="Intervention Type"
                options={filterOptions.interventionType}
                value={filters.interventionType}
                onSelect={(option) => setFilters({...filters, interventionType: option.value})}
              />
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setFilters({...filters, hasResults: !filters.hasResults})}
                >
                  <Icon
                    name={filters.hasResults ? "check-square" : "square"}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.checkboxLabel}>Has Results</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setFilters({...filters, healthyVolunteers: !filters.healthyVolunteers})}
                >
                  <Icon
                    name={filters.healthyVolunteers ? "check-square" : "square"}
                    size={20}
                    color={COLORS.primary}
                  />
<Text style={styles.checkboxLabel}>Healthy Volunteers</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.resetButton]}
              onPress={() => {
                setFilters({
                  status: 'RECRUITING',
                  phase: '',
                  distance: '',
                  ageGroup: '',
                  gender: '',
                  healthyVolunteers: false,
                  studyType: '',
                  fundingType: '',
                  interventionType: '',
                  conditions: [],
                  locations: [],
                  startDate: '',
                  completionDate: '',
                  hasResults: false,
                  sponsorType: '',
                  participantAge: { min: '', max: '' },
                  enrollmentCount: { min: '', max: '' },
                });
              }}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, styles.applyButton]}
              onPress={() => {
                searchTrials();
                setShowFilters(false);
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );