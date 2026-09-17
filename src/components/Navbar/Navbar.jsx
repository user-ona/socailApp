import React from 'react'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../CounterContext/UserContext'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../api/getProfile.api'
export default function Navbar() {
let {userLogin,setuserLogin}=useContext(UserContext)
let navigate=useNavigate()
const {data: profile} = useQuery({
  queryKey: ['profile'],
  queryFn: getProfile,
  select: (response) => response?.data?.data
})

function signOut() {
  localStorage.removeItem('userToken')
  setuserLogin(null)
navigate('/login')
}

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-30 fixed z-90 ">
  <div className="flex-1">
    <Link to={'/home'} className="btn btn-ghost text-xl text-sky-500">SocialApp</Link>
  </div>
  <div className="flex gap-5">
    {userLogin ?  <div className="dropdown dropdown-end">
      <button type="button" tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt={profile?.user?.name || 'Profile'}
            src={profile?.user?.photo || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'} />
        </div>
      </button>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content right-0 left-auto mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg">
        <li>
          <Link to={'/profile'} className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li>
          <details className="">
  <summary className=" ">settings</summary>
  <ul className="   z-1   ">
    <li><Link to={`/ChangePassword`}>change password</Link></li>
    
  </ul>
</details>
        </li>
        <li>
          <button type="button" onClick={signOut} className="w-full text-left">Logout</button>
        </li>
      </ul>
    </div> :   <ul className='flex gap-5 items-center'>
    <li className='font-bold text-sky-400'>  <Link to={"/"}>Register</Link>
    </li>
    <li  className='font-bold text-sky-400'><Link to={"login"}>Login</Link></li>
  </ul> }
   
  
  
   
  </div>
</div>
    </>
  )
}
