# Placement Saathi 🎓
> *Your AI-Powered Companion for Placement Preparation*

Placement Saathi is a comprehensive placement preparation platform designed to help students crack their dream job interviews. It combines traditional mock tests with advanced AI features like Resume ATS Scanning and Personalized Study Roadmaps.

![Placement Saathi Landing](client/public/vite.svg) *Note: Replace with actual screenshot*

## 🚀 Key Features

*   **Mock Test Engine**: Real-time examination environment with timer, question palette, and auto-submit. Supports both MCQs and Coding problems.
*   **Deep Analytics**: Visualize your performance with interactive charts (Accuracy, Subject-wise strength, etc.).
*   **Advanced Coding Editor**: Integrated Monaco Editor (VS Code core) for a superior coding experience during tests.
*   **AI Resume ATS Scanner**: Upload your PDF resume to get an instant ATS compatibility score and keyword gap analysis.
*   **Personalized Roadmap**: AI-generated weekly study plan based on your weak areas.
*   **Admin Dashboard**: comprehensive tools for colleges to create tests, manage questions, and track student progress.

## 🛠️ Tech Stack

**Frontend:**
*   React + Vite
*   Tailwind CSS (Styling)
*   Zustand (State Management)
*   Chart.js (Analytics)
*   Monaco Editor (Code Editor)
*   Lucide React (Icons)

**Backend:**
*   Node.js + Express
*   MongoDB + Mongoose
*   JWT (Authentication)
*   Multer + PDF-Parse (Resume Processing)

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v14+)
*   MongoDB (Local or Atlas URL)

### 1. Clone the Repository
```bash
git clone <repository_url>
cd placementsaathi
```

### 2. Backward Setup (Server)
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/placement_saathi
JWT_SECRET=your_super_secret_key_123
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
Start the React app:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 📚 Usage Guide

### For Students
1.  **Sign Up/Login**: Create an account to access the dashboard.
2.  **Take Tests**: Go to "Practice" or select a recommended test from the dashboard.
3.  **Analyze**: View detailed reports after every test. Check the "Analytics" tab for trend graphs.
4.  **Tools**: 
    *   Use **Resume Scan** to optimize your CV.
    *   Check **Study Roadmap** for your personalized plan.

### For Admins
1.  Log in with an admin account (Role: `admin`).
2.  **Dashboard**: View platform usage stats.
3.  **Question Bank**: Add new questions (MCQ or Coding) with specific test cases.
4.  **Test Management**: Create new assessments by selecting questions from the bank.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
MIT License
