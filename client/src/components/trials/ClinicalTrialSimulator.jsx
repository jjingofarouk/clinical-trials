// ClinicalTrialSimulator.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Table } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ErrorBar } from 'recharts';
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

  // Configuration constants
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

  // State
  const [controlSize, setControlSize] = useState(CONTROL_START);
  const [testSize, setTestSize] = useState(TEST_START);
  const [controlEvents, setControlEvents] = useState(EVENTS_CONTROL_START);
  const [testEvents, setTestEvents] = useState(EVENTS_TEST_START);
  const [confidenceLevel, setConfidenceLevel] = useState(CI_START);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load saved results
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

  // Statistical functions
  const binomialConfidence = (p, n, z, method) => {
    if (method === 'clopper-pearson') {
      const alpha = 1 - (z / 100);
      const x = Math.round(p * n);
      const lower = jStat.beta.inv(alpha / 2, x, n - x + 1);
      const upper = jStat.beta.inv(1 - alpha / 2, x + 1, n - x);
      return [isNaN(lower) ? 0 : lower, isNaN(upper) ? 1 : upper];
    }
    return [p, p];
  };

  const getPhi = (p0, p1, n0, n1, walter) => {
    if (!walter) return p1 / p0;
    const x0 = p0 * n0;
    const x1 = p1 * n1;
    return Math.exp(Math.log((x1 + 0.5) / (n1 + 0.5)) - Math.log((x0 + 0.5) / (n0 + 0.5)));
  };

  const getPar = (p0, p1, n0, n1, walter) => {
    if (!walter) {
      return Math.sqrt((1 - p0) / (n0 * p0) + (1 - p1) / (n1 * p1));
    }
    const x0 = p0 * n0;
    const x1 = p1 * n1;
    return Math.sqrt(1 / (x1 + 0.5) - 1 / (n1 + 0.5) + 1 / (x0 + 0.5) - 1 / (n0 + 0.5));
  };

  const getOverlap = (i1, i2) => {
    const a = Math.max(i1[0], i2[0]);
    const b = Math.min(i1[1], i2[1]);
    return a > b ? [] : [a, b];
  };

  const getPValue = (p0, p1, n0, n1) => {
    const mean = Math.log(1);
    const stdev = Math.sqrt(((1 / p0 - 1) / n0) + ((1 / p1 - 1) / n1));
    const observedRR = p1 / p0;
    const logObservedRR = Math.log(observedRR);
    const pLeft = jStat.normal.cdf(logObservedRR, mean, stdev);
    const pRight = 1 - pLeft;
    return Math.round(2 * Math.min(pRight, pLeft) * 10000) / 10000;
  };

  const getPValue2 = (riskRatioObs, riskRatioL, riskRatioR, confidenceLevel) => {
    const zValue = jStat.normal.inv(1 - confidenceLevel / 100 / 2, 0, 1);
    const logRiskRatioL = Math.log(riskRatioL);
    const logRiskRatioR = Math.log(riskRatioR);
    const logRiskRatioObs = Math.log(riskRatioObs);
    const stdErr = (logRiskRatioR - logRiskRatioL) / (2 * zValue);
    const zStat = Math.abs(logRiskRatioObs / stdErr);
    const a = -0.717;
    const b = -0.416;
    return Math.round(Math.exp(a * zStat + b * zStat ** 2) * 10000) / 10000;
  };

  const getCValue = (p0, p1, n0, n1, baseValue, step) => {
    let contains = false;
    let j = 0;
    let cValue = 0;
    while (!contains) {
      const currentConfidence = baseValue + j * step;
      const zValue = jStat.normal.inv(1 - currentConfidence / 100 / 2, 0, 1);
      const phi = getPhi(p0, p1, n0, n1, WALTER_CI);
      const par = getPar(p0, p1, n0, n1, WALTER_CI);
      const riskRatioL = phi * Math.exp(-zValue * par);
      const riskRatioR = phi * Math.exp(zValue * par);
      if (1 >= riskRatioL && 1 <= riskRatioR) {
        contains = true;
        cValue = 1 - (currentConfidence - step) / 100;
      }
      j++;
      if (j > 1000) break;
    }
    return Math.round(cValue * 10000) / 10000;
  };

  const mkRiskStr = (title, risk, riskL, riskR) => {
    return {
      title,
      value: risk.toFixed(2),
      ci: `(${riskL.toFixed(2)}-${riskR.toFixed(2)})`,
    };
  };

  // Validation
  const validateInputs = () => {
    setError(null);

    const parsedControlSize = Number(controlSize);
    const parsedTestSize = Number(testSize);
    const parsedControlEvents = Number(controlEvents);
    const parsedTestEvents = Number(testEvents);
    const parsedConfidenceLevel = Number(confidenceLevel);

    if (isNaN(parsedControlSize) || parsedControlSize < CONTROL_MIN || parsedControlSize > CONTROL_MAX) {
      setError(`Control group size must be between ${CONTROL_MIN} and ${CONTROL_MAX}.`);
      return false;
    }
    if (isNaN(parsedTestSize) || parsedTestSize < TEST_MIN || parsedTestSize > TEST_MAX) {
      setError(`Test group size must be between ${TEST_MIN} and ${TEST_MAX}.`);
      return false;
    }
    if (isNaN(parsedControlEvents) || parsedControlEvents < EVENTS_CONTROL_MIN || parsedControlEvents > EVENTS_CONTROL_MAX) {
      setError(`Control group events must be between ${EVENTS_CONTROL_MIN} and ${EVENTS_CONTROL_MAX}%.`);
      return false;
    }
    if (isNaN(parsedTestEvents) || parsedTestEvents < EVENTS_TEST_MIN || parsedTestEvents > EVENTS_TEST_MAX) {
      setError(`Test group events must be between ${EVENTS_TEST_MIN} and ${EVENTS_TEST_MAX}%.`);
      return false;
    }
    if (isNaN(parsedConfidenceLevel) || parsedConfidenceLevel < CI_MIN || parsedConfidenceLevel > CI_MAX) {
      setError(`Confidence level must be between ${CI_MIN} and ${CI_MAX}%.`);
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
      const confidence = confidenceLevel / 100;
      const zValue = jStat.normal.inv(1 - confidence / 2, 0, 1);

      // Control group inference
      const controlRisk = controlEvents / 100;
      const controlRiskCI = binomialConfidence(controlRisk, controlSize, zValue * 100, INDIVIDUAL_CI_METHOD).map(x => x * 100);
      const controlRiskL = controlRiskCI[0];
      const controlRiskR = controlRiskCI[1];
      const controlRiskErr = controlRiskR - controlRiskL;
      const strControlRisk = mkRiskStr('Control Group Risk (%)', controlEvents, controlRiskL, controlRiskR);

      // Test group inference
      const testRisk = testEvents / 100;
      const testRiskCI = binomialConfidence(testRisk, testSize, zValue * 100, INDIVIDUAL_CI_METHOD).map(x => x * 100);
      const testRiskL = testRiskCI[0];
      const testRiskR = testRiskCI[1];
      const testRiskErr = testRiskR - testRiskL;
      const strTestRisk = mkRiskStr('Test Group Risk (%)', testEvents, testRiskL, test onRiskR);

      // Overlap
      const overlapInterval = getOverlap(testRiskCI, controlRiskCI);
      const overlapLength = overlapInterval.length > 0 ? overlapInterval[1] - overlapInterval[0] : 0;
      const strOverlapInterval = {
        title: 'Overlap Interval',
        value: overlapLength.toFixed(2),
        ci: `[${overlapInterval.map(x => x.toFixed(2)).join(', ')}]`,
      };
      const strOverlapPctTest = {
        title: 'Overlap % for Test Group',
        value: (overlapLength / testRiskErr * 100).toFixed(2),
        ci: '',
      };

      // Risk ratio
      const phi = getPhi(controlRisk, testRisk, controlSize, testSize, WALTER_CI);
      const par = getPar(controlRisk, testRisk, controlSize, testSize, WALTER_CI);
      const riskRatio = testRisk / controlRisk;
      const riskRatioL = phi * Math.exp(-zValue * par);
      const riskRatioR = phi * Math.exp(zValue * par);
      const strRiskRatio = mkRiskStr('Relative Risk', riskRatio, riskRatioL, riskRatioR);

      // Adverse effects threshold
      const advEffectsThreshold = (1 - (1 - confidence) ** (1 / testSize)) * 100;
      const strAdvEffects = {
        title: 'Adverse Effects Threshold (%)',
        value: advEffectsThreshold.toFixed(2),
        ci: '',
      };

      // P-values
      const pValue1 = getPValue(controlRisk, testRisk, controlSize, testSize);
      const strPValue = {
        title: 'P-Value',
        value: pValue1,
        ci: '',
      };

      // C-value
      const cValue = getCValue(controlRisk, testRisk, controlSize, testSize, 0.5, 0.005);
      const highestCI = 1 - cValue;
      const strCValue = {
        title: 'C-Value',
        value: cValue,
        ci: '',
      };
      const strCValueExt = {
        title: 'Highest CI',
        value: highestCI.toFixed(4),
        ci: `/ ${(highestCI * 100).toFixed(2)}%`,
      };

      // Warnings
      let warnings = [];
      if (1 >= riskRatioL && 1 <= riskRatioR) {
        warnings.push('The confidence interval for Relative Risk contains 1.');
      }
      if (advEffectsThreshold > controlEvents) {
        warnings.push('The adverse effects detectability threshold for the test group is above the risk level for the control group.');
      }

      // Chart data
      const chartData = [
        { group: 'Test group', value: testEvents, lower: testRiskL, upper: testRiskR },
        { group: 'Control group', value: controlEvents, lower: controlRiskL, upper: controlRiskR },
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

      // Save to localStorage
      try {
        localStorage.setItem('simulatorResults', JSON.stringify(result));
      } catch (err) {}

      // Save to Firebase
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

  // Reset inputs
  const resetData = () => {
    setControlSize(CONTROL_START);
    setTestSize(TEST_START);
    setControlEvents(EVENTS_CONTROL_START);
    setTestEvents(EVENTS_TEST_START);
    setConfidenceLevel(CI_START);
    runSimulation();
  };

  // Export CSV
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
        'Control Risk CI': `[${result.controlRisk.ci.map(x => x.toFixed(2)).join(', ')}]`,
        'Test Risk CI': `[${result.testRisk.ci.map(x => x.toFixed(2)).join(', ')}]`,
        'Risk Ratio': result.riskRatio.value.toFixed(2),
        'Risk Ratio CI': `[${result.riskRatio.ci.map(x => x.toFixed(2)).join(', ')}]`,
        'P-Value': result.pValue.value1,
        'C-Value': result.cValue.value,
        'Adverse Effects Threshold (%)': result.adverseEffects.threshold.toFixed(2),
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
    } catch (err) {
      setError(`PNG export failed: ${err.message}`);
    }
  };

  return (
    <Container className="py-5 simulator-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-center">Clinical Trial Simulator</h2>
        <Card className="shadow-sm mb-4 border-0">
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
                      className="form-control-modern"
                    />
                    <Form.Range
                      value={controlSize}
                      onChange={(e) => setControlSize(e.target.value)}
                      min={CONTROL_MIN}
                      max={CONTROL_MAX}
                      step={CONTROL_STEP}
                      className="range-modern"
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
                      className="form-control-modern"
                    />
                    <Form.Range
                      value={testSize}
                      onChange={(e) => setTestSize(e.target.value)}
                      min={TEST_MIN}
                      max={TEST_MAX}
                      step={TEST_STEP}
                      className="range-modern"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Detected Proportion for Control Group (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={controlEvents}
                      onChange={(e) => setControlEvents(e.target.value)}
                      min={EVENTS_CONTROL_MIN}
                      max={EVENTS_CONTROL_MAX}
                      step={EVENTS_CONTROL_STEP}
                      aria-label="Control events"
                      className="form-control-modern"
                    />
                    <Form.Range
                      value={controlEvents}
                      onChange={(e) => setControlEvents(e.target.value)}
                      min={EVENTS_CONTROL_MIN}
                      max={EVENTS_CONTROL_MAX}
                      step={EVENTS_CONTROL_STEP}
                      className="range-modern"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Detected Proportion for Test Group (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={testEvents}
                      onChange={(e) => setTestEvents(e.target.value)}
                      min={EVENTS_TEST_MIN}
                      max={EVENTS_TEST_MAX}
                      step={EVENTS_TEST_STEP}
                      aria-label="Test events"
                      className="form-control-modern"
                    />
                    <Form.Range
                      value={testEvents}
                      onChange={(e) => setTestEvents(e.target.value)}
                      min={EVENTS_TEST_MIN}
                      max={EVENTS_TEST_MAX}
                      step={EVENTS_TEST_STEP}
                      className="range-modern"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Target Confidence Level (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={confidenceLevel}
                      onChange={(e) => setConfidenceLevel(e.target.value)}
                      min={CI_MIN}
                      max={CI_MAX}
                      step={CI_STEP}
                      aria-label="Confidence level"
                      className="form-control-modern"
                    />
                    <Form.Range
                      value={confidenceLevel}
                      onChange={(e) => setConfidenceLevel(e.target.value)}
                      min={CI_MIN}
                      max={CI_MAX}
                      step={CI_STEP}
                      className="range-modern"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-center gap-2">
                <Button
                  variant="primary"
                  onClick={runSimulation}
                  disabled={loading}
                  className="btn-modern"
                >
                  {loading ? 'Simulating...' : 'Run Simulation'}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={resetData}
                  className="btn-modern-outline"
                >
                  Reset
                </Button>
              </div>
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
              <Alert variant="danger" className="modern-alert">{error}</Alert>
            </motion.div>
          )}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <h3 className="mb-4 text-center">Simulation Results</h3>
                  <Table responsive className="modern-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Value</th>
                        <th>Confidence Interval</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{result.testRisk.str.title}</td>
                        <td>{result.testRisk.str.value}</td>
                        <td>{result.testRisk.str.ci}</td>
                      </tr>
                      <tr>
                        <td>{result.controlRisk.str.title}</td>
                        <td>{result.controlRisk.str.value}</td>
                        <td>{result.controlRisk.str.ci}</td>
                      </tr>
                      <tr>
                        <td>{result.overlap.strInterval.title}</td>
                        <td>{result.overlap.strInterval.value}</td>
                        <td>{result.overlap.strInterval.ci}</td>
                      </tr>
                      <tr>
                        <td>{result.overlap.strPctTest.title}</td>
                        <td>{result.overlap.strPctTest.value}%</td>
                        <td>{result.overlap.strPctTest.ci}</td>
                      </tr>
                      <tr>
                        <td>{result.riskRatio.str.title}</td>
                        <td>{result.riskRatio.str.value}</td>
                        <td>{result.riskRatio.str.ci}</td>
                      </tr>
                      <tr>
                        <td>{result.pValue.str.title}</td>
                        <td>{result.pValue.str.value}</td>
                        <td>{result.pValue.str.ci}</td>
                      </tr>
                      <tr>
                        <td>{result.cValue.str.title}</td>
                        <td>{result.cValue.str.value}</td>
                        <td>{result.cValue.str.ci}</td>
                      </tr>
                      <tr>
                        <td>{result.cValue.strExt.title}</td>
                        <td>{result.cValue.strExt.value}</td>
                        <td>{result.cValue.strExt.ci}</td>
                      </tr>
                      <tr>
                        <td>{result.adverseEffects.str.title}</td>
                        <td>{result.adverseEffects.str.value}</td>
                        <td>{result.adverseEffects.str.ci}</td>
                      </tr>
                    </tbody>
                  </Table>
                  {result.warnings.length > 0 && (
                    <Alert variant="warning" className="modern-alert mt-3">
                      <strong>Warnings:</strong>
                      <ul className="mb-0">
                        {result.warnings.map((warning, idx) => (
                          <li key={idx}>{warning}</li>
                        ))}
                      </ul>
                    </Alert>
                  )}
                  <div className="d-flex justify-content-center gap-2 mt-4">
                    <Button variant="primary" onClick={exportCSV} className="btn-modern">
                      Export CSV
                    </Button>
                    <Button variant="outline-secondary" onClick={exportPNG} className="btn-modern-outline">
                      Export PNG
                    </Button>
                  </div>
                  <div ref={chartRef} className="mt-5">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="group" tick={{ fill: '#333' }} />
                        <YAxis
                          domain={[0, data => Math.ceil(Math.max(...result.chartData.map(d => d.upper))) + PLOT_RANGE_DELTA]}
                          tick={{ fill: '#333' }}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Bar dataKey="value" fill="#3b82f6">
                          <ErrorBar dataKey="upper" width={4} strokeWidth={2} stroke="#333" direction="upper" />
                          <ErrorBar dataKey="lower" width={4} strokeWidth={2} stroke="#333" direction="lower" />
                        </Bar>
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