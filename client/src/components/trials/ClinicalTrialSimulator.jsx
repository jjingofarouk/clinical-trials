import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jStat from 'jstat';
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

  const PLOT_RANGE_DELTA = 5;
  const GROUPS = ['Test group', 'Control group'];
  const CONTROL_MIN = 50;
  const CONTROL_MAX = 25000;
  const CONTROL_START = 1000;
  const CONTROL_STEP = 10;
  const TEST_MIN = 50;
  const TEST_MAX = 25000;
  const TEST_START = 1000;
  const TEST_STEP = 10;
  const EVENTS_CONTROL_MIN = 0.25;
  const EVENTS_CONTROL_MAX = 100;
  const EVENTS_CONTROL_START = 3;
  const EVENTS_CONTROL_STEP = 0.25;
  const EVENTS_TEST_MIN = 0;
  const EVENTS_TEST_MAX = 100;
  const EVENTS_TEST_START = 1.5;
  const EVENTS_TEST_STEP = 0.25;
  const CI_MIN = 60;
  const CI_MAX = 99;
  const CI_START = 95;
  const CI_STEP = 0.5;
  const INDIVIDUAL_CI_METHOD = 'clopper-pearson';
  const WALTER_CI = true;

  const [controlSize, setControlSize] = useState(CONTROL_START);
  const [testSize, setTestSize] = useState(TEST_START);
  const [controlEvents, setControlEvents] = useState(EVENTS_CONTROL_START);
  const [testEvents, setTestEvents] = useState(EVENTS_TEST_START);
  const [confidenceLevel, setConfidenceLevel] = useState(CI_START);
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

  const binomialConfidence = (p, n, z, method) => {
    if (!Number.isFinite(p) || !Number.isFinite(n) || !Number.isFinite(z)) return [p, p];
    if (method === 'clopper-pearson') {
      const alpha = 1 - (z / 100);
      const x = Math.round(p * n);
      let lower = jStat.beta.inv(alpha / 2, x, n - x + 1);
      let upper = jStat.beta.inv(1 - alpha / 2, x + 1, n - x);
      lower = Number.isFinite(lower) && lower >= 0 ? lower : 0;
      upper = Number.isFinite(upper) && upper <= 1 ? upper : 1;
      return [lower, upper];
    }
    return [p, p];
  };

  const getPhi = (p0, p1, n0, n1, walter) => {
    if (!Number.isFinite(p0) || !Number.isFinite(p1) || !Number.isFinite(n0) || !Number.isFinite(n1)) return 0;
    if (!walter) return p1 / p0 || 0;
    const x0 = p0 * n0;
    const x1 = p1 * n1;
    return Math.exp(Math.log((x1 + 0.5) / (n1 + 0.5)) - Math.log((x0 + 0.5) / (n0 + 0.5))) || 0;
  };

  const getPar = (p0, p1, n0, n1, walter) => {
    if (!Number.isFinite(p0) || !Number.isFinite(p1) || !Number.isFinite(n0) || !Number.isFinite(n1)) return 0;
    if (!walter) {
      return p0 && p1 ? Math.sqrt((1 - p0) / (n0 * p0) + (1 - p1) / (n1 * p1)) : 0;
    }
    const x0 = p0 * n0;
    const x1 = p1 * n1;
    return Math.sqrt(1 / (x1 + 0.5) - 1 / (n1 + 0.5) + 1 / (x0 + 0.5) - 1 / (n0 + 0.5)) || 0;
  };

  const getOverlap = (i1, i2) => {
    if (!i1 || !i2 || !Number.isFinite(i1[0]) || !Number.isFinite(i1[1]) || !Number.isFinite(i2[0]) || !Number.isFinite(i2[1])) return [];
    const a = Math.max(i1[0], i2[0]);
    const b = Math.min(i1[1], i2[1]);
    return a > b ? [] : [a, b];
  };

  const getPValue = (p0, p1, n0, n1) => {
    if (!Number.isFinite(p0) || !Number.isFinite(p1) || !Number.isFinite(n0) || !Number.isFinite(n1) || !p0 || !p1) return 0;
    const mean = Math.log(1);
    const stdev = Math.sqrt(((1 / p0 - 1) / n0) + ((1 / p1 - 1) / n1));
    const observedRR = p1 / p0;
    const logObservedRR = Math.log(observedRR);
    const pLeft = jStat.normal.cdf(logObservedRR, mean, stdev);
    const pRight = 1 - pLeft;
    return Math.round(2 * Math.min(pRight, pLeft) * 10000) / 10000;
  };

  const getCValue = (p0, p1, n0, n1, baseValue, step) => {
    if (!Number.isFinite(p0) || !Number.isFinite(p1) || !Number.isFinite(n0) || !Number.isFinite(n1)) return 0;
    let contains = false;
    let j = 0;
    let cValue = 0;
    while (!contains) {
      const currentConfidence = baseValue + j * step;
      const zValue = Number.isFinite(jStat.normal.inv(1 - currentConfidence / 100 / 2, 0, 1)) ? jStat.normal.inv(1 - currentConfidence / 100 / 2, 0, 1) : 0;
      const phi = getPhi(p0, p1, n0, n1, WALTER_CI);
      const par = getPar(p0, p1, n0, n1, WALTER_CI);
      const riskRatioL = phi * Math.exp(-zValue * par);
      const riskRatioR = phi * Math.exp(zValue * par);
      if (Number.isFinite(riskRatioL) && Number.isFinite(riskRatioR) && 1 >= riskRatioL && 1 <= riskRatioR) {
        contains = true;
        cValue = 1 - (currentConfidence - step) / 100;
      }
      j++;
      if (j > 1000) break;
    }
    return Math.round(cValue * 10000) / 10000;
  };

  const mkRiskStr = (title, risk, riskL, riskR) => {
    const safeRisk = Number.isFinite(risk) ? risk : 0;
    const safeRiskL = Number.isFinite(riskL) ? riskL : 0;
    const safeRiskR = Number.isFinite(riskR) ? riskR : 0;
    return `${title}${safeRisk.toFixed(2)} (${safeRiskL.toFixed(2)}-${safeRiskR.toFixed(2)})`;
  };

  const validateInputs = () => {
    setError(null);

    const parsedControlSize = Number(controlSize);
    const parsedTestSize = Number(testSize);
    const parsedControlEvents = Number(controlEvents);
    const parsedTestEvents = Number(testEvents);
    const parsedConfidenceLevel = Number(confidenceLevel);

    if (!Number.isFinite(parsedControlSize) || parsedControlSize < CONTROL_MIN || parsedControlSize > CONTROL_MAX) {
      setError(`Control group size must be between ${CONTROL_MIN} and ${CONTROL_MAX}.`);
      return false;
    }
    if (!Number.isFinite(parsedTestSize) || parsedTestSize < TEST_MIN || parsedTestSize > TEST_MAX) {
      setError(`Test group size must be between ${TEST_MIN} and ${TEST_MAX}.`);
      return false;
    }
    if (!Number.isFinite(parsedControlEvents) || parsedControlEvents < EVENTS_CONTROL_MIN || parsedControlEvents > EVENTS_CONTROL_MAX) {
      setError(`Control group events must be between ${EVENTS_CONTROL_MIN} and ${EVENTS_CONTROL_MAX}%.`);
      return false;
    }
    if (!Number.isFinite(parsedTestEvents) || parsedTestEvents < EVENTS_TEST_MIN || parsedTestEvents > EVENTS_TEST_MAX) {
      setError(`Test group events must be between ${EVENTS_TEST_MIN} and ${EVENTS_TEST_MAX}%.`);
      return false;
    }
    if (!Number.isFinite(parsedConfidenceLevel) || parsedConfidenceLevel < CI_MIN || parsedConfidenceLevel > CI_MAX) {
      setError(`Confidence level must be between ${CI_MIN} and ${CI_MAX}%.`);
      return false;
    }

    return true;
  };

  const runSimulation = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError(null);

    try {
      const confidence = confidenceLevel / 100;
      const zValue = Number.isFinite(jStat.normal.inv(1 - confidence / 2, 0, 1)) ? jStat.normal.inv(1 - confidence / 2, 0, 1) : 0;

      const controlRisk = controlEvents / 100;
      const controlRiskCI = binomialConfidence(controlRisk, controlSize, zValue * 100, INDIVIDUAL_CI_METHOD).map(x => x * 100);
      const controlRiskL = controlRiskCI[0];
      const controlRiskR = controlRiskCI[1];
      const controlRiskErr = Number.isFinite(controlRiskR - controlRiskL) ? controlRiskR - controlRiskL : 0;
      const strControlRisk = mkRiskStr('Control Group Risk: ', controlEvents, controlRiskL, controlRiskR);

      const testRisk = testEvents / 100;
      const testRiskCI = binomialConfidence(testRisk, testSize, zValue * 100, INDIVIDUAL_CI_METHOD).map(x => x * 100);
      const testRiskL = testRiskCI[0];
      const testRiskR = testRiskCI[1];
      const testRiskErr = Number.isFinite(testRiskR - testRiskL) ? testRiskR - testRiskL : 0;
      const strTestRisk = mkRiskStr('Test Group Risk: ', testEvents, testRiskL, testRiskR);

      const overlapInterval = getOverlap(testRiskCI, controlRiskCI);
      const overlapLength = overlapInterval.length > 0 && Number.isFinite(overlapInterval[1] - overlapInterval[0]) ? overlapInterval[1] - overlapInterval[0] : 0;
      const strOverlapInterval = `Overlap: ${overlapLength.toFixed(2)}% [${overlapInterval.map(x => Number.isFinite(x) ? x.toFixed(2) : '0.00').join(', ')}]`;
      const strOverlapPctTest = `Overlap % for Test Group: ${(Number.isFinite(overlapLength / testRiskErr) ? overlapLength / testRiskErr * 100 : 0).toFixed(2)}%`;

      const phi = getPhi(controlRisk, testRisk, controlSize, testSize, WALTER_CI);
      const par = getPar(controlRisk, testRisk, controlSize, testSize, WALTER_CI);
      const riskRatio = Number.isFinite(testRisk / controlRisk) ? testRisk / controlRisk : 0;
      const riskRatioL = Number.isFinite(phi * Math.exp(-zValue * par)) ? phi * Math.exp(-zValue * par) : 0;
      const riskRatioR = Number.isFinite(phi * Math.exp(zValue * par)) ? phi * Math.exp(zValue * par) : 0;
      const strRiskRatio = mkRiskStr('Relative Risk: ', riskRatio, riskRatioL, riskRatioR);

      const advEffectsThreshold = Number.isFinite(1 - (1 - confidence) ** (1 / testSize)) ? (1 - (1 - confidence) ** (1 / testSize)) * 100 : 0;
      const strAdvEffects = `Adverse Effects Threshold: ${advEffectsThreshold.toFixed(2)}%`;

      const pValue1 = getPValue(controlRisk, testRisk, controlSize, testSize);
      const strPValue = `P-Value: ${pValue1}`;

      const cValue = getCValue(controlRisk, testRisk, controlSize, testSize, 0.5, 0.005);
      const highestCI = Number.isFinite(1 - cValue) ? 1 - cValue : 0;
      const strCValue = `C-Value: ${cValue}`;
      const strCValueExt = `Highest CI: ${(highestCI * 100).toFixed(2)}%`;

      let warnings = [];
      if (Number.isFinite(riskRatioL) && Number.isFinite(riskRatioR) && 1 >= riskRatioL && 1 <= riskRatioR) {
        warnings.push('Relative Risk CI contains 1.');
      }
      if (Number.isFinite(advEffectsThreshold) && Number.isFinite(controlEvents) && advEffectsThreshold > controlEvents) {
        warnings.push('Adverse effects threshold exceeds control group risk.');
      }

      const chartData = [
        {
          group: 'Test group',
          value: Number.isFinite(testEvents) ? testEvents : 0,
          lower: Number.isFinite(testRiskL) ? testRiskL : 0,
          upper: Number.isFinite(testRiskR) ? testRiskR : 0,
        },
        {
          group: 'Control group',
          value: Number.isFinite(controlEvents) ? controlEvents : 0,
          lower: Number.isFinite(controlRiskL) ? controlRiskL : 0,
          upper: Number.isFinite(controlRiskR) ? controlRiskR : 0,
        },
      ];

      const result = {
        controlRisk: { value: controlEvents, ci: [controlRiskL, controlRiskR], str: strControlRisk },
        testRisk: { value: testEvents, ci: [testRiskL, testRiskR], str: strTestRisk },
        overlap: { interval: overlapInterval, length: overlapLength, strInterval: strOverlapInterval, strPctTest: strOverlapPctTest },
        riskRatio: { value: riskRatio, ci: [riskRatioL, riskRatioR], str: strRiskRatio },
        adverseEffects: { threshold: advEffectsThreshold, str: strAdvEffects },
        pValue: { value1: pValue1, str: strPValue },
        cValue: { value: cValue, highestCI, str: strCValue, strExt: strCValueExt },
        warnings,
        chartData,
        parameters: { controlSize, testSize, controlEvents, testEvents, confidenceLevel },
      };

      setResult(result);

      try {
        localStorage.setItem('simulatorResults', JSON.stringify(result));
      } catch (err) {}

      const user = auth.currentUser;
      if (user) {
        try {
          await addDoc(collection(db, 'simulations'), {
            userId: user.uid,
            result,
            timestamp: new Date(),
          });
        } catch (err) {}
      }
    } catch (err) {
      setError(`Simulation failed: ${err.message}`);
    }
    setLoading(false);
  };

  const resetData = () => {
    setControlSize(CONTROL_START);
    setTestSize(TEST_START);
    setControlEvents(EVENTS_CONTROL_START);
    setTestEvents(EVENTS_TEST_START);
    setConfidenceLevel(CI_START);
    runSimulation();
  };

  const exportCSV = () => {
    if (!result) {
      setError('No results to export.');
      return;
    }
    try {
      const data = [{
        'Control Group Size': result.parameters.controlSize,
        'Test Group Size': result.parameters.testSize,
        'Control Events (%)': result.controlRisk.value,
        'Test Events (%)': result.testRisk.value,
        'Confidence Level (%)': result.parameters.confidenceLevel,
        'Control Risk CI': `[${result.controlRisk.ci.map(x => Number.isFinite(x) ? x.toFixed(2) : '0.00').join(', ')}]`,
        'Test Risk CI': `[${result.testRisk.ci.map(x => Number.isFinite(x) ? x.toFixed(2) : '0.00').join(', ')}]`,
        'Risk Ratio': Number.isFinite(result.riskRatio.value) ? result.riskRatio.value.toFixed(2) : '0.00',
        'Risk Ratio CI': `[${result.riskRatio.ci.map(x => Number.isFinite(x) ? x.toFixed(2) : '0.00').join(', ')}]`,
        'P-Value': result.pValue.value1,
        'C-Value': result.cValue.value,
        'Adverse Effects Threshold (%)': Number.isFinite(result.adverseEffects.threshold) ? result.adverseEffects.threshold.toFixed(2) : '0.00',
      }];
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'simulation_results.csv';
      link.click();
    } catch (err) {
      setError(`CSV export failed: ${err.message}`);
    }
  };

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
    } catch (err) {
      setError(`PNG export failed: ${err.message}`);
    }
  };

  return (
    <Container className="simulator-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="simulator-title">Clinical Trial Simulator</h2>
        <Card className="simulator-card mb-4">
          <Card.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Control Group Size</Form.Label>
                    <Form.Control
                      type="number"
                      value={controlSize}
                      onChange={(e) => setControlSize(e.target.value)}
                      min={CONTROL_MIN}
                      max={CONTROL_MAX}
                      step={CONTROL_STEP}
                      aria-label="Control group size"
                    />
                    <Form.Range
                      value={controlSize}
                      onChange={(e) => setControlSize(e.target.value)}
                      min={CONTROL_MIN}
                      max={CONTROL_MAX}
                      step={CONTROL_STEP}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Group Size</Form.Label>
                    <Form.Control
                      type="number"
                      value={testSize}
                      onChange={(e) => setTestSize(e.target.value)}
                      min={TEST_MIN}
                      max={TEST_MAX}
                      step={TEST_STEP}
                      aria-label="Test group size"
                    />
                    <Form.Range
                      value={testSize}
                      onChange={(e) => setTestSize(e.target.value)}
                      min={TEST_MIN}
                      max={TEST_MAX}
                      step={TEST_STEP}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Control Group Events (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={controlEvents}
                      onChange={(e) => setControlEvents(e.target.value)}
                      min={EVENTS_CONTROL_MIN}
                      max={EVENTS_CONTROL_MAX}
                      step={EVENTS_CONTROL_STEP}
                      aria-label="Control events"
                    />
                    <Form.Range
                      value={controlEvents}
                      onChange={(e) => setControlEvents(e.target.value)}
                      min={EVENTS_CONTROL_MIN}
                      max={EVENTS_CONTROL_MAX}
                      step={EVENTS_CONTROL_STEP}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Group Events (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={testEvents}
                      onChange={(e) => setTestEvents(e.target.value)}
                      min={EVENTS_TEST_MIN}
                      max={EVENTS_TEST_MAX}
                      step={EVENTS_TEST_STEP}
                      aria-label="Test events"
                    />
                    <Form.Range
                      value={testEvents}
                      onChange={(e) => setTestEvents(e.target.value)}
                      min={EVENTS_TEST_MIN}
                      max={EVENTS_TEST_MAX}
                      step={EVENTS_TEST_STEP}
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
                      onChange={(e) => setConfidenceLevel(e.target.value)}
                      min={CI_MIN}
                      max={CI_MAX}
                      step={CI_STEP}
                      aria-label="Confidence level"
                    />
                    <Form.Range
                      value={confidenceLevel}
                      onChange={(e) => setControlEvents(e.target.value)}
                      min={CI_MIN}
                      max={CI_MAX}
                      step={CI_STEP}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                onClick={runSimulation}
                disabled={loading}
                className="me-2"
              >
                {loading ? 'Simulating...' : 'Run Simulation'}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={resetData}
              >
                Reset
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
              <Card className="simulator-results-card">
                <Card.Body>
                  <h3 className="results-title">Experimental Results</h3>
                  <Row>
                    <Col md={6}>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">Test Group Risk</Badge>
                        <span>{result.testRisk.value.toFixed(2)}% ({result.testRisk.ci[0].toFixed(2)}-{result.testRisk.ci[1].toFixed(2)})</span>
                      </div>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">Control Group Risk</Badge>
                        <span>{result.controlRisk.value.toFixed(2)}% ({result.controlRisk.ci[0].toFixed(2)}-{result.controlRisk.ci[1].toFixed(2)})</span>
                      </div>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">Overlap</Badge>
                        <span>{result.overlap.length.toFixed(2)}% [{result.overlap.interval.map(x => x.toFixed(2)).join(', ')}]</span>
                      </div>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">Overlap % Test</Badge>
                        <span>{(result.overlap.length / (result.testRisk.ci[1] - result.testRisk.ci[0]) * 100).toFixed(2)}%</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">Relative Risk</Badge>
                        <span>{result.riskRatio.value.toFixed(2)} ({result.riskRatio.ci[0].toFixed(2)}-{result.riskRatio.ci[1].toFixed(2)})</span>
                      </div>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">P-Value</Badge>
                        <span>{result.pValue.value1}</span>
                      </div>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">C-Value</Badge>
                        <span>{result.cValue.value}</span>
                      </div>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">Highest CI</Badge>
                        <span>{(result.cValue.highestCI * 100).toFixed(2)}%</span>
                      </div>
                      <div className="result-item">
                        <Badge bg="primary" className="result-badge">Adverse Effects</Badge>
                        <span>{result.adverseEffects.threshold.toFixed(2)}%</span>
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
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="group" stroke="#333" />
                        <YAxis domain={[0, data => Math.ceil(Math.max(...result.chartData.map(d => d.upper)) + PLOT_RANGE_DELTA)]} stroke="#333" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                        <Legend />
                        <Bar dataKey="value" fill="#007bff" radius={[4, 4, 0, 0]} />
                      </BarChart>
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