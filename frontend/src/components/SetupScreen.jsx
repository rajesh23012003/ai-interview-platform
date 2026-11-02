import React, { useState, useRef, useEffect } from 'react';
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
  FileUp,
  Layers,
  Layout,
  Server,
  Cpu,
  Cloud,
  Terminal,
  Headphones,
  Monitor,
  Flame,
  Zap,
  Check,
  RefreshCw
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/soundEffects';

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
• Integrated Prometheus and Grafana for real-time latency monitoring.`,

  devops: `VIKAS MEHTA
Email: vikas.devops@email.com | GitHub: github.com/vikas-ops | Certifications: CKA, AWS DevOps Pro

SUMMARY
DevOps Engineer with 3 years of hands-on experience in container orchestration (Kubernetes, Docker), Infrastructure as Code (Terraform), and robust CI/CD automation pipelines (GitHub Actions, Jenkins).

TECHNICAL SKILLS
• Orchestration: Kubernetes, Docker, Helm, Docker Compose
• CI/CD: GitHub Actions, GitLab CI, Jenkins, ArgoCD
• IaC & Automation: Terraform, Ansible, CloudFormation
• Monitoring & Logging: Prometheus, Grafana, ELK Stack, Datadog
• Cloud: AWS (EKS, EC2, S3, IAM, CloudWatch)

EXPERIENCE & PROJECTS
1. Production Kubernetes (EKS) Cluster Migration
• Automated multi-tenant EKS cluster provisioning using Terraform and Helm charts.
• Implemented ArgoCD GitOps workflow, reducing deployment failure rates by 35%.
• Configured Prometheus alerts and Grafana dashboards for cluster-wide CPU and memory monitoring.`,

  aws: `ANKIT SINGH
Email: ankit.cloud@email.com | Certifications: AWS Certified Solutions Architect Associate (SAA-C03)

SUMMARY
AWS Cloud Engineer with 2+ years of experience designing secure, scalable, and highly available cloud infrastructure using Amazon Web Services.

TECHNICAL SKILLS
• Compute & Networking: AWS VPC, EC2, Auto Scaling Groups, ALB, Route53
• Storage & Databases: Amazon S3, EBS, EFS, RDS (PostgreSQL/MySQL), DynamoDB
• Security & Governance: IAM Roles & Policies, Security Groups, NACLs, KMS, AWS WAF
• Monitoring & Serverless: CloudWatch, CloudTrail, AWS Lambda, SNS, SQS

EXPERIENCE & PROJECTS
1. Highly Available 3-Tier Web App on AWS
• Designed a Multi-AZ VPC across 2 Availability Zones with isolated Public, Private App, and DB subnets.
• Configured Application Load Balancer with Auto Scaling Groups, maintaining 99.99% uptime during traffic surges.
• Automated daily snapshot backups and lifecycle policies for S3 buckets, saving 28% monthly cloud costs.`,

  linux: `RAHUL KESHARI
Email: rahul.linux@email.com | Certifications: Red Hat Certified System Administrator (RHCSA)

SUMMARY
Linux System Administrator with 3 years of experience managing enterprise RHEL, Rocky Linux, and Ubuntu servers. Proficient in Bash automation, systemd, user security, LVM, and network diagnostics.

TECHNICAL SKILLS
• OS: RHEL 8/9, CentOS, Ubuntu Server, Debian
• Scripting & Automation: Bash, Shell Scripting, Cron, Ansible
• Services: systemd, SSH, Nginx, Apache, Postfix, BIND DNS, NFS, Samba
• Storage & Security: LVM, RAID, firewalld, iptables, SELinux, ACLs, SUID/SGID
• Troubleshooting: top, htop, vmstat, iostat, tcpdump, netstat, strace

EXPERIENCE & PROJECTS
1. High-Availability Web & DNS Infrastructure
• Managed fleet of 40+ Linux virtual machines on VMware ESXi and KVM.
• Wrote automated Bash backup scripts with checksum verification and offsite rsync synchronization.
• Configured LVM volume groups and expanded logical volumes on live production servers with zero downtime.`,

  itsupport: `AMIT KUMAR
Email: amit.support@email.com | Certifications: CompTIA Network+, ITIL v4 Foundation

SUMMARY
IT Support Specialist with 2+ years of experience in enterprise technical support, Active Directory administration, Windows Server, network diagnostics, and Office 365 administration.

TECHNICAL SKILLS
• Directory Services: Active Directory Users and Computers (ADUC), Group Policy (GPO), Azure AD (Entra ID)
• Networking: TCP/IP, DNS, DHCP, VPN, Routers, Switches, Wi-Fi APs, Cabling (Cat6)
• Systems & Software: Windows 10/11, Windows Server 2019/2022, Microsoft 365 Admin, Outlook, Teams
• Ticketing & Remote Support: ServiceNow, Jira Service Desk, TeamViewer, AnyDesk, RDP

EXPERIENCE & PROJECTS
1. Tier-2 Enterprise IT Support Desk
• Resolved 1,200+ tickets annually covering network outages, domain account lockouts, and VPN issues with 98% SLA compliance.
• Managed user onboarding, offboarding, and group permissions in Active Directory and Office 365.
• Troubleshoot DNS and IP conflict issues using ipconfig, nslookup, ping, and traceroute.`,

  desktopsupport: `SANDEEP VERMA
Email: sandeep.desktop@email.com | Certifications: CompTIA A+, Microsoft Modern Desktop Administrator

SUMMARY
Desktop Support Engineer with 2+ years of hands-on experience diagnosing hardware, operating systems (Windows & macOS), printer peripherals, system imaging, and endpoint troubleshooting.

TECHNICAL SKILLS
• Hardware: Laptop/Desktop assembly, RAM/SSD upgrades, Motherboards, Power Supplies, BIOS/UEFI
• OS & Diagnostics: Windows 10/11 Pro, BSOD analysis (WinDbg, BlueScreenView), Safe Mode, Event Viewer
• Tools & Deployment: Sysprep, Windows Deployment Services (WDS), Macrium Reflect, BitLocker
• Office & Peripherals: MS Office 365, Print Spooler, Network Printers, Scanners, Docking Stations

EXPERIENCE & PROJECTS
1. Corporate Endpoint Management & Imaging
• Deployed and configured 200+ corporate laptops using standard Sysprep gold images and BitLocker drive encryption.
• Diagnosed and resolved blue screen (BSOD) driver crashes, RAM faults, and thermal throttling issues.
• Managed office network printer queues and resolved print spooler failures across 3 office floors.`
};

const ROLES_LIST = [
  {
    id: 'fullstack',
    title: 'Full Stack Engineer',
    roleVal: 'Full Stack Engineer (React & Node.js)',
    icon: Layers,
    badge: 'Trending',
    badgeColor: '#6366f1',
    desc: 'End-to-end full stack web architecture, React 19, RESTful APIs, Node.js & DBs.',
    skills: ['React 19', 'Node.js', 'PostgreSQL', 'Docker', 'Redis']
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Ops',
    roleVal: 'DevOps Engineer (Docker, K8s, CI/CD)',
    icon: Cpu,
    badge: 'High Demand',
    badgeColor: '#06b6d4',
    desc: 'Container orchestration, CI/CD pipeline automation, Terraform & Kubernetes.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Helm']
  },
  {
    id: 'aws',
    title: 'AWS Cloud Architect',
    roleVal: 'AWS Cloud Engineer (AWS, Cloud Infrastructure)',
    icon: Cloud,
    badge: 'Cloud Native',
    badgeColor: '#f59e0b',
    desc: 'High availability multi-tier cloud infrastructure, VPC, EC2, S3, IAM & Lambda.',
    skills: ['AWS VPC', 'EC2', 'S3', 'IAM', 'CloudWatch']
  },
  {
    id: 'linux',
    title: 'Linux Administrator',
    roleVal: 'Linux Administrator (RHEL, Bash, systemd)',
    icon: Terminal,
    badge: 'SysAdmin',
    badgeColor: '#10b981',
    desc: 'Enterprise Linux servers, Bash automation, systemd, LVM, firewall & security.',
    skills: ['RHEL / Ubuntu', 'Bash', 'systemd', 'LVM', 'SELinux']
  },
  {
    id: 'frontend',
    title: 'Frontend Specialist',
    roleVal: 'Frontend Developer (React & Next.js)',
    icon: Layout,
    badge: 'UI / UX',
    badgeColor: '#ec4899',
    desc: 'Core Web Vitals, accessible React components, Next.js App Router & modern state.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Performance']
  },
  {
    id: 'backend',
    title: 'Backend Architect',
    roleVal: 'Backend Developer (Node.js & Microservices)',
    icon: Server,
    badge: 'Microservices',
    badgeColor: '#8b5cf6',
    desc: 'Distributed rate limiting, event-driven Kafka architectures, SQL optimization.',
    skills: ['Node.js', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka']
  },
  {
    id: 'itsupport',
    title: 'IT Support Specialist',
    roleVal: 'IT Support Specialist (Active Directory, Network)',
    icon: Headphones,
    badge: 'Enterprise',
    badgeColor: '#3b82f6',
    desc: 'Active Directory, Windows Server, TCP/IP, Office 365, DNS & enterprise helpdesk.',
    skills: ['Active Directory', 'DNS / DHCP', 'Office 365', 'Networking']
  },
  {
    id: 'desktopsupport',
    title: 'Desktop Support',
    roleVal: 'Desktop Support Engineer (Hardware, Windows, Helpdesk)',
    icon: Monitor,
    badge: 'Hardware & OS',
    badgeColor: '#14b8a6',
    desc: 'BSOD diagnostics, laptop imaging, peripheral repair, RAM/SSD hardware upgrades.',
    skills: ['Windows 11', 'BSOD Analysis', 'Hardware Repair', 'Sysprep']
  }
];

const EXPERIENCE_OPTIONS = [
  '0-1 Years (Fresher / Junior)',
  '1-3 Years Experience',
  '3-5+ Years (Mid / Senior)'
];

const COMPANY_OPTIONS = [
  'Product Startup (High Velocity)',
  'Top Tech MAANG (High Rigor)',
  'Enterprise MNC (Scale & Security)',
  'Remote Global Team'
];

export default function SetupScreen({ onStartInterview }) {
  const [selectedRoleId, setSelectedRoleId] = useState('fullstack');
  const [candidateName, setCandidateName] = useState('Aarav Sharma');
  const [experience, setExperience] = useState('1-3 Years Experience');
  const [companyType, setCompanyType] = useState('Product Startup (High Velocity)');
  const [voiceLanguage, setVoiceLanguage] = useState('en-IN');
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES.fullstack);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  
  const fileInputRef = useRef(null);

  // Auto scan on initial load
  useEffect(() => {
    triggerAutoScan(SAMPLE_RESUMES.fullstack);
  }, []);

  const selectedRoleObj = ROLES_LIST.find(r => r.id === selectedRoleId) || ROLES_LIST[0];

  const handleRoleSelect = (roleItem) => {
    playClickSound();
    setSelectedRoleId(roleItem.id);
    
    // Auto-update sample resume if no custom file uploaded
    if (!uploadedFileName) {
      const sample = SAMPLE_RESUMES[roleItem.id] || SAMPLE_RESUMES.fullstack;
      setResumeText(sample);
      triggerAutoScan(sample);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processUploadedFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = async (file) => {
    playClickSound();
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
          playSuccessSound();
          setResumeText(data.extractedText);
          setResumeAnalysis(data.analysis);
        } else {
          alert(data.message || 'Error parsing PDF document');
        }
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          playSuccessSound();
          setResumeText(text);
          triggerAutoScan(text);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Unable to parse file. You can also paste resume text directly.');
    } finally {
      setUploadingFile(false);
    }
  };

  const triggerAutoScan = async (text) => {
    if (!text || text.trim().length === 0) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: candidateName,
          target_role: selectedRoleObj.roleVal,
          resume_text: text
        })
      });
      const data = await res.json();
      if (data.success) {
        setResumeAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClearResume = () => {
    playClickSound();
    setResumeText('');
    setUploadedFileName('');
    setResumeAnalysis(null);
  };

  const handleResetToSample = () => {
    playClickSound();
    const sample = SAMPLE_RESUMES[selectedRoleId] || SAMPLE_RESUMES.fullstack;
    setResumeText(sample);
    setUploadedFileName('');
    triggerAutoScan(sample);
  };

  const handleLaunch = () => {
    playSuccessSound();
    onStartInterview({
      candidateName: candidateName.trim() || 'Alex Kumar',
      role: selectedRoleObj.roleVal,
      experience,
      companyType,
      voiceLanguage,
      resumeText,
      resumeAnalysis
    });
  };

  // Radial calculation for ATS score
  const atsScore = resumeAnalysis?.atsScore || 75;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 65) return '#f59e0b';
    return '#f43f5e';
  };
  const scoreColor = getScoreColor(atsScore);

  return (
    <div className="setup-container">
      {/* Hero Intro Header */}
      <div style={{ textAlign: 'center', marginBottom: '38px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#818cf8',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <Sparkles size={15} />
          <span>AI-POWERED TECHNICAL & HR MOCK INTERVIEWS</span>
        </div>
        <h1 className="hero-title">Practice Interviews with Interactive AI Voice & Video</h1>
        <p className="hero-subtitle" style={{ margin: '0 auto' }}>
          Select your target role, upload your PDF resume, and let our interactive AI interviewer ask real-time technical questions with live speech, webcam proctoring, and instant feedback.
        </p>
      </div>

      {/* STEP 1: Interactive Role Selector Cards */}
      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={22} color="var(--primary)" />
            Step 1: Choose Your Target Job Role
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            8 Specialized Domains Configured
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
          Click a role to load domain-specific interview questions, technical benchmarks, and sample resumes.
        </p>

        <div className="roles-grid">
          {ROLES_LIST.map((r) => {
            const isSelected = r.id === selectedRoleId;
            const Icon = r.icon;
            return (
              <div 
                key={r.id} 
                className={`role-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleRoleSelect(r)}
              >
                <div className="role-card-header">
                  <div className="role-icon-box">
                    <Icon size={22} />
                  </div>
                  <span 
                    className="role-badge"
                    style={{
                      background: `${r.badgeColor}20`,
                      color: r.badgeColor,
                      border: `1px solid ${r.badgeColor}50`
                    }}
                  >
                    {r.badge}
                  </span>
                </div>

                <div>
                  <div className="role-card-title">{r.title}</div>
                  <div className="role-card-desc">{r.desc}</div>
                </div>

                <div className="role-skills-pills">
                  {r.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="role-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>

                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 10px var(--primary)'
                  }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Candidate Details & Interview Preferences */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '28px', alignItems: 'start' }}>
        
        {/* Left Column: Candidate & Preferences */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={20} color="var(--accent-cyan)" />
            Step 2: Candidate & Session Details
          </h2>

          {/* Candidate Name */}
          <div className="input-group">
            <label className="input-label">
              <span>Candidate Name</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shown on Scorecard</span>
            </label>
            <input 
              type="text" 
              className="text-input" 
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          {/* Experience Level Pills */}
          <div className="input-group">
            <label className="input-label">Experience Level</label>
            <div className="pills-group">
              {EXPERIENCE_OPTIONS.map((exp, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pill-option ${experience === exp ? 'active' : ''}`}
                  onClick={() => {
                    playClickSound();
                    setExperience(exp);
                  }}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Company Target Pills */}
          <div className="input-group">
            <label className="input-label">Target Company Culture</label>
            <div className="pills-group">
              {COMPANY_OPTIONS.map((comp, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pill-option ${companyType === comp ? 'active' : ''}`}
                  onClick={() => {
                    playClickSound();
                    setCompanyType(comp);
                  }}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Assistant & Language Selection */}
          <div className="input-group">
            <label className="input-label">
              <span>AI Voice Assistant & Accent</span>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>🇮🇳 Hindi / Indian English</span>
            </label>
            <div className="pills-group">
              <button
                type="button"
                className={`pill-option ${voiceLanguage === 'en-IN' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound();
                  setVoiceLanguage('en-IN');
                }}
              >
                🇮🇳 Indian English (en-IN)
              </button>
              <button
                type="button"
                className={`pill-option ${voiceLanguage === 'hi-IN' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound();
                  setVoiceLanguage('hi-IN');
                }}
              >
                🇮🇳 हिंदी Voice Assistant (hi-IN)
              </button>
              <button
                type="button"
                className={`pill-option ${voiceLanguage === 'en-US' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound();
                  setVoiceLanguage('en-US');
                }}
              >
                🌐 Global English (en-US)
              </button>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
              {voiceLanguage === 'hi-IN' 
                ? '⭐ AI questions Hindi/Hinglish me bolega aur speech-to-text Hindi voice transcription sunega.' 
                : voiceLanguage === 'en-IN'
                ? '⭐ AI Indian English accent (Ravi / Heera / Google Indian English) me bolega aur Indian accent speech sunega.'
                : '⭐ Standard Global English pronunciation aur voice recognition.'}
            </div>
          </div>

          {/* Live Feature Highlights */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              ⚡ Interactive Interview Engine Active
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Real-Time Voice AI (TTS)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Webcam Video Proctor</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Speech-to-Text Answer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Instant Answer Scoring</span>
              </div>
            </div>
          </div>

          {/* Big Launch Button */}
          <button 
            onClick={handleLaunch}
            className="btn-ai btn-ai-primary"
            style={{ width: '100%', marginTop: '24px', padding: '16px 24px', fontSize: '1.05rem' }}
          >
            <span>Launch Live AI Interview</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Right Column: Resume Upload & Interactive ATS Analyzer */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="var(--accent-emerald)" />
              Step 3: Resume & ATS Diagnostics
            </h2>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleResetToSample}
                className="btn-ai btn-ai-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                title="Reset to selected role sample"
              >
                <RefreshCw size={13} />
                <span>Sample</span>
              </button>
              <button 
                onClick={handleClearResume}
                className="btn-ai btn-ai-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                title="Clear text"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,.txt,.md" 
            style={{ display: 'none' }} 
          />

          <div 
            className={`resume-dropzone ${isDragOver ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={38} color={uploadingFile ? '#06b6d4' : '#6366f1'} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff' }}>
              {uploadingFile ? 'AI is parsing your PDF document...' : 'Click or Drag & Drop your Resume (PDF / TXT)'}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
              Supports modern PDF files, TXT, and Markdown up to 10MB
            </p>

            {uploadedFileName && (
              <div style={{
                marginTop: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                <FileCheck size={14} />
                <span>{uploadedFileName} (Uploaded & Verified)</span>
              </div>
            )}
          </div>

          {/* Resume Text Area with live count */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Extracted Resume Content ({resumeText ? resumeText.split(/\s+/).filter(Boolean).length : 0} words)
              </span>
              <button
                type="button"
                onClick={() => triggerAutoScan(resumeText)}
                className="btn-ai btn-ai-secondary"
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                disabled={analyzing}
              >
                {analyzing ? 'Scanning...' : 'Re-Run ATS Scan'}
              </button>
            </div>
            <textarea
              className="text-input"
              rows={6}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', resize: 'vertical' }}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
              }}
              placeholder="Paste your plain text resume or upload a PDF above..."
            />
          </div>

          {/* Interactive ATS Score Meter & Skill Badges */}
          {resumeAnalysis && (
            <div style={{
              marginTop: '18px',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                {/* Circular Gauge */}
                <div className="ats-gauge-circle">
                  <svg width="100" height="100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r={radius} 
                      stroke="rgba(255, 255, 255, 0.1)" 
                      strokeWidth="8" 
                      fill="transparent" 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r={radius} 
                      stroke={scoreColor} 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                  </svg>
                  <div className="ats-score-number">
                    <div className="ats-score-val" style={{ color: scoreColor }}>
                      {atsScore}
                    </div>
                    <div className="ats-score-lbl">ATS Match</div>
                  </div>
                </div>

                {/* Score Summary */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                      {atsScore >= 80 ? 'ATS Optimized (High Pass)' : atsScore >= 65 ? 'Competitive Profile' : 'Needs Optimization'}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: `${scoreColor}20`,
                      color: scoreColor,
                      border: `1px solid ${scoreColor}50`
                    }}>
                      {selectedRoleObj.title}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4' }}>
                    {resumeAnalysis.strengths?.[0] || 'Technical keywords detected align with target position.'}
                  </p>
                </div>
              </div>

              {/* Detected Skills Chips */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Detected Core Skills ({resumeAnalysis.skillsFound?.length || 0})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {resumeAnalysis.skillsFound?.map((sk, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        color: '#c7d2fe'
                      }}
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {resumeAnalysis.suggestions && resumeAnalysis.suggestions.length > 0 && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Zap size={14} />
                    <span>AI Recommendation for Interview Prep:</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.45', margin: 0 }}>
                    {resumeAnalysis.suggestions[0]}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
