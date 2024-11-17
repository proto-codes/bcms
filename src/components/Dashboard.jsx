import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { MdTask, MdBarChart, MdNotifications, MdHelp, MdMail, MdAccountCircle, MdExitToApp, MdSettings, MdSearch, MdGroup, MdVisibility, MdManageAccounts, MdDashboard } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Dashboard() {
  const { userId } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState('');

  const handleMenuVisibility = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      // setIsAuthenticated(false);
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user');
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <div className="row m-0">
        <div className="dashboard-menu vh-100 col-md-3 p-0 bg-purple z-3" style={{ right: showMenu ? '0' : '100%' }}>
          <div className="w-100 p-3 d-none d-md-flex align-items-center gap-2 bg-purple-subtle" style={{ height: '8rem' }}>
            <img src='/profile-placeholder.png' alt="User img" className='img' />
            <div className="d-flex flex-column">
              <strong className='h5 m-0'>{userName || 'Loading...'}</strong>
              <span className='text-gold fw-bold status-online'>Online</span>
            </div>
          </div>
          <div className="p-3 text-light border-bottom d-flex align-items-center justify-content-between">
            <h4 className='m-0'>Dashboard</h4>
            <button className='btn btn-close btn-close-white d-block d-md-none' onClick={handleMenuVisibility}></button>
          </div>
          <div className="p-3">
            <nav onFocus={handleMenuVisibility}>
              <NavLink to="/overview" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdDashboard size={30} color="#fff" /> Overview
              </NavLink>
              <NavLink to="/manage" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdGroup size={30} color="#fff" /> Club
              </NavLink>
              {/* Dropdown */}
              {/* <div className="dropdown">
                <a 
                  href="#" 
                  className='nav-link dropdown-toggle nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none' 
                  id="dropdownMenuLink" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <MdGroup size={30} color="#fff" /> Clubs
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <Link className="dropdown-item fs-5" to="/clubs/overview">
                      <MdVisibility size={20} className="me-2" /> Overview
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item fs-5" to="/clubs/manage">
                      <MdManageAccounts size={20} className="me-2" /> Manage Club
                    </Link>
                  </li>
                </ul>
              </div> */}
              <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdTask size={30} color="#fff" /> Tasks
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdSearch size={30} color="#fff" /> Search
              </NavLink>
              <NavLink to="/statistics" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdBarChart size={30} color="#fff" /> Statistics
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none active-tab' : 'nav-tab text-light fs-4 p-1 d-flex align-items-center gap-2 text-decoration-none'}>
                <MdSettings size={30} color="#fff" /> Settings
              </NavLink>
            </nav>
          </div>
        </div>
        <div className="vh-100 col-md-9 p-0">
          <div className="w-100 px-3 d-flex align-items-center justify-content-between bg-purple" style={{ height: '4.5rem' }}>
            <div className="d-flex align-items-center gap-2">
              <button className='btn p-1 d-block d-md-none' onClick={handleMenuVisibility}>
                <FaBars size={30} color="#fff" />
              </button>
              <h2 className='bcms m-0 text-gold'>BCMS</h2>
            </div>
            <div className="d-flex align-items-center gap-2">
              <NavLink
                className={({ isActive }) => isActive ? 'text-gold fs-5 active-icon' : 'text-gold fs-5'}
                to="/notifications"><MdNotifications size={30} color="#fff" className='icon' />
              </NavLink>
              <NavLink
                className={({ isActive }) => isActive ? 'text-gold fs-5 active-icon' : 'text-gold fs-5'}
                to="/help-support"><MdHelp size={30} color="#fff" className='icon' />
              </NavLink>
              <NavLink
                className={({ isActive }) => isActive ? 'text-gold fs-5 active-icon' : 'text-gold fs-5'}
                to="/messages"><MdMail size={30} color="#fff" className='icon' />
              </NavLink>
              <div className="dropdown">
                <button className="btn dropdown-toggle d-flex align-items-center gap-2 p-1 text-light" type='button' id='dropdownMenuButton' data-bs-toggle='dropdown' aria-expanded='false'>                    
                  <img src='/profile-placeholder.png' alt="" className='img' style={{ width: '2.5rem' }} />
                  <span className='d-none d-md-block'>{userName.split(' ')[0] || 'Loading...'}</span>
                </button>
                <ul className="dropdown-menu" aria-labelledby='dropdownMenuButton'>
                  <li>
                    <NavLink to={`/profile/${userId}`} className="dropdown-item d-flex align-items-center gap-2"><MdAccountCircle size={20} /> Profile</NavLink>
                    <button className="btn dropdown-item d-flex align-items-center gap-2" onClick={handleLogout}>
                      <MdExitToApp size={20} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <main className='cst-height'>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
