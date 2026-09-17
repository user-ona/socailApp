import dayjs from 'dayjs'
import React from 'react'
import relativeTime from "dayjs/plugin/relativeTime"
export default function Comment({comment:{content,createdAt,commentCreator:{name,photo},image}}) {
   dayjs.extend(relativeTime)
    
  return (
    <>
    <div className=' border-2 border-gray-100 rounded-md p-2'>
     <div className='flex items-center gap-2 mb-1'>
          <div className='flex gap-2'>
           <div className='bg-gray-100 py-1.5 px-3 rounded-[10px]'>
            <h4 className='flex items-center font-semibold m-0'>{name} <span className='font-medium text-[8px]'>{dayjs(createdAt).fromNow()}</span></h4>
            <p className='font-medium text-gray-700 text-[14px]  flex justify-end'>{content}</p>
        </div>
        <div>
            <img src={photo} className='w-10 h-10 rounded-full' alt="" />
        </div>
         </div>
     </div>
      {image&&<img className='w-[20%] rounded-md' src={image} alt=""  />}
    </div>
      
    </>
  )
}
