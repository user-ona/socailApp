import { Input ,Button} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import z from 'zod'
import ErorrMassage from '../ErorrMassage/ErorrMassage'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { UserContext } from '../../CounterContext/UserContext'
import { useContext } from 'react'


export default function ChangePassword() {
    const navigate=useNavigate()
  const {setuserLogin}=useContext(UserContext)
 const schema = z.object({
  password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "password must start with capital....."),
  newPassword:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "password must start with capital.....")
 })
 const form= useForm({
    defaultValues:{
        password:'',
        newPassword:''
    },
    resolver:zodResolver(schema),
    mode:'all'
   
    
 })
 
 async function changePass(body) {
    return  await axios.patch(`https://route-posts.routemisr.com/users/change-password`,body,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })

 }
 const {data,mutate,isPending}=useMutation({
mutationFn:changePass,
onSuccess:(response)=>{
    console.log('success');
    toast.success('password changed successfully')
  const token=response.data.data.token
  localStorage.setItem("userToken",token)
  setuserLogin(token)
     setTimeout(() => {
      navigate('/home')
    }, 500);
},
onError:(error)=>{
  toast.error( 'Could not change password')
}
 })
 const {register,handleSubmit,formState,watch}=form
    function handlePassword(values){
      console.log(values);
      if (values.password === values.newPassword) {
        toast.error('The new password must be different from the current password')
        return
      }
      mutate(values)

    }
  return (
    <>
       <div className="p-5 bg-gray-50">
           <div className="text-center md:w-1/2 m-auto bg-white p-5 rounded-2xl">
             <h2 className="font-bold text-sky-500 text-2xl">Change Password</h2>
             <form onSubmit={handleSubmit(handlePassword)}>
               
             
              
             <div className="flex flex-col items-start gap-1 mt-2 relative">
                {/* {passValue&& <span onClick={()=>setShowPass(!showPass)} className=" absolute top-11 right-3 cursor-pointer">{showPass ? <FaEye /> : <FaEyeSlash />}</span>} */}
                 <label htmlFor="password" className="font-medium">
                   current Password
                 </label>
                 {/* ////////////////////  password  ///////////////////////// */}
   
                 <Input
                 {...register('password')}
                   type='password'
                   id="password"
                   aria-label="password"
                   className="w-full h-12"
                   placeholder="Enter your current Password"
                 />
                  <ErorrMassage erorr={formState.errors.password}/>
                                      
                             
   
               </div>
               <div className="flex flex-col items-start gap-1 mt-2 relative">
                {/* {passValue&& <span onClick={()=>setShowPass(!showPass)} className=" absolute top-11 right-3 cursor-pointer">{showPass ? <FaEye /> : <FaEyeSlash />}</span>} */}
                 <label htmlFor="newPassword" className="font-medium">
                     new Password
                 </label>
                 {/* ////////////////////  password  ///////////////////////// */}
   
                 <Input
                 {...register('newPassword')}
                   type='password'
                   id="newPassword"
                   aria-label="newPassword"
                   className="w-full h-12"
                   placeholder="Enter your Password"
                 />
                             
    <ErorrMassage erorr={formState.errors.newPassword}/>
                        
               </div>
              
               
              <div className="flex flex-col">
                <Button type='submit' className='bg-sky-600  text-white w-full mt-7 py-2 rounded-3xl text-[18px] font-semibold hover:bg-[#005FD5] transition-all duration-200 ' >change password</Button>
              </div>
             </form>
           </div>
         </div>
    </>
  )
}
