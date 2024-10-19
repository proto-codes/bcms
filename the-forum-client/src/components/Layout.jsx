import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

function Layout() {
  return (
    <>
      <div className='vh-100 vw-100 overflow-auto'>
        <Nav />

        <main className='h-100 d-flex flex-column justify-content-between'>
          <Outlet />
          <Footer />
        </main>
      </div>
    </>
  )
}

export default Layout
