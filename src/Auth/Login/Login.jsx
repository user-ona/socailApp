import { Input ,Button,} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import z, { email } from 'zod'
import ErorrMassage from '../../components/ErorrMassage/ErorrMassage'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { UserContext } from '../../CounterContext/UserContext'





export default function Login() {
  let {setuserLogin} =useContext(UserContext)
const navigate=useNavigate()
 const [showPass,setShowPass]=useState(false)
 const schema = z.object({
  email:z.string().email('invalid Email'),
  password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "password must start with capital.....")
 })
const form =useForm({
  defaultValues:{
email:"",
password:""
  },
  resolver:zodResolver(schema),
  mode:'all'
})
let {register ,handleSubmit,formState,watch}=form

let passValue=watch('password')

async function handelLogin (values){
console.log(values);
try {
  let {data} = await axios.post(`https://route-posts.routemisr.com/users/signin`,values)
  console.log(data.message);
  console.log(data.data.token);

  
  
  
    Swal.fire({
    title: "successfuly",
    text: data.message,
    icon: "success",
    confirmButtonAriaLabel:'ok'
  }).then((result)=>{
  if(result.isConfirmed){
    localStorage.setItem("userToken",data.data.token)
    setuserLogin(data.data.token)
    setTimeout(() => {
      navigate('/home')
    }, 500);
  }

})
   
  
} catch (error) {
  console.log(error.response.data.message);
       Swal.fire({
    title: "Error!",
    text: error?.response?.data?.message,
    icon: "error",
    confirmButtonAriaLabel:'ok'
  });
  
}

}




  return (
     <>
         <div className="p-5 bg-gray-50">
           <div className="text-center md:w-1/2 m-auto bg-white p-5 rounded-2xl">
             <h2 className="font-bold text-sky-500 text-2xl">Login</h2>
             <form onSubmit={handleSubmit(handelLogin)}>
               
             
               <div className="flex flex-col items-start gap-1 mt-2">
                 <label htmlFor="email" className="font-medium">
                   Email
                 </label>
                 {/* ////////////////////  email  ///////////////////////// */}
   
                 <Input
                  {...register('email')}
                   type="email"
                   id="email"
                   aria-label="email"
                   className="w-full h-12"
                   placeholder="Enter your Email"
                 />
                 <ErorrMassage erorr={formState.errors.email}/>
                       
               </div>
            
               <div className="flex flex-col items-start gap-1 mt-2 relative">
                {passValue&& <span onClick={()=>setShowPass(!showPass)} className=" absolute top-11 right-3 cursor-pointer">{showPass ? <FaEye /> : <FaEyeSlash />}</span>}
                 <label htmlFor="password" className="font-medium">
                   Password
                 </label>
                 {/* ////////////////////  password  ///////////////////////// */}
   
                 <Input
                 {...register('password')}
                   type={showPass ? 'text':'password'}
                   id="password"
                   aria-label="password"
                   className="w-full h-12"
                   placeholder="Enter your Password"
                 />
                 <ErorrMassage erorr={formState.errors.password}/>
                             
   
               </div>
              
               
              <div className="flex flex-col">
                <Button className='bg-sky-600  text-white w-full mt-7 py-2 rounded-3xl text-[18px] font-semibold hover:bg-[#005FD5] transition-all duration-200 ' type="submit">Login</Button>
               <p className='mt-1'>Don't have an account ? <Link to={'/'} className='text-blue-500 font-medium'>Register Now</Link></p>
              </div>
             </form>
           </div>
         </div>
       </>
  )
}
