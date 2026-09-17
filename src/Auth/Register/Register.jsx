import {  Input, Label, ListBox, Select ,Button} from "@heroui/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import './register.css'
import ErrorMessage from'../../components/ErorrMassage/ErorrMassage'
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate,Link } from "react-router-dom";
import { ImSpinner } from "react-icons/im";


export default function Register() {
const navigate=useNavigate()
 const [showPassword,setShowPassword] = useState(false)
const [isloading,setIsLoading] =useState(false)

  const schema = z
    .object({
      name: z
        .string()
        .min(3, "name must beat latest 3")
        .max(15, "name must be at most 15"),
      username: z
        .string()
        .min(3, "name must beat latest 3")
        .max(15, "name must be at most 15"),
      email: z.string().email("invalid email"),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/,'invalid date')
        .refine((date) => {
          const userData = new Date(date);
          let now = new Date();
          now.setHours(0, 0, 0, 0);

          return userData <= now;
        }, "can not future date"),
      gender: z.enum(
        ["male", "female"],
        "gender must be one of male or female",
      ),
      password: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "password must start with capital.....",
        ),
      rePassword: z.string(),
    })
    .refine((object) => object.password === object.rePassword, {
      error: "password and rePassword must be same",
      path: ["rePassword"],
    });

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
    mode:'all'
  });
  let { register, handleSubmit,formState ,watch} = form;


 async function handelRegister(values) {
    console.log(values);
if(isloading){
  return;
}

 try {
  setIsLoading(true)
     let {data}=await axios.post(`https://route-posts.routemisr.com/users/signup`,values)
    console.log(data.message);
    Swal.fire({
  title: "successfuly",
  text: data.message,
  icon: "success",
  confirmButtonAriaLabel:'ok'
}).then((result)=>{
  if(result.isConfirmed){
    setTimeout(() => {
      navigate('/login')
    }, 1000);
  }

})
    
 } catch (error) {
  console.log(error.response.data.message);
     Swal.fire({
  title: "Error!",
  text: error.response.data.message,
  icon: "error",
  confirmButtonAriaLabel:'ok'
});

  
 }finally{setIsLoading(false)}




  }
  const passValue = watch('password')

  const fields=[
    {name:'name',type:'text',placeholder:'Enter your Name'},
    {name:'username',type:'text',placeholder:'Enter your UserName'},
    {name:'email',type:'email',placeholder:'Enter your Email'},
   

  ]

  return (
    <>
      <div className="p-5 bg-gray-50">
        <div className="text-center md:w-1/2 m-auto bg-white p-5 rounded-2xl">
          <h2 className="font-bold text-sky-500 text-2xl">Register</h2>
          <form onSubmit={handleSubmit(handelRegister)}>
            {fields.map((field)=><div key={field.name}>
              <div className="flex flex-col items-start gap-1 mt-2">
              <label htmlFor="name" className="font-medium">
                {field.name.charAt(0).toUpperCase()+field.name.slice(1)}
              </label>
              {/* ////////////////////  name  ///////////////////////// */}
              <Input
                {...register(field.name)}
                type={field.type}
                id="name"
                aria-label={field.name}
                className="w-full h-12"
                placeholder={field.placeholder}
              />
              <ErrorMessage erorr={formState.errors[field.name]}/>
            </div>
            </div>)}
           
            <div className="flex items-end gap-3  ">
              <div className="flex flex-col items-start gap-1 mt-2 w-[50%]">
                <label htmlFor="dateOfBirth" className="font-medium">
                  Date
                </label>
                {/* ////////////////////  dateOfBirth  ///////////////////////// */}

                <Input
                  {...register("dateOfBirth")}
                  type="date"
                  id="dateOfBirth"
                  aria-label="dateOfBirth"
                  className="w-full h-12"
                  placeholder="Enter your DateOfBirth"
                />
                             <ErrorMessage erorr={formState.errors.dateOfBirth}/>

              </div>
              <div className="w-[50%] ">
                {/* ////////////////////  gender  ///////////////////////// */}

                <select
                  {...register("gender")}
                  defaultValue="Pick a color"
                  className="w-full select  rounded-[10px] h-12 hover:bg-[#F9F9F9] transition-all duration-200 border-gray-100  focus:border-transparent"
                >
                  <option disabled={true}>Male Or Female</option>
                  <option value={"male"}>male</option>
                  <option value={"female"}>female</option>
                </select>
                             <ErrorMessage erorr={formState.errors.gender}/>

              </div>
            </div>
            <div className="flex flex-col items-start gap-1 mt-2 relative">
              {passValue && <span onClick={()=>setShowPassword(!showPassword)} className=" absolute top-11 right-3 cursor-pointer">{showPassword ? <FaEye /> : <FaEyeSlash />}</span>} 
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              {/* ////////////////////  password  ///////////////////////// */}

              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                aria-label="password"
                className="w-full h-12"
                placeholder="Enter your Password"
              />
                           <ErrorMessage erorr={formState.errors.password}/>

            </div>
            <div className="flex flex-col items-start gap-1 mt-2">
              <label htmlFor="rePassword" className="font-medium">
                Repassword
              </label>
              {/* ////////////////////  rePassword  ///////////////////////// */}

              <Input
                {...register("rePassword")}
                type="password"
                id="rePassword"
                aria-label="rePassword"
                className="w-full h-12"
                placeholder="Enter your Repassword"
              />
                           <ErrorMessage erorr={formState.errors.rePassword}/>

            </div>
            
           <div className="flex flex-col">
             <Button className='bg-sky-600  text-white w-full mt-7 py-2 rounded-3xl text-[18px] font-semibold hover:bg-[#005FD5] transition-all duration-200 'isDisabled={isloading} type="submit">{isloading ? <ImSpinner className=" animate-spin" /> : "Submit"}</Button>
            <Link  to={'/login'} className="bg-white   w-full mt-4 py-2 rounded-3xl text-[18px] font-semibold border border-gray-400 hover:bg-[#F2F2F2] transition-all duration-200">
          I already have an acount
            </Link>
           </div>
          </form>
        </div>
      </div>
    </>
  );
}
