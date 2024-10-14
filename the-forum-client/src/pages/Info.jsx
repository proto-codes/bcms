import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="container-fluid my-2 p-3">
      <header className="background-img bg-gold-dark text-white text-center p-5">
        <h1 className="position-relative z-2">Welcome to The Forum</h1>
        <p className="fs-5 position-relative z-2">Your Hub for Collaboration, Learning, and Engagement</p>
      </header>

      <div className="section my-4">
        <h2 className='text-gold-dark mb-3'>About Us</h2>
        <p className="fs-5">
          The Forum is a vibrant community dedicated to fostering collaboration among individuals interested in various topics, including software development, design, and technology. Our mission is to provide a platform for members to connect, share knowledge, and grow together.
        </p>
      </div>

      <div className="section my-4">
        <h2 className='text-gold-dark mb-3'>Our Vision</h2>
        <p className="fs-5">
          To create an inclusive environment where every member feels valued and empowered to contribute to discussions, share resources, and participate in events that enhance their learning experience.
        </p>
      </div>

      <div className="section my-4">
        <h2 className='text-gold-dark mb-3'>User Roles</h2>
        <ul>
          <li><strong>Admin:</strong> Manage users, create events, oversee discussions, and generate reports.</li>
          <li><strong>Club Leader:</strong> Manage club activities, approve member requests, and communicate with members.</li>
          <li><strong>Member:</strong> Join clubs, participate in discussions, RSVP for events, and access resources.</li>
        </ul>
      </div>

      <div className="section my-4">
        <h2 className='text-gold-dark mb-3'>Features</h2>
        <p className="fs-5">Our club offers a range of features for all users:</p>
        <ul>
          <li>User authentication with login/signup options.</li>
          <li>Dashboard tailored for Admins, Club Leaders, and Members.</li>
          <li>Club and event management tools.</li>
          <li>Discussion forums for engagement.</li>
          <li>Access to valuable resources and materials.</li>
          <li>Internal messaging for effective communication.</li>
          <li>Reporting and analytics for insights.</li>
        </ul>
      </div>

      <div className="section my-4">
        <h2 className='text-gold-dark mb-3'>Join Us!</h2>
        <p className="fs-5">If you're passionate about learning and collaboration, we invite you to become a part of our community. Together, we can achieve great things!</p>
        <Link to='/auth/register' className="btn btn-gold-dark">Get Started</Link>
      </div>
    </div>
  );
}

export default Home
