import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

function Layout() {
  return (
    <>
      <div className='vh-100 vw-100 overflow-auto'>
        <Nav />

        <main style={{minHeight: '100%'}}>
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Layout
