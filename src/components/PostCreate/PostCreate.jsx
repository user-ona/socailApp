import React, { useRef, useState } from 'react'
import {Avatar} from "@heroui/react";
import {Button, Modal} from "@heroui/react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaImage } from 'react-icons/fa';
import { MdGifBox } from "react-icons/md";
import { VscStarEmpty } from "react-icons/vsc";
import { BsCameraVideo } from "react-icons/bs";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function PostCreate() {
  const queryClient=useQueryClient()
    const [isOpen,setisOpen]=useState(false)
    const [isUpload,setisUpload]=useState(false)
   const text= useRef(null)
   const img= useRef(null)
  

  //  console.log(text?.current?.value);
  //  console.log(text?.current );

   function postCreate(){
       return axios.post(`https://route-posts.routemisr.com/posts`, Data(),
           {
               headers:{
                   Authorization:`Bearer ${localStorage.getItem('userToken')}`
               }
           }
       )
   }
      const {data,isPending,mutate}=useMutation({
      mutationFn:postCreate,
      onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['allPosts']})
        setisUpload(false),
        toast.success('Post created successfully')
      },
    })
    function Data(){

      // if (!text.current.value&&!img.current.files[0]) return

      const formData=new FormData()
      if (text.current.value) {
        formData.append('body', text.current.value)
      }
      if (img.current.files[0]) {
        formData.append('image', img.current.files[0])
      }
      
      return formData
    }
    
   
    function handleImage(e) {
      // console.log(e.target.files[0]);
      const image=e.target.files[0]
      const pathImg=URL.createObjectURL(e.target.files[0])
      setisUpload(pathImg)
      
      
    }
 
  return (
    <>
     <div className=' w-[95%] md:w-[65%] lg:w-[55%] xl:w-[45%] m-auto mt-5'>
     <div className='gap-3 bg-gray-200 flex items-center p-3 rounded-2xl'>
           <Avatar className=' cursor-pointer'>
        <Avatar.Image alt="John Doe" src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3" />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar>
       <input onClick={()=>setisOpen(true)} type="text" name=""  className='w-full p-2 outline-0 cursor-pointer' id="" placeholder="what's on your mind" />
     </div>
      <Modal isOpen={isOpen} onOpenChange={setisOpen}>
      <Modal.Backdrop>
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-125">
            <Modal.CloseTrigger />
            <Modal.Header>
              
              <Modal.Heading className='m-auto mt-0 text-[20px] mb-5'>Create post</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
             <textarea ref={text}  id="" className='w-full  outline-0 resize-none ' placeholder='Add text'>

             </textarea>
          {isUpload&&<div className='relative'>
                <img 
          alt="AI Builders community"
          className="pointer-events-none  rounded-2xl"
          loading="lazy"
          src={isUpload}
        />
        <IoIosCloseCircle onClick={()=>setisUpload(false)}  className=' cursor-pointer absolute top-2.5 right-2.5 text-3xl text-black bg-gray-500 rounded-[5px]'/>

          </div>}
            </Modal.Body>
            <Modal.Footer>
              <div className='flex items-center gap-5'>
                <Button onClick={()=>mutate()} className="" slot="close">
                Add post
              </Button>
                <div className='flex gap-2.5 text-2xl'>
                    <label htmlFor="img" className=' cursor-pointer'>
                        <FaImage />
                          <input ref={img} onChange={handleImage} type="file" id='img'  className='hidden'/>
                    </label>
                    <MdGifBox  className=' cursor-not-allowed'/>
                    <VscStarEmpty className=' cursor-not-allowed'/>
                    <BsCameraVideo className=' cursor-not-allowed' />



                </div>
                
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
     </div> 
    </>
  )
}
