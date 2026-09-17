import axios from "axios"



export const uploadPhoto =  (formData)=>{
    return axios.put(`https://route-posts.routemisr.com/users/upload-photo`,formData,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }})
}