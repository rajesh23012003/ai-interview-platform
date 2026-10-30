import React from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function Scorecard({ data, onStartNew, onViewHistory }) {
  const interview = data.interview || {};
  const questions = data.questions || [];

  const overallScore = Math.round(interview.overall_score || 0);

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
    window.print();
  };

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
            <span>Print Official Certificate</span>
          </button>

          <button 
            onClick={onStartNew}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  {interview.candidate_name || 'Candidate'}
                </span>
                <span style={{
                  background: badgeStyle.bg,
                  color: badgeStyle.text,
                  border: `1px solid ${badgeStyle.border}`,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  {interview.hire_recommendation || 'Hire'}
                </span>
              </div>

              <div style={{ fontSize: '0.88rem', color: '#c7d2fe', fontWeight: 600 }}>
                {interview.target_role} • {interview.experience_level}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Target Track: {interview.company_type || 'Product Startup'} • Verified AI Mock Session
              </div>
            </div>

            {/* Giant Score Circle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="score-circle" style={{ '--score': overallScore }}>
                <div className="score-circle-inner">
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                    {overallScore}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    OUT OF 100
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                  Overall Assessment
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  {overallScore >= 80 ? 'Top 10% Candidate' : (overallScore >= 65 ? 'Competitive Candidate' : 'Emerging Candidate')}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Ready for live company interviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Metric Gauges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>TECHNICAL ACCURACY</span>
              <BrainCircuit size={18} color="#818cf8" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              {Math.round(interview.technical_score || 85)}%
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${interview.technical_score || 85}%`, height: '100%', background: '#6366f1' }} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROBLEM SOLVING</span>
              <TrendingUp size={18} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              {Math.round(interview.problem_solving_score || 88)}%
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${interview.problem_solving_score || 88}%`, height: '100%', background: '#06b6d4' }} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>COMMUNICATION</span>
              <MessageSquare size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              {Math.round(interview.communication_score || 82)}%
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${interview.communication_score || 82}%`, height: '100%', background: '#10b981' }} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>CONFIDENCE & PACE</span>
              <ShieldCheck size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              {Math.round(interview.confidence_score || 80)}%
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${interview.confidence_score || 80}%`, height: '100%', background: '#f59e0b' }} />
            </div>
          </div>
        </div>

        {/* AI Qualitative Feedback Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 800, fontSize: '0.88rem', marginBottom: '10px' }}>
              <CheckCircle2 size={18} />
              <span>KEY CANDIDATE STRENGTHS</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
              {interview.key_strengths || 'Strong conceptual accuracy, structured explanations, good communication.'}
            </p>
          </div>

          <div className="glass-card" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 800, fontSize: '0.88rem', marginBottom: '10px' }}>
              <AlertCircle size={18} />
              <span>ACTIONABLE IMPROVEMENT AREAS</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
              {interview.areas_to_improve || 'Incorporate more system metrics, discuss caching layers and trade-offs.'}
            </p>
          </div>
        </div>

        {/* Question-by-Question Audit */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '20px' }}>
            Question-by-Question Detailed Audit
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {questions.map((q, idx) => (
              <div 
                key={q.id || idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 800
                    }}>
                      {q.question_number}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {q.category}
                    </span>
                  </div>

                  <span style={{
                    background: q.score >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: q.score >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 800
                  }}>
                    Score: {q.score} / 100
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.4, marginBottom: '12px' }}>
                  {q.question_text}
                </h3>

                {/* Candidate's answer */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    CANDIDATE RESPONSE TRANSCRIPT:
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                    "{q.user_answer || 'No spoken answer recorded.'}"
                  </div>
                </div>

                {/* AI Feedback */}
                <div style={{ fontSize: '0.82rem', color: '#c7d2fe', marginBottom: '10px', lineHeight: 1.5 }}>
                  <strong>AI Feedback:</strong> {q.feedback}
                </div>

                {/* Model Answer */}
                {q.ideal_answer && (
                  <div style={{
                    borderLeft: '2px solid #818cf8',
                    paddingLeft: '12px',
                    fontSize: '0.78rem',
                    color: '#94a3b8',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: '#818cf8' }}>Recommended Model Architecture:</strong> {q.ideal_answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
