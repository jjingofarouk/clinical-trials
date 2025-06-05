import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { NavLink, Routes, Route } from 'react-router-dom';
import { auth, db, collection, doc, setDoc, getDocs, query, where } from './firebase';
import { Container, Box, Typography, Button, Skeleton, Alert } from '@mui/material';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import TrialsSection from './TrialsSection';
import TrialRecommender from './TrialRecommender';
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
        try {
          const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email)));
          if (!userDoc.empty) {
            setUserData(userDoc.docs[0].data());
          } else {
            setUserData(null);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUserData(null);
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
      console.error('Saved trials error:', err);
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
          throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setRecommendedTrials(Array.isArray(data.studies) ? data.studies : []);
      }
    } catch (err) {
      setError(`Error fetching recommended trials: ${err.message}`);
      console.error('Recommended trials error:', err);
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

        console.log('Fetching trials with URL:', `${process.env.REACT_APP_CLINICAL_TRIALS_API}/studies?${queryParams.toString()}`);
        let response = await fetch(
          `${process.env.REACT_APP_CLINICAL_TRIALS_API}/studies?${queryParams.toString()}`,
          { headers: { 'Accept': 'application/json' } }
        );
        if (!response.ok) {
          if (response.status === 429 && attempt < retries) {
            console.warn(`Rate limit hit, retrying after ${1000 * Math.pow(2, attempt)}ms`);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            continue;
          }
          console.log('Primary query failed, attempting fallback');
          const fallbackParams = new URLSearchParams({
            pageSize: '50',
            format: 'json',
          });
          response = await fetch(
            `${process.env.REACT_APP_CLINICAL_TRIALS_API}/studies?${fallbackParams.toString()}`,
            { headers: { 'Accept': 'application/json' } }
          );
          if (!response.ok) {
            throw new Error(`Fallback query failed: HTTP ${response.status} - ${response.statusText}`);
          }
        }
        const data = await response.json();
        console.log('API response:', data);
        const fetchedTrials = Array.isArray(data.studies) ? data.studies : [];
        if (fetchedTrials.length === 0 && !isRandom && searchQuery) {
          setError('No trials found. Try a broader query, e.g., "cancer" or "diabetes".');
          console.warn('No trials returned for query:', searchQuery);
        }
        setTrials(isRandom ? shuffleArray(fetchedTrials) : fetchedTrials);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Trial fetch error (attempt', attempt, '):', err);
        if (attempt === retries) {
          setTrials([]);
          setLoading(false);
          setError(`Failed to load trials: ${err.message}. Check your network or try again.`);
        }
      }
    }
  }, [searchQuery, filters]);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    searchTrials(true);
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
      console.error('Save trial error:', err);
    }
  };

  if (error && process.env.REACT_APP_DEBUG_MODE === 'true') {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" gutterBottom>
          {error}
        </Typography>
        {error.includes('sign in') && (
          <NavLink to="/auth">
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Go to Sign In
            </Button>
          </NavLink>
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => searchTrials()}
          sx={{ mt: 2, ml: 2 }}
        >
          Retry Search
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {user && userData && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Welcome, {userData.name}! Explore your saved trials or{' '}
          <NavLink to="/trials/recommender">
            <Typography component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
              try the Trial Recommender
            </Typography>
          </NavLink>.
        </Alert>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchTrials={searchTrials}
                setShowFilters={setShowFilters}
              />
              <Box sx={{ display: 'flex', mt: 3 }}>
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
                <Box sx={{ flex: 1, ml: { xs: 0, md: showFilters ? 2 : 0 } }}>
                  {loading ? (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                      ))}
                    </Box>
                  ) : (
                    <>
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
                    </>
                  )}
                </Box>
              </Box>
            </>
          }
        />
        <Route path="/recommender" element={<TrialRecommender user={user} />} />
      </Routes>
    </Container>
  );
};

export default ClinicalTrials;