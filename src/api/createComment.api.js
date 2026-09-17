import axios from "axios";


export function createComment({id},formData) {
    return axios.post(`https://route-posts.routemisr.com/posts/${id}/comments`,formData,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })
    
    
    
}