import { Search, Filter, LogIn, LogOut } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut } from './firebase';

const SearchBar = ({ user, searchQuery, setSearchQuery, searchTrials, setShowFilters, setShowAuthModal }) => {
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

  return (
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
  );
};

export default SearchBar;