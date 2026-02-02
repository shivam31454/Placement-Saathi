# Placement Saathi 🎓
> *Your AI-Powered Companion for Placement Preparation*

Placement Saathi is a comprehensive, AI-powered placement preparation platform designed to help students crack their dream job interviews. It combines traditional mock tests with cutting-edge AI features including Mock Interviews, Resume ATS Scanning, LeetCode Integration, and Personalized Learning Paths.

## ✨ Key Features

### 🤖 AI-Powered Features
*   **AI Mock Interview**: Practice interviews with realistic 3D avatars (male/female) that feature lip-sync animation and natural conversation flow powered by Groq AI
*   **AI Chat Assistant**: Global AI chatbot accessible from any page to answer placement-related questions instantly
*   **AI Resume ATS Scanner**: Upload your PDF resume to get instant ATS compatibility scores and keyword gap analysis
*   **Personalized Study Roadmap**: AI-generated weekly study plans based on your weak areas

### 📝 Testing & Practice
*   **Mock Test Engine**: Real-time examination environment with timer, question palette, and auto-submit
*   **Advanced Coding Editor**: Integrated Monaco Editor (VS Code core) for superior coding experience
*   **Structured Learning**: Topic-wise learning modules with practice questions
*   **Practice Arena**: Interactive practice sessions with instant feedback

### 📊 Analytics & Tracking
*   **Deep Analytics Dashboard**: Visualize performance with interactive charts (accuracy, subject-wise strength, time management)
*   **LeetCode Integration**: Link your LeetCode account to track coding progress and get personalized recommendations
*   **Interview Experiences**: Browse and share real interview experiences from various companies

### 👥 User Management
*   **Student Dashboard**: Comprehensive view of tests, analytics, and progress
*   **Admin Dashboard**: Tools for colleges to create tests, manage questions, and track student progress
*   **Role-Based Access**: Separate interfaces for students and administrators

### 🎨 Modern UI/UX
*   **Dark Mode Support**: Eye-friendly dark theme with smooth transitions
*   **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
*   **3D Visualizations**: Interactive 3D avatars using React Three Fiber
*   **Smooth Animations**: Powered by Framer Motion for premium feel

## 🛠️ Tech Stack

**Frontend:**
*   React 18 + Vite (Lightning-fast development)
*   Tailwind CSS (Modern styling)
*   Zustand (Lightweight state management)
*   Chart.js + React-Chartjs-2 (Analytics visualization)
*   Monaco Editor (Code editor)
*   React Three Fiber + Drei (3D graphics)
*   Framer Motion (Animations)
*   Lucide React (Icons)

**Backend:**
*   Node.js + Express
*   MongoDB + Mongoose
*   JWT (Authentication)
*   Multer + PDF-Parse (Resume processing)
*   Groq SDK (AI integration)
*   Axios (HTTP client)

**AI & External Services:**
*   Groq AI (Mock interviews & chatbot)
*   LeetCode API (Coding analytics)

## 🚀 Performance Optimizations

*   **Lazy Loading**: All routes are code-split for faster initial load
*   **Smart Chunk Splitting**: Vendor libraries separated for better caching
*   **Build Optimizations**: Minification, tree-shaking, and dead code elimination
*   **DNS Prefetch**: Preconnect to external domains for faster resource loading

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v14+)
*   MongoDB (Local or Atlas URL)
*   Groq API Key (for AI features)

### 1. Clone the Repository
```bash
git clone <repository_url>
cd placement-saathi
```

### 2. Backend Setup (Server)
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/placement_saathi
JWT_SECRET=your_super_secret_key_123
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup (Client)
Open a new terminal:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (for production):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the React app:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 📚 Usage Guide

### For Students
1.  **Sign Up/Login**: Create an account to access the dashboard
2.  **Link LeetCode**: Connect your LeetCode account for coding analytics
3.  **Take Tests**: Practice with mock tests and coding challenges
4.  **AI Mock Interview**: Practice with AI-powered 3D interviewers
5.  **Analyze Progress**: View detailed analytics and performance trends
6.  **Tools**: 
    *   Use **Resume Scan** to optimize your CV for ATS
    *   Check **Study Roadmap** for personalized learning path
    *   Browse **Interview Experiences** from other students
    *   Use **AI Chat** for instant help

### For Admins
1.  Log in with an admin account (Role: `admin`)
2.  **Dashboard**: View platform usage statistics
3.  **Question Bank**: Add new questions (MCQ or Coding) with test cases
4.  **Test Management**: Create assessments by selecting questions
5.  **Student Monitoring**: Track student progress and performance

## 🌐 Deployment

The application is optimized for deployment on:
*   **Frontend**: Vercel (recommended) or Netlify
*   **Backend**: Render, Railway, or Heroku
*   **Database**: MongoDB Atlas

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 🎯 Future Enhancements

*   Video-based mock interviews with recording
*   Peer-to-peer study groups
*   Company-specific preparation tracks
*   Mobile app (React Native)
*   Advanced AI feedback on coding solutions

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Created with ❤️ for students preparing for placements

---

**Note**: This is an educational project. Make sure to add your own API keys and configure environment variables before deployment.
