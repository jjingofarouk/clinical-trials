import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Dimensions,
  ScrollView, 
  StyleSheet,
  SafeAreaView,
  Modal,
  Platform,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import clinicalTrialsData from './clinicaltrials.json';

const ITEMS_PER_PAGE_OPTIONS = [
  { label: "10 per page", value: 10 },
  { label: "20 per page", value: 20 },
  { label: "30 per page", value: 30 },
  { label: "50 per page", value: 50 },
  { label: "100 per page", value: 100 },
];

const ClinicalTrials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0].value);
  const [filters, setFilters] = useState({
    status: [],
    dateRange: 'all',
    institution: '',
  });

  const filterOptions = {
    status: ['Ongoing', 'Closed Out'],
    dateRanges: ['all', 'past_month', 'past_6_months', 'past_year']
  };

  const applyFilters = (trials) => {
    return trials.filter(trial => {
      const matchesSearch = 
        trial.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trial.Principal_Investigator.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status.length === 0 || 
        filters.status.includes(trial.Status);
      
      const matchesInstitution = !filters.institution || 
        trial.Institution.toLowerCase().includes(filters.institution.toLowerCase());

      const trialDate = new Date(trial.Date_of_Initial_Authorization);
      const now = new Date();
      let matchesDate = true;
      
      if (filters.dateRange === 'past_month') {
        matchesDate = now - trialDate <= 30 * 24 * 60 * 60 * 1000;
      } else if (filters.dateRange === 'past_6_months') {
        matchesDate = now - trialDate <= 180 * 24 * 60 * 60 * 1000;
      } else if (filters.dateRange === 'past_year') {
        matchesDate = now - trialDate <= 365 * 24 * 60 * 60 * 1000;
      }

      return matchesSearch && matchesStatus && matchesInstitution && matchesDate;
    });
  };

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const FilterChip = ({ label, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterChip, selected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PaginationControls = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <View style={styles.paginationContainer}>
        <View style={styles.itemsPerPageContainer}>
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.itemsPerPageButton,
                itemsPerPage === option.value && styles.itemsPerPageButtonSelected
              ]}
              onPress={() => {
                setItemsPerPage(option.value);
                setCurrentPage(1);
              }}
            >
              <Text style={[
                styles.itemsPerPageButtonText,
                itemsPerPage === option.value && styles.itemsPerPageButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.pageControls}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <Icon name="chevron-left" size={24} color={currentPage === 1 ? "#9ca3af" : "#6b7280"} />
          </TouchableOpacity>
          
          <Text style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </Text>
          
          <TouchableOpacity
            style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <Icon name="chevron-right" size={24} color={currentPage === totalPages ? "#9ca3af" : "#6b7280"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ViewModeToggle = () => (
    <View style={styles.viewModeContainer}>
      <TouchableOpacity
        style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonSelected]}
        onPress={() => setViewMode('list')}
      >
        <Icon name="format-list-bulleted" size={24} color={viewMode === 'list' ? "#ffffff" : "#6b7280"} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonSelected]}
        onPress={() => setViewMode('grid')}
      >
        <Icon name="grid" size={24} color={viewMode === 'grid' ? "#ffffff" : "#6b7280"} />
      </TouchableOpacity>
    </View>
  );

const TrialDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={detailModalVisible}
      onRequestClose={() => setDetailModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Trial Details</Text>
            <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            {selectedTrial && (
              <>
                <View style={styles.trialHeader}>
                  <View style={[
                    styles.statusBadge,
                    styles[`status${selectedTrial.Status.replace(/\s+/g, '')}`]
                  ]}>
                    <Text style={[
                      styles.statusText,
                      styles[`statusText${selectedTrial.Status.replace(/\s+/g, '')}`]
                    ]}>
                      {selectedTrial.Status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.trialTitle}>{selectedTrial.Title}</Text>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>CTA Number</Text>
                  <Text style={styles.detailText}>{selectedTrial.CTA}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Principal Investigator</Text>
                  <View style={styles.infoRow}>
                    <Icon name="account" size={20} color="#6b7280" />
                    <Text style={styles.infoText}>{selectedTrial.Principal_Investigator}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Institution</Text>
                  <View style={styles.infoRow}>
                    <Icon name="hospital-building" size={20} color="#6b7280" />
                    <Text style={styles.infoText}>{selectedTrial.Institution}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Sponsor</Text>
                  <Text style={styles.detailText}>{selectedTrial.Sponsor || 'Not specified'}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Date of Initial Authorization</Text>
                  <Text style={styles.detailText}>{selectedTrial.Date_of_Initial_Authorization}</Text>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const FilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Advanced Filters</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            {/* Status Filter Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Trial Status</Text>
              <View style={styles.filterChipsContainer}>
                {filterOptions.status.map((status) => (
                  <FilterChip
                    key={status}
                    label={status}
                    selected={filters.status.includes(status)}
                    onPress={() => {
                      const updated = filters.status.includes(status)
                        ? filters.status.filter(s => s !== status)
                        : [...filters.status, status];
                      setFilters({...filters, status: updated});
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Institution Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Institution</Text>
              <TextInput
                style={styles.locationInput}
                placeholder="Enter institution name"
                value={filters.institution}
                onChangeText={(text) => setFilters({...filters, institution: text})}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Date Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                {[
                  { label: 'All Time', value: 'all' },
                  { label: 'Past Month', value: 'past_month' },
                  { label: 'Past 6 Months', value: 'past_6_months' },
                  { label: 'Past Year', value: 'past_year' }
                ].map((range) => (
                  <TouchableOpacity
                    key={range.value}
                    style={[
                      styles.dateRangeButton,
                      filters.dateRange === range.value && styles.dateRangeButtonSelected
                    ]}
                    onPress={() => setFilters({...filters, dateRange: range.value})}
                  >
                    <Text style={[
                      styles.dateRangeButtonText,
                      filters.dateRange === range.value && styles.dateRangeButtonTextSelected
                    ]}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setFilters({
                status: [],
                dateRange: 'all',
                institution: '',
              })}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );


  const TrialCard = ({ trial }) => (
    <TouchableOpacity
      style={[styles.trialCard, viewMode === 'grid' ? styles.gridItem : styles.listItem]}
      onPress={() => {
        setSelectedTrial(trial);
        setDetailModalVisible(true);
      }}
    >
      <View style={styles.trialCardHeader}>
        <View style={[
          styles.statusBadge,
          styles[`status${trial.Status.replace(/\s+/g, '')}`]
        ]}>
          <Text style={[
            styles.statusText,
            styles[`statusText${trial.Status.replace(/\s+/g, '')}`]
          ]}>
            {trial.Status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.trialTitle}>{trial.Title}</Text>
      
      <View style={styles.trialInfo}>
        <View style={styles.infoRow}>
          <Icon name="account" size={16} color="#6b7280" />
          <Text style={styles.infoText}>{trial.Principal_Investigator}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="hospital-building" size={16} color="#6b7280" />
          <Text style={styles.infoText}>{trial.Institution}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar" size={16} color="#6b7280" />
          <Text style={styles.infoText}>{trial.Date_of_Initial_Authorization}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredTrials = applyFilters(clinicalTrialsData);
  const paginatedTrials = getPaginatedData(filteredTrials);

 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchAndFiltersContainer}>
          <View style={styles.searchWrapper}>
            <Icon name="magnify" size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search trials..."
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                setCurrentPage(1);
              }}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="filter-variant" size={20} color="#6b7280" />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>

          <View style={styles.viewModeContainer}>
            <TouchableOpacity
              style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonSelected]}
              onPress={() => setViewMode('list')}
            >
              <Icon name="format-list-bulleted" size={20} color={viewMode === 'list' ? "#ffffff" : "#6b7280"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonSelected]}
              onPress={() => setViewMode('grid')}
            >
              <Icon name="grid" size={20} color={viewMode === 'grid' ? "#ffffff" : "#6b7280"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {filteredTrials.length} {filteredTrials.length === 1 ? 'trial' : 'trials'} found
          </Text>
          <View style={styles.paginationInfo}>
            <Text style={styles.paginationText}>
              Page {currentPage} of {Math.ceil(filteredTrials.length / itemsPerPage)}
            </Text>
            <View style={styles.paginationControls}>
              <TouchableOpacity
                style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <Icon name="chevron-left" size={20} color={currentPage === 1 ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === Math.ceil(filteredTrials.length / itemsPerPage) && styles.pageButtonDisabled
                ]}
                onPress={() => setCurrentPage(Math.min(Math.ceil(filteredTrials.length / itemsPerPage), currentPage + 1))}
                disabled={currentPage === Math.ceil(filteredTrials.length / itemsPerPage)}
              >
                <Icon name="chevron-right" size={20} color={currentPage === Math.ceil(filteredTrials.length / itemsPerPage) ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        <ScrollView style={styles.trialsList}>
          <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
            {paginatedTrials.map((trial) => (
              <TrialCard key={trial.CTA} trial={trial} />
            ))}
          </View>
        </ScrollView>
      )}

      <FilterModal />
      <TrialDetailModal />
    </SafeAreaView>
  );
};

const colors = {
  // Primary brand colors
  primary: '#2563eb',        // Rich blue - main brand color
  primaryLight: '#3b82f6',   // Lighter blue for interactive elements
  primaryDark: '#1d4ed8',    // Darker blue for pressed states
  
  // Status colors
  success: '#059669',        // Emerald green for "Ongoing" status
  successLight: '#dcfce7',   // Light green background
  closed: '#dc2626',         // Red for "Closed" status
  closedLight: '#fee2e2',    // Light red background
  
  // Neutral palette
  background: '#f8fafc',     // Very light blue-grey
  surface: '#ffffff',        // Pure white for cards
  textPrimary: '#1e293b',    // Dark blue-grey for primary text
  textSecondary: '#475569',  // Medium blue-grey for secondary text
  border: '#e2e8f0',         // Light grey for borders
  divider: '#f1f5f9',        // Subtle divider color
  
  // Interactive states
  hover: '#eff6ff',          // Light blue hover state
  pressed: '#dbeafe',        // Slightly darker blue pressed state
  disabled: '#94a3b8',       // Muted grey for disabled states
};

const shadow = Platform.select({
  ios: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 3,
  },
});

const windowWidth = Dimensions.get('window').width;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  searchAndFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#1f2937',
    fontSize: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  filterButtonText: {
    marginLeft: 4,
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  viewModeContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  viewModeButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginLeft: 4,
  },
  viewModeButtonSelected: {
    backgroundColor: '#3b82f6',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsText: {
    color: '#6b7280',
    fontSize: 14,
  },
  paginationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationText: {
    color: '#6b7280',
    fontSize: 14,
    marginRight: 8,
  },
  paginationControls: {
    flexDirection: 'row',
  },
  pageButton: {
    padding: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    marginLeft: 4,
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  trialsList: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  listContainer: {
    padding: 8,
  },
  trialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gridItem: {
    width: '48%',
    margin: '1%',
  },
  listItem: {
    marginBottom: 12,
    width: '100%',
  },
  trialCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusOngoing: {
    backgroundColor: '#dcfce7',
  },
  statusClosedOut: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextOngoing: {
    color: '#166534',
  },
  statusTextClosedOut: {
    color: '#991b1b',
  },
  trialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 24,
  },
  trialInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalScroll: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  filterChipSelected: {
    backgroundColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#4b5563',
  },
  filterChipTextSelected: {
    color: '#ffffff',
  },
  locationInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  dateRangeButtonSelected: {
    backgroundColor: '#3b82f6',
  },
  dateRangeButtonText: {
    fontSize: 14,
    color: '#4b5563',
  },
  dateRangeButtonTextSelected: {
    color: '#ffffff',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default ClinicalTrials;

