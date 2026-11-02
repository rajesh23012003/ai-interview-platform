import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  History as HistoryIcon, 
  FileCheck, 
  Video, 
  Trophy,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

import SetupScreen from './components/SetupScreen';
import InterviewRoom from './components/InterviewRoom';
import Scorecard from './components/Scorecard';
import History from './components/History';

export default function App() {
  const [currentView, setCurrentView] = useState('setup'); // 'setup', 'interview', 'scorecard', 'history'
  const [activeInterviewData, setActiveInterviewData] = useState(null);
  const [scorecardData, setScorecardData] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);

  // Start interview from setup
  const handleStartInterview = async (config) => {
    setLoadingSession(true);
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: config.candidateName,
          target_role: config.role,
          experience_level: config.experience,
          company_type: config.companyType,
          resume_text: config.resumeText,
          resume_analysis: config.resumeAnalysis
        })
      });
      const data = await res.json();
      if (data.success) {
        data.voiceLanguage = config.voiceLanguage || 'en-IN';
        setActiveInterviewData(data);
        setCurrentView('interview');
      } else {
        alert(data.message || 'Error starting interview session');
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Unable to connect to AI server. Please make sure the backend is running.');
    } finally {
      setLoadingSession(false);
    }
  };

  // When all questions in interview room are answered
  const handleFinishInterview = (finalData) => {
    setScorecardData(finalData);
    setCurrentView('scorecard');
  };

  // View report from history
  const handleViewHistoricalReport = async (id) => {
    try {
      const res = await fetch(`/api/interview/${id}`);
      const data = await res.json();
      if (data.success) {
        setScorecardData(data);
        setCurrentView('scorecard');
      }
    } catch (err) {
      console.error('Failed to load scorecard:', err);
    }
  };

  return (
    <div className="app-root">
      {/* Top Navbar */}
      <header className="app-nav">
        <div className="brand-badge" onClick={() => setCurrentView('setup')}>
          <div className="brand-icon">
            <Bot size={22} />
          </div>
          <div>
            <div className="brand-name">PrepMind AI</div>
          </div>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-tab-btn ${currentView === 'setup' ? 'active' : ''}`}
            onClick={() => setCurrentView('setup')}
          >
            <Sparkles size={16} />
            <span>Practice Interview</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            <HistoryIcon size={16} />
            <span>Score Archives</span>
          </button>
        </nav>
      </header>

      {/* Main Viewport Container */}
      <main className="main-wrapper">
        {loadingSession ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', color: '#c7d2fe' }}>
            <div className="audio-wave-container" style={{ margin: '0 auto 20px' }}>
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              AI Interviewer is analyzing your resume & tailoring questions...
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Preparing webcam feed, voice synthesizer, and role benchmarks.
            </p>
          </div>
        ) : (
          <>
            {currentView === 'setup' && (
              <SetupScreen onStartInterview={handleStartInterview} />
            )}

            {currentView === 'interview' && activeInterviewData && (
              <InterviewRoom 
                interviewData={activeInterviewData}
                onFinishInterview={handleFinishInterview}
                onExit={() => setCurrentView('setup')}
              />
            )}

            {currentView === 'scorecard' && scorecardData && (
              <Scorecard 
                data={scorecardData}
                onStartNew={() => setCurrentView('setup')}
                onViewHistory={() => setCurrentView('history')}
              />
            )}

            {currentView === 'history' && (
              <History 
                onViewReport={handleViewHistoricalReport}
                onStartNew={() => setCurrentView('setup')}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
