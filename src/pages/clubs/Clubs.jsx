import React from 'react'
import { Outlet } from 'react-router-dom';

const Club = () => {
  return (
    <div className='container-fluid my-4'>
      <Outlet />
    </div>
  )
}

export default Club
