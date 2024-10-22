import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='bg-purple'>
      <div className="container py-3 text-light text-center">
        {/* Quick Links */}
        <div className="footer-links d-flex flex-wrap justify-content-center text-center">
          <Link to="/info" className="text-light mx-1 my-1 text-decoration-none">Info</Link>
          <Link to="/info/gallery" className="text-light mx-1 my-1 text-decoration-none">Gallery</Link>
          <Link to="/info/contact" className="text-light mx-1 my-1 text-decoration-none">Contact Us</Link>
          <Link to="/info/help-support" className="text-light mx-1 my-1 text-decoration-none">Help & Support</Link>
        </div>

        {/* Contact Information */}
        <p className="m-0 pb-2">info@theforum.com | +123 456 7890</p>

        {/* Copyright */}
        <p className="m-0">&copy; {new Date().getFullYear()} The Forum All Rights Reserved
        </p>
        <p className="m-0">
          Powered by
          <a href="https://protocodes.vercel.app/" target="_blank" rel="noopener noreferrer" className='text-decoration-none text-light'> Protocodes</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
