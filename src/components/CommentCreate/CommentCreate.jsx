import React from 'react'
import { useForm } from 'react-hook-form'
import {Description, InputGroup, Label, TextField} from "@heroui/react";
import { IoSend } from "react-icons/io5";
import { FaImage } from "react-icons/fa";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../api/createComment.api';



export default function CommentCreate({id}) {
     const form= useForm({
  defaultValues:{
    content:'',
    image:''
  }
 })
 const {register,handleSubmit,watch,reset}=form
  const commentValue= watch('content')
  const imageValue= watch('image')
  const queryClient=useQueryClient()

const {mutate,isPending}=useMutation({
  mutationFn:(formData)=>createComment({id},formData),
  onSuccess:()=>{
    queryClient.invalidateQueries({queryKey:['allComments',id]})
    queryClient.invalidateQueries({queryKey:['singlePost',id]})
    reset()
  }
})
function handleComment(valus) {
  if (!valus.content&&!valus.image[0]) return

  const formData=new FormData()
  
  if (valus.content) {
    formData.append('content',valus.content)
    
  }
  if (valus.image[0]) {
    formData.append('image',valus.image[0])
 
  }
  mutate(formData)
}





  return (
    <>
 <form onSubmit={handleSubmit(handleComment)}>
    <div className='flex items-center  justify-center gap-2'>
       <div className='w-[90%]'>
         <TextField className="w-full " aria-label="text">
      <InputGroup>
        <InputGroup.Input {...register('content')} className="w-full  p-3 " placeholder="Write Comment" />
        <InputGroup.Suffix>
        <label htmlFor="img" className=' cursor-pointer' aria-label='file'>
        <FaImage className='size-6' />

        </label>
        <input type="file"  {...register('image')} id="img"  className=' hidden'/>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
       </div>
        {commentValue ||imageValue ? <button type="submit" >
           <IoSend className="size-6  cursor-pointer text-sky-600" />

         </button> : ''}

  </div>
  </form>
     <>
        
        
     </> 
    </>
  )
}
