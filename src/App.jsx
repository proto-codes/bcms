import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import PageLoader from './components/PageLoader';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load the pages
const Auth = lazy(() => import('./components/Auth'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyAccount = lazy(() => import('./pages/auth/VerifyAccount'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Overview = lazy(() => import('./pages/DashboardOverview'));
const Profile = lazy(() => import('./pages/Profile'));
const HelpAndSupport = lazy(() => import('./pages/HelpAndSupport'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Messages = lazy(() => import('./pages/Messages'));
const Tasks = lazy(() => import('./pages/Tasks'));
const ClubOverview = lazy(() => import('./pages/clubs/ClubOverview'));
const ClubMange = lazy(() => import('./pages/clubs/ClubMange'));
const Discussion = lazy(() => import('./pages/clubs/Discussion'));
const Search = lazy(() => import('./pages/Search'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute requireAuth={true}><Dashboard /></ProtectedRoute>}>
              <Route index element={<Overview />} />
              <Route path="overview" element={<Overview />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="help-support" element={<HelpAndSupport />} />
              <Route path="messages" element={<Messages />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path=":clubId/:clubName/overview" element={<ClubOverview />} />
              <Route path="clubs" element={<ClubMange />} />
              <Route path="discussion/:discussionId" element={<Discussion />} />
              <Route path="search" element={<Search />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="verify-account" element={<VerifyAccount />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/auth/" element={<ProtectedRoute requireAuth={false}><Auth /></ProtectedRoute>}>
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
