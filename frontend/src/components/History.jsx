import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Calendar, 
  Trophy, 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';

export default function History({ onViewReport, onStartNew }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/interview/history');
      const data = await res.json();
      if (data.success) {
        setInterviews(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="history-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HistoryIcon size={26} color="var(--primary)" />
            Interview History & Score Archives
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Review your past mock interview attempts and track your progress over time.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="btn-ai btn-ai-primary"
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
        >
          <span>Start New Interview</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading historical sessions...
        </div>
      ) : interviews.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
          <Trophy size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            No Completed Sessions Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 20px' }}>
            Take your first AI mock interview round to unlock personalized scorecards and performance feedback.
          </p>
          <button onClick={onStartNew} className="btn-ai btn-ai-primary">
            Start Your First Mock Round
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {interviews.map((item) => {
            const badge = getRecommendationBadge(item.hire_recommendation || 'Hire');
            const score = Math.round(item.overall_score || 0);

            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  border: '1px solid var(--border)'
                }}
                onClick={() => onViewReport(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Score badge circle */}
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: score >= 80 ? 'rgba(16, 185, 129, 0.15)' : (score >= 65 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                    border: `2px solid ${score >= 80 ? '#10b981' : (score >= 65 ? '#6366f1' : '#f59e0b')}`,
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    <span>{score}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                        {item.target_role}
                      </h3>
                      <span style={{
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {item.hire_recommendation || 'Hire'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '14px' }}>
                      <span>Candidate: <strong style={{ color: '#cbd5e1' }}>{item.candidate_name}</strong></span>
                      <span>•</span>
                      <span>{item.experience_level}</span>
                      <span>•</span>
                      <span>{item.company_type}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
                    <div>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}</div>
                    <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '2px' }}>
                      Tech Score: {Math.round(item.technical_score || 85)}%
                    </div>
                  </div>

                  <button
                    className="btn-ai btn-ai-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  >
                    <span>View Scorecard</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
