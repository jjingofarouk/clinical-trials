import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { googleProvider, signInWithPopup } from './firebase';

const AuthModal = ({ setShowAuthModal }) => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="filter-sidebar active"
      aria-hidden={false}
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
};

export default AuthModal;