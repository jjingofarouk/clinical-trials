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

// Import all components
import Interventions from './Interventions';
import Locations from './Locations';
import Outcomes from './Outcomes';
import Participants from './Participants';
import RegulatoryInfo from './RegulatoryInfo';
import Results from './Results';
import Statistics from './Statistics';
import StudyDesign from './StudyDesign';
import StudyDetails from './StudyDetails';

const ClinicalTrials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedTrialId, setExpandedTrialId] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
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
  const statusOptions = [
    { label: 'Recruiting', value: 'RECRUITING' },
    { label: 'Not Yet Recruiting', value: 'NOT_YET_RECRUITING' },
    { label: 'Active, not recruiting', value: 'ACTIVE_NOT_RECRUITING' },
    { label: 'Completed', value: 'COMPLETED' }
  ];
  const phaseOptions = [
    { label: 'All Phases', value: '' },
    { label: 'Phase 1', value: 'PHASE1' },
    { label: 'Phase 2', value: 'PHASE2' },
    { label: 'Phase 3', value: 'PHASE3' },
    { label: 'Phase 4', value: 'PHASE4' }
  ];

  const filterOptions = {
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
  const searchTrials = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://clinicaltrials.gov/api/v2/studies?query.term=${searchQuery}&filter.overallStatus=${filters.status}&format=json`
      );
      const data = await response.json();
      setTrials(data.studies || []);
    } catch (error) {
      console.error('Error fetching trials:', error);
    }
    setLoading(false);
  };
  const TrialCard = ({ trial }) => {
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

  const FilterModal = () => (
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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clinical trials..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter" size={20} color={COLORS.text.inverse} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.searchButton}
          onPress={searchTrials}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FilterModal />
      <View style={styles.filtersContainer}>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={trials}
          renderItem={({ item }) => <TrialCard trial={item} />}
          keyExtractor={(item) => item.protocolSection?.identificationModule?.nctId}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No trials found. Try adjusting your search criteria.
            </Text>
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};


// Design system constants
const COLORS = {
  primary: '#0066cc',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    inverse: '#ffffff'
  },
  border: '#eeeeee',
  shadow: '#000000'
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

const RADII = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16
};

const TYPOGRAPHY = {
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700'
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400'
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600'
  }
};

const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  }
};
// Add these new styles to your existing StyleSheet
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.title,
    fontSize: 20,
  },
  filterScroll: {
    maxHeight: '70%',
  },
  filterSection: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterSectionTitle: {
    ...TYPOGRAPHY.button,
    marginBottom: SPACING.md,
  },
  rangeInputContainer: {
    marginVertical: SPACING.md,
  },
  rangeLabel: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
  },
  rangeSeparator: {
    marginHorizontal: SPACING.md,
  },
  checkboxContainer: {
    marginTop: SPACING.md,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  checkboxLabel: {
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADII.md,
    alignItems: 'center',
  },
  resetButton: {
    marginRight: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
  },
  resetButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.primary,
  },
  applyButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.inverse,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADII.md,
    marginHorizontal: SPACING.sm,
  },


    // Existing styles from the original component
    container: {
      flex: 1,
      padding: SPACING.lg,
      backgroundColor: COLORS.background
    },
    title: {
      ...TYPOGRAPHY.title,
      color: COLORS.text.primary,
      marginBottom: SPACING.lg
    },
    searchContainer: {
      flexDirection: 'row',
      marginBottom: SPACING.lg,
      gap: SPACING.sm
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: RADII.md,
      paddingHorizontal: SPACING.md,
      ...SHADOWS.small
    },
    searchIcon: {
      marginRight: SPACING.sm
    },
    searchInput: {
      flex: 1,
      height: 40,
      ...TYPOGRAPHY.body,
      color: COLORS.text.primary
    },
    searchButton: {
      backgroundColor: COLORS.primary,
      borderRadius: RADII.md,
      paddingHorizontal: SPACING.lg,
      justifyContent: 'center',
      minWidth: 80
    },
    searchButtonText: {
      ...TYPOGRAPHY.button,
      color: COLORS.text.inverse
    },
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: RADII.md,
      marginBottom: SPACING.md,
      ...SHADOWS.medium
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.lg
    },
    expandedContent: {
      padding: SPACING.lg,
      borderTopWidth: 1,
      borderTopColor: COLORS.border
    },
    loader: {
      marginTop: SPACING.xxl
    },
    emptyText: {
      ...TYPOGRAPHY.body,
      textAlign: 'center',
      marginTop: SPACING.xxl,
      color: COLORS.text.secondary
    },
    listContainer: {
      paddingBottom: SPACING.lg
    },
    // New styles for the enhanced filter modal
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: COLORS.surface,
      borderTopLeftRadius: RADII.xl,
      borderTopRightRadius: RADII.xl,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    modalTitle: {
      ...TYPOGRAPHY.title,
      fontSize: 20,
    },
    filterScroll: {
      maxHeight: '70%',
    },
    filterSection: {
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    filterSectionTitle: {
      ...TYPOGRAPHY.button,
      marginBottom: SPACING.md,
    },
    rangeInputContainer: {
      marginVertical: SPACING.md,
    },
    rangeLabel: {
      ...TYPOGRAPHY.body,
      marginBottom: SPACING.sm,
    },
    rangeInputs: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rangeInput: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: RADII.md,
      paddingHorizontal: SPACING.md,
    },
    rangeSeparator: {
      marginHorizontal: SPACING.md,
    },
    checkboxContainer: {
      marginTop: SPACING.md,
    },
    checkbox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SPACING.sm,
    },
    checkboxLabel: {
      ...TYPOGRAPHY.body,
      marginLeft: SPACING.sm,
    },
    modalFooter: {
      flexDirection: 'row',
      padding: SPACING.lg,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg, // Account for iOS bottom safe area
    },
    footerButton: {
      flex: 1,
      padding: SPACING.md,
      borderRadius: RADII.md,
      alignItems: 'center',
    },
    resetButton: {
      marginRight: SPACING.sm,
      backgroundColor: COLORS.background,
    },
    applyButton: {
      backgroundColor: COLORS.primary,
    },
    resetButtonText: {
      ...TYPOGRAPHY.button,
      color: COLORS.text.primary,
    },
    applyButtonText: {
      ...TYPOGRAPHY.button,
      color: COLORS.text.inverse,
    },
    filterButton: {
      backgroundColor: COLORS.primary,
      padding: SPACING.md,
      borderRadius: RADII.md,
      marginHorizontal: SPACING.sm,
    },
    activeFilterBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: '#FF4444',
      borderRadius: 10,
      width: 10,
      height: 10,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
      padding: SPACING.md,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.background,
      borderRadius: RADII.xl,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
    },
    chipText: {
      ...TYPOGRAPHY.body,
      fontSize: 14,
      marginRight: SPACING.sm,
    },
    chipRemove: {
      padding: 2,
    }

});

// Enhanced searchTrials function with all filters
const searchTrials = async () => {
  setLoading(true);
  try {
    // Build query parameters based on filters
    const queryParams = new URLSearchParams({
      'query.term': searchQuery,
      'filter.overallStatus': filters.status,
    });

    if (filters.phase) queryParams.append('filter.phase', filters.phase);
    if (filters.studyType) queryParams.append('filter.studyType', filters.studyType);
    if (filters.gender) queryParams.append('filter.sex', filters.gender);
    if (filters.ageGroup) queryParams.append('filter.ageGroup', filters.ageGroup);
    if (filters.healthyVolunteers) queryParams.append('filter.healthyVolunteers', 'true');
    if (filters.hasResults) queryParams.append('filter.hasResults', 'true');
    if (filters.fundingType) queryParams.append('filter.fundingType', filters.fundingType);
    
    // Add enrollment count filter if specified
    if (filters.enrollmentCount.min || filters.enrollmentCount.max) {
      queryParams.append('filter.enrollment.min', filters.enrollmentCount.min || '0');
      if (filters.enrollmentCount.max) {
        queryParams.append('filter.enrollment.max', filters.enrollmentCount.max);
      }
    }

    const response = await fetch(
      `https://clinicaltrials.gov/api/v2/studies?${queryParams.toString()}`
    );
    const data = await response.json();
    setTrials(data.studies || []);
  } catch (error) {
    console.error('Error fetching trials:', error);
    // You might want to add error handling UI here
  }
  setLoading(false);
};

// Helper function to count active filters
const getActiveFilterCount = () => {
  return Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'enrollmentCount') {
      return count + (value.min ? 1 : 0) + (value.max ? 1 : 0);
    }
    return count + (value && value !== '' ? 1 : 0);
  }, 0);
};

export default ClinicalTrials;