import React from 'react';
import './App.css';
import ClinicalTrials from './components/trials/ClinicalTrials'; // Import ClinicalTrials component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ClinSearch</h1> {/* Display app name */}
        <p>
          Search and explore clinical trials with ease.
        </p>
      </header>
      <main>
        <ClinicalTrials /> {/* Use ClinicalTrials component */}
      </main>
    </div>
  );
}

export default App;
