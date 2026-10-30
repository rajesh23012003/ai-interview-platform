const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const db = require('./database');
const aiEngine = require('./aiEngine');

const app = express();
const PORT = process.env.PORT || 5050;

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend assets if built
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// -------------------------------------------------------------
// 1. RESUME ANALYZER & FILE UPLOAD API
// -------------------------------------------------------------
app.post('/api/resume/upload', upload.single('resume_file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded' });
    }

    let extractedText = '';
    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text || '';
    } else {
      extractedText = req.file.buffer.toString('utf-8');
    }

    const cleanText = extractedText.replace(/\r\n/g, '\n').trim();
    const analysis = aiEngine.parseResume(cleanText);

    res.json({
      success: true,
      filename: req.file.originalname,
      extractedText: cleanText,
      analysis
    });
  } catch (err) {
    console.error('File parsing error:', err);
    res.status(500).json({ success: false, message: 'Failed to extract text from file: ' + err.message });
  }
});

app.post('/api/resume/analyze', (req, res) => {
  try {
    const { resume_text, target_role, candidate_name } = req.body;
    const analysis = aiEngine.parseResume(resume_text || '');

    res.json({
      success: true,
      candidate_name: candidate_name || 'Candidate',
      target_role: target_role || 'Full Stack Engineer',
      analysis
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 2. START INTERVIEW SESSION API
// -------------------------------------------------------------
app.post('/api/interview/start', (req, res) => {
  try {
    const { candidate_name, target_role, experience_level, company_type, resume_text, resume_analysis } = req.body;

    const name = candidate_name && candidate_name.trim() ? candidate_name.trim() : 'Alex Kumar';
    const role = target_role || 'Full Stack Engineer (React & Node.js)';
    const exp = experience_level || '1-3 Years Experience';
    const compType = company_type || 'Product Tech Company';

    // 1. Generate tailored questions
    const generatedQuestions = aiEngine.getQuestionsForRole(role, resume_analysis);

    // 2. Insert interview record
    const insertInterview = db.prepare(`
      INSERT INTO interviews (
        candidate_name, target_role, experience_level, company_type,
        resume_skills, resume_text, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'In Progress')
    `);

    const skillsString = resume_analysis && resume_analysis.skillsFound ? resume_analysis.skillsFound.join(', ') : 'JavaScript, Full Stack';
    const interviewResult = insertInterview.run(name, role, exp, compType, skillsString, resume_text || '');
    const interviewId = interviewResult.lastInsertRowid;

    // 3. Insert generated questions into DB
    const insertQuestion = db.prepare(`
      INSERT INTO interview_questions (
        interview_id, question_number, question_text, category, difficulty,
        expected_points, ideal_answer
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const questionsList = [];
    generatedQuestions.forEach((q, idx) => {
      const qRes = insertQuestion.run(
        interviewId,
        idx + 1,
        q.question,
        q.category,
        q.difficulty || 'Medium',
        JSON.stringify(q.expectedPoints || []),
        q.idealAnswer || ''
      );

      questionsList.push({
        id: qRes.lastInsertRowid,
        question_number: idx + 1,
        question_text: q.question,
        category: q.category,
        difficulty: q.difficulty || 'Medium'
      });
    });

    res.json({
      success: true,
      interviewId,
      candidate_name: name,
      target_role: role,
      experience_level: exp,
      company_type: compType,
      questions: questionsList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 3. SUBMIT ANSWER & INSTANT AI EVALUATION API
// -------------------------------------------------------------
app.post('/api/interview/submit-answer', (req, res) => {
  try {
    const { interviewId, questionId, userAnswer } = req.body;
    if (!questionId) {
      return res.status(400).json({ success: false, message: 'questionId is required' });
    }

    const question = db.prepare('SELECT * FROM interview_questions WHERE id = ?').get(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    let expectedPoints = [];
    try {
      expectedPoints = JSON.parse(question.expected_points || '[]');
    } catch {
      expectedPoints = [];
    }

    // AI Evaluation
    const evaluation = aiEngine.evaluateCandidateAnswer(
      {
        question: question.question_text,
        expectedPoints,
        idealAnswer: question.ideal_answer
      },
      userAnswer || '',
      question.category
    );

    // Save in DB
    const updateStmt = db.prepare(`
      UPDATE interview_questions 
      SET user_answer = ?,
          score = ?,
          feedback = ?
      WHERE id = ?
    `);

    updateStmt.run(userAnswer || '', evaluation.score, evaluation.feedback, questionId);

    res.json({
      success: true,
      questionId,
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        idealAnswer: evaluation.idealAnswer
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 4. COMPLETE INTERVIEW & GENERATE FINAL SCORECARD
// -------------------------------------------------------------
app.post('/api/interview/finish', (req, res) => {
  try {
    const { interviewId } = req.body;
    if (!interviewId) {
      return res.status(400).json({ success: false, message: 'interviewId is required' });
    }

    const interview = db.prepare('SELECT * FROM interviews WHERE id = ?').get(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const questions = db.prepare('SELECT * FROM interview_questions WHERE interview_id = ? ORDER BY question_number ASC').all(interviewId);

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions answered in this session' });
    }

    // Calculate score aggregates
    const scores = questions.map(q => q.score || 50);
    const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;

    const technicalScore = Math.min(100, Math.round(avgScore + (Math.random() * 4 - 2)));
    const commScore = Math.min(100, Math.round(avgScore * 0.95 + 4));
    const problemSolving = Math.min(100, Math.round(avgScore * 1.02 - 1));
    const confidenceScore = Math.min(100, Math.round(avgScore * 0.96 + 3));

    let hireRecommendation = 'Hire';
    if (avgScore >= 85) hireRecommendation = 'Strong Hire';
    else if (avgScore >= 70) hireRecommendation = 'Hire';
    else if (avgScore >= 55) hireRecommendation = 'Leaning Hire';
    else hireRecommendation = 'Needs Further Preparation';

    const strengthsList = [
      'Articulated core engineering fundamentals with clear, structured thought process',
      'Demonstrated practical grasp of real-world implementation nuances',
      'Communicated clearly and responded effectively to targeted interview prompts'
    ];

    const improvementList = [
      'Deepen coverage of distributed trade-offs (latency vs consistency, memory vs CPU overhead)',
      'Structure architectural answers consistently using the STAR (Situation, Task, Action, Result) methodology',
      'Elaborate more on error handling, failover scenarios, and production edge cases'
    ];

    // Update interview record
    const updateInterview = db.prepare(`
      UPDATE interviews
      SET overall_score = ?,
          technical_score = ?,
          communication_score = ?,
          problem_solving_score = ?,
          confidence_score = ?,
          hire_recommendation = ?,
          key_strengths = ?,
          areas_to_improve = ?,
          status = 'Completed'
      WHERE id = ?
    `);

    updateInterview.run(
      avgScore,
      technicalScore,
      commScore,
      problemSolving,
      confidenceScore,
      hireRecommendation,
      strengthsList.join('. '),
      improvementList.join('. '),
      interviewId
    );

    const updatedInterview = db.prepare('SELECT * FROM interviews WHERE id = ?').get(interviewId);

    res.json({
      success: true,
      interview: updatedInterview,
      questions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 5. GET INTERVIEWS HISTORY
// -------------------------------------------------------------
app.get('/api/interview/history', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM interviews ORDER BY id DESC').all();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 6. GET SINGLE INTERVIEW REPORT
// -------------------------------------------------------------
app.get('/api/interview/:id', (req, res) => {
  try {
    const { id } = req.params;
    const interview = db.prepare('SELECT * FROM interviews WHERE id = ?').get(id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const questions = db.prepare('SELECT * FROM interview_questions WHERE interview_id = ? ORDER BY question_number ASC').all(id);

    res.json({
      success: true,
      interview,
      questions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fallback for SPA routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🤖 AI Mock Interview Platform API running on http://localhost:${PORT}`);
});
