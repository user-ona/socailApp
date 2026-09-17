import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'

export default function Layout() {
  return (
    <>
      <Navbar/>

<div className='min-h-screen pt-20 pb-5'>
  <Outlet/>
</div>

<Footer/>

    </>
  )
}
