import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as jStat from 'jstat';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './ClinicalTrialSimulator.css';

const ClinicalTrialSimulator = () => {
  const location = useLocation();
  const auth = getAuth();
  const db = getFirestore();
  const chartRef = useRef(null);

  // State
  const [sampleSize, setSampleSize] = useState(location.state?.sampleSize || 100);
  const [effectSize, setEffectSize] = useState(location.state?.effectSize || 0.5);
  const [alpha, setAlpha] = useState(0.05);
  const [dropoutRate, setDropoutRate] = useState(0.1);
  const [testType, setTestType] = useState('ttest');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugMessages, setDebugMessages] = useState([]);

  // Load saved results
  useEffect(() => {
    const saved = localStorage.getItem('simulatorResults');
    if (saved) {
      try {
        setResult(JSON.parse(saved));
        setDebugMessages([...debugMessages, 'Loaded saved results from localStorage']);
      } catch (err) {
        setError('Failed to load saved results.');
      }
    }
  }, []);

  // Validation
  const validateInputs = () => {
    setDebugMessages([]);
    setError(null);

    const parsedSampleSize = Number(sampleSize);
    const parsedEffectSize = Number(effectSize);
    const parsedAlpha = Number(alpha);
    const parsedDropoutRate = Number(dropoutRate);

    if (isNaN(parsedSampleSize) || parsedSampleSize < 10 || parsedSampleSize > 10000) {
      setError('Sample size must be a number between 10 and 10,000.');
      return false;
    }
    if (isNaN(parsedEffectSize) || parsedEffectSize < 0 || parsedEffectSize > 2) {
      setError('Effect size must be a number between 0 and 2.');
      return false;
    }
    if (isNaN(parsedAlpha) || parsedAlpha < 0.01 || parsedAlpha > 0.5) {
      setError('Alpha must be a number between 0.01 and 0.5.');
      return false;
    }
    if (isNaN(parsedDropoutRate) || parsedDropoutRate < 0 || parsedDropoutRate > 0.5) {
      setError('Dropout rate must be a number between 0 and 0.5.');
      return false;
    }

    const effectiveSampleSize = Math.floor(parsedSampleSize * (1 - parsedDropoutRate));
    if (effectiveSampleSize < 6) {
      setError('Effective sample size (after dropout) must be at least 6.');
      return false;
    }
    if (testType === 'anova' && effectiveSampleSize < 9) {
      setError('ANOVA requires at least 9 effective samples (3 per group).');
      return false;
    }

    setDebugMessages([...debugMessages, 'Input validation passed']);
    return true;
  };

  // Simulation logic
  const runSimulation = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError(null);
    setDebugMessages([...debugMessages, 'Starting simulation...']);

    try {
      const effectiveSampleSize = Math.floor(Number(sampleSize) * (1 - Number(dropoutRate)));
      const simulations = [];

      if (testType === 'ttest') {
        setDebugMessages([...debugMessages, 'Running t-test simulation']);
        for (let i = 0; i < 50; i++) {
          try {
            if (effectiveSampleSize < 2) throw new Error('Sample size too small for t-test');
            const control = Array.from({ length: effectiveSampleSize }, () =>
              jStat.normal.sample(0, 1)
            );
            const treatment = Array.from({ length: effectiveSampleSize }, () =>
              jStat.normal.sample(Number(effectSize), 1)
            );
            const { p } = jStat.ttest(control, treatment, 2);
            if (isNaN(p) || p === null) throw new Error('Invalid p-value in t-test');
            simulations.push({ p_value: p, significant: p < Number(alpha) });
          } catch (err) {
            setDebugMessages([...debugMessages, `T-test error in iteration ${i}: ${err.message}`]);
            throw new Error(`T-test simulation failed: ${err.message}`);
          }
        }
      } else if (testType === 'anova') {
        setDebugMessages([...debugMessages, 'Running ANOVA simulation']);
        for (let i = 0; i < 50; i++) {
          try {
            const groupSize = Math.floor(effectiveSampleSize / 3);
            if (groupSize < 3) throw new Error('Group size too small for ANOVA');
            const group1 = Array.from({ length: groupSize }, () =>
              jStat.normal.sample(0, 1)
            );
            const group2 = Array.from({ length: groupSize }, () =>
              jStat.normal.sample(Number(effectSize) / 2, 1)
            );
            const group3 = Array.from({ length: groupSize }, () =>
              jStat.normal.sample(Number(effectSize), 1)
            );
            const { p } = jStat.anova([group1, group2, group3]);
            if (isNaN(p) || p === null) throw new Error('Invalid p-value in ANOVA');
            simulations.push({ p_value: p, significant: p < Number(alpha) });
          } catch (err) {
            setDebugMessages([...debugMessages, `ANOVA error in iteration ${i}: ${err.message}`]);
            throw new Error(`ANOVA simulation failed: ${err.message}`);
          }
        }
      }

      setDebugMessages([...debugMessages, 'Calculating power...']);
      let power;
      try {
        power = jStat.ttest.power(Number(effectSize), effectiveSampleSize, Number(alpha), 2);
        if (isNaN(power) || power === null) throw new Error('Invalid power calculation');
      } catch (err) {
        setDebugMessages([...debugMessages, `Power calculation error: ${err.message}`]);
        throw new Error(`Power calculation failed: ${err.message}`);
      }

      const result = {
        power,
        simulations,
        parameters: { sampleSize: Number(sampleSize), effectSize: Number(effectSize), alpha: Number(alpha), dropoutRate: Number(dropoutRate), testType },
      };
      setResult(result);
      setDebugMessages([...debugMessages, 'Simulation completed successfully']);

      // Save to localStorage
      try {
        localStorage.setItem('simulatorResults', JSON.stringify(result));
        setDebugMessages([...debugMessages, 'Saved results to localStorage']);
      } catch (err) {
        setDebugMessages([...debugMessages, `localStorage save error: ${err.message}`]);
      }

      // Save to Firebase if authenticated
      const user = auth.currentUser;
      if (user) {
        setDebugMessages([...debugMessages, 'Attempting to save to Firebase...']);
        try {
          await addDoc(collection(db, 'simulations'), {
            userId: user.uid,
            result,
            timestamp: new Date(),
          });
          setDebugMessages([...debugMessages, 'Successfully saved to Firebase']);
        } catch (err) {
          setDebugMessages([...debugMessages, `Firebase save warning: ${err.message}`]);
          // Do not set error state to avoid marking simulation as failed
        }
      }
    } catch (err) {
      setError(`Simulation failed: ${err.message}`);
      setDebugMessages([...debugMessages, `General error: ${err.message}`]);
    }
    setLoading(false);
  };

  // Export CSV
  const exportCSV = () => {
    if (!result) {
      setError('No results to export.');
      return;
    }
    try {
      const data = result.simulations.map((sim, i) => ({
        Trial: i + 1,
        P_Value: sim.p_value,
        Significant: sim.significant,
      }));
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'simulation_results.csv';
      link.click();
      setDebugMessages([...debugMessages, 'Exported CSV successfully']);
    } catch (err) {
      setError(`CSV export failed: ${err.message}`);
      setDebugMessages([...debugMessages, `CSV export error: ${err.message}`]);
    }
  };

  // Export PNG
  const exportPNG = async () => {
    if (!chartRef.current) {
      setError('No chart available to export.');
      return;
    }
    try {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'simulation_chart.png';
      link.click();
      setDebugMessages([...debugMessages, 'Exported PNG successfully']);
    } catch (err) {
      setError(`PNG export failed: ${err.message}`);
      setDebugMessages([...debugMessages, `PNG export error: ${err.message}`]);
    }
  };

  // Chart data
  const chartData = result ? result.simulations.map((sim, i) => ({
    trial: `Trial ${i + 1}`,
    p_value: sim.p_value,
  })) : [];

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4">Clinical Trial Simulator</h2>
        <Card className="mb-4">
          <Card.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Size</Form.Label>
                    <Form.Control
                      type="number"
                      value={sampleSize}
                      onChange={(e) => setSampleSize(e.target.value)}
                      min="10"
                      max="10000"
                      aria-label="Sample size"
                    />
                    <Form.Range
                      value={sampleSize}
                      onChange={(e) => setSampleSize(e.target.value)}
                      min="10"
                      max="1000"
                      step="10"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Effect Size</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      value={effectSize}
                      onChange={(e) => setEffectSize(e.target.value)}
                      min="0"
                      max="2"
                      aria-label="Effect size"
                    />
                    <Form.Range
                      value={effectSize}
                      onChange={(e) => setEffectSize(e.target.value)}
                      min="0"
                      max="2"
                      step="0.1"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Alpha</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={alpha}
                      onChange={(e) => setAlpha(e.target.value)}
                      min="0.01"
                      max="0.5"
                      aria-label="Alpha"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dropout Rate</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={dropoutRate}
                      onChange={(e) => setDropoutRate(e.target.value)}
                      min="0"
                      max="0.5"
                      aria-label="Dropout rate"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Test Type</Form.Label>
                <Form.Select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  aria-label="Test type"
                >
                  <option value="ttest">Two-Sample T-Test</option>
                  <option value="anova">One-Way ANOVA</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant="primary"
                onClick={runSimulation}
                disabled={loading}
              >
                {loading ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Alert variant="danger">{error}</Alert>
            </motion.div>
          )}
          {debugMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="mb-4">
                <Card.Body>
                  <h4>Debug Log</h4>
                  <ul>
                    {debugMessages.map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </motion.div>
          )}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Card>
                <Card.Body>
                  <h3>Results</h3>
                  <p>Statistical Power: {(result.power * 100).toFixed(2)}%</p>
                  <p>
                    Significant Trials: {result.simulations.filter((sim) => sim.significant).length} /{' '}
                    {result.simulations.length}
                  </p>
                  <Button variant="success" onClick={exportCSV} className="me-2">
                    Export CSV
                  </Button>
                  <Button variant="secondary" onClick={exportPNG}>
                    Export PNG
                  </Button>
                  <div ref={chartRef} className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="trial" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="p_value" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default ClinicalTrialSimulator;