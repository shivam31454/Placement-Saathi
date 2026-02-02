# Project Report: Placement Saathi

> [!NOTE]
> This is a living document. It tracks the current state of the project, including technology stack, dependencies, API integrations, and feature implementations.

**Last Updated:** 2026-01-26

## 1. Project Overview
Placement Saathi is a comprehensive web application designed to help students prepare for job interviews. It includes features for mock interviews, AI-driven chat assistance, interview experiences sharing, and performance analytics.

## 2. Technology Stack

### Backend (Server)
- **Node.js & Express**: Core server framework.
- **MongoDB & Mongoose**: Database for storing Users, Experiences, and Tests.
- **Groq SDK**: Interface for AI functionalities.

### Frontend (Client)
- **React (Vite)**: Modern, fast frontend framework.
- **Tailwind CSS**: Utility-first styling.
- **Zustand**: State management (e.g., AuthStore).
- **Framer Motion**: Animations.

## 3. Dependencies

### Server Dependencies
| Package | Purpose |
| :--- | :--- |
| `express` | Web server framework. |
| `mongoose` | MongoDB object modeling. |
| `groq-sdk` | **[CRITICAL]** Logic for AI Mock Interview & Chatbot. Uses `llama-3.3-70b-versatile` model. |
| `jsonwebtoken` | User authentication & session management. |
| `bcrypt` | Password hashing for security. |
| `cors` | Handling Cross-Origin requests. |
| `dotenv` | loading environment variables. |
| `multer` | Handling file uploads (e.g., resumes). |
| `pdf-parse` | Extracting text from PDF resumes for analysis. |
| `nodemailer` | Sending emails (e.g., password reset). |

### Client Dependencies
| Package | Purpose |
| :--- | :--- |
| `react`, `react-dom` | Core UI library. |
| `react-router-dom` | Client-side routing. |
| `axios` | Making HTTP requests to the backend. |
| `lucide-react` | Icon set used throughout the UI. |
| `react-chartjs-2`, `chart.js` | Rendering performance graphs and analytics charts. |
| `framer-motion` | UI animations (e.g., card hovers, page transitions). |
| `@monaco-editor/react` | Code editor component for coding tests. |

## 4. APIs & Integrations

### 🤖 Groq AI API
- **Purpose**: Powers the "AI Mock Interview" and "Global Chat Widget".
- **Model Used**: `llama-3.3-70b-versatile`.
- **Implementation**:
    - `server/controllers/aiController.js`: Handles prompt engineering and API calls.
    - **System Prompts**: Custom-tuned personas for "Senior Staff Software Engineer" (Mock Interview) and "Career Mentor" (Chat).
    - **Features**: Includes logic to ignore Speech-to-Text hallucinations (e.g., "baby") and provide grammar correction.

### 📊 LeetCode GraphQL API
- **Purpose**: Fetches real-time coding statistics for the "Analytics" dashboard.
- **Endpoint**: `https://leetcode.com/graphql` (Public endpoint).
- **Implementation**:
    - `server/controllers/leetcodeController.js`:
        - Fetches user stats (`submitStatsGlobal`).
        - Fetches solved problems by tag (`tagProblemCounts`).
        - **Recommendation Engine**: Fetches specific problems (Easy/Medium/Hard) for topics where the user's score is < 5/10.

### 🗄️ MongoDB Atlas
- **Purpose**: Primary database.
- **Collections**:
    - `users`: Stores profiles, LeetCode usernames.
    - `experiences`: Stores shared interview stories.
    - `tests` / `results`: Stores mock test data.

## 5. Key Features Explained

### 🎤 AI Mock Interview
- **How it works**:
    1. Browser uses native `SpeechRecognition` API to convert user voice to text.
    2. Frontend sends text -> Backend (`/api/v1/ai/interview`).
    3. Backend sends text + History -> Groq AI.
    4. AI responds with a concise, spoken-style answer.
    5. Frontend uses `window.speechSynthesis` to speak the response.
- **Key Files**: `client/src/pages/student/AIMockInterview.jsx`, `server/controllers/aiController.js`.

### 📈 LeetCode Analytics & Recommendations
- **How it works**:
    1. User links `leetcodeUsername`.
    2. Backend queries LeetCode API for solved counts per tag (e.g., "Dynamic Programming": 10 solved).
    3. **Scoring**: Calculates a 1-10 rating based on solve count.
    4. **Recommendation**: If rating < 5, backend fetches 1 Easy, 1 Medium, and 1 Hard problem for that specific tag.
- **Key Files**: `server/controllers/leetcodeController.js`, `client/src/pages/student/Dashboard.jsx`.

### 📝 Interview Experiences
- **How it works**:
    1. Users view/post stories stored in MongoDB.
    2. Data is served via REST API (`/api/v1/experiences`).
- **Key Files**: `server/controllers/experiencesController.js`, `client/src/pages/student/InterviewExperiences.jsx`.

---
*This report should be updated whenever a new major feature or dependency is added.*
