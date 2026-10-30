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
  },
  'devops': {
    title: 'DevOps Engineer',
    coreSkills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Prometheus', 'Ansible', 'Linux'],
    questionBank: [
      {
        question: 'Explain the Kubernetes architecture. When a Pod gets stuck in CrashLoopBackOff, walk me through your exact troubleshooting methodology.',
        category: 'Container Orchestration',
        difficulty: 'Hard',
        expectedPoints: ['Control Plane vs Worker Nodes', 'kubectl describe pod for events', 'kubectl logs --previous for exit code', 'OOMKilled memory limits or application failure'],
        idealAnswer: 'Kubernetes separates the Control Plane (API Server, etcd, Scheduler, Controller Manager) from Worker Nodes (Kubelet, Kube-Proxy, Container Runtime). For a CrashLoopBackOff: 1) Run `kubectl describe pod <name>` to view container exit codes (e.g., exit 137 means OOMKilled, exit 1 indicates app crash); 2) Inspect previous crash output using `kubectl logs <name> --previous`; 3) Check resource requests/limits, missing ConfigMaps/Secrets, or database connectivity timeouts.'
      },
      {
        question: 'How do you structure a production Terraform setup with remote state, locking, and multi-environment isolation (Dev, Staging, Prod)?',
        category: 'Infrastructure as Code',
        difficulty: 'Medium',
        expectedPoints: ['S3 backend with encryption and versioning', 'DynamoDB state locking table', 'Directory-based or workspace separation', 'Reusable custom modules'],
        idealAnswer: 'A production Terraform setup uses an Amazon S3 remote backend with server-side encryption and object versioning, coupled with a DynamoDB table for distributed state locking to prevent concurrent runs. Isolate environments using dedicated directory structures (e.g., `environments/prod`, `environments/dev`) with environment-specific tfvars, referencing shared versioned modules from a central repository.'
      },
      {
        question: 'Contrast Blue/Green Deployment versus Canary Deployment in a zero-downtime microservices architecture.',
        category: 'CI/CD & Release Strategies',
        difficulty: 'Medium',
        expectedPoints: ['Blue/Green identical duplicate environments', 'Canary gradual percentage traffic rollouts (e.g. 5% to 100%)', 'Instant rollback in Blue/Green via DNS/router', 'Telemetry and automated metric rollbacks in Canary'],
        idealAnswer: 'Blue/Green maintains two identical production environments; active traffic points to Blue, the new release deploys to Green, and router/DNS switches all traffic over with instantaneous rollback capability. Canary deploys the new release alongside existing pods and routes a small fraction (e.g., 5-10%) of live traffic, monitoring error rates via Prometheus before incrementally scaling up to 100%.'
      }
    ]
  },
  'aws': {
    title: 'AWS Cloud Engineer',
    coreSkills: ['AWS VPC', 'EC2', 'IAM', 'S3', 'CloudWatch', 'Lambda', 'ALB', 'RDS', 'CloudFront', 'Route53'],
    questionBank: [
      {
        question: 'Design a highly available, fault-tolerant, 3-tier web application architecture on AWS. Detail your VPC, subnet, and security layout.',
        category: 'Cloud Architecture & VPC',
        difficulty: 'Hard',
        expectedPoints: ['Multi-AZ VPC with Public, Private App, and Private DB subnets', 'Internet Gateway & NAT Gateways', 'ALB in public subnet', 'Auto Scaling Group in private app subnet', 'Multi-AZ RDS in isolated database subnet'],
        idealAnswer: 'Create a Multi-AZ VPC across at least 2 Availability Zones. The Presentation tier sits in Public Subnets behind an Application Load Balancer with an Internet Gateway. The Application tier runs in Private Subnets on EC2 Auto Scaling Groups, accessing outbound internet via NAT Gateways. The Data tier resides in isolated Database Subnets hosting Multi-AZ Amazon RDS with synchronous replication. Security Groups enforce least-privilege chaining: DB accepts traffic only from App tier; App tier accepts traffic only from ALB.'
      },
      {
        question: 'Explain the difference between Security Groups and Network Access Control Lists (NACLs) in AWS VPC.',
        category: 'Cloud Security & Networking',
        difficulty: 'Medium',
        expectedPoints: ['Security Group is stateful at instance/ENI level', 'NACL is stateless at subnet boundary', 'NACL evaluates numbered allow/deny rules in order', 'Security Group allows all return traffic automatically'],
        idealAnswer: 'Security Groups operate at the individual instance/ENI level and are stateful: if inbound traffic is allowed, corresponding outbound response traffic is automatically allowed. They only support ALLOW rules. In contrast, NACLs operate at the subnet boundary and are stateless: return traffic must be explicitly permitted. NACLs support both ALLOW and DENY rules, evaluating rules in ascending numerical order.'
      },
      {
        question: 'How do IAM Roles, IAM Policies, and the AWS Security Token Service (STS) work together for secure cross-service access?',
        category: 'Identity & Access Management',
        difficulty: 'Medium',
        expectedPoints: ['IAM Roles assume temporary credentials via STS', 'No long-lived access keys embedded in code', 'IAM Policy JSON defining effect, action, resource', 'Instance profiles for EC2'],
        idealAnswer: 'Instead of embedding long-lived AWS Access Keys in applications, services use IAM Roles attached via Instance Profiles or ECS Task Roles. Under the hood, AWS STS (Security Token Service) issues short-lived, automatically rotated credentials (access key, secret key, and session token) to the instance metadata service (IMDSv2). IAM Policies written in JSON define the exact Actions, Effects (Allow/Deny), and Resource ARNs permitted.'
      }
    ]
  },
  'linux': {
    title: 'Linux System Administrator',
    coreSkills: ['Linux', 'Bash Scripting', 'systemd', 'Networking', 'SSH', 'Storage/LVM', 'User Management', 'Performance Tuning'],
    questionBank: [
      {
        question: 'A Linux production server is experiencing 100% CPU utilization and unresponsiveness. Walk me through your command-line diagnostic steps.',
        category: 'System Diagnostics & Troubleshooting',
        difficulty: 'Hard',
        expectedPoints: ['top / htop / uptime for load averages', 'vmstat 1 for CPU/memory/swapping queues', 'iostat -xz for disk I/O bottlenecks', 'ps aux --sort=-%cpu to pinpoint PID', 'strace or killing with kill -15 before kill -9'],
        idealAnswer: '1) Check load averages using `uptime` and `top`/`htop` to see if the bottleneck is CPU bound or I/O wait (`%wa`). 2) Run `vmstat 1` to check runnable process queues and memory swapping. 3) Use `ps aux --sort=-%cpu | head -n 10` to identify offending PIDs. 4) If disk I/O is high, use `iostat -xz 1` and `iotop`. 5) Terminate offending processes gracefully with `kill -15 <PID>` before escalating to `kill -9` if unresponsive.'
      },
      {
        question: 'Explain the Linux boot process from the moment hardware powers on to the user login shell.',
        category: 'Operating System Internals',
        difficulty: 'Medium',
        expectedPoints: ['BIOS/UEFI POST initialization', 'Master Boot Record (MBR) / EFI System Partition', 'GRUB2 bootloader', 'Kernel initialization and initramfs/initrd', 'systemd PID 1 default target'],
        idealAnswer: '1) BIOS/UEFI executes POST and loads boot device. 2) GRUB2 bootloader is executed from MBR/EFI, displaying kernel options. 3) GRUB loads the Linux Kernel and initramfs into RAM. 4) The kernel initializes hardware drivers and mounts root filesystem via initramfs. 5) Kernel starts PID 1 (`/sbin/init` or `systemd`), which executes default target units (e.g. multi-user.target or graphical.target), starting background daemons and login getty shells.'
      },
      {
        question: 'What are SUID, SGID, and Sticky Bit in Linux file permissions, and when is each used?',
        category: 'File System Security & Permissions',
        difficulty: 'Medium',
        expectedPoints: ['SUID (4) executes file with owner privileges (e.g. /usr/bin/passwd)', 'SGID (2) executes with group privileges and inherits directory group', 'Sticky bit (1) prevents deletion except by owner (e.g. /tmp)'],
        idealAnswer: 'Special permission bits: 1) SUID (SetUID, octal 4000): When an executable has SUID, any user runs it with the permissions of the file owner (e.g., `/usr/bin/passwd` allows normal users to update `/etc/shadow`). 2) SGID (SetGID, octal 2000): Executables run with group permissions; on directories, newly created files inherit the parent directory group. 3) Sticky Bit (octal 1000): Applied to shared directories like `/tmp` where all users have write access, ensuring only the file owner or root can delete or rename files.'
      }
    ]
  },
  'itsupport': {
    title: 'IT Support Specialist',
    coreSkills: ['Active Directory', 'DNS/DHCP', 'Networking (TCP/IP)', 'Windows Server', 'VPN', 'Ticketing Tools (ServiceNow/Jira)', 'Office 365'],
    questionBank: [
      {
        question: 'A user calls reporting: "My computer has no internet access." How do you systematically isolate and resolve the issue?',
        category: 'Network Troubleshooting',
        difficulty: 'Medium',
        expectedPoints: ['Physical layer check (cable/Wi-Fi LED)', 'ipconfig for 169.254.x.x APIPA vs valid IP', 'Ping localhost 127.0.0.1 (NIC test)', 'Ping default gateway', 'Ping 8.8.8.8 vs domain name for DNS resolution'],
        idealAnswer: 'I follow a bottom-up OSI troubleshooting approach: 1) Physical Layer: Check Ethernet cable link lights or Wi-Fi connectivity. 2) Data Link & Network: Run `ipconfig /all`. If IP is 169.254.x.x (APIPA), DHCP is unreachable; run `ipconfig /release` and `ipconfig /renew`. 3) Ping loopback `127.0.0.1` to confirm TCP/IP stack health. 4) Ping Default Gateway to test local router communication. 5) Ping public IP (`8.8.8.8`); if successful but browsing fails, it is a DNS issue — run `nslookup google.com` and `ipconfig /flushdns`.'
      },
      {
        question: 'How do you troubleshoot a user unable to log into their Windows domain account or access Active Directory network shares?',
        category: 'Active Directory & Identity',
        difficulty: 'Medium',
        expectedPoints: ['Check if account is locked out or password expired in ADUC', 'Verify domain controller network connectivity', 'Time synchronization skew between client and DC (Kerberos requires <5 mins)', 'Group Policy update with gpupdate /force'],
        idealAnswer: '1) In Active Directory Users and Computers (ADUC), check if the user account is locked, disabled, or if password expired. 2) Verify network connectivity and DNS points to the internal Domain Controller. 3) Check system clock: Kerberos authentication fails if workstation time is skewed by more than 5 minutes from the DC. 4) Run `gpupdate /force` and inspect event logs (`eventvwr.msc`) under Security for failed logon Event ID 4625.'
      },
      {
        question: 'A user reports that Microsoft Outlook is repeatedly prompting for a password and emails are stuck in the Outbox. What are your troubleshooting steps?',
        category: 'Office 365 & Application Support',
        difficulty: 'Medium',
        expectedPoints: ['Check Windows Credential Manager and clear cached credentials', 'Verify Modern Authentication (MFA prompt)', 'Run Outlook in Safe Mode (outlook.exe /safe) to check faulty add-ins', 'Rebuild Outlook profile in Control Panel Mail'],
        idealAnswer: '1) Verify user credentials and MFA status in Microsoft 365 Admin Center. 2) Open Windows Credential Manager and remove outdated cached generic credentials for Office/Outlook. 3) Test Outlook in Safe Mode (`outlook.exe /safe`) to rule out misbehaving third-party add-ins. 4) Check mailbox storage limits and attachment size in Outbox. 5) If unresolved, create a clean new Outlook profile via Control Panel -> Mail.'
      }
    ]
  },
  'desktopsupport': {
    title: 'Desktop Support Engineer',
    coreSkills: ['Windows 10/11', 'Hardware Diagnostics', 'BitLocker', 'Printer Troubleshooting', 'Driver Management', 'Remote Desktop', 'OS Imaging'],
    questionBank: [
      {
        question: 'A workstation experiences recurring Blue Screen of Death (BSOD) crashes. How do you analyze the root cause and resolve it?',
        category: 'OS Diagnostics & Hardware',
        difficulty: 'Medium',
        expectedPoints: ['Note BSOD Stop Code (e.g. CRITICAL_PROCESS_DIED, MEMORY_MANAGEMENT)', 'Inspect Minidump files using WinDbg or BlueScreenView', 'Run Windows Memory Diagnostic (mdsched.exe)', 'Boot into Safe Mode, update/rollback faulty hardware drivers, run sfc /scannow and DISM'],
        idealAnswer: '1) Note the exact Stop Code (e.g., `DRIVER_IRQL_NOT_LESS_OR_EQUAL` or `PAGE_FAULT_IN_NONPAGED_AREA`). 2) Boot into Safe Mode and extract minidump files from `C:\\Windows\\Minidump` using BlueScreenView or WinDbg to pinpoint the responsible `.sys` driver. 3) Run `sfc /scannow` and `DISM /Online /Cleanup-Image /RestoreHealth` to repair corrupted Windows system files. 4) Run `mdsched.exe` to test RAM for hardware defects. 5) Rollback or clean-install recent GPU, chipset, or network drivers.'
      },
      {
        question: 'A network shared printer in the office is showing as "Offline" for all users and jobs are stuck in queue. How do you resolve this?',
        category: 'Peripherals & Hardware',
        difficulty: 'Easy',
        expectedPoints: ['Ping printer IP address to verify connectivity', 'Restart Windows Print Spooler service (net stop spooler && net start spooler)', 'Clear stuck print jobs in C:\\Windows\\System32\\spool\\PRINTERS', 'Check SNMP status on print server port configuration'],
        idealAnswer: '1) Ping the printer\'s static IP from command line to verify physical and network connectivity. 2) Access the print server: stop the Print Spooler service (`net stop spooler`), clear all temporary `.spl` and `.shd` files in `C:\\Windows\\System32\\spool\\PRINTERS`, then restart with `net start spooler`. 3) Verify the printer port settings in Printer Properties; uncheck "SNMP Status Enabled" if SNMP timeouts are causing false offline states.'
      },
      {
        question: 'How do you prepare a fleet of new corporate laptops for deployment using Sysprep and disk imaging / Intune Autopilot?',
        category: 'Deployment & Imaging',
        difficulty: 'Medium',
        expectedPoints: ['Generalizing OS using sysprep /generalize /oobe /shutdown', 'BitLocker drive encryption keys backed up to Azure AD / AD', 'Modern cloud deployment via Microsoft Intune Autopilot profiles', 'Standard base applications and security endpoint agents'],
        idealAnswer: 'For modern corporate environments: 1) Hardware hashes are registered in Microsoft Intune Autopilot for zero-touch cloud provisioning. 2) For gold-master image setups: configure reference OS, run `sysprep.exe /generalize /oobe /shutdown` to strip unique SIDs and machine-specific drivers before capturing the image via WDS/Clonezilla. 3) Ensure BitLocker recovery keys automatically escrow to Active Directory or Entra ID, and verify endpoint antivirus (EDR) agents register on first boot.'
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

  if (normalizedKey.includes('devops') || normalizedKey.includes('kubernetes') || normalizedKey.includes('ci/cd')) {
    categoryKey = 'devops';
  } else if (normalizedKey.includes('aws') || normalizedKey.includes('cloud')) {
    categoryKey = 'aws';
  } else if (normalizedKey.includes('linux') || normalizedKey.includes('sysadmin') || normalizedKey.includes('system admin')) {
    categoryKey = 'linux';
  } else if (normalizedKey.includes('desktop') || normalizedKey.includes('desktop support')) {
    categoryKey = 'desktopsupport';
  } else if (normalizedKey.includes('it support') || normalizedKey.includes('helpdesk') || normalizedKey.includes('service desk') || normalizedKey.includes('support')) {
    categoryKey = 'itsupport';
  } else if (normalizedKey.includes('front')) {
    categoryKey = 'frontend';
  } else if (normalizedKey.includes('back')) {
    categoryKey = 'backend';
  } else if (normalizedKey.includes('data') || normalizedKey.includes('analyst') || normalizedKey.includes('python')) {
    categoryKey = 'datascience';
  }

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
