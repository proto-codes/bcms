import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'

const Auth = () => {
  return (
    <>
      <div>
        <main className='vh-100 d-flex flex-column justify-content-between'>
            <Outlet />
            <Footer />
        </main>
      </div>
    </>
  )
}

export default Auth
