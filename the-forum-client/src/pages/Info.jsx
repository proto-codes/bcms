import React from 'react'
import { Link } from 'react-router-dom'
import Technicalexcellence from '../assets/img/technical-excellence.png'
import Educationaltransparency from '../assets/img/educational-transparency.png'
import Community from '../assets/img/community.png'
import Socialresponsibility from '../assets/img/social-responsibility.png'

function Home() {
  return (
    <>
      <section className="background-img p-3">
        <div className="Forum-info w-75">
          <p className='fs-5 fw-bold text-light'>Welcome to The Forum</p>
          <p className="fs-5 fw-bold text-light">Connect with like-minded individuals, join clubs that align with your interets, and participate in meaningful discussions. The Forum is a platform designed to foster community engagement, learning and growth.</p>
          <Link to='/login' className="btn btn-blue p-3 rounded-pill fs-5 mb-4">Learn more</Link>
        </div>
      </section>

      {/* Features */}
      <section className='p-3'>
        <h2 className='text-blue fw-bold mb-3'>Features</h2>
        <ul>
          <li className='fs-5'>Discover and join clubs that match your passion</li>
          <li className='fs-5'>Attend events, webinars, and meetups</li>
          <li className='fs-5'>Engage in discussion, share ideas, and learn from others</li>
          <li className='fs-5'>Access resources, materials and expert insights</li>
          <li className='fs-5'>Connect with members, leaders, and mentors</li>
        </ul>
      </section>

      {/* Benefits */}
      <section className='p-3'>
        <h2 className='text-blue fw-bold mb-3'>Benefits</h2>
        <ul>
          <li className='fs-5'>Expand your network and build meaningful relationships</li>
          <li className='fs-5'>Develop new skills and knowledge</li>
          <li className='fs-5'>Enhance your personal and professional growth</li>
          <li className='fs-5'>Find support, encouragement, and motivation</li>
          <li className='fs-5'>Be part of a vibrant and diverse community</li>
        </ul>
      </section>

      {/* What is it for? */}
      <section className='p-3'>
        <h2 className='text-blue fw-bold mb-3'>What is it for?</h2>
        <ul>
          <li className='fs-5'>Anyone looking to connect with others who share similar interests</li>
          <li className='fs-5'>Individuals seeking personal and professional development</li>
          <li className='fs-5'>Club leaders and organizers wanting to manage their group efficiently</li>
          <li className='fs-5'>Event planners and speaker looking to reach a target audience</li>
        </ul>
      </section>

      {/* Goals */}
      <section className='p-3'>
        <h2 className='text-blue fw-bold mb-3'>Goals</h2>
        <div className='row'>
          <div className="col-md-6 px-3 mb-3">
            <img src={Technicalexcellence} alt="Forum Goals" style={{width: '3rem'}} />
            <h4 className='text-blue fw-bold'>Inspire</h4>
            <p className="fs-5">Create a supportive environment that inspire creativity, innovation, and progress</p>
          </div>
          <div className="col-md-6 px-3 mb-3">
            <img src={Educationaltransparency} alt="Forum Goals" style={{width: '3rem'}} />
            <h4 className='text-blue fw-bold'>Empower</h4>
            <p className="fs-5">Equip members with tools, skills, and confidence to achieve their goals</p>
          </div>  
        </div>
        <div className='row'>
          <div className="col-md-6 px-3 mb-3">
            <img src={Community} alt="Forum Goals" style={{width: '3rem'}} />
            <h4 className='text-blue fw-bold'>Connect</h4>
            <p className="fs-5">Foster meaningful connection among members with shared interests</p>
          </div>
          <div className="col-md-6 px-3">
            <img src={Socialresponsibility} alt="Forum Goals" style={{width: '3rem'}} />
            <h4 className='text-blue fw-bold'>Engage</h4>
            <p className="fs-5">Encourage active participation in discussion, events, and activities.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
