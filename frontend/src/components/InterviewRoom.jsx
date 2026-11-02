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
  RotateCcw,
  Lightbulb,
  Zap,
  Check,
  Flame,
  ArrowRight,
  Globe,
  Languages
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/soundEffects';

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
  const [showHint, setShowHint] = useState(false);
  const [showHindi, setShowHindi] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState(interviewData.voiceLanguage || 'en-IN');

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const questions = interviewData.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Helper to find optimal voice (Indian English, Hindi, or fallback)
  const getVoiceForLanguage = (langCode) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    
    if (langCode === 'hi-IN') {
      return voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('hemant')) ||
             voices.find(v => v.lang.includes('IN')) ||
             null;
    }
    if (langCode === 'en-IN') {
      return voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('neerja')) ||
             voices.find(v => v.lang.includes('IN')) ||
             null;
    }
    return voices.find(v => v.lang === 'en-US' || v.lang.startsWith('en')) || null;
  };

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = voiceLanguage;

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setUserAnswer(transcript.trim());
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

  // Update recognition language when voiceLanguage changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = voiceLanguage;
    }
  }, [voiceLanguage]);

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
      setShowHint(false);
      if (voiceLanguage === 'hi-IN' && currentQuestion.hindi_question) {
        speakQuestion(currentQuestion.hindi_question, 'hi-IN');
      } else {
        speakQuestion(currentQuestion.question_text, voiceLanguage);
      }
    }
  }, [currentQuestionIndex]);

  const speakQuestion = (text, forcedLang = null) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const currentLang = forcedLang || voiceLanguage;

      let textToSpeak = text;
      if (currentLang === 'hi-IN' && currentQuestion && currentQuestion.hindi_question) {
        textToSpeak = currentQuestion.hindi_question;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.96; // clear Indian cadence
      utterance.pitch = 1.0;
      utterance.lang = currentLang;

      const voice = getVoiceForLanguage(currentLang);
      if (voice) {
        utterance.voice = voice;
      }

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

  const handleLanguageSwitch = (newLang) => {
    playClickSound();
    setVoiceLanguage(newLang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang;
    }
    if (newLang === 'hi-IN' && currentQuestion.hindi_question) {
      speakQuestion(currentQuestion.hindi_question, 'hi-IN');
    } else {
      speakQuestion(currentQuestion.question_text, newLang);
    }
  };

  const toggleRecording = () => {
    playClickSound();
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
        recognitionRef.current.lang = voiceLanguage;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const toggleCamera = () => {
    playClickSound();
    setCameraActive(prev => !prev);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please speak or type your answer before submitting.');
      return;
    }

    playClickSound();
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
        playSuccessSound();
        setLastFeedback(data.evaluation);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = async () => {
    playClickSound();
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
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        marginBottom: '22px',
        padding: '14px 24px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(16px)'
      }}>
        {/* Role & Candidate Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Bot size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
              {interviewData.target_role}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Candidate: <strong style={{ color: '#e2e8f0' }}>{interviewData.candidate_name}</strong> • {interviewData.experience_level}
            </div>
          </div>
        </div>

        {/* Dynamic Voice Assistant / Accent Switcher */}
        <div className="lang-selector-group">
          <button
            type="button"
            className={`lang-pill-btn ${voiceLanguage === 'en-IN' ? 'active' : ''}`}
            onClick={() => handleLanguageSwitch('en-IN')}
            title="Indian English voice and accent"
          >
            🇮🇳 Indian English (en-IN)
          </button>
          <button
            type="button"
            className={`lang-pill-btn ${voiceLanguage === 'hi-IN' ? 'active' : ''}`}
            onClick={() => handleLanguageSwitch('hi-IN')}
            title="Hindi voice assistant"
          >
            🇮🇳 हिंदी Voice AI (hi-IN)
          </button>
          <button
            type="button"
            className={`lang-pill-btn ${voiceLanguage === 'en-US' ? 'active' : ''}`}
            onClick={() => handleLanguageSwitch('en-US')}
            title="Global English"
          >
            🌐 English (US)
          </button>
        </div>

        {/* Stepper Progress & Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="stepper-progress">
            {questions.map((q, idx) => {
              const isDone = idx < currentQuestionIndex;
              const isActive = idx === currentQuestionIndex;
              return (
                <div 
                  key={idx} 
                  className={`stepper-step ${isActive ? 'active' : isDone ? 'completed' : ''}`}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : <span>Q{idx + 1}</span>}
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.86rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#38bdf8'
          }}>
            <Clock size={15} />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <button 
            onClick={onExit}
            className="btn-ai btn-ai-danger"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Exit Round
          </button>
        </div>
      </div>

      {/* Main Dual Viewport: AI Interrogator & Candidate Webcam */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left: AI Holographic Presenter */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.4)'
                }}>
                  {currentQuestion.category || 'Technical Assessment'}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#22d3ee',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}>
                  {currentQuestion.difficulty || 'Medium'}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: voiceLanguage === 'hi-IN' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: voiceLanguage === 'hi-IN' ? '#fbbf24' : '#34d399',
                  border: `1px solid ${voiceLanguage === 'hi-IN' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                }}>
                  {voiceLanguage === 'hi-IN' ? '🇮🇳 हिंदी Voice Mode' : '🇮🇳 Indian English Mode'}
                </span>
              </div>

              {/* AI Voice State Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isAiSpeaking ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06b6d4', fontSize: '0.78rem', fontWeight: 700 }}>
                    <div className="audio-wave-container" style={{ height: '20px' }}>
                      <div className="wave-bar" style={{ height: '6px' }} />
                      <div className="wave-bar" style={{ height: '14px' }} />
                      <div className="wave-bar" style={{ height: '10px' }} />
                    </div>
                    <span>AI Speaking...</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AI Listening</span>
                )}
              </div>
            </div>

            {/* AI Avatar Display */}
            <div style={{ display: 'flex', alignItems: 'start', gap: '20px', marginBottom: '14px' }}>
              <div className={`ai-avatar-wrapper ${isAiSpeaking ? 'ai-avatar-speaking' : ''}`}>
                <div className="ai-avatar-pulse" />
                <div className="ai-avatar-circle">
                  <Bot size={38} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Question {currentQuestion.question_number} of {questions.length}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', lineHeight: '1.4', marginTop: '4px' }}>
                  {currentQuestion.question_text}
                </div>
              </div>
            </div>

            {/* Hindi Question & Translation Box */}
            {currentQuestion.hindi_question && (
              <div className="hindi-translation-box">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🇮🇳 हिंदी अनुवाद (Hindi Question)
                  </span>
                  <button
                    onClick={() => {
                      playClickSound();
                      speakQuestion(currentQuestion.hindi_question, 'hi-IN');
                    }}
                    className="btn-ai btn-ai-secondary"
                    style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                    title="Speak in Hindi"
                  >
                    <Volume2 size={12} />
                    <span>हिंदी में सुनें</span>
                  </button>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#fef3c7', margin: 0, fontWeight: 500, lineHeight: '1.45' }}>
                  {currentQuestion.hindi_question}
                </p>
              </div>
            )}
          </div>

          {/* Action Row: Voice controls & Hint */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border)', marginTop: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                onClick={() => {
                  playClickSound();
                  speakQuestion(currentQuestion.question_text, 'en-IN');
                }}
                className="btn-ai btn-ai-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                disabled={isAiSpeaking}
              >
                <Volume2 size={15} />
                <span>Repeat in Indian English</span>
              </button>

              {currentQuestion.hindi_question && (
                <button
                  onClick={() => {
                    playClickSound();
                    speakQuestion(currentQuestion.hindi_question, 'hi-IN');
                  }}
                  className="btn-ai btn-ai-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                  disabled={isAiSpeaking}
                >
                  <Volume2 size={15} />
                  <span>हिंदी में सुनें (Hindi)</span>
                </button>
              )}

              <button
                onClick={() => {
                  playClickSound();
                  setShowHint(prev => !prev);
                }}
                className="btn-ai btn-ai-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Lightbulb size={15} color={showHint ? '#f59e0b' : '#94a3b8'} />
                <span>{showHint ? 'Hide Hint' : 'Need a Clue?'}</span>
              </button>
            </div>

            {showHint && (
              <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontStyle: 'italic', width: '100%' }}>
                💡 Tip: Structure answer with Architecture ➔ Execution ➔ Failure mitigation.
              </span>
            )}
          </div>
        </div>

        {/* Right: Candidate Live Webcam View */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="proctor-video-feed">
            {/* Futuristic Corner Brackets */}
            <div className="proctor-corner-tl" />
            <div className="proctor-corner-tr" />
            <div className="proctor-corner-bl" />
            <div className="proctor-corner-br" />

            {/* Proctoring HUD Badge */}
            <div className="proctor-hud-badge">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', animation: 'recordPulse 1s infinite' }} />
              <span style={{ color: '#fff' }}>LIVE PROCTOR</span>
              <span style={{ color: '#22d3ee' }}>• AI VERIFIED</span>
            </div>

            {/* Video Element or Off Camera State */}
            {cameraActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                gap: '8px'
              }}>
                <User size={54} />
                <span style={{ fontSize: '0.85rem' }}>Camera Paused (Audio Only)</span>
              </div>
            )}
          </div>

          {/* Camera & Audio Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={toggleCamera}
                className="btn-ai btn-ai-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                {cameraActive ? <VideoOff size={15} /> : <Video size={15} />}
                <span>{cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}</span>
              </button>
            </div>

            <span style={{ fontSize: '0.78rem', color: isRecording ? '#f43f5e' : 'var(--text-muted)', fontWeight: isRecording ? 700 : 400 }}>
              {isRecording 
                ? (voiceLanguage === 'hi-IN' ? '🔴 हिंदी वॉइस सुन रहे हैं...' : '🔴 Listening to Indian English...') 
                : (voiceLanguage === 'hi-IN' ? 'माइक तैयार (हिंदी / Hinglish)' : 'Microphone Ready (Indian English)')}
            </span>
          </div>
        </div>
      </div>

      {/* Answer Input Station */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
              Your Response
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({userAnswer ? userAnswer.split(/\s+/).filter(Boolean).length : 0} words)
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#38bdf8'
            }}>
              {voiceLanguage === 'hi-IN' ? '🇮🇳 Hindi / Hinglish Active' : '🇮🇳 Indian English Active'}
            </span>
          </div>

          {/* Quick Clear */}
          {userAnswer && (
            <button
              onClick={() => {
                playClickSound();
                setUserAnswer('');
              }}
              className="btn-ai btn-ai-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              Clear Answer
            </button>
          )}
        </div>

        {/* Textarea for answer / live speech transcription */}
        <textarea
          className="text-input"
          rows={5}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={
            isRecording 
              ? (voiceLanguage === 'hi-IN' ? "हिंदी या Hinglish में बोलें, real-time transcription chal raha hai..." : "Listening to your Indian English voice in real-time...") 
              : (voiceLanguage === 'hi-IN' 
                  ? "माइक बटन दबाकर हिंदी या Hinglish में जवाब दें (उदा: 'React me Virtual DOM memory me create hota hai aur Fiber architecture incremental rendering karta hai...')" 
                  : "Speak your answer using the microphone button below in Indian English, or type your response directly...")
          }
          style={{
            fontSize: '0.95rem',
            lineHeight: '1.5',
            resize: 'vertical',
            borderColor: isRecording ? 'var(--accent-rose)' : undefined,
            boxShadow: isRecording ? '0 0 16px rgba(244, 63, 94, 0.3)' : undefined
          }}
        />

        {/* Action Controls Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '18px' }}>
          {/* Recording Mic Button */}
          <button
            onClick={toggleRecording}
            className={`btn-ai ${isRecording ? 'btn-record-active' : 'btn-ai-accent'}`}
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            <span>
              {isRecording 
                ? 'Stop Recording' 
                : (voiceLanguage === 'hi-IN' ? 'Start Hindi Voice Answering (माइक चालू करें)' : 'Start Voice Answering (Speech-to-Text)')}
            </span>
          </button>

          {/* Submit Answer Button */}
          <button
            onClick={handleSubmitAnswer}
            disabled={evaluating || !userAnswer.trim()}
            className="btn-ai btn-ai-primary"
            style={{ padding: '12px 28px', fontSize: '0.98rem' }}
          >
            {evaluating ? (
              <>
                <Sparkles size={18} className="spin" />
                <span>AI Evaluating Answer...</span>
              </>
            ) : (
              <>
                <span>Submit Answer for AI Scoring</span>
                <Send size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Instant Evaluation Modal Sheet */}
      {lastFeedback && (
        <div className="feedback-modal-backdrop">
          <div className="feedback-modal-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                }}>
                  <Award size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    Question {currentQuestion.question_number} AI Evaluation
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Instant Benchmarking against Industry Standards
                  </span>
                </div>
              </div>

              {/* Score Chip */}
              <div style={{
                textAlign: 'right',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#818cf8', lineHeight: 1 }}>
                  {Math.round(lastFeedback.score || 80)}/100
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Score Awarded
                </div>
              </div>
            </div>

            {/* Critique Feedback */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '18px',
              lineHeight: '1.5',
              fontSize: '0.92rem',
              color: '#e2e8f0'
            }}>
              {lastFeedback.feedback}
            </div>

            {/* Strengths & Missing Points */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {/* Strengths */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Key Points Hit</span>
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
                  {lastFeedback.strengths && lastFeedback.strengths.length > 0 ? (
                    lastFeedback.strengths.map((s, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>)
                  ) : (
                    <li>Articulated thoughts clearly with relevant terminology.</li>
                  )}
                </ul>
              </div>

              {/* Missed / Suggestions */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={15} />
                  <span>Points to Add for 100%</span>
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
                  {lastFeedback.missingPoints && lastFeedback.missingPoints.length > 0 ? (
                    lastFeedback.missingPoints.map((m, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{m}</li>)
                  ) : (
                    <li>Mention concrete performance benchmarks or edge case error recovery.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Next Action Button */}
            <button
              onClick={handleNextQuestion}
              className="btn-ai btn-ai-primary"
              style={{ width: '100%', padding: '14px 20px', fontSize: '1rem' }}
            >
              <span>{currentQuestionIndex + 1 < questions.length ? 'Continue to Next Question' : 'View Full Final Scorecard'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
