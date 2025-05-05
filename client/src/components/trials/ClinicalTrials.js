import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { auth, db, collection, doc, setDoc, getDocs, query, where } from './firebase';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import TrialsSection from './TrialsSection';
import './ClinicalTrials.css';

const ClinicalTrials = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trials, setTrials] = useState([]);
  const [savedTrials, setSavedTrials] = useState([]);
  const [recommendedTrials, setRecommendedTrials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: '',
    phase: '',
    studyType: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email)));
        if (!userDoc.empty) {
          setUserData(userDoc.docs[0].data());
        }
        fetchSavedTrials(currentUser.uid);
        fetchRecommendedTrials(currentUser.uid);
      } else {
        setUserData(null);
        setSavedTrials([]);
        setRecommendedTrials([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSavedTrials = async (uid) => {
    try {
      const q = query(collection(db, 'savedTrials'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const saved = querySnapshot.docs.map(doc => doc.data().trial);
      setSavedTrials(saved);
    } catch (err) {
      setError(`Error fetching saved trials: ${err.message}`);
    }
  };

  const fetchRecommendedTrials = async (uid) => {
    try {
      const q = query(collection(db, 'savedTrials'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const conditions = querySnapshot.docs
        .map(doc => doc.data().trial.protocolSection?.conditionsModule?.conditions || [])
        .flat()
        .filter(Boolean);
      if (conditions.length > 0) {
        const response = await fetch(
          `${process.env.REACT_APP_CLINICAL_TRIALS_API}/studies?query.cond=${encodeURIComponent(conditions.join(' OR '))}&pageSize=5&format=json`,
          { headers: { 'Accept': 'application/json' } }
        );
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setRecommendedTrials(data.studies || []);
      }
    } catch (err) {
      setError(`Error fetching recommended trials: ${err.message}`);
    }
  };

  const searchTrials = useCallback(async (isRandom = false, retries = 3) => {
    setLoading(true);
    setError(null);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const queryParams = new URLSearchParams({
          pageSize: '50',
          format: 'json',
        });

        if (!isRandom && searchQuery) {
          queryParams.append('query.term', encodeURIComponent(searchQuery));
        }
        if (filters.status) {
          queryParams.append('filter.overallStatus', filters.status.toUpperCase());
        }
        if (filters.phase) {
          queryParams.append('filter.phase', filters.phase.replace('PHASE_', ''));
        }
        if (filters.studyType) {
          queryParams.append('filter.studyType', filters.studyType.toUpperCase());
        }

        const response = await fetch(
          `${process.env.REACT_APP_CLINICAL_TRIALS_API}/studies?${queryParams.toString()}`,
          { headers: { 'Accept': 'application/json' } }
        );
        if (!response.ok) {
          if (response.status === 429 && attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            continue;
          }
          throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        const fetchedTrials = data.studies || [];
        if (fetchedTrials.length === 0 && !isRandom && searchQuery) {
          setError('No trials found for your search. Try a broader query, e.g., "cancer" or "diabetes".');
        }
        setTrials(isRandom ? shuffleArray(fetchedTrials) : fetchedTrials);
        setLoading(false);
        return;
      } catch (err) {
        if (attempt === retries) {
          setTrials([]);
          setLoading(false);
          setError(`Failed to load trials: ${err.message}. Please check your network or try again later.`);
        }
      }
    }
  }, [searchQuery, filters]);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchInitialTrials = async () => {
      try {
        await searchTrials(true);
        if (trials.length === 0) {
          await searchTrials(false);
        }
      } catch (err) {
        setError(`Error fetching initial trials: ${err.message}`);
      }
    };
    fetchInitialTrials();
  }, [searchTrials]);

  const saveTrial = async (trial) => {
    if (!user) {
      setError('Please sign in to save trials.');
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
    } catch (err) {
      setError(`Error saving trial: ${err.message}`);
    }
  };

  if (error && process.env.REACT_APP_DEBUG_MODE === 'true') {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Error</h1>
        <p>{error}</p>
        {error.includes('sign in') && (
          <NavLink to="/auth" style={{ color: '#3498DB', textDecoration: 'underline' }}>
            Go to Sign In
          </NavLink>
        )}
        <button onClick={() => searchTrials()} style={{ marginTop: '10px' }}>
          Retry Search
        </button>
      </div>
    );
  }

  return (
    <div className="clinical-trials-container">
      {user && userData && (
        <div style={{ padding: '10px', textAlign: 'center', background: '#e6f3ff' }}>
          <p>Welcome, {userData.name}! Explore your saved trials below.</p>
        </div>
      )}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchTrials={searchTrials}
        setShowFilters={setShowFilters}
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