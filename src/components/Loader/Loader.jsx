import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

export default function Loader() {
  return (
    <>
 <div className='flex justify-center items-center min-h-screen'>
        <RotatingLines
visible={true}
height="96"
width="96"
color="grey"
strokeWidth="5"
animationDuration="0.75"
ariaLabel="rotating-lines-loading"
wrapperStyle={{}}
wrapperClass=""
/>
 </div>
    </>
  )
}
