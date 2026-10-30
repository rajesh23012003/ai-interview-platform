import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  UploadCloud,
  FileCheck,
  AlertCircle,
  Code2,
  Trash2,
  FileUp
} from 'lucide-react';

const SAMPLE_RESUMES = {
  fullstack: `AARAV SHARMA
Email: aarav.sharma@email.com | Phone: +91 98765 43210 | GitHub: github.com/aarav | LinkedIn: linkedin.com/in/aarav

SUMMARY
Full Stack Engineer with 2+ years of experience designing and deploying scalable web applications using React 19, Node.js, Express, and PostgreSQL. Experienced with microservices, Redis caching, Docker, and AWS cloud deployments.

TECHNICAL SKILLS
• Languages: JavaScript (ES6+), TypeScript, SQL, Python
• Frontend: React.js, Next.js, Redux Toolkit, TailwindCSS, HTML5/CSS3
• Backend: Node.js, Express.js, RESTful APIs, WebSockets, GraphQL
• Databases: PostgreSQL, MongoDB, Redis, SQLite
• Cloud & DevOps: AWS (EC2, S3), Docker, Git, CI/CD GitHub Actions

EXPERIENCE & PROJECTS
1. E-Commerce Order & Inventory System (Full Stack)
• Architected an event-driven order processing engine in Node.js and PostgreSQL, handling 5,000+ daily orders with sub-100ms latency.
• Integrated Redis caching to reduce database read pressure by 42% on peak traffic spikes.
• Designed responsive React dashboard with real-time order tracking via WebSockets.

2. Real-Time Collaborative Task Manager
• Developed a Trello-like kanban board with drag-and-drop React state management and optimistic UI updates.
• Built secure JWT authentication with refresh token rotation in httpOnly cookies.
• Containerized the application using Docker and deployed onto AWS EC2 with PM2 process manager.`,

  frontend: `PRIYA PATEL
Email: priya.patel@email.com | Portfolio: priyadev.io | GitHub: github.com/priyapatel

SUMMARY
Frontend Engineer with 2 years of experience specializing in React, Next.js, TypeScript, and modern state architecture. Passionate about Core Web Vitals optimization, accessible UI/UX, and component libraries.

TECHNICAL SKILLS
• Core: React, TypeScript, JavaScript (ES2024), Next.js (App Router), HTML5, CSS3/SCSS
• State & Data: TanStack Query (React Query), Zustand, Redux Toolkit, Context API
• Styling & Animation: TailwindCSS, Framer Motion, CSS Modules, Radix UI
• Testing & Build: Jest, React Testing Library, Vite, Webpack, ESLint

EXPERIENCE & PROJECTS
1. High-Performance FinTech Analytics Dashboard
• Built an interactive investment dashboard in React 19 rendering real-time streaming market charts.
• Optimized Core Web Vitals, achieving 98 Lighthouse Performance score and cutting LCP from 3.2s to 1.1s.
• Designed a reusable atomic design component library documented with Storybook.`,

  backend: `ROHAN VERMA
Email: rohan.verma@email.com | GitHub: github.com/rohanv

SUMMARY
Backend Software Engineer focused on high-throughput microservices, distributed system design, relational database optimization, and cloud infrastructure.

TECHNICAL SKILLS
• Backend: Node.js, Express, Python (FastAPI), Go (basic), REST APIs, gRPC
• Databases: PostgreSQL, MySQL, Redis, MongoDB, ElasticSearch
• Architecture: Microservices, Event-Driven (Kafka, RabbitMQ), Docker, Kubernetes, AWS

EXPERIENCE & PROJECTS
1. Distributed Rate Limiter & API Gateway Service
• Implemented a Token Bucket distributed rate limiting middleware using Redis and Lua scripts.
• Decreased server crash rates to 0% during distributed DDoS stress testing.
• Integrated Prometheus and Grafana for real-time latency monitoring.`
};

export default function SetupScreen({ onStartInterview }) {
  const [candidateName, setCandidateName] = useState('Aarav Sharma');
  const [role, setRole] = useState('Full Stack Engineer (React & Node.js)');
  const [experience, setExperience] = useState('1-3 Years Experience');
  const [companyType, setCompanyType] = useState('Product Startup (High Velocity)');
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES.fullstack);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (!uploadedFileName) {
      if (selectedRole.includes('Front')) {
        setResumeText(SAMPLE_RESUMES.frontend);
      } else if (selectedRole.includes('Back')) {
        setResumeText(SAMPLE_RESUMES.backend);
      } else {
        setResumeText(SAMPLE_RESUMES.fullstack);
      }
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setUploadedFileName(file.name);

    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const formData = new FormData();
        formData.append('resume_file', file);

        const res = await fetch('/api/resume/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          setResumeText(data.extractedText);
          setResumeAnalysis(data.analysis);
        } else {
          alert(data.message || 'Error parsing PDF document');
        }
      } else {
        // Text or Markdown
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          setResumeText(text);
          triggerAutoScan(text);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Unable to read resume file. You can also paste text directly.');
    } finally {
      setUploadingFile(false);
    }
  };

  const triggerAutoScan = async (text) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: candidateName,
          target_role: role,
          resume_text: text
        })
      });
      const data = await res.json();
      if (data.success) {
        setResumeAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClearResume = () => {
    setResumeText('');
    setUploadedFileName('');
    setResumeAnalysis(null);
  };

  const handleAnalyzeResume = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: candidateName,
          target_role: role,
          resume_text: resumeText
        })
      });
      const data = await res.json();
      if (data.success) {
        setResumeAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to analyze resume:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLaunch = () => {
    onStartInterview({
      candidateName,
      role,
      experience,
      companyType,
      resumeText,
      resumeAnalysis
    });
  };

  return (
    <div className="setup-container">
      {/* Hero Intro */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#818cf8',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '14px'
        }}>
          <Sparkles size={15} />
          <span>AI-POWERED TECHNICAL & HR INTERVIEWS</span>
        </div>
        <h1 className="hero-title">Prepare with Real-Time AI Video & Voice Interviewer</h1>
        <p className="hero-subtitle" style={{ margin: '0 auto' }}>
          Select your target role, paste your resume, and let our interactive AI conduct a live technical round with real-time speech, webcam view, and in-depth scorecard feedback.
        </p>
      </div>

      {/* Main Grid: Settings & Resume */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Interview Settings */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={20} color="var(--primary)" />
            Interview Target Configuration
          </h2>

          <div className="input-group">
            <label className="input-label">Candidate Name</label>
            <input 
              type="text" 
              className="text-input" 
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Target Role</label>
            <select 
              className="select-input"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="Full Stack Engineer (React & Node.js)">Full Stack Engineer (React & Node.js)</option>
              <option value="Frontend Developer (React & TypeScript)">Frontend Developer (React & TypeScript)</option>
              <option value="Backend Developer (Node.js & Python)">Backend Developer (Node.js & Distributed Systems)</option>
              <option value="Data Analyst / Data Scientist">Data Analyst / Data Scientist</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Experience Bracket</label>
            <select 
              className="select-input"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="Fresher / College Graduate (0-1 Year)">Fresher / College Graduate (0-1 Year)</option>
              <option value="1-3 Years Experience (Junior-Mid)">1-3 Years Experience (Junior-Mid)</option>
              <option value="3-5 Years Experience (Senior)">3-5 Years Experience (Senior)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Target Company Culture</label>
            <select 
              className="select-input"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
            >
              <option value="Product Startup (High Velocity)">Product Startup (High Velocity, Problem Solving)</option>
              <option value="Tier-1 Big Tech / FAANG">Tier-1 Big Tech / FAANG (In-depth Algorithms & Scalability)</option>
              <option value="Enterprise / Global Consultancy">Enterprise / Global Consultancy (Robust Architecture & Clean Code)</option>
            </select>
          </div>

          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            fontSize: '0.8rem',
            color: '#c7d2fe',
            display: 'flex',
            gap: '10px'
          }}>
            <Code2 size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
            <div>
              <strong>Adaptive Questioning:</strong> The AI will analyze your specific resume projects and generate 4 targeted technical and design questions tailored to your background.
            </div>
          </div>
        </div>

        {/* Right Column: Resume Input & ATS Analysis */}
        <div className="glass-card">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept=".pdf,.txt,.md" 
            style={{ display: 'none' }} 
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="var(--accent-cyan)" />
              Candidate Resume
            </h2>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="btn-ai btn-ai-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
              >
                <FileUp size={14} />
                <span>{uploadingFile ? 'Extracting PDF...' : 'Upload PDF / Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleAnalyzeResume}
                disabled={analyzing}
                className="btn-ai btn-ai-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Sparkles size={14} color="var(--accent-cyan)" />
                <span>{analyzing ? 'Scanning...' : 'Scan ATS'}</span>
              </button>
            </div>
          </div>

          {uploadedFileName && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              fontSize: '0.78rem',
              color: '#67e8f9',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#06b6d4" />
                <span>Uploaded: <strong>{uploadedFileName}</strong> (Text Extracted)</span>
              </div>
              <button
                type="button"
                onClick={handleClearResume}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.72rem' }}
              >
                Remove
              </button>
            </div>
          )}

          <div className="input-group" style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="input-label" style={{ margin: 0 }}>
                {uploadedFileName ? 'Extracted Resume Content' : 'Paste Your Resume or Edit Below'}
              </label>
              {resumeText && (
                <button
                  type="button"
                  onClick={handleClearResume}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              )}
            </div>
            <textarea
              className="text-input"
              style={{ height: '220px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your own resume content here (Skills, Experience, Education, Projects)..."
            />
          </div>

          {/* Quick preset buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Or use template:</span>
            <button
              type="button"
              onClick={() => setResumeText(SAMPLE_RESUMES.fullstack)}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              Full Stack
            </button>
            <button
              type="button"
              onClick={() => setResumeText(SAMPLE_RESUMES.frontend)}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              Frontend
            </button>
            <button
              type="button"
              onClick={() => setResumeText(SAMPLE_RESUMES.backend)}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              Backend
            </button>
          </div>

          {/* Real-time ATS Preview if Analyzed */}
          {resumeAnalysis && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  ATS KEYWORD ANALYSIS
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-emerald)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  ATS Match: {resumeAnalysis.atsScore}%
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {resumeAnalysis.skillsFound.map((skill, i) => (
                  <span key={i} style={{
                    background: 'rgba(99, 102, 241, 0.18)',
                    color: '#c7d2fe',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    {skill}
                  </span>
                ))}
              </div>

              {resumeAnalysis.suggestions.length > 0 && (
                <div style={{ fontSize: '0.74rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} />
                  <span>Tip: {resumeAnalysis.suggestions[0]}</span>
                </div>
              )}
            </div>
          )}

          {/* Launch Button */}
          <button
            type="button"
            className="btn-ai btn-ai-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            onClick={handleLaunch}
          >
            <span>Enter AI Interview Room</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
