import axios from "axios"




export const SinglePost=({id})=>{
   console.log(id);
   return  axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
      headers:{
         Authorization:`Bearer ${localStorage.getItem('userToken')}`
      }
   })
   
   
}