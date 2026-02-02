import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import useAuthStore from './store/useAuthStore';
import AdminLayout from './components/layout/AdminLayout';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminAddQuestion from './pages/admin/AdminAddQuestion';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTests from './pages/admin/AdminTests';
import AdminCreateTest from './pages/admin/AdminCreateTest';
import Dashboard from './pages/student/Dashboard';
import TestInstructions from './pages/student/TestInstructions';
import LiveTest from './pages/student/LiveTest';
import TestResult from './pages/student/TestResult';
import ResumeScan from './pages/student/ResumeScan';
import StudyRoadmap from './pages/student/StudyRoadmap';
import InterviewExperiences from './pages/student/InterviewExperiences';
import AIMockInterview from './pages/student/AIMockInterview';
import LearningDashboard from './pages/learning/LearningDashboard';
import SubjectView from './pages/learning/SubjectView';
import PracticeArena from './pages/learning/PracticeArena';
import LandingPage from './pages/LandingPage';
import AIChatWidget from './components/chat/AIChatWidget';
import ThemeToggle from './components/ui/ThemeToggle';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />; // Redirect unauthorized users to student dashboard
  }

  return children;
};


function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:id/instructions"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <TestInstructions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:id/live"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <LiveTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/result/:id"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <TestResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan-resume"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <ResumeScan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experiences"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <InterviewExperiences />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <AIMockInterview />
            </ProtectedRoute>
          }
        />

        {/* Learning & Practice Routes */}
        <Route
          path="/learning"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <LearningDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning/:subjectId"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <SubjectView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/:topicId"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <PracticeArena />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="questions/new" element={<AdminAddQuestion />} />
          <Route path="tests" element={<AdminTests />} />
          <Route path="tests/new" element={<AdminCreateTest />} />
          {/* Add more admin routes here */}
        </Route>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <AIChatWidget />
      <ThemeToggle />
    </Router>
  );
}

export default App;
