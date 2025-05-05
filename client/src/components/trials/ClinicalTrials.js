import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { auth, db } from './firebase';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import AuthModal from './AuthModal';
import TrialsSection from './TrialsSection';
import './ClinicalTrials.css';

const ClinicalTrials = () => {
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
    const { getDocs, query, collection, where } = await import('./firebase');
    const q = query(collection(db, 'savedTrials'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    const saved = querySnapshot.docs.map(doc => doc.data().trial);
    setSavedTrials(saved);
  };

  const fetchRecommendedTrials = async (uid) => {
    const { getDocs, query, collection, where } = await import('./firebase');
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

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchInitialTrials = async () => {
      await searchTrials(true);
      if (trials.length === 0) {
        await searchTrials(false);
      }
    };
    fetchInitialTrials();
  }, [searchTrials, trials.length]);

  const saveTrial = async (trial) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      const { doc, setDoc } = await import('./firebase');
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

  return (
    <div className="clinical-trials-container">
      <SearchBar
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchTrials={searchTrials}
        setShowFilters={setShowFilters}
        setShowAuthModal={setShowAuthModal}
      />
      <div className="main-content">
        <AnimatePresence>
          {showFilters && (
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              setShowFilters={setShowFilters}
              searchTrials={searchTrials}
            />
          )}
          {showAuthModal && <AuthModal setShowAuthModal={setShowAuthModal} />}
        </AnimatePresence>
        <main className="trials-content">
          {user && savedTrials.length > 0 && (
            <TrialsSection
              title="Saved Trials"
              trials={savedTrials}
              savedTrials={savedTrials}
              saveTrial={saveTrial}
            />
          )}
          {user && recommendedTrials.length > 0 && (
            <TrialsSection
              title="Recommended Trials"
              trials={recommendedTrials}
              savedTrials={savedTrials}
              saveTrial={saveTrial}
            />
          )}
          <TrialsSection
            title="Search Results"
            trials={trials}
            savedTrials={savedTrials}
            saveTrial={saveTrial}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default ClinicalTrials;