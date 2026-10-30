const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'interview.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_name TEXT NOT NULL,
      target_role TEXT NOT NULL,
      experience_level TEXT NOT NULL,
      company_type TEXT DEFAULT 'General Tech',
      resume_skills TEXT,
      resume_text TEXT,
      overall_score REAL DEFAULT 0,
      technical_score REAL DEFAULT 0,
      communication_score REAL DEFAULT 0,
      problem_solving_score REAL DEFAULT 0,
      confidence_score REAL DEFAULT 0,
      hire_recommendation TEXT,
      key_strengths TEXT,
      areas_to_improve TEXT,
      status TEXT DEFAULT 'Completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS interview_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      interview_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      expected_points TEXT,
      user_answer TEXT,
      score REAL DEFAULT 0,
      feedback TEXT,
      ideal_answer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
    );
  `);

  // Check if sample demo session exists
  const checkInterviews = db.prepare('SELECT COUNT(*) as count FROM interviews').get();
  if (checkInterviews.count === 0) {
    seedSampleSession();
  }
}

function seedSampleSession() {
  const insertInterview = db.prepare(`
    INSERT INTO interviews (
      candidate_name, target_role, experience_level, company_type, resume_skills,
      overall_score, technical_score, communication_score, problem_solving_score, confidence_score,
      hire_recommendation, key_strengths, areas_to_improve, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertInterview.run(
    'Aarav Sharma',
    'Full Stack Developer (React & Node.js)',
    '1-3 Years Experience',
    'Product Startup',
    'React, Node.js, Express, JavaScript, REST APIs, SQL, Docker, Git',
    84.5,
    86,
    82,
    88,
    82,
    'Strong Hire',
    'Clear architectural understanding of React state flow, good explanation of Node.js event loop and asynchronous concurrency, structured thinking.',
    'Deepen explanation of database indexing strategies and Redis caching layers for high scale systems.',
    'Completed'
  );

  const interviewId = result.lastInsertRowid;

  const insertQuestion = db.prepare(`
    INSERT INTO interview_questions (
      interview_id, question_number, question_text, category, difficulty,
      expected_points, user_answer, score, feedback, ideal_answer
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertQuestion.run(
    interviewId,
    1,
    'Can you explain the Node.js Event Loop and how it handles asynchronous I/O operations without blocking the main thread?',
    'Backend Architecture',
    'Medium',
    'Single-threaded event loop, Call Stack, Libuv thread pool, Task Queue & Microtask queue, Event loop phases.',
    'Node.js uses a single-threaded event loop driven by Libuv. When asynchronous tasks like file reads or network calls occur, they are delegated to worker threads. Once completed, callbacks are queued in task queues and executed when the call stack clears.',
    88,
    'Strong answer explaining Libuv and task offloading clearly. Could have explicitly contrasted microtasks (Promises) with macrotasks (setTimeout).',
    'Node.js runs on a single main JavaScript execution thread powered by the V8 engine and Libuv. I/O operations are offloaded to Libuv worker threads or OS kernel APIs. The Event Loop progresses through phases: Timers, Pending I/O callbacks, Idle/Prepare, Poll, Check (setImmediate), and Close callbacks. Microtasks (process.nextTick, Promise callbacks) run between each phase.'
  );

  insertQuestion.run(
    interviewId,
    2,
    'In React, what are the primary performance optimization techniques you would employ when rendering a heavy list with frequent updates?',
    'Frontend & React',
    'Medium',
    'Virtualization (react-window/virtualized), React.memo, useMemo/useCallback, key prop importance, state localization.',
    'I would use windowing or virtualization like react-window so only items in the viewport are rendered in the DOM. Also memoizing list item components with React.memo and keeping key props unique.',
    85,
    'Accurate identification of DOM virtualization as the primary optimization technique for heavy lists.',
    'To optimize heavy lists: 1) Implement virtualized rendering (react-window) to mount only visible DOM nodes; 2) Ensure stable unique identifiers as keys (never array indices); 3) Wrap row items in React.memo with custom comparison if needed; 4) Debounce or batch incoming update streams; 5) Keep local row state isolated.'
  );

  insertQuestion.run(
    interviewId,
    3,
    'Walk me through how you would design a rate limiter middleware for a high-traffic REST API to prevent abuse.',
    'System Design',
    'Hard',
    'Token Bucket or Sliding Window algorithm, Redis in-memory store, IP/API-key identification, HTTP 429 response headers.',
    'I would use a Sliding Window or Token Bucket algorithm stored in Redis. When a request comes in, we check the client IP or JWT user ID against Redis. If the request count in the current window exceeds the limit, return HTTP 429 Too Many Requests.',
    82,
    'Good architectural approach choosing Redis and HTTP 429 status codes. Next time discuss distributed race conditions and atomic Redis scripts.',
    'A robust rate limiter uses a Token Bucket or Sliding Window Log in Redis using atomic Lua scripts (e.g., INCRBY or ZADD). Requests check remaining quota; compliant requests proceed with X-RateLimit-Remaining headers, while exceeded quotas return HTTP 429 with Retry-After header.'
  );

  console.log('Sample interview session seeded!');
}

initDb();

module.exports = db;
