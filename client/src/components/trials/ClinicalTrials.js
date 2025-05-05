import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Bookmark, LogIn, LogOut } from 'lucide-react';
import { auth, db, googleProvider, signInWithPopup, signOut, collection, doc, setDoc, getDocs, query, where } from './firebase';
import './ClinicalTrials.css';

const ClinicalTrials = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trials, setTrials] = useState([]);
  const [savedTrials, setSavedTrials] = useState([]);
  const [recommendedTrials, setRecommendedTrials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    phase: '',
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
    participantAge: { min: '', max: '' },
    enrollmentCount: { min: '', max: '' },
  });

  const filterOptions = {
    status: [
      { label: 'All Statuses', value: '' },
      { label: 'Recruiting', value: 'RECRUITING' },
      { label: 'Not Yet Recruiting', value: 'NOT_YET_RECRUITING' },
      { label: 'Active, not recruiting', value: 'ACTIVE_NOT_RECRUITING' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Enrolling by invitation', value: 'ENROLLING_BY_INVITATION' },
      { label: 'Suspended', value: 'SUSPENDED' },
      { label: 'Terminated', value: 'TERMINATED' },
      { label: 'Withdrawn', value: 'WITHDRAWN' },
    ],
    phase: [
      { label: 'All Phases', value: '' },
      { label: 'Early Phase 1', value: 'EARLY_PHASE1' },
      { label: 'Phase 1', value: 'PHASE1' },
      { label: 'Phase 1/Phase 2', value: 'PHASE1_PHASE2' },
      { label: 'Phase 2', value: 'PHASE2' },
      { label: 'Phase 2/Phase 3', value: 'PHASE2_PHASE3' },
      { label: 'Phase 3', value: 'PHASE3' },
      { label: 'Phase 4', value: 'PHASE4' },
    ],
    studyType: [
      { label: 'All Types', value: '' },
      { label: 'Interventional', value: 'INTERVENTIONAL' },
      { label: 'Observational', value: 'OBSERVATIONAL' },
      { label: 'Patient Registry', value: 'PATIENT_REGISTRY' },
      { label: 'Expanded Access', value: 'EXPANDED_ACCESS' },
    ],
    ageGroup: [
      { label: 'All Ages', value: '' },
      { label: 'Child (0-17)', value: 'CHILD' },
      { label: 'Adult (18-64)', value: 'ADULT' },
      { label: 'Older Adult (65+)', value: 'OLDER_ADULT' },
    ],
    gender: [
      { label: 'All', value: '' },
      { label: 'Male', value: 'MALE' },
      { label: 'Female', value: 'FEMALE' },
      { label: 'All Genders', value: 'ALL' },
    ],
    fundingType: [
      { label: 'All', value: '' },
      { label: 'NIH', value: 'NIH' },
      { label: 'Industry', value: 'INDUSTRY' },
      { label: 'Other U.S. Federal Agency', value: 'FED' },
      { label: 'Other', value: 'OTHER' },
    ],
    interventionType: [
      { label: 'All', value: '' },
      { label: 'Drug', value: 'DRUG' },
      { label: 'Device', value: 'DEVICE' },
      { label: 'Biological', value: 'BIOLOGICAL' },
      { label: 'Procedure', value: 'PROCEDURE' },
      { label: 'Behavioral', value: 'BEHAVIORAL' },
      { label: 'Dietary Supplement', value: 'DIETARY_SUPPLEMENT' },
    ],
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchSavedTrials(currentUser.uid);
        fetchRecommendedTrials(currentUser.uid);
      } else {
        setSavedTrials([]);
        setRecommendedTrials([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSavedTrials = async (uid) => {
    const q = query(collection(db, 'savedTrials'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    const saved = querySnapshot.docs.map(doc => doc.data().trial);
    setSavedTrials(saved);
  };

  const fetchRecommendedTrials = async (uid) => {
    const q = query(collection(db, 'savedTrials'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    const conditions = querySnapshot.docs.map(doc => doc.data().trial.protocolSection?.conditionsModule?.conditions || []).flat();
    if (conditions.length > 0) {
      const response = await fetch(
        `https://clinicaltrials.gov/api/v2/studies?query.cond=${conditions.join('|')}&pageSize=5`
      );
      const data = await response.json();
      setRecommendedTrials(data.studies || []);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const saveTrial = async (trial) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      const trialRef = doc(db, 'savedTrials', `${user.uid}_${trial.protocolSection.identificationModule.nctId}`);
      await setDoc(trialRef, {
        userId: user.uid,
        trial,
        savedAt: new Date().toISOString(),
      });
      fetchSavedTrials(user.uid);
    } catch (error) {
      console.error('Error saving trial:', error);
    }
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const searchTrials = useCallback(async (isRandom = false, retries = 3) => {
    setLoading(true);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const queryParams = new URLSearchParams({
          pageSize: '50',
        });

        if (!isRandom && searchQuery) queryParams.append('query.term', searchQuery);
        if (filters.status) queryParams.append('filter.overallStatus', filters.status);
        if (filters.phase) queryParams.append('filter.phase', filters.phase);
        if (filters.studyType) queryParams.append('filter.studyType', filters.studyType);
        if (filters.gender) queryParams.append('filter.sex', filters.gender);
        if (filters.healthyVolunteers) queryParams.append('filter.healthyVolunteers', 'true');
        if (filters.hasResults) queryParams.append('filter.hasResults', 'true');
        if (filters.fundingType) queryParams.append('filter.sponsorType', filters.fundingType);
        if (filters.interventionType)
          queryParams.append('filter.interventionType', filters.interventionType);
        if (filters.startDate) queryParams.append('filter.startDate', filters.startDate);
        if (filters.completionDate)
          queryParams.append('filter.completionDate', filters.completionDate);
        if (filters.conditions.length)
          queryParams.append('filter.advanced', filters.conditions.map(c => `AREA[Condition]${c}`).join('|'));
        if (filters.locations.length)
          queryParams.append('filter.advanced', filters.locations.map(l => `AREA[LocationCountry]${l}`).join('|'));
        if (filters.ageGroup) {
          if (filters.ageGroup === 'CHILD') {
            queryParams.append('filter.minimumAge', '0');
            queryParams.append('filter.maximumAge', '17');
          } else if (filters.ageGroup === 'ADULT') {
            queryParams.append('filter.minimumAge', '18');
            queryParams.append('filter.maximumAge', '64');
          } else if (filters.ageGroup === 'OLDER_ADULT') {
            queryParams.append('filter.minimumAge', '65');
          }
        }
        if (filters.participantAge.min)
          queryParams.append('filter.minimumAge', filters.participantAge.min);
        if (filters.participantAge.max)
          queryParams.append('filter.maximumAge', filters.participantAge.max);
        if (filters.enrollmentCount.min)
          queryParams.append('filter.enrollmentMin', filters.enrollmentCount.min);
        if (filters.enrollmentCount.max)
          queryParams.append('filter.enrollmentMax', filters.enrollmentCount.max);

        const response = await fetch(
          `https://clinicaltrials.gov/api/v2/studies?${queryParams.toString()}`
        );
        if (!response.ok) {
          if (response.status === 429 && attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const fetchedTrials = data.studies || [];
        setTrials(isRandom ? shuffleArray(fetchedTrials) : fetchedTrials);
        setLoading(false);
        return;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === retries) {
          setTrials([]);
          setLoading(false);
        }
      }
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    const fetchInitialTrials = async () => {
      await searchTrials(true);
      if (trials.length === 0) {
        console.log('No trials found, retrying with default query');
        await searchTrials(false);
      }
    };
    fetchInitialTrials();
  }, [searchTrials, trials.length]);

  const resetFilters = () => {
    setFilters({
      status: '',
      phase: '',
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
      participantAge: { min: '', max: '' },
      enrollmentCount: { min: '', max: '' },
    });
  };

  const TrialListItem = ({ trial, isSaved }) => {
    const protocolSection = trial.protocolSection;
    const nctId = protocolSection?.identificationModule?.nctId || 'N/A';
    const title = protocolSection?.identificationModule?.briefTitle || 'No Title';
    const status = protocolSection?.statusModule?.overallStatus || 'Unknown';
    const phase = protocolSection?.designModule?.phases?.join(', ') || 'N/A';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="trial-list-item"
        onClick={() => navigate(`/trials/${nctId}`)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && navigate(`/trials/${nctId}`)}
        aria-label={`View trial ${title}`}
      >
        <div className="trial-list-content">
          <h3 className="trial-title">{title}</h3>
          <p className="trial-meta nct-id">NCT ID: {nctId}</p>
          <p className="trial-meta status">Status: {status}</p>
          <p className="trial-meta phase">Phase: {phase}</p>
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              saveTrial(trial);
            }}
            aria-label={isSaved ? 'Remove from saved trials' : 'Save trial'}
          >
            <Bookmark size={16} />
          </button>
        </div>
      </motion.div>
    );
  };

  const FilterSidebar = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showFilters ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`filter-sidebar ${showFilters ? 'active' : ''}`}
      aria-hidden={!showFilters}
    >
      <div className="filter-modal">
        <div className="sidebar-header">
          <h3>Filter Trials</h3>
          <button
            className="close-btn"
            onClick={() => setShowFilters(false)}
            aria-label="Close filters"
          >
            <X size={20} color="#1E293B" />
          </button>
        </div>
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="status-filter" className="filter-label">Status</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-input"
            >
              {filterOptions.status.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="phase-filter" className="filter-label">Phase</label>
            <select
              id="phase-filter"
              value={filters.phase}
              onChange={(e) => setFilters({ ...filters, phase: e.target.value })}
              className="filter-input"
            >
              {filterOptions.phase.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="studyType-filter" className="filter-label">Study Type</label>
            <select
              id="studyType-filter"
              value={filters.studyType}
              onChange={(e) => setFilters({ ...filters, studyType: e.target.value })}
              className="filter-input"
            >
              {filterOptions.studyType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="ageGroup-filter" className="filter-label">Age Group</label>
            <select
              id="ageGroup-filter"
              value={filters.ageGroup}
              onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
              className="filter-input"
            >
              {filterOptions.ageGroup.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="gender-filter" className="filter-label">Gender</label>
            <select
              id="gender-filter"
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="filter-input"
            >
              {filterOptions.gender.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="fundingType-filter" className="filter-label">Funding Type</label>
            <select
              id="fundingType-filter"
              value={filters.fundingType}
              onChange={(e) => setFilters({ ...filters, fundingType: e.target.value })}
              className="filter-input"
            >
              {filterOptions.fundingType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="interventionType-filter" className="filter-label">Intervention Type</label>
            <select
              id="interventionType-filter"
              value={filters.interventionType}
              onChange={(e) => setFilters({ ...filters, interventionType: e.target.value })}
              className="filter-input"
            >
              {filterOptions.interventionType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="healthy-volunteers-filter" className="filter-label">
              Healthy Volunteers
            </label>
            <label className="filter-switch">
              <input
                id="healthy-volunteers-filter"
                type="checkbox"
                checked={filters.healthyVolunteers}
                onChange={(e) => setFilters({ ...filters, healthyVolunteers: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="filter-group">
            <label htmlFor="has-results-filter" className="filter-label">
              Has Results
            </label>
            <label className="filter-switch">
              <input
                id="has-results-filter"
                type="checkbox"
                checked={filters.hasResults}
                onChange={(e) => setFilters({ ...filters, hasResults: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="filter-group">
            <label htmlFor="conditions-filter" className="filter-label">Conditions</label>
            <input
              id="conditions-filter"
              type="text"
              placeholder="Enter conditions, comma-separated"
              value={filters.conditions.join(',')}
              onChange={(e) =>
                setFilters({ ...filters, conditions: e.target.value.split(',').map((c) => c.trim()) })
              }
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="locations-filter" className="filter-label">Locations</label>
            <input
              id="locations-filter"
              type="text"
              placeholder="Enter locations, comma-separated"
              value={filters.locations.join(',')}
              onChange={(e) =>
                setFilters({ ...filters, locations: e.target.value.split(',').map((l) => l.trim()) })
              }
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Participant Age Range</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min Age"
                value={filters.participantAge.min}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    participantAge: { ...filters.participantAge, min: e.target.value },
                  })
                }
                className="filter-input"
                aria-label="Minimum age"
              />
              <input
                type="number"
                placeholder="Max Age"
                value={filters.participantAge.max}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    participantAge: { ...filters.participantAge, max: e.target.value },
                  })
                }
                className="filter-input"
                aria-label="Maximum age"
              />
            </div>
          </div>
        </div>
        <div className="sidebar-footer">
          <button
            className="btn btn-secondary"
            onClick={resetFilters}
            aria-label="Reset filters"
          >
            Reset
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              searchTrials();
              setShowFilters(false);
            }}
            aria-label="Apply filters"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );

  const AuthModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showAuthModal ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`filter-sidebar ${showAuthModal ? 'active' : ''}`}
      aria-hidden={!showAuthModal}
    >
      <div className="filter-modal">
        <div className="sidebar-header">
          <h3>Sign In</h3>
          <button
            className="close-btn"
            onClick={() => setShowAuthModal(false)}
            aria-label="Close auth modal"
          >
            <X size={20} color="#1E293B" />
          </button>
        </div>
        <div className="auth-grid">
          <button
            className="btn btn-primary"
            onClick={handleGoogleSignIn}
            aria-label="Sign in with Google"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="clinical-trials-container">
      <header className="search-header">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search clinical trials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchTrials()}
              aria-label="Search clinical trials"
              className="search-input"
            />
          </div>
          <button
            className="btn btn-filter"
            onClick={() => setShowFilters(true)}
            aria-label="Toggle filters"
          >
            <Filter size={16} className="mr-1" /> Filters
          </button>
          <button
            className="btn btn-primary"
            onClick={searchTrials}
            aria-label="Search trials"
          >
            Search
          </button>
          {user ? (
            <button
              className="btn btn-secondary"
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              <LogOut size={16} className="mr-1" /> Sign Out
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setShowAuthModal(true)}
              aria-label="Sign in"
            >
              <LogIn size={16} className="mr-1" /> Sign In
            </button>
          )}
        </div>
      </header>
      <div className="main-content">
        <AnimatePresence>
          {showFilters && <FilterSidebar />}
          {showAuthModal && <AuthModal />}
        </AnimatePresence>
        <main className="trials-content">
          {user && savedTrials.length > 0 && (
            <section className="trials-section">
              <h2 className="section-title">Saved Trials</h2>
              <div className="trials-list">
                {savedTrials.map((trial) => (
                  <TrialListItem
                    key={trial.protocolSection?.identificationModule?.nctId}
                    trial={trial}
                    isSaved={true}
                  />
                ))}
              </div>
            </section>
          )}
          {user && recommendedTrials.length > 0 && (
            <section className="trials-section">
              <h2 className="section-title">Recommended Trials</h2>
              <div className="trials-list">
                {recommendedTrials.map((trial) => (
                  <TrialListItem
                    key={trial.protocolSection?.identificationModule?.nctId}
                    trial={trial}
                    isSaved={savedTrials.some(
                      (saved) => saved.protocolSection?.identificationModule?.nctId === trial.protocolSection?.identificationModule?.nctId
                    )}
                  />
                ))}
              </div>
            </section>
          )}
          <section className="trials-section">
            <h2 className="section-title">Search Results</h2>
            {loading ? (
              <div className="loading-spinner" aria-live="polite">
                <div className="spinner" />
                Loading trials...
              </div>
            ) : trials.length > 0 ? (
              <div className="trials-list">
                {trials.map((trial) => (
                  <TrialListItem
                    key={trial.protocolSection?.identificationModule?.nctId}
                    trial={trial}
                    isSaved={savedTrials.some(
                      (saved) => saved.protocolSection?.identificationModule?.nctId === trial.protocolSection?.identificationModule?.nctId
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results" aria-live="polite">
                No trials found. Try broadening your search criteria or resetting filters.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ClinicalTrials;