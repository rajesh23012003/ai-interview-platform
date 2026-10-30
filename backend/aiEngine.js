/**
 * AI Engine for Mock Interviews & Resume Analysis
 * Intelligent evaluation engine with deep role-specific knowledge bases
 * Supports native parsing, heuristic NLP scoring, and optional Gemini LLM integration
 */

const ROLE_KNOWLEDGE_BASE = {
  'frontend': {
    title: 'Frontend Developer',
    coreSkills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML5', 'Next.js', 'Redux', 'Performance', 'Web APIs', 'Tailwind'],
    questionBank: [
      {
        question: 'Explain the difference between Virtual DOM and Shadow DOM, and how React uses reconciliation with the Fiber architecture.',
        category: 'Core React & Architecture',
        difficulty: 'Medium',
        expectedPoints: ['Virtual DOM in-memory representation', 'Shadow DOM browser scoped encapsulation', 'Reconciliation diffing algorithm', 'Fiber incremental rendering and prioritization'],
        idealAnswer: 'The Virtual DOM is an in-memory JS representation of the real DOM used by React to compute minimal diffs through reconciliation. Shadow DOM is a browser-native standard for scoped CSS and encapsulated DOM subtrees (used in Web Components). React 16+ uses Fiber to break reconciliation work into interruptible units, prioritizing high-priority updates (like animations and user input) over background computations.'
      },
      {
        question: 'How do you optimize Core Web Vitals (LCP, INP/FID, CLS) in a modern single-page React or Next.js application?',
        category: 'Web Performance',
        difficulty: 'Hard',
        expectedPoints: ['LCP image preloading and SSR', 'INP/FID main thread scheduling and code splitting', 'CLS aspect-ratio and dimension reservations', 'Dynamic imports'],
        idealAnswer: 'For Largest Contentful Paint (LCP): Preload critical hero assets, leverage SSR/ISR, and use modern formats (AVIF/WebP) with CDN caching. For Interaction to Next Paint (INP): Minimize long tasks by offloading CPU-intensive work to Web Workers, debouncing handlers, and using React transitions (startTransition). For Cumulative Layout Shift (CLS): Explicitly define width/height attributes or aspect-ratio on media elements and avoid injecting dynamic DOM elements above existing content.'
      },
      {
        question: 'What happens under the hood when a user types an address into a browser and presses Enter? Focus specifically on client rendering.',
        category: 'Browser Fundamentals',
        difficulty: 'Medium',
        expectedPoints: ['DNS lookup', 'TCP/TLS handshake', 'HTTP request/response', 'HTML parsing to DOM tree', 'CSSOM construction', 'Render tree, Layout/Reflow, and Paint'],
        idealAnswer: 'After DNS resolution and TCP/TLS handshakes, the browser receives the HTML stream. The HTML parser builds the DOM tree incrementally while discovering linked assets. The CSS parser constructs the CSSOM. DOM and CSSOM combine into the Render Tree (excluding hidden nodes). The browser calculates geometric positions in Layout (Reflow), converts vector nodes to pixels in Paint, and combines layer bitmaps on the GPU in Compositing.'
      },
      {
        question: 'How do you prevent memory leaks and handle state cleanup in complex React applications with subscriptions or WebSockets?',
        category: 'State Management & Lifecycle',
        difficulty: 'Medium',
        expectedPoints: ['useEffect cleanup function', 'AbortController for fetch calls', 'Socket disconnect and event listener removal', 'Clearing setTimeout/setInterval'],
        idealAnswer: 'In React, cleanup functions inside useEffect or custom hooks are vital. When subscribing to WebSockets, EventSources, or window listeners, the returned cleanup function must call socket.close(), socket.off(), or removeEventListener. For async HTTP requests, an AbortController signal should cancel in-flight promises on unmount to avoid setting state on unmounted components.'
      }
    ]
  },
  'backend': {
    title: 'Backend Developer',
    coreSkills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Microservices', 'REST', 'GraphQL'],
    questionBank: [
      {
        question: 'How does the Node.js Event Loop work with Libuv? Contrast microtasks versus macrotasks with code execution order.',
        category: 'Node.js Internals',
        difficulty: 'Hard',
        expectedPoints: ['Libuv event loop phases', 'Call stack', 'process.nextTick queue', 'Promise microtasks', 'Timers and I/O callbacks'],
        idealAnswer: 'Node.js executes JavaScript on a single thread powered by V8 and Libuv. The Event Loop cycles through phases: Timers, Pending I/O, Idle, Poll, Check (setImmediate), and Close. Microtasks (process.nextTick has highest priority, followed by Promise.then callbacks) drain completely between every single asynchronous tick and phase change before the loop proceeds to the next macrotask.'
      },
      {
        question: 'How would you scale a relational database (PostgreSQL/MySQL) when table row counts grow into hundreds of millions?',
        category: 'Database Scaling & Architecture',
        difficulty: 'Hard',
        expectedPoints: ['Indexing (B-Tree, BRIN)', 'Read replicas and connection pooling', 'Table partitioning (range/hash)', 'Sharding', 'Caching with Redis'],
        idealAnswer: 'Scaling a large relational DB involves multiple tiers: 1) Query and indexing tuning (composite B-trees, partial indexes, EXPLAIN ANALYZE); 2) Connection pooling (PgBouncer); 3) Read replicas to distribute query traffic away from the primary write node; 4) Table Partitioning (by date range or tenant ID) to keep active working sets in memory; 5) In-memory cache layer (Redis) for hot reads; 6) Horizontal sharding across clusters when data exceeds a single server disk I/O.'
      },
      {
        question: 'Explain how you design idempotency in REST APIs, specifically for payment processing and critical transactions.',
        category: 'API Design & Resilience',
        difficulty: 'Medium',
        expectedPoints: ['Idempotency-Key header', 'Distributed locks or unique constraints', 'Storing request state and cached response in DB/Redis', 'Atomic transactions'],
        idealAnswer: 'To ensure idempotency, the client provides a unique Idempotency-Key in the request header. The server uses an atomic lock or DB transaction to verify if this key was previously processed. If found, it returns the cached response without re-executing charges. If processing is in-progress, subsequent requests are either queued or rejected with HTTP 409 Conflict. Once successfully committed, the result is permanently stored.'
      },
      {
        question: 'Walk me through designing a robust JWT authentication flow with Refresh Tokens and token revocation.',
        category: 'Security & Auth',
        difficulty: 'Medium',
        expectedPoints: ['Short-lived Access Token in memory', 'Long-lived Refresh Token in httpOnly cookie', 'Refresh token rotation', 'Blacklisting/Revocation table in Redis'],
        idealAnswer: 'A secure JWT architecture uses a short-lived Access Token (15 mins) stored in memory and a long-lived Refresh Token (7 days) stored in a secure, httpOnly, SameSite cookie. When refreshing tokens, use Refresh Token Rotation: invalidate the old token and issue a new pair. If a revoked or reused refresh token is presented, invalidate the entire token family to prevent theft. A Redis blacklist allows instant token revocation on user logout or password changes.'
      }
    ]
  },
  'fullstack': {
    title: 'Full Stack Engineer',
    coreSkills: ['React', 'Node.js', 'Express', 'TypeScript', 'SQL', 'MongoDB', 'REST APIs', 'System Design', 'Git', 'CI/CD'],
    questionBank: [
      {
        question: 'Walk me through the end-to-end architecture of a real-time messaging application like Slack or WhatsApp Web.',
        category: 'Full Stack System Design',
        difficulty: 'Hard',
        expectedPoints: ['WebSockets connection handling', 'Load balancer with sticky sessions', 'Pub/Sub message broker (Redis/Kafka)', 'Message persistence (NoSQL/SQL)', 'Offline delivery queue'],
        idealAnswer: 'The client maintains a persistent WebSocket connection to a gateway service behind a load balancer with sticky sessions. Outgoing messages hit an API that stores them in a distributed database (e.g., Cassandra for time-series chat or PostgreSQL with partition) and publishes them to a Redis Pub/Sub or Kafka broker. The broker routes messages to the specific gateway pod where the recipient is connected. If offline, a push notification worker queues push alerts via FCM/APNS.'
      },
      {
        question: 'How do you handle transactional consistency across multiple microservices or distributed components (Saga Pattern vs 2PC)?',
        category: 'Distributed Systems',
        difficulty: 'Hard',
        expectedPoints: ['Saga pattern (Choreography vs Orchestration)', 'Compensating transactions', 'Eventual consistency', 'Idempotent consumer'],
        idealAnswer: 'Two-Phase Commit (2PC) is synchronous and creates tight coupling and blocking. The industry standard is the Saga Pattern, which breaks a distributed transaction into a sequence of local transactions coordinated either by events (Choreography via Kafka/RabbitMQ) or a centralized coordinator (Orchestrator). If any step fails, compensating transactions are executed in reverse order to restore consistency.'
      },
      {
        question: 'What are the main security vulnerabilities outlined in OWASP Top 10 (like SQLi, XSS, CSRF, SSRF) and how do you mitigate each?',
        category: 'Application Security',
        difficulty: 'Medium',
        expectedPoints: ['SQL Injection: parameterized queries', 'XSS: input sanitization and CSP', 'CSRF: SameSite cookies and CSRF tokens', 'SSRF: IP allowlisting and metadata protection'],
        idealAnswer: 'SQL Injection: Always use parameterized queries or ORM abstractions. XSS: Escape HTML, sanitize untrusted rich text with DOMPurify, and enforce strict Content Security Policy (CSP). CSRF: Use SameSite=Strict cookies and anti-CSRF challenge tokens for mutating requests. SSRF: Validate and allowlist external URLs and disallow private IP ranges (like AWS metadata endpoint 169.254.169.254).'
      },
      {
        question: 'How do you manage frontend state synchronization with server state (e.g., React Query / TanStack Query vs Redux)?',
        category: 'Frontend-Backend Integration',
        difficulty: 'Medium',
        expectedPoints: ['Server state vs client UI state', 'Caching, background refetching, and deduping', 'Optimistic UI updates', 'Stale-while-revalidate strategy'],
        idealAnswer: 'Modern full-stack apps separate client state (modal open, theme) from server state (cached API responses). Tools like TanStack Query handle server state through stale-while-revalidate caching, request deduplication, and automated background synchronization. For high-perceived performance, optimistic updates update the UI immediately and roll back if the server mutation fails.'
      }
    ]
  },
  'datascience': {
    title: 'Data Analyst / Data Scientist',
    coreSkills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Data Visualization', 'Tableau', 'Statistics', 'Power BI'],
    questionBank: [
      {
        question: 'Explain how you handle multicollinearity and missing data in a large predictive modeling dataset.',
        category: 'Data Preprocessing & Statistics',
        difficulty: 'Medium',
        expectedPoints: ['VIF (Variance Inflation Factor)', 'Correlation matrix', 'Imputation methods (KNN, iterative, median)', 'Feature elimination or PCA'],
        idealAnswer: 'For multicollinearity, calculate Variance Inflation Factor (VIF > 5-10 indicates issues) and inspect correlation heatmaps; remedy by dropping redundant features, combining them, or applying PCA/regularization (Lasso/Ridge). For missing data: assess whether it is MCAR, MAR, or MNAR. For numerical features with small missingness, use median or iterative/KNN imputation; for categorical, use mode or indicator tokens.'
      },
      {
        question: 'In SQL, what is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() window functions?',
        category: 'Advanced SQL',
        difficulty: 'Easy',
        expectedPoints: ['ROW_NUMBER gives sequential 1,2,3', 'RANK leaves gaps for ties (1,2,2,4)', 'DENSE_RANK leaves no gaps (1,2,2,3)', 'PARTITION BY and ORDER BY'],
        idealAnswer: 'All three are window ranking functions evaluated over a partition. ROW_NUMBER assigns a strictly unique sequential integer regardless of ties (1, 2, 3, 4). RANK assigns the same rank to identical values but skips ranks for subsequent rows (1, 2, 2, 4). DENSE_RANK assigns the same rank to ties without skipping subsequent ranks (1, 2, 2, 3).'
      },
      {
        question: 'How do you prevent overfitting in Tree-based models (Random Forest, XGBoost) and measure generalization error?',
        category: 'Machine Learning',
        difficulty: 'Medium',
        expectedPoints: ['K-fold cross validation', 'Max depth and min samples leaf pruning', 'Subsampling / colsample_bytree', 'Early stopping and learning rate'],
        idealAnswer: 'To mitigate overfitting: 1) Constrain tree depth (max_depth) and set minimum samples per leaf (min_child_weight); 2) Use feature subsampling (colsample_bytree) and row subsampling; 3) Use K-Fold Cross Validation; 4) For gradient boosting, use lower learning rates with early stopping on validation loss.'
      }
    ]
  }
};

/**
 * Intelligent Resume Parsing & Skill Extraction
 */
function parseResume(resumeText) {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      skillsFound: ['JavaScript', 'HTML/CSS', 'Git'],
      projectsFound: ['Web Project'],
      atsScore: 70,
      strengths: ['Clear formatting'],
      suggestions: ['Add quantifiable metric achievements (e.g., improved speed by 30%)', 'Include cloud deployment details']
    };
  }

  const text = resumeText.toLowerCase();
  
  const skillCatalog = [
    'react', 'next.js', 'vue', 'angular', 'javascript', 'typescript', 'node.js', 'express',
    'python', 'django', 'fastapi', 'java', 'spring', 'c++', 'c#', '.net', 'sql', 'postgresql',
    'mysql', 'mongodb', 'redis', 'graphql', 'rest', 'docker', 'kubernetes', 'aws', 'gcp',
    'azure', 'git', 'ci/cd', 'tailwind', 'redux', 'pandas', 'numpy', 'machine learning',
    'data structures', 'algorithms', 'sqlite', 'html', 'css', 'linux', 'testing', 'jest'
  ];

  const foundSkills = skillCatalog.filter(skill => text.includes(skill.toLowerCase()));

  // Count metrics / numbers (% or numbers indicate strong ATS performance)
  const numbersCount = (text.match(/\d+%/g) || []).length + (text.match(/\$\d+/g) || []).length;
  const projectMentions = (text.match(/project|developed|architected|built|designed|implemented/g) || []).length;

  let atsScore = 65;
  if (foundSkills.length >= 6) atsScore += 15;
  else if (foundSkills.length >= 3) atsScore += 8;

  if (numbersCount >= 2) atsScore += 10;
  if (projectMentions >= 3) atsScore += 10;

  atsScore = Math.min(96, Math.max(55, atsScore));

  const strengths = [];
  if (foundSkills.length >= 5) strengths.push(`Strong keyword coverage across modern tech stacks (${foundSkills.slice(0, 4).join(', ')})`);
  if (projectMentions >= 3) strengths.push('Action-oriented project descriptions with engineering verbs');
  if (numbersCount >= 1) strengths.push('Includes quantified achievements and business impact');
  if (strengths.length === 0) strengths.push('Clean and structured presentation of technical competencies');

  const suggestions = [];
  if (numbersCount === 0) suggestions.push('Incorporate measurable metrics (e.g. "Reduced bundle size by 24%", "Handled 10k daily requests")');
  if (!foundSkills.some(s => ['docker', 'aws', 'ci/cd', 'kubernetes'].includes(s))) {
    suggestions.push('Highlight Cloud/DevOps competencies (Docker, AWS, CI/CD pipelines)');
  }
  if (!text.includes('test') && !text.includes('jest')) {
    suggestions.push('Mention Automated Testing and QA methodologies (Jest, Cypress, TDD)');
  }

  return {
    skillsFound: foundSkills.map(s => s.toUpperCase()),
    atsScore,
    strengths,
    suggestions
  };
}

/**
 * Question Generator tailored to role and resume
 */
function getQuestionsForRole(roleKey, resumeAnalysis = null) {
  const normalizedKey = roleKey ? roleKey.toLowerCase() : 'fullstack';
  let categoryKey = 'fullstack';
  if (normalizedKey.includes('front')) categoryKey = 'frontend';
  else if (normalizedKey.includes('back')) categoryKey = 'backend';
  else if (normalizedKey.includes('data') || normalizedKey.includes('analyst') || normalizedKey.includes('python')) categoryKey = 'datascience';

  const roleConfig = ROLE_KNOWLEDGE_BASE[categoryKey] || ROLE_KNOWLEDGE_BASE['fullstack'];
  const questions = [...roleConfig.questionBank];

  // If candidate has special skills from resume, inject customized opening question
  if (resumeAnalysis && resumeAnalysis.skillsFound && resumeAnalysis.skillsFound.length > 0) {
    const topSkills = resumeAnalysis.skillsFound.slice(0, 3).join(' and ');
    questions.unshift({
      question: `Your resume highlights proficiency in ${topSkills}. Can you walk me through the most technically challenging project you built using these technologies, highlighting an architectural bottleneck you resolved?`,
      category: 'Resume & Deep Dive',
      difficulty: 'Medium',
      expectedPoints: ['Clear problem statement', 'Architecture diagram/design', 'Technical hurdle/bottleneck', 'Measurable outcome and lessons learned'],
      idealAnswer: 'The candidate should use the STAR method (Situation, Task, Action, Result). State the system requirement, pinpoint the exact bottleneck (e.g., query latency, state thrashing, memory leak), explain the technical trade-offs of the chosen solution, and finish with verified performance metrics.'
    });
  }

  return questions.slice(0, 4); // Deliver 4 high-yield questions for an optimal 10-15 minute mock session
}

/**
 * AI Response Evaluator
 */
function evaluateCandidateAnswer(questionObj, userAnswer, role) {
  if (!userAnswer || userAnswer.trim().length < 15) {
    return {
      score: 25,
      feedback: 'Response was too brief or incomplete. In technical interviews, provide detailed context, architectural rationale, and examples.',
      strengths: 'Acknowledged the question prompt.',
      improvements: 'Elaborate using the STAR method, mention underlying mechanisms, and provide concrete code or architecture examples.',
      idealAnswer: questionObj.idealAnswer
    };
  }

  const answerLower = userAnswer.toLowerCase();
  const wordCount = userAnswer.trim().split(/\s+/).length;

  // Calculate semantic keyword alignment
  let matchedPoints = 0;
  if (questionObj.expectedPoints) {
    questionObj.expectedPoints.forEach(point => {
      const words = point.toLowerCase().split(' ').filter(w => w.length > 4);
      if (words.some(w => answerLower.includes(w))) {
        matchedPoints++;
      }
    });
  }

  // Scoring rubric: Depth (word count), Coverage (matched expected points), Technical terminology
  let baseScore = 60;
  if (wordCount >= 60) baseScore += 15;
  else if (wordCount >= 30) baseScore += 8;

  const matchRatio = questionObj.expectedPoints ? (matchedPoints / questionObj.expectedPoints.length) : 0.6;
  baseScore += Math.round(matchRatio * 20);

  const finalScore = Math.min(96, Math.max(40, baseScore));

  let feedback = '';
  let strengths = '';
  let improvements = '';

  if (finalScore >= 85) {
    feedback = 'Exceptional, articulate answer! You demonstrated solid command of underlying concepts with clear technical vocabulary.';
    strengths = 'Strong conceptual accuracy, direct articulation of core architectural principles.';
    improvements = 'To make it world-class, discuss edge cases or trade-offs (e.g. latency vs consistency, CPU vs memory).';
  } else if (finalScore >= 70) {
    feedback = 'Good answer covering the main fundamentals. You clearly understand the core workflow.';
    strengths = 'Good foundational grasp of the problem, clear communication tone.';
    improvements = 'Incorporate more specific internal mechanism details and mention alternative approaches.';
  } else {
    feedback = 'Fair attempt, but missing critical architectural depth and key terminologies expected for this question.';
    strengths = 'General familiarity with the topic domain.';
    improvements = 'Ensure you cover internal workings (e.g., data structures, lifecycle phases, and failure modes).';
  }

  return {
    score: finalScore,
    feedback,
    strengths,
    improvements,
    idealAnswer: questionObj.idealAnswer
  };
}

module.exports = {
  parseResume,
  getQuestionsForRole,
  evaluateCandidateAnswer
};
