import React from 'react'

export default function Error({error}) {
  return (
    <>
<div className='flex justify-center items-center min-h-screen'>
    <div role="alert" className="alert alert-error alert-soft flex justify-center">
  <span className=''>{error}</span>
</div>
</div>
    </>
  )
}
