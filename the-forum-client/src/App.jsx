// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import PageLoader from './components/PageLoader';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

// Lazy load the pages
const Auth = lazy(() => import('./pages/auth/Auth'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Layout = lazy(() => import('./components/Layout'));
const Info = lazy(() => import('./pages/Info'));
const Contact = lazy(() => import('./pages/Contact'));
const HelpAndSupport = lazy(() => import('./pages/HelpAndSupport'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const Overview = lazy(() => import('./pages/Overview'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Messages = lazy(() => import('./pages/Messages'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Clubs = lazy(() => import('./pages/Clubs'));
const Events = lazy(() => import('./pages/Events'));
const Search = lazy(() => import('./pages/Search'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<ProtectedRoute requireAuth={true}><Dashboard /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="overview" element={<Overview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="events" element={<Events />} />
              <Route path="search" element={<Search />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/info/" element={<Layout />}>
              <Route index element={<Info />} />
              <Route path="contact" element={<Contact />} />
              <Route path="help-support" element={<HelpAndSupport />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/auth/" element={<ProtectedRoute requireAuth={false}><Auth /></ProtectedRoute>}>
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
