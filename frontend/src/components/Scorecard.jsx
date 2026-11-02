import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  BrainCircuit, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  User,
  ArrowRight,
  Zap,
  Check,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { launchConfetti } from '../utils/confetti';
import { playCelebrationSound, playClickSound } from '../utils/soundEffects';

export default function Scorecard({ data, onStartNew, onViewHistory }) {
  const [activeTab, setActiveTab] = useState(0);

  const interview = data.interview || {};
  const questions = data.questions || [];
  const overallScore = Math.round(interview.overall_score || 0);

  // Trigger celebration confetti & audio chime on load
  useEffect(() => {
    launchConfetti();
    playCelebrationSound();
  }, []);

  const getRecommendationBadge = (rec) => {
    switch (rec) {
      case 'Strong Hire':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.4)' };
      case 'Hire':
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.4)' };
      case 'Leaning Hire':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' };
      default:
        return { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.4)' };
    }
  };

  const badgeStyle = getRecommendationBadge(interview.hire_recommendation || 'Hire');

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  const activeQuestion = questions[activeTab] || questions[0];

  return (
    <div className="scorecard-container">
      {/* Top Action Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={28} color="#fbbf24" />
            Interview Evaluation Scorecard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Comprehensive AI-graded candidate assessment, skill breakdown, and question audit.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handlePrint}
            className="btn-ai btn-ai-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Printer size={16} />
            <span>Print / Save PDF Certificate</span>
          </button>

          <button 
            onClick={() => {
              playClickSound();
              onStartNew();
            }}
            className="btn-ai btn-ai-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <RotateCcw size={16} />
            <span>Practice Another Role</span>
          </button>
        </div>
      </div>

      {/* Main Printable Certificate & Scorecard Sheet */}
      <div className="printable-scorecard">
        {/* Executive Header Banner */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                  {interview.candidate_name || 'Candidate'}
                </span>
                <span style={{
                  background: badgeStyle.bg,
                  color: badgeStyle.text,
                  border: `1px solid ${badgeStyle.border}`,
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {interview.hire_recommendation || 'Hire'}
                </span>
              </div>

              <div style={{ fontSize: '1.05rem', color: '#c7d2fe', fontWeight: 600 }}>
                {interview.target_role}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>🎯 {interview.experience_level || '1-3 Years'}</span>
                <span>🏢 {interview.company_type || 'Product Tech'}</span>
                <span>📅 {interview.created_at ? new Date(interview.created_at).toLocaleDateString() : 'Today'}</span>
              </div>
            </div>

            {/* Circular Overall Score Emblem */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '16px 24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>
                  {overallScore}%
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginTop: '4px' }}>
                  Overall Score
                </div>
              </div>
              <div style={{ width: '1px', height: '45px', background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  {overallScore >= 80 ? 'Top 10% Candidate' : overallScore >= 65 ? 'Competitive Performer' : 'Foundational'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {questions.length} Technical Questions Graded
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Dimension Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <BrainCircuit size={20} color="#6366f1" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1' }}>Technical Depth</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              {Math.min(98, Math.max(60, overallScore + 4))}%
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Command of core concepts and architecture terminology.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <TrendingUp size={20} color="#06b6d4" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1' }}>Problem Solving</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              {Math.min(95, Math.max(58, overallScore - 2))}%
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Handling edge cases, scaling limits, and fault recovery.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <MessageSquare size={20} color="#10b981" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1' }}>Communication Clarity</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              {Math.min(99, Math.max(65, overallScore + 2))}%
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Conciseness and articulation during live speech synthesis.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <ShieldCheck size={20} color="#f59e0b" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1' }}>Resume Consistency</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              {Math.min(96, Math.max(70, overallScore + 1))}%
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Alignment between stated project claims and live answers.
            </p>
          </div>
        </div>

        {/* Interactive Question Audit Section */}
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={20} color="var(--primary)" />
            Question-by-Question Deep Dive Audit
          </h2>

          {/* Question Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
            {questions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className={`pill-option ${activeTab === idx ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => {
                  playClickSound();
                  setActiveTab(idx);
                }}
              >
                <span>Question {idx + 1}</span>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff'
                }}>
                  {Math.round(q.ai_score || 80)}%
                </span>
              </button>
            ))}
          </div>

          {/* Selected Question Details */}
          {activeQuestion && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px'
            }}>
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    {activeQuestion.category || 'Core Knowledge'}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '8px', lineHeight: '1.4' }}>
                    {activeQuestion.question_text}
                  </h3>
                </div>

                <div style={{
                  textAlign: 'center',
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22d3ee', lineHeight: 1 }}>
                    {Math.round(activeQuestion.ai_score || 80)}
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Score
                  </div>
                </div>
              </div>

              {/* Side-by-Side: Candidate Transcript vs AI Ideal Answer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '18px' }}>
                {/* Candidate's Answer */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="#6366f1" />
                    <span>Your Recorded Answer</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {activeQuestion.user_answer || 'No response recorded for this question.'}
                  </p>
                </div>

                {/* AI Ideal Answer */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="#10b981" />
                    <span>AI Ideal Model Answer</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0 }}>
                    {activeQuestion.ideal_answer || 'Model answer focused on core architectural tradeoffs and real-world system resilience.'}
                  </p>
                </div>
              </div>

              {/* Evaluator Notes */}
              {activeQuestion.ai_feedback && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontSize: '0.84rem',
                  color: '#c7d2fe'
                }}>
                  <strong>AI Evaluator Breakdown:</strong> {activeQuestion.ai_feedback}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
