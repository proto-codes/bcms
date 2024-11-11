import React from 'react'
import { Outlet } from 'react-router-dom';

const ClubJoin = () => {
  return (
    <div className='container-fluid my-4'>
      <h3>Clubs</h3>
      <p className='fs-5'>Welcome to the Club House!</p>
      <Outlet />
    </div>
  )
}

export default ClubJoin
