import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Award,
  AlertCircle,
  HelpCircle,
  Bot,
  User,
  RotateCcw
} from 'lucide-react';

export default function InterviewRoom({ interviewData, onFinishInterview, onExit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [cameraActive, setCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState(false);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const questions = interviewData.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setUserAnswer(prev => transcript.trim());
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // WebCam setup
  useEffect(() => {
    let stream = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        console.warn('Webcam permission not granted or unavailable:', err);
        setCameraError(true);
        setCameraActive(false);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Speak question aloud when question changes
  useEffect(() => {
    if (currentQuestion) {
      speakQuestion(currentQuestion.question_text);
    }
  }, [currentQuestionIndex]);

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-text is not supported in this browser. You can type your answer directly in the box!');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please speak or type your answer before submitting.');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    stopSpeaking();

    setEvaluating(true);
    try {
      const res = await fetch('/api/interview/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId: interviewData.interviewId,
          questionId: currentQuestion.id,
          userAnswer: userAnswer.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        setLastFeedback(data.evaluation);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = async () => {
    setLastFeedback(null);
    setUserAnswer('');

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed all questions -> generate full report card
      setEvaluating(true);
      try {
        const res = await fetch('/api/interview/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interviewId: interviewData.interviewId })
        });
        const data = await res.json();
        if (data.success) {
          onFinishInterview(data);
        }
      } catch (err) {
        console.error('Failed to finish interview:', err);
      } finally {
        setEvaluating(false);
      }
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading interview questions...</div>;
  }

  return (
    <div className="interview-room-container">
      {/* Top Session Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        padding: '12px 20px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 800
          }}>
            QUESTION {currentQuestionIndex + 1} OF {questions.length}
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {interviewData.target_role}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c7d2fe', fontSize: '0.85rem', fontWeight: 700 }}>
            <Clock size={16} />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <button
            onClick={onExit}
            className="btn-ai btn-ai-secondary"
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            Exit Round
          </button>
        </div>
      </div>

      {/* Main Grid: AI Interviewer Video + Candidate View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* 1. AI Interviewer Screen */}
        <div className="webcam-viewport" style={{ position: 'relative', background: 'radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%)' }}>
          <div className="live-badge" style={{ background: 'rgba(99, 102, 241, 0.25)', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
            <Bot size={14} color="#818cf8" />
            <span style={{ color: '#c7d2fe' }}>AI INTERVIEWER (SOPHIA)</span>
          </div>

          {/* AI Avatar Animation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isAiSpeaking ? '0 0 40px rgba(99, 102, 241, 0.8)' : '0 0 20px rgba(99, 102, 241, 0.3)',
              transform: isAiSpeaking ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}>
              <Bot size={52} color="#fff" />
            </div>

            {/* Speaking Waveform */}
            {isAiSpeaking ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div className="audio-wave-container">
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.05em' }}>
                  SPEAKING QUESTION...
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                Listening to Candidate...
              </span>
            )}
          </div>

          {/* Re-listen controls */}
          <div style={{ position: 'absolute', bottom: '14px', right: '14px' }}>
            <button
              onClick={() => speakQuestion(currentQuestion.question_text)}
              className="btn-ai btn-ai-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.5)' }}
              title="Repeat question"
            >
              <RotateCcw size={13} />
              <span>Repeat Voice</span>
            </button>
          </div>
        </div>

        {/* 2. Candidate Live Webcam Window */}
        <div className="webcam-viewport">
          <div className="live-badge">
            <span className="rec-dot" />
            <span>LIVE VIDEO</span>
          </div>

          {cameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={40} color="#cbd5e1" />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{interviewData.candidate_name}</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Camera feed inactive (Audio & Text enabled)</span>
            </div>
          )}

          {/* Speech Mic Status Overlay */}
          {isRecording && (
            <div style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              background: 'rgba(244, 63, 94, 0.85)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(244, 63, 94, 0.5)'
            }}>
              <Mic size={14} />
              <span>TRANSCRIBING YOUR VOICE LIVE...</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Presentation Card */}
      <div className="glass-card" style={{ marginBottom: '20px', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#a5b4fc',
            padding: '2px 10px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            {currentQuestion.category}
          </span>

          <span style={{
            color: '#fbbf24',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            Difficulty: {currentQuestion.difficulty || 'Medium'}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.4, margin: '6px 0 12px' }}>
          "{currentQuestion.question_text}"
        </h3>

        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          💡 <em>Tip: Structure your response with context, the technical solution, and trade-offs.</em>
        </div>
      </div>

      {/* Answer Workspace (Voice-to-Text & Text Editor) */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Candidate Response
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              (Speak naturally via mic or type response below)
            </span>
          </div>

          {/* Voice Mic Toggle */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`btn-ai ${isRecording ? 'btn-ai-danger' : 'btn-ai-primary'}`}
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            <span>{isRecording ? 'Stop Recording Voice' : '🎙️ Speak Answer (Mic)'}</span>
          </button>
        </div>

        <textarea
          className="text-input"
          style={{
            height: '140px',
            fontSize: '0.92rem',
            lineHeight: 1.5,
            marginBottom: '16px',
            borderColor: isRecording ? '#f43f5e' : 'var(--border)'
          }}
          placeholder="Your speech transcript will automatically appear here as you speak... You can also type or polish your thoughts directly."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Word count: <strong>{userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}</strong> words
          </div>

          <button
            type="button"
            disabled={evaluating || !userAnswer.trim()}
            onClick={handleSubmitAnswer}
            className="btn-ai btn-ai-success"
            style={{ padding: '10px 22px' }}
          >
            <Sparkles size={16} />
            <span>{evaluating ? 'Evaluating with AI...' : 'Submit Answer for AI Review'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Answer Feedback Modal / Drawer */}
      {lastFeedback && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '560px', background: '#0f172a', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  AI Response Evaluation
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>
                  Question {currentQuestionIndex + 1} Performance
                </span>
              </div>

              <div style={{
                background: lastFeedback.score >= 80 ? '#10b981' : (lastFeedback.score >= 65 ? '#f59e0b' : '#ef4444'),
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 900,
                fontSize: '1rem',
                boxShadow: '0 0 14px rgba(16, 185, 129, 0.4)'
              }}>
                {lastFeedback.score} / 100
              </div>
            </div>

            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  AI Observations
                </div>
                <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
                  {lastFeedback.feedback}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '4px' }}>
                    What Went Well
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    {lastFeedback.strengths}
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '4px' }}>
                    How to Improve
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    {lastFeedback.improvements}
                  </div>
                </div>
              </div>

              {lastFeedback.idealAnswer && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border)',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontWeight: 800, color: '#818cf8', marginBottom: '6px' }}>
                    Target Ideal Approach:
                  </div>
                  <div style={{ color: '#94a3b8', lineHeight: 1.5 }}>
                    {lastFeedback.idealAnswer}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.2)' }}>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="btn-ai btn-ai-primary"
              >
                <span>{currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Complete Interview & View Scorecard'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
