import React, { useEffect } from 'react';
import { MdMenu } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/img/the-forum-logo.jpeg';

function Nav() {
  const btnRef = React.createRef();

  const handleFocus = () => {
    // Only trigger the focus on mobile screen size (e.g., less than 768px)
    if (window.innerWidth < 768) {
      btnRef.current.click();
    }
  };

  // Add event listener for resizing to handle any dynamic resizing behavior
  useEffect(() => {
    const handleResize = () => {
      // This function is triggered on window resize to update the navbar if needed
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem('token'); // true if token exists, false otherwise

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-purple position-sticky top-0 shadow z-3">
      <div className="container">
        <div className="d-flex align-items-center">
          <NavLink className="navbar-brand d-flex align-items-center gap-2 text-gold fw-bold" to="/">
          <img src={Logo} alt="The Forum" height="40" className='rounded' /> <span>The Forum</span>
          </NavLink>
        </div>

        {/* Toggle button for small screens */}
        <button
          ref={btnRef}
          className="navbar-toggler text-gold"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <MdMenu size={30} />
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto" onFocus={handleFocus}>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => isActive ? 'nav-link text-gold fs-5 active-link' : 'nav-link text-gold fs-5'}
                to="/">Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => isActive ? 'nav-link text-gold fs-5 active-link' : 'nav-link text-gold fs-5'}
                to="/info/gallery">Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => isActive ? 'nav-link text-gold fs-5 active-link' : 'nav-link text-gold fs-5'}
                to="/info/contact">Contact Us
              </NavLink>
            </li>

            {/* Conditional rendering for Login/Register */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => isActive ? 'nav-link text-gold fs-5 active-link' : 'nav-link text-gold fs-5'}
                    to="/auth/login">Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => isActive ? 'nav-link text-gold fs-5 active-link' : 'nav-link text-gold fs-5'}
                    to="/auth/register">Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
