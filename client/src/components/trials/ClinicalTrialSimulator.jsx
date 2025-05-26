import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './ClinicalTrialSimulator.css';

const ClinicalTrialSimulator = () => {
  const location = useLocation();
  const chartRef = useRef(null);

  const PLOT_RANGE_DELTA = 10;
  const GROUPS = ['Control', 'Treatment 1', 'Treatment 2'];
  const SAMPLE_MIN = 50;
  const SAMPLE_MAX = 10000;
  const SAMPLE_START = 500;
  const SAMPLE_STEP = 10;
  const EFFECT_MIN = 0;
  const EFFECT_MAX = 50;
  const EFFECT_START = 10;
  const EFFECT_STEP = 0.5;
  const INTERIM_LOOKS_MIN = 1;
  const INTERIM_LOOKS_MAX = 5;
  const INTERIM_LOOKS_START = 2;
  const FUTILITY_THRESHOLD_MIN = 0;
  const FUTILITY_THRESHOLD_MAX = 0.5;
  const FUTILITY_THRESHOLD_START = 0.1;
  const FUTILITY_THRESHOLD_STEP = 0.01;
  const CI_MIN = 80;
  const CI_MAX = 99;
  const CI_START = 95;
  const CI_STEP = 0.5;
  const SIMULATIONS_MIN = 100;
  const SIMULATIONS_MAX = 2000;
  const SIMULATIONS_START = 1000;

  const [sampleSize, setSampleSize] = useState(SAMPLE_START);
  const [controlEffect, setControlEffect] = useState(EFFECT_START);
  const [treatment1Effect, setTreatment1Effect] = useState(EFFECT_START + 2);
  const [treatment2Effect, setTreatment2Effect] = useState(EFFECT_START + 4);
  const [interimLooks, setInterimLooks] = useState(INTERIM_LOOKS_START);
  const [futilityThreshold, setFutilityThreshold] = useState(FUTILITY_THRESHOLD_START);
  const [confidenceLevel, setConfidenceLevel] = useState(CI_START);
  const [numSimulations, setNumSimulations] = useState(SIMULATIONS_START);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('simulatorResults');
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (err) {
        setError('Failed to load saved results.');
      }
    }
  }, []);

  const generateBinomialSample = (n, p) => {
    let successes = 0;
    for (let i = 0; i < n; i++) {
      if (Math.random() < p) successes++;
    }
    return successes;
  };

  const betaMean = (alpha, beta) => {
    return alpha / (alpha + beta);
  };

  const normalInv = (p, mean = 0, std = 1) => {
    const a = [0.31938153, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
    const t = Math.sqrt(-2 * Math.log(p > 0.5 ? 1 - p : p));
    let x = t - (a[0] + a[1] * t + a[2] * t ** 2 + a[3] * t ** 3 + a[4] * t ** 4) / (1 + a[0] * t + a[1] * t ** 2 + a[2] * t ** 3 + a[3] * t ** 4 + a[4] * t ** 5);
    if (p > 0.5) x = -x;
    return mean + std * x;
  };

  const validateInputs = () => {
    setError(null);
    const parsedSampleSize = parseFloat(sampleSize);
    const parsedControlEffect = parseFloat(controlEffect);
    const parsedTreatment1Effect = parseFloat(treatment1Effect);
    const parsedTreatment2Effect = parseFloat(treatment2Effect);
    const parsedInterimLooks = parseInt(interimLooks, 10);
    const parsedFutilityThreshold = parseFloat(futilityThreshold);
    const parsedConfidenceLevel = parseFloat(confidenceLevel);
    const parsedNumSimulations = parseInt(numSimulations, 10);

    if (isNaN(parsedSampleSize) || parsedSampleSize < SAMPLE_MIN || parsedSampleSize > SAMPLE_MAX) {
      setError(`Sample size per arm must be between ${SAMPLE_MIN} and ${SAMPLE_MAX}.`);
      return false;
    }
    if (isNaN(parsedControlEffect) || parsedControlEffect < EFFECT_MIN || parsedControlEffect > EFFECT_MAX) {
      setError(`Control effect (%) must be between ${EFFECT_MIN} and ${EFFECT_MAX}.`);
      return false;
    }
    if (isNaN(parsedTreatment1Effect) || parsedTreatment1Effect < EFFECT_MIN || parsedTreatment1Effect > EFFECT_MAX) {
      setError(`Treatment 1 effect (%) must be between ${EFFECT_MIN} and ${EFFECT_MAX}.`);
      return false;
    }
    if (isNaN(parsedTreatment2Effect) || parsedTreatment2Effect < EFFECT_MIN || parsedTreatment2Effect > EFFECT_MAX) {
      setError(`Treatment 2 effect (%) must be between ${EFFECT_MIN} and ${EFFECT_MAX}.`);
      return false;
    }
    if (isNaN(parsedInterimLooks) || parsedInterimLooks < INTERIM_LOOKS_MIN || parsedInterimLooks > INTERIM_LOOKS_MAX) {
      setError(`Number of interim looks must be between ${INTERIM_LOOKS_MIN} and ${INTERIM_LOOKS_MAX}.`);
      return false;
    }
    if (isNaN(parsedFutilityThreshold) || parsedFutilityThreshold < FUTILITY_THRESHOLD_MIN || parsedFutilityThreshold > FUTILITY_THRESHOLD_MAX) {
      setError(`Futility threshold must be between ${FUTILITY_THRESHOLD_MIN} and ${FUTILITY_THRESHOLD_MAX}.`);
      return false;
    }
    if (isNaN(parsedConfidenceLevel) || parsedConfidenceLevel < CI_MIN || parsedConfidenceLevel > CI_MAX) {
      setError(`Confidence level must be between ${CI_MIN} and ${CI_MAX}%.`);
      return false;
    }
    if (isNaN(parsedNumSimulations) || parsedNumSimulations < SIMULATIONS_MIN || parsedNumSimulations > SIMULATIONS_MAX) {
      setError(`Number of simulations must be between ${SIMULATIONS_MIN} and ${SIMULATIONS_MAX}.`);
      return false;
    }
    return true;
  };

  const computePosteriorProbability = (successes, trials, priorAlpha = 1, priorBeta = 1) => {
    const posteriorAlpha = priorAlpha + successes;
    const posteriorBeta = priorBeta + trials - successes;
    return betaMean(posteriorAlpha, posteriorBeta);
  };

  const simulateTrial = (sampleSize, controlEffect, treatmentEffects, interimLooks, futilityThreshold, confidenceLevel) => {
    const interimSample = Math.floor(sampleSize / interimLooks);
    const results = { control: [], treatment1: [], treatment2: [], stoppedEarly: false, reason: null };
    let activeArms = [true, true, true];
    let currentSample = 0;

    for (let i = 0; i < interimLooks; i++) {
      currentSample += interimSample;
      if (currentSample > sampleSize) currentSample = sampleSize;

      const controlSuccesses = activeArms[0] ? generateBinomialSample(currentSample, controlEffect / 100) : 0;
      const treatment1Successes = activeArms[1] ? generateBinomialSample(currentSample, treatmentEffects[0] / 100) : 0;
      const treatment2Successes = activeArms[2] ? generateBinomialSample(currentSample, treatmentEffects[1] / 100) : 0;

      const controlProb = activeArms[0] ? computePosteriorProbability(controlSuccesses, currentSample) : 0;
      const treatment1Prob = activeArms[1] ? computePosteriorProbability(treatment1Successes, currentSample) : 0;
      const treatment2Prob = activeArms[2] ? computePosteriorProbability(treatment2Successes, currentSample) : 0;

      results.control.push(controlProb * 100);
      results.treatment1.push(treatment1Prob * 100);
      results.treatment2.push(treatment2Prob * 100);

      if (activeArms[1] && treatment1Prob < controlProb + futilityThreshold) {
        activeArms[1] = false;
        results.reason = `Treatment 1 dropped at look ${i + 1} (futility)`;
      }
      if (activeArms[2] && treatment2Prob < controlProb + futilityThreshold) {
        activeArms[2] = false;
        results.reason = `Treatment 2 dropped at look ${i + 1} (futility)`;
      }

      const zValue = normalInv(1 - confidenceLevel / 100 / 2);
      if (activeArms[1]) {
        const diff = treatment1Prob - controlProb;
        const se = Math.sqrt((treatment1Prob * (1 - treatment1Prob)) / currentSample + (controlProb * (1 - controlProb)) / currentSample);
        if (diff > zValue * se) {
          results.stoppedEarly = true;
          results.reason = `Stopped at look ${i + 1} (Treatment 1 superior)`;
          break;
        }
      }
      if (activeArms[2]) {
        const diff = treatment2Prob - controlProb;
        const se = Math.sqrt((treatment2Prob * (1 - treatment2Prob)) / currentSample + (controlProb * (1 - controlProb)) / currentSample);
        if (diff > zValue * se) {
          results.stoppedEarly = true;
          results.reason = `Stopped at look ${i + 1} (Treatment 2 superior)`;
          break;
        }
      }

      if (!activeArms[1] && !activeArms[2]) {
        results.stoppedEarly = true;
        results.reason = `Stopped at look ${i + 1} (all treatments dropped)`;
        break;
      }
    }

    return { ...results, finalSampleSize: currentSample };
  };

  const runSimulation = async () => {
    try {
      if (!validateInputs()) return;
      setLoading(true);
      setError(null);

      if (!auth || !db) {
        setError('Firebase is not properly initialized.');
        return;
      }

      const treatmentEffects = [parseFloat(treatment1Effect), parseFloat(treatment2Effect)];
      let powerTreatment1 = 0;
      let powerTreatment2 = 0;
      let typeIError = 0;
      const sampleSizes = [];
      const chartData = [];

      for (let i = 0; i < numSimulations; i++) {
        const trialResult = simulateTrial(parseFloat(sampleSize), parseFloat(controlEffect), treatmentEffects, parseInt(interimLooks, 10), parseFloat(futilityThreshold), parseFloat(confidenceLevel));
        sampleSizes.push(trialResult.finalSampleSize);

        const controlProb = trialResult.control[trialResult.control.length - 1] / 100;
        const treatment1Prob = trialResult.treatment1[trialResult.treatment1.length - 1] / 100;
        const treatment2Prob = trialResult.treatment2[trialResult.treatment2.length - 1] / 100;
        const zValue = normalInv(1 - parseFloat(confidenceLevel) / 100 / 2);

        if (treatment1Prob > controlProb) {
          const diff = treatment1Prob - controlProb;
          const se = Math.sqrt((treatment1Prob * (1 - treatment1Prob) + controlProb * ( 1 - controlProb)) / trialResult.finalSampleSize);
          if (diff > zValue * se) powerTreatment1++;
        }
        if (treatment2Prob > controlProb) {
          const diff = treatment2Prob - controlProb;
          const se = Math.sqrt((treatment2Prob * (1 - treatment2Prob) + controlProb * (1 - controlProb)) / trialResult.finalSampleSize);
          if (diff > zValue * se) powerTreatment2++;
        }

        const nullTrial = simulateTrial(parseFloat(sampleSize), parseFloat(controlEffect), [parseFloat(controlEffect), parseFloat(controlEffect)], parseInt(interimLooks, 10), parseFloat(futilityThreshold), parseFloat(confidenceLevel));
        const nullTreatment1Prob = nullTrial.treatment1[nullTrial.treatment1.length - 1] / 100;
        const nullTreatment2Prob = nullTrial.treatment2[nullTrial.treatment2.length - 1] / 100;
        if (nullTreatment1Prob > controlProb || nullTreatment2Prob > controlProb) typeIError++;
      }

      const power = {
        treatment1: (powerTreatment1 / numSimulations * 100).toFixed(2),
        treatment2: (powerTreatment2 / numSimulations * 100).toFixed(2),
      };
      const typeIErrorRate = (typeIError / numSimulations * 100).toFixed(2);
      const avgSampleSize = (sampleSizes.reduce((a, b) => a + b, 0) / numSimulations).toFixed(0);

      const sampleSizesRange = Array.from({ length: 5 }, (_, i) => SAMPLE_MIN + (i * (SAMPLE_MAX - SAMPLE_MIN)) / 4);
      for (const size of sampleSizesRange) {
        let tempPower1 = 0;
        let tempPower2 = 0;
        for (let i = 0; i < 100; i++) {
          const trial = simulateTrial(size, parseFloat(controlEffect), treatmentEffects, parseInt(interimLooks, 10), parseFloat(futilityThreshold), parseFloat(confidenceLevel));
          const controlProb = trial.control[trial.control.length - 1] / 100;
          const treatment1Prob = trial.treatment1[trial.treatment1.length - 1] / 100;
          const treatment2Prob = trial.treatment2[trial.treatment2.length - 1] / 100;
          const zValue = normalInv(1 - parseFloat(confidenceLevel) / 100 / 2);
          if (treatment1Prob > controlProb) {
            const diff = treatment1Prob - controlProb;
            const se = Math.sqrt((treatment1Prob * (1 - treatment1Prob) + controlProb * (1 - controlProb)) / trial.finalSampleSize);
            if (diff > zValue * se) tempPower1++;
          }
          if (treatment2Prob > controlProb) {
            const diff = treatment2Prob - controlProb;
            const se = Math.sqrt((treatment2Prob * (1 - treatment2Prob) + controlProb * (1 - controlProb)) / trial.finalSampleSize);
            if (diff > zValue * se) tempPower2++;
          }
        }
        chartData.push({
          sampleSize: size,
          powerTreatment1: (tempPower1 / 100 * 100).toFixed(2),
          powerTreatment2: (tempPower2 / 100 * 100).toFixed(2),
        });
      }

      const result = {
        power,
        typeIError: typeIErrorRate,
        avgSampleSize,
        chartData,
        parameters: { sampleSize, controlEffect, treatment1Effect, treatment2Effect, interimLooks, futilityThreshold, confidenceLevel, numSimulations },
        warnings: typeIErrorRate > 5 ? ['Type I error rate exceeds 5%. Consider adjusting futility threshold or sample size.'] : [],
      };

      setResult(result);
      localStorage.setItem('simulatorResults', JSON.stringify(result));

      if (auth.currentUser) {
        try {
          await addDoc(collection(db, 'simulations'), {
            userId: auth.currentUser.uid,
            result,
            timestamp: new Date(),
          });
        } catch (err) {
          console.error('Firebase save failed:', err);
          setError('Failed to save simulation to Firebase.');
        }
      } else {
        console.warn('User not authenticated.');
      }
    } catch (err) {
      setError(`Simulation failed: ${err.message}`);
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    setSampleSize(SAMPLE_START);
    setControlEffect(EFFECT_START);
    setTreatment1Effect(EFFECT_START + 2);
    setTreatment2Effect(EFFECT_START + 4);
    setInterimLooks(INTERIM_LOOKS_START);
    setFutilityThreshold(FUTILITY_THRESHOLD_START);
    setConfidenceLevel(CI_START);
    setNumSimulations(SIMULATIONS_START);
    setResult(null);
    setError(null);
  };

  const exportCSV = () => {
    if (!result) {
      setError('No results to export.');
      return;
    }
    try {
      const data = [{
        'Sample Size per Arm': result.parameters.sampleSize,
        'Control Effect (%)': result.parameters.controlEffect,
        'Treatment 1 Effect (%)': result.parameters.treatment1Effect,
        'Treatment 2 Effect (%)': result.parameters.treatment2Effect,
        'Interim Looks': result.parameters.interimLooks,
        'Futility Threshold': result.parameters.futilityThreshold,
        'Confidence Level (%)': result.parameters.confidenceLevel,
        'Number of Simulations': result.parameters.numSimulations,
        'Power Treatment 1 (%)': result.power.treatment1,
        'Power Treatment 2 (%)': result.power.treatment2,
        'Type I Error (%)': result.typeIError,
        'Average Sample Size': result.avgSampleSize,
      }];
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'adaptive_simulation_results.csv';
      link.click();
    } catch (err) {
      setError(`CSV export failed: ${err.message}`);
      console.error('CSV export error:', err);
    }
  };

  const exportPNG = async () => {
    if (!chartRef.current) {
      setError('No chart available to export.');
      return;
    }
    try {
      const canvas = await html2canvas(chartRef.current, { useCORS: true });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'adaptive_simulation_chart.png';
      link.click();
    } catch (err) {
      setError(`PNG export failed: ${err.message}`);
      console.error('PNG export error:', err);
    }
  };

  class ErrorBoundary extends React.Component {
    state = { error: null };
    static getDerivedStateFromError(error) {
      return { error: error.message };
    }
    render() {
      if (this.state.error) {
        return (
          <Container style={{ padding: '20px' }}>
            <Alert variant="danger">Error: {this.state.error}</Alert>
          </Container>
        );
      }
      return this.props.children;
    }
  }

  const fallbackStyles = `
    .simulator-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .simulator-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .results-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .result-item {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
    }
    .result-badge {
      margin-right: 0.5rem;
    }
    .warning-badge {
      margin-right: 0.5rem;
      margin-top: 0.5rem;
    }
  `;

  return (
    <ErrorBoundary>
      <Container className="simulator-container">
        <style>{fallbackStyles}</style>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="simulator-title">Adaptive Clinical Trial Simulator</h2>
          <Card className="simulator-card mb-4">
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sample Size per Arm</Form.Label>
                      <Form.Control
                        type="number"
                        value={sampleSize}
                        onChange={(e) => setSampleSize(parseFloat(e.target.value) || SAMPLE_START)}
                        min={SAMPLE_MIN}
                        max={SAMPLE_MAX}
                        step={SAMPLE_STEP}
                        aria-label="Sample size per arm"
                      />
                      <Form.Range
                        value={sampleSize}
                        onChange={(e) => setSampleSize(parseFloat(e.target.value) || SAMPLE_START)}
                        min={SAMPLE_MIN}
                        max={SAMPLE_MAX}
                        step={SAMPLE_STEP}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Control Effect (%)</Form.Label>
                      <Form.Control
                        type="number"
                        value={controlEffect}
                        onChange={(e) => setControlEffect(parseFloat(e.target.value) || EFFECT_START)}
                        min={EFFECT_MIN}
                        max={EFFECT_MAX}
                        step={EFFECT_STEP}
                        aria-label="Control effect"
                      />
                      <Form.Range
                        value={controlEffect}
                        onChange={(e) => setControlEffect(parseFloat(e.target.value) || EFFECT_START)}
                        min={EFFECT_MIN}
                        max={EFFECT_MAX}
                        step={EFFECT_STEP}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Treatment 1 Effect (%)</Form.Label>
                      <Form.Control
                        type="number"
                        value={treatment1Effect}
                        onChange={(e) => setTreatment1Effect(parseFloat(e.target.value) || EFFECT_START + 2)}
                        min={EFFECT_MIN}
                        max={EFFECT_MAX}
                        step={EFFECT_STEP}
                        aria-label="Treatment 1 effect"
                      />
                      <Form.Range
                        value={treatment1Effect}
                        onChange={(e) => setTreatment1Effect(parseFloat(e.target.value) || EFFECT_START + 2)}
                        min={EFFECT_MIN}
                        max={EFFECT_MAX}
                        step={EFFECT_STEP}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Treatment 2 Effect (%)</Form.Label>
                      <Form.Control
                        type="number"
                        value={treatment2Effect}
                        onChange={(e) => setTreatment2Effect(parseFloat(e.target.value) || EFFECT_START + 4)}
                        min={EFFECT_MIN}
                        max={EFFECT_MAX}
                        step={EFFECT_STEP}
                        aria-label="Treatment 2 effect"
                      />
                      <Form.Range
                        value={treatment2Effect}
                        onChange={(e) => setTreatment2Effect(parseFloat(e.target.value) || EFFECT_START + 4)}
                        min={EFFECT_MIN}
                        max={EFFECT_MAX}
                        step={EFFECT_STEP}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Interim Looks</Form.Label>
                      <Form.Control
                        type="number"
                        value={interimLooks}
                        onChange={(e) => setInterimLooks(parseInt(e.target.value, 10) || INTERIM_LOOKS_START)}
                        min={INTERIM_LOOKS_MIN}
                        max={INTERIM_LOOKS_MAX}
                        step={1}
                        aria-label="Interim looks"
                      />
                      <Form.Range
                        value={interimLooks}
                        onChange={(e) => setInterimLooks(parseInt(e.target.value, 10) || INTERIM_LOOKS_START)}
                        min={INTERIM_LOOKS_MIN}
                        max={INTERIM_LOOKS_MAX}
                        step={1}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Futility Threshold</Form.Label>
                      <Form.Control
                        type="number"
                        value={futilityThreshold}
                        onChange={(e) => setFutilityThreshold(parseFloat(e.target.value) || FUTILITY_THRESHOLD_START)}
                        min={FUTILITY_THRESHOLD_MIN}
                        max={FUTILITY_THRESHOLD_MAX}
                        step={FUTILITY_THRESHOLD_STEP}
                        aria-label="Futility threshold"
                      />
                      <Form.Range
                        value={futilityThreshold}
                        onChange={(e) => setFutilityThreshold(parseFloat(e.target.value) || FUTILITY_THRESHOLD_START)}
                        min={FUTILITY_THRESHOLD_MIN}
                        max={FUTILITY_THRESHOLD_MAX}
                        step={FUTILITY_THRESHOLD_STEP}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confidence Level (%)</Form.Label>
                      <Form.Control
                        type="number"
                        value={confidenceLevel}
                        onChange={(e) => setConfidenceLevel(parseFloat(e.target.value) || CI_START)}
                        min={CI_MIN}
                        max={CI_MAX}
                        step={CI_STEP}
                        aria-label="Confidence level"
                      />
                      <Form.Range
                        value={confidenceLevel}
                        onChange={(e) => setConfidenceLevel(parseFloat(e.target.value) || CI_START)}
                        min={CI_MIN}
                        max={CI_MAX}
                        step={CI_STEP}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Simulations</Form.Label>
                      <Form.Control
                        type="number"
                        value={numSimulations}
                        onChange={(e) => setNumSimulations(parseInt(e.target.value, 10) || SIMULATIONS_START)}
                        min={SIMULATIONS_MIN}
                        max={SIMULATIONS_MAX}
                        step={100}
                        aria-label="Number of simulations"
                      />
                      <Form.Range
                        value={numSimulations}
                        onChange={(e) => setNumSimulations(parseInt(e.target.value, 10) || SIMULATIONS_START)}
                        min={SIMULATIONS_MIN}
                        max={SIMULATIONS_MAX}
                        step={100}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" onClick={runSimulation} disabled={loading} className="me-2">
                  {loading ? 'Simulating...' : 'Run Simulation'}
                </Button>
                <Button variant="outline-secondary" onClick={resetData}>
                  Reset
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Alert variant="danger">{error}</Alert>
              </motion.div>
            )}
            {result && result.chartData && result.chartData.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <Card className="simulator-results-card">
                  <Card.Body>
                    <h3 className="results-title">Simulation Results</h3>
                    <Row>
                      <Col md={6}>
                        <div className="result-item">
                          <Badge bg="primary" className="result-badge">Power (Treatment 1)</Badge>
                          <span>{result.power.treatment1}%</span>
                        </div>
                        <div className="result-item">
                          <Badge bg="primary" className="result-badge">Power (Treatment 2)</Badge>
                          <span>{result.power.treatment2}%</span>
                        </div>
                        <div className="result-item">
                          <Badge bg="primary" className="result-badge">Type I Error</Badge>
                          <span>{result.typeIError}%</span>
                        </div>
                        <div className="result-item">
                          <Badge bg="primary" className="result-badge">Average Sample Size</Badge>
                          <span>{result.avgSampleSize}</span>
                        </div>
                      </Col>
                    </Row>
                    {result.warnings.length > 0 && (
                      <div className="warnings mt-3">
                        <h5>Warnings</h5>
                        {result.warnings.map((warning, idx) => (
                          <Badge key={idx} bg="warning" className="warning-badge">{warning}</Badge>
                        ))}
                      </div>
                    )}
                    <Button variant="success" onClick={exportCSV} className="me-2 mt-3">
                      Export CSV
                    </Button>
                    <Button variant="outline-primary" onClick={exportPNG} className="mt-3">
                      Export PNG
                    </Button>
                    <div ref={chartRef} className="mt-4">
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={result.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="sampleSize" stroke="#333" label={{ value: 'Sample Size per Arm', position: 'insideBottom', offset: -5 }} />
                          <YAxis domain={[0, 100]} stroke="#333" label={{ value: 'Power (%)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                          <Legend />
                          <Line type="monotone" dataKey="powerTreatment1" stroke="#007bff" name="Treatment 1 Power" />
                          <Line type="monotone" dataKey="powerTreatment2" stroke="#28a745" name="Treatment 2 Power" />
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
    </ErrorBoundary>
  );
};

export default ClinicalTrialSimulator;