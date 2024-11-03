import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='bg-purple'>
      <div className="container py-3 text-light text-center">
        {/* Quick Links */}
        <div className="footer-links d-flex flex-wrap justify-content-center text-center">
          <Link to="#" className="text-light mx-1 my-1 text-decoration-none">Home</Link>
          <Link to="#" className="text-light mx-1 my-1 text-decoration-none">Gallery</Link>
          <Link to="#" className="text-light mx-1 my-1 text-decoration-none">Contact Us</Link>
          <Link to="#" className="text-light mx-1 my-1 text-decoration-none">Help & Support</Link>
        </div>

        {/* Contact Information */}
        <p className="mb-1">info@theforum.com | +123 456 7890</p>

        {/* Copyright */}
        <p className="mb-1">&copy; {new Date().getFullYear()} The Forum All Rights Reserved
        </p>
        <p className="mb-1">
          Powered by
          <a href="https://protocodes.vercel.app/" target="_blank" rel="noopener noreferrer" className='text-decoration-none text-light'> Protocodes</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
