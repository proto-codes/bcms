import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container-fluid my-2 p-3">
      <header className="background-img bg-gold-dark text-white text-center p-5">
        <h1 className="position-relative z-2">Welcome to The Forum</h1>
      </header>

      <div className="section my-4">
        <h4 className='text-gold-dark mb-3'>About Us</h4>
        <p className="fs-5">
          We are the members of “The Forum for Support, Wellness and Philanthropy” (also known as “The League of Gentlemen”), a not-for-profit organization with a registered office at Umuahia, Abia State Nigeria, and registered as a Not-for-Profit organization under Part F of the Companies and Allied Matters Act, (C.A.M.A) 2020, Laws of the Federation of Nigeria.
        </p>
        <p className="fs-5">
          The name of the Association is “The Forum for Support, Wellness, and Philanthropy”, hereinafter referred to as "The Forum" or “League of Gentlemen”.
        </p>
        <p className="fs-5">
          The registered address/secretariat of the Association is in Umuahia, Abia State, Nigeria.
        </p>
        <h4 className='text-gold-dark mb-3'>Purpose:</h4>
        <ul className='fs-5'>
          <li>
            The Association operates purely as an Association whose core objectives shall be charitable ventures to be initiated and actualized for the benefits of its members and the society.
          </li>
          <li>
            Being mindful of the diverse interests, beliefs, orientation, and doctrines of its membership, the Association shall not hold any political or religious affiliations or bias to any group or person(s) within or outside the Association.
          </li>
          <li>
            The Association aims to serve its members and their interests that fall within its objectives, enhance the members’ well-being, and strive to make positive impacts in the community through the following major objectives:
            <ul className='fs-5'>
              <li>Providing support and rallying around bereaved or sick members during their time of need.</li>
              <li>Encouraging exercise, healthy living, and overall wellness among forum or Association members.</li>
              <li>Engaging in corporate social responsibility initiatives to benefit the wider community.</li>
              <li>Any other activities agreed by at least two-thirds majority of the membership as being beneficial to “The Forum”.</li>
            </ul>
          </li>
        </ul>
        <h4 className='text-gold-dark mb-3'>The Executives:</h4>
        <ul className='fs-5'>
          <li>Barr Sam Hart: Mni - Ugwu Ngwu President</li>
          <li>Dr Pastra Arinze Etie. Ochiagha - Sec - Gen</li>
          <li>Mazi Austin Akuma. Ugwu Atani - Treasury</li>
        </ul>
      </div>

      <div className="section my-4">
        <h4 className='text-gold-dark mb-3'>Join Us!</h4>
        <p className="fs-5">If you're passionate about learning and collaboration, we invite you to become a part of our community. Together, we can achieve great things!</p>
        <Link to='/auth/register' className="btn btn-gold-dark">Get Started</Link>
      </div>
    </div>
  );
}

export default Home
