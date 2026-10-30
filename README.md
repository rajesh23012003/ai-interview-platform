# 🤖 PrepMind AI — Real-Time Voice & Video Mock Interviewer

An enterprise-grade, full-stack **AI Mock Interview & Resume Feedback Platform** built with **React 19**, **Node.js (Express)**, and **Native SQLite**.

Featuring **live webcam candidate streaming**, **voice speech question synthesis**, **real-time speech-to-text voice recognition**, and **multi-metric AI scorecard generation**.

---

## 🌟 Key Features

### 1. 🎯 Role-Targeted & ATS Resume Scanner
- Candidate selects target engineering role (**Full Stack, Frontend, Backend, Data Science/Analytics**).
- Experience brackets: Fresher / College Grad, 1-3 Years Junior-Mid, 3-5 Years Senior.
- Company culture targeting: **Tier-1 Big Tech / FAANG**, **High-Velocity Product Startup**, or **Global Enterprise**.
- **Instant ATS Keyword Analysis:** Detects tech stack competencies, quantifiable metrics impact, and gives actionable resume improvement suggestions.

### 2. 🎙️ Live Voice & Webcam AI Interview Room
- **AI Interviewer Sophia:** Speaks out technical and system design questions aloud using the browser's native **Speech Synthesis**.
- **Real-Time Voice Speech-to-Text:** Candidate can answer by speaking naturally into their microphone via native **SpeechRecognition** — spoken words appear live on screen.
- **Interactive AI Soundwave Visualizer:** Responsive waveform animation while the AI speaks or listens.
- **Live Candidate Webcam View:** Realistic mock interview feel with live video feed and recording status indicators.

### 3. 🧠 Instant AI Answer Evaluation
- Immediate question-by-question scoring (0 to 100).
- Pinpoints **What Went Well** vs **How to Improve**.
- Provides a model architectural response demonstrating the ideal candidate approach.

### 4. 🏆 Comprehensive Evaluation Scorecard & Report
- **Hireability Verdict:** *Strong Hire*, *Hire*, *Leaning Hire*, or *Needs Further Preparation*.
- **4 Core Competency Meters:**
  1. Technical Accuracy (%)
  2. Problem Solving & Architectural Structure (%)
  3. Communication & Articulation (%)
  4. Confidence & Delivery Pace (%)
- **Question-by-Question Audit:** Full transcript of candidate responses paired with actionable mentor guidance.
- **Dedicated Print Layout:** 1-click printable interview certification and performance report.

### 5. 📜 Score Archives & Progress Tracking
- Preserves historical interview attempts in SQLite to measure improvement across practice rounds.

---

## 🏗️ Tech Stack

- **Frontend:** React 19, Vite, Lucide Icons, Modern Cyber Glassmorphism Design System.
- **Backend:** Node.js v24, Express, CORS.
- **Audio/Video APIs:** Native Web Speech API (`SpeechSynthesis`, `webkitSpeechRecognition`), `MediaDevices.getUserMedia`.
- **Database:** Node 24 native SQLite (`node:sqlite`) — persistent storage with zero external database dependencies.

---

## 🚀 How to Run Locally

### Quick Start:
```bash
npm start
```
Then open your browser at: **[http://localhost:5050](http://localhost:5050)**

Or run `start.bat` on Windows.
