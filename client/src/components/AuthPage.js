import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, googleProvider } from './trials/firebase';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/trials');
    } catch (err) {
      setError(`Google sign-in failed: ${err.message}`);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/trials');
    } catch (err) {
      setError(`${isSignUp ? 'Sign-up' : 'Sign-in'} failed: ${err.message}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      {error && process.env.REACT_APP_DEBUG_MODE === 'true' && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
          <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          {error}
        </div>
      )}
      <button
        onClick={handleGoogleSignIn}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Sign {isSignUp ? 'Up' : 'In'} with Google
      </button>
      <form onSubmit={handleEmailAuth}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#FF8C00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ background: 'none', border: 'none', color: '#3498DB', cursor: 'pointer' }}
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
      <button
        onClick={() => navigate('/trials')}
        style={{
          width: '100%',
          padding: '10px',
          background: 'none',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginTop: '10px',
          cursor: 'pointer',
        }}
      >
        Back to Trials
      </button>
    </motion.div>
  );
};

export default AuthPage;