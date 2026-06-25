import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sort-ticket';

function App() {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('app');
  const [locale, setLocale] = useState('en');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    // Generate dynamic mock Ticket ID for evaluation
    const generatedId = `T-${Date.now().toString().slice(-6)}`;

    try {
      const response = await axios.post(API_URL, {
        ticket_id: generatedId,
        channel,
        locale,
        message: message.trim()
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze ticket. Please verify server connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'critical': return 'badge bg-critical';
      case 'high': return 'badge bg-high';
      case 'low': return 'badge bg-low';
      default: return 'badge bg-gray';
    }
  };

  return (
    <div className="container">
      <header className="navbar">
        <h1 className="brand">⚡ QueueStorm <span>Ticket Analyzer</span></h1>
      </header>

      <main className="dashboard">
        <section className="input-card">
          <h2>Triage Processing Pipeline</h2>
          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label htmlFor="complaint">Customer Complaint / Message</label>
              <textarea
                id="complaint"
                rows="5"
                placeholder="Paste the raw support message here (e.g., 'I sent 5000 taka to wrong number')..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="form-group col">
                <label>Channel</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                  <option value="app">bKash App</option>
                  <option value="ussd">USSD (*247#)</option>
                  <option value="sms">SMS Gateway</option>
                  <option value="web">Web Portal</option>
                </select>
              </div>

              <div className="form-group col">
                <label>Locale</label>
                <select value={locale} onChange={(e) => setLocale(e.target.value)}>
                  <option value="en">English (en)</option>
                  <option value="bn">Bengali (bn)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading || !message.trim()} className="btn-submit">
              {loading ? 'Analyzing Content...' : 'Run Diagnostics'}
            </button>
          </form>

          {error && <div className="error-alert">🚨 {error}</div>}
        </section>

        <section className="output-card">
          <h2>Classification Analytics Result</h2>
          {result ? (
            <div className="results-grid">
              <div className="result-tile">
                <span className="tile-label">Ticket Reference ID</span>
                <span className="tile-value highlight">{result.ticket_id}</span>
              </div>

              <div className="result-tile">
                <span className="tile-label">Case Classification</span>
                <span className="tile-value uppercase">{result.case_type.replace(/_/g, ' ')}</span>
              </div>

              <div className="result-tile">
                <span className="tile-label">Operational Severity</span>
                <span className={getSeverityBadgeClass(result.severity)}>{result.severity}</span>
              </div>

              <div className="result-tile">
                <span className="tile-label">Target Department</span>
                <span className="tile-value uppercase">{result.department.replace(/_/g, ' ')}</span>
              </div>

              <div className="result-tile col-span-2">
                <span className="tile-label">AI Agent Summary</span>
                <p className="tile-desc">{result.agent_summary}</p>
              </div>

              <div className="result-tile">
                <span className="tile-label">Model Confidence</span>
                <span className="tile-value font-numeric">{(result.confidence * 100).toFixed(0)}%</span>
              </div>

              <div className="result-tile">
                <span className="tile-label">Human Review Flag</span>
                <span className={`badge ${result.human_review_required ? 'bg-critical' : 'bg-low'}`}>
                  {result.human_review_required ? 'REQUIRED' : 'BYPASS OK'}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No diagnostics processed yet. Populate the complaint field and click "Run Diagnostics".</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;