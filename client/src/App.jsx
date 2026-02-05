import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load all page components for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminQuestions = lazy(() => import('./pages/admin/AdminQuestions'));
const AdminAddQuestion = lazy(() => import('./pages/admin/AdminAddQuestion'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminTests = lazy(() => import('./pages/admin/AdminTests'));
const AdminCreateTest = lazy(() => import('./pages/admin/AdminCreateTest'));
const Dashboard = lazy(() => import('./pages/student/Dashboard'));
const TestInstructions = lazy(() => import('./pages/student/TestInstructions'));
const LiveTest = lazy(() => import('./pages/student/LiveTest'));
const TestResult = lazy(() => import('./pages/student/TestResult'));
const ResumeScan = lazy(() => import('./pages/student/ResumeScan'));
const StudyRoadmap = lazy(() => import('./pages/student/StudyRoadmap'));
const InterviewExperiences = lazy(() => import('./pages/student/InterviewExperiences'));
const AIMockInterview = lazy(() => import('./pages/student/AIMockInterview'));
const LearningDashboard = lazy(() => import('./pages/learning/LearningDashboard'));
const SubjectView = lazy(() => import('./pages/learning/SubjectView'));
const PracticeArena = lazy(() => import('./pages/learning/PracticeArena'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AIChatWidget = lazy(() => import('./components/chat/AIChatWidget'));
const ThemeToggle = lazy(() => import('./components/ui/ThemeToggle'));

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


import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function App() {
  const { loadUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
    </AnimatePresence>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <App />
        <AIChatWidget />
        <ThemeToggle />
      </Suspense>
    </Router>
  );
}

export default AppWrapper;
