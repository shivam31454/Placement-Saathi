# Project Report: Placement Saathi

> [!NOTE]
> This is a living document. It tracks the current state of the project, including technology stack, dependencies, API integrations, and feature implementations.

**Last Updated:** 2026-02-03

## 1. Project Overview
Placement Saathi is a comprehensive, AI-powered web application designed to help students prepare for job interviews and placements. It includes features for AI mock interviews with 3D avatars, global AI chat assistance, LeetCode integration, structured learning paths, interview experiences sharing, and comprehensive performance analytics.

## 2. Technology Stack

### Backend (Server)
- **Node.js & Express**: Core server framework
- **MongoDB & Mongoose**: Database for storing Users, Experiences, Tests, and Learning Content
- **Groq SDK**: AI functionalities for interviews and chat
- **Axios**: HTTP client for external API calls (LeetCode)

### Frontend (Client)
- **React 18 (Vite)**: Modern, lightning-fast frontend framework
- **Tailwind CSS**: Utility-first styling with dark mode support
- **Zustand**: Lightweight state management
- **Framer Motion**: Smooth animations and transitions
- **React Three Fiber + Drei**: 3D graphics for avatar rendering
- **Chart.js**: Analytics visualization

## 3. Dependencies

### Server Dependencies
| Package | Purpose |
| :--- | :--- |
| `express` | Web server framework |
| `mongoose` | MongoDB object modeling |
| `groq-sdk` | **[CRITICAL]** AI Mock Interview & Chatbot using `llama-3.3-70b-versatile` |
| `axios` | **[NEW]** HTTP client for LeetCode API integration |
| `jsonwebtoken` | User authentication & session management |
| `bcrypt` | Password hashing for security |
| `cors` | Handling Cross-Origin requests |
| `dotenv` | Loading environment variables |
| `multer` | Handling file uploads (resumes) |
| `pdf-parse` | Extracting text from PDF resumes |
| `nodemailer` | Email functionality (password reset) |
| `helmet` | Security middleware |
| `morgan` | HTTP request logging |
| `joi` | Input validation |

### Client Dependencies
| Package | Purpose |
| :--- | :--- |
| `react`, `react-dom` | Core UI library (v18) |
| `react-router-dom` | Client-side routing with lazy loading |
| `axios` | HTTP requests to backend API |
| `lucide-react` | Modern icon set |
| `react-chartjs-2`, `chart.js` | Performance graphs and analytics |
| `framer-motion` | **[ENHANCED]** UI animations and transitions |
| `@monaco-editor/react` | VS Code-powered code editor |
| `three`, `@react-three/fiber`, `@react-three/drei` | **[NEW]** 3D avatar rendering |
| `zustand` | State management |
| `clsx`, `tailwind-merge` | Utility for conditional CSS classes |

## 4. APIs & Integrations

### 🤖 Groq AI API
- **Purpose**: Powers AI Mock Interview and Global Chat Widget
- **Model Used**: `llama-3.3-70b-versatile`
- **Implementation**:
    - `server/controllers/aiController.js`: Handles prompt engineering and API calls
    - **System Prompts**: Custom personas for "Senior Staff Software Engineer" (Interview) and "Career Mentor" (Chat)
    - **Features**: Speech-to-Text hallucination filtering, grammar correction, context-aware responses
- **Endpoints**:
    - `POST /api/v1/ai/interview`: Mock interview conversations
    - `POST /api/v1/ai/chat`: General career guidance

### 📊 LeetCode GraphQL API
- **Purpose**: Fetches real-time coding statistics and problem recommendations
- **Endpoint**: `https://leetcode.com/graphql` (Public)
- **Implementation**:
    - `server/controllers/leetcodeController.js`:
        - Fetches user stats (`submitStatsGlobal`)
        - Fetches solved problems by tag (`tagProblemCounts`)
        - **Recommendation Engine**: Suggests Easy/Medium/Hard problems for weak topics (score < 5/10)
- **Endpoints**:
    - `GET /api/v1/leetcode/analytics`: User coding statistics
    - `POST /api/v1/leetcode/link`: Link LeetCode account
    - `DELETE /api/v1/leetcode/unlink`: Unlink account

### 🗄️ MongoDB Atlas
- **Purpose**: Primary database (cloud-hosted)
- **Collections**:
    - `users`: User profiles, LeetCode usernames, authentication
    - `experiences`: Shared interview stories
    - `tests` / `results`: Mock test data and submissions
    - `subjects` / `topics`: **[NEW]** Structured learning content
    - `questions`: Test question bank

## 5. Key Features Explained

### 🎭 AI Mock Interview with 3D Avatars
- **How it works**:
    1. User selects interviewer (David/Sarah) - built-in 3D avatars
    2. Browser uses `SpeechRecognition` API for voice-to-text
    3. Frontend sends text → Backend (`/api/v1/ai/interview`)
    4. Backend sends text + conversation history → Groq AI
    5. AI responds with natural, interview-style answer
    6. Frontend uses `window.speechSynthesis` for text-to-speech
    7. **[NEW]** 3D avatar animates with lip-sync during speech
- **Avatar Technology**:
    - Procedurally generated using React Three Fiber
    - No external dependencies (ReadyPlayerMe discontinued)
    - Features: Lip-sync, eye blinking, head bobbing
- **Key Files**: 
    - `client/src/pages/student/AIMockInterview.jsx`
    - `client/src/components/Three/Avatar.jsx`
    - `server/controllers/aiController.js`

### 💬 Global AI Chat Widget
- **How it works**:
    1. Floating widget accessible from any page
    2. Context-aware responses about placements, interviews, career advice
    3. Maintains conversation history
- **Key Files**: 
    - `client/src/components/chat/AIChatWidget.jsx`

### 📈 LeetCode Analytics & Recommendations
- **How it works**:
    1. User links `leetcodeUsername` via dashboard
    2. Backend queries LeetCode GraphQL API for:
        - Total solved problems (Easy/Medium/Hard)
        - Tag-wise problem counts (e.g., "Dynamic Programming": 10)
    3. **Scoring Algorithm**: Calculates 1-10 rating per topic
    4. **Smart Recommendations**: If rating < 5, suggests 3 problems (Easy/Medium/Hard) for that topic
- **Key Files**: 
    - `server/controllers/leetcodeController.js`
    - `client/src/pages/student/Dashboard.jsx`

### 📚 Structured Learning System
- **How it works**:
    1. Content organized by Subjects → Topics
    2. Each topic has theory, examples, and practice questions
    3. Progress tracking per topic
    4. Practice Arena for hands-on learning
- **Key Files**:
    - `client/src/pages/learning/LearningDashboard.jsx`
    - `client/src/pages/learning/SubjectView.jsx`
    - `client/src/pages/learning/PracticeArena.jsx`
    - `server/routes/learningRoutes.js`

### 📝 Interview Experiences
- **How it works**:
    1. Students share real interview experiences
    2. Filter by company, status (Selected/Rejected)
    3. Stored in MongoDB, served via REST API
- **Key Files**: 
    - `server/controllers/experiencesController.js`
    - `client/src/pages/student/InterviewExperiences.jsx`

### 🎯 Mock Test Engine
- **Features**:
    - Real-time timer with auto-submit
    - Question palette (Answered/Unanswered/Marked)
    - Monaco Editor for coding questions
    - Instant results with detailed analytics
- **Key Files**:
    - `client/src/pages/student/LiveTest.jsx`
    - `client/src/pages/student/TestResult.jsx`

## 6. Performance Optimizations

### Code Splitting & Lazy Loading
- All routes use `React.lazy()` for on-demand loading
- Reduces initial bundle size by ~60-70%
- Faster Time to Interactive (TTI)

### Smart Chunk Splitting
- Vendor libraries separated into optimized chunks:
    - `react-vendor`: React core
    - `chart-vendor`: Chart.js
    - `three-vendor`: 3D libraries
    - `ui-vendor`: Framer Motion, icons
    - `editor-vendor`: Monaco Editor

### Build Optimizations
- Terser minification with console.log removal
- CSS code splitting per route
- Tree-shaking for dead code elimination

### Network Optimizations
- DNS prefetch for external domains
- Preconnect hints in HTML
- Optimized dependency loading

## 7. Deployment Architecture

### Frontend (Vercel)
- Automatic deployments from GitHub
- Environment Variables:
    - `VITE_API_URL`: Backend API URL (must include `/api/v1`)
- Edge network for global CDN

### Backend (Render)
- Auto-deploy from GitHub
- Environment Variables:
    - `PORT`: Server port
    - `MONGO_URI`: MongoDB Atlas connection string
    - `JWT_SECRET`: Authentication secret
    - `GROQ_API_KEY`: Groq AI API key

### Database (MongoDB Atlas)
- Cloud-hosted MongoDB
- IP whitelist: `0.0.0.0/0` for Render access

## 8. Security Measures

- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js for HTTP headers
- CORS configuration
- Input validation with Joi
- Environment variable protection

## 9. Recent Updates (2026-02-03)

### ✅ Completed
- Replaced ReadyPlayerMe with built-in 3D avatars
- Implemented comprehensive performance optimizations
- Added lazy loading and code splitting
- Created deployment guides and troubleshooting docs
- Removed unnecessary console.logs and test files
- Updated README with all new features

### 🔄 In Progress
- Mobile responsiveness improvements
- Additional AI features

### 🎯 Planned
- Video-based mock interviews
- Peer-to-peer study groups
- Company-specific preparation tracks
- Mobile app (React Native)

---

*This report should be updated whenever a new major feature or dependency is added.*
