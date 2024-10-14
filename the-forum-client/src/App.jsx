import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Auth from './pages/auth/Auth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/Layout';
import Info from './pages/Info';
import Contact from './pages/Contact';
import HelpAndSupport from './pages/HelpAndSupport';
import Dashboard from './components/Dashboard';
import DashboardHome from './pages/DashboardHome';
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Tasks from './pages/Tasks';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Search from './pages/Search';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path='overview' element={<Overview />} />
          <Route path='profile' element={<Profile />} />
          <Route path='notifications' element={<Notifications />} />
          <Route path='messages' element={<Messages />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="events" element={<Events />} />
          <Route path="search" element={<Search />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
          <Route path='*' element={<NotFound />} />
        </Route>

        <Route path='/info/' element={<Layout />}>
          <Route index element={<Info />} />
          <Route path='contact' element={<Contact />} />
          <Route path='help-support' element={<HelpAndSupport />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        
        <Route path='/auth/' element={<Auth />}>
          <Route index element={<Login />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
