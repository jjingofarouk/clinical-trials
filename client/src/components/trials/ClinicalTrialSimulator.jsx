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

  // Load saved results
  useEffect(() => {
    const saved = localStorage.getItem('simulatorResults');
    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  // Validation
  const validateInputs = () => {
    if (sampleSize < 10 || sampleSize > 10000) {
      setError('Sample size must be between 10 and 10,000.');
      return false;
    }
    if (effectSize < 0 || effectSize > 2) {
      setError('Effect size must be between 0 and 2.');
      return false;
    }
    if (alpha < 0.01 || alpha > 0.5) {
      setError('Alpha must be between 0.01 and 0.5.');
      return false;
    }
    if (dropoutRate < 0 || dropoutRate > 0.5) {
      setError('Dropout rate must be between 0 and 0.5.');
      return false;
    }
    return true;
  };

  // Simulation logic
  const runSimulation = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError(null);
    try {
      const effectiveSampleSize = Math.floor(sampleSize * (1 - dropoutRate));
      const simulations = [];

      if (testType === 'ttest') {
        for (let i = 0; i < 50; i++) {
          const control = jStat.normal.sample(effectiveSampleSize, 0, 1);
          const treatment = jStat.normal.sample(effectiveSampleSize, effectSize, 1);
          const { p } = jStat.ttest(control, treatment, 2);
          simulations.push({ p_value: p, significant: p < alpha });
        }
      } else if (testType === 'anova') {
        for (let i = 0; i < 50; i++) {
          const group1 = jStat.normal.sample(effectiveSampleSize / 3, 0, 1);
          const group2 = jStat.normal.sample(effectiveSampleSize / 3, effectSize / 2, 1);
          const group3 = jStat.normal.sample(effectiveSampleSize / 3, effectSize, 1);
          const { p } = jStat.anova([group1, group2, group3]);
          simulations.push({ p_value: p, significant: p < alpha });
        }
      }

      const power = jStat.ttest.power(effectSize, effectiveSampleSize, alpha, 2);

      const result = {
        power,
        simulations,
        parameters: { sampleSize, effectSize, alpha, dropoutRate, testType },
      };
      setResult(result);

      // Save to localStorage
      localStorage.setItem('simulatorResults', JSON.stringify(result));

      // Save to Firebase if authenticated
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'simulations'), {
          userId: user.uid,
          result,
          timestamp: new Date(),
        });
      }
    } catch (err) {
      setError('Simulation failed. Please try again.');
    }
    setLoading(false);
  };

  // Export CSV
  const exportCSV = () => {
    if (!result) return;
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
  };

  // Export PNG
  const exportPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'simulation_chart.png';
      link.click();
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
                      onChange={(e) => setSampleSize(Number(e.target.value))}
                      min="10"
                      max="10000"
                      aria-label="Sample size"
                    />
                    <Form.Range
                      value={sampleSize}
                      onChange={(e) => setSampleSize(Number(e.target.value))}
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
                      onChange={(e) => setEffectSize(Number(e.target.value))}
                      min="0"
                      max="2"
                      aria-label="Effect size"
                    />
                    <Form.Range
                      value={effectSize}
                      onChange={(e) => setEffectSize(Number(e.target.value))}
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
                      onChange={(e) => setAlpha(Number(e.target.value))}
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
                      onChange={(e) => setDropoutRate(Number(e.target.value))}
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