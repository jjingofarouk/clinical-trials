import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, googleProvider, doc, setDoc } from './trials/firebase';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cadre, setCadre] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, 'users', result.user.uid), {
        name: result.user.displayName || 'User',
        email: result.user.email,
        cadre: 'General',
        createdAt: new Date().toISOString(),
      }, { merge: true });
      navigate('/trials');
    } catch (err) {
      setError(`Google sign-in failed: ${err.message}`);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth,

 email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          cadre,
          createdAt: new Date().toISOString(),
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/trials');
    } catch (err) {
      setError(`${isSignUp ? 'Sign-up' : 'Sign-in'} failed: ${err.message}`);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-container"
      >
        <h2 className="auth-title">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {error && process.env.REACT_APP_DEBUG_MODE === 'true' && (
          <div className="error-message">
            <AlertCircle size={20} style={{ marginRight: '5px' }} />
            {error}
          </div>
        )}
        <button
          onClick={handleGoogleSignIn}
          className="google-button"
        >
          Sign {isSignUp ? 'Up' : 'In'} with Google
        </button>
        <form onSubmit={handleEmailAuth} className="auth-form">
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cadre" className="form-label">
                  Cadre
                </label>
                <select
                  id="cadre"
                  value={cadre}
                  onChange={(e) => setCadre(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">Select Cadre</option>
                  <option value="Student">Student</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Clinician">Clinician</option>
                  <option value="General">General</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="submit-button"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p className="toggle-auth">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="toggle-button"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
        <button
          onClick={() => navigate('/trials')}
          className="back-button"
        >
          Back to Trials
        </button>
      </motion.div>
    </div>
  );
};

export default AuthPage;