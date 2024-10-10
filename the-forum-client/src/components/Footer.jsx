import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="container-fluid bg-info text-light text-center p-3">
        {/* Quick Links */}
        <div className="footer-links d-flex flex-wrap justify-content-center text-center">
          <Link to="/info" className="text-light mx-1 my-1 text-decoration-none">Info</Link>
          <Link to="/info/contact" className="text-light mx-1 my-1 text-decoration-none">Contact Us</Link>
          <Link to="/info/help-support" className="text-light mx-1 my-1 text-decoration-none">Help & Support</Link>
        </div>

        {/* Contact Information */}
        <p className="m-0 pb-2">info@forumclub.com | +123 456 7890</p>

        {/* Copyright */}
        <p className="m-0">&copy; {new Date().getFullYear()} 
          <a href="https://protocodes.vercel.app/" target="_blank" rel="noopener noreferrer" className='text-decoration-none text-light'> Protocodes</a> All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;