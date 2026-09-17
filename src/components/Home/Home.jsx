import React, { useEffect, useState } from 'react'
import { allPosts } from '../../api/getAllPosts.api'
import CardPost from '../CardPost/CardPost'
import Loader from '../Loader/Loader'
import Error from '../Error/Error'
import { useQuery } from '@tanstack/react-query'
import PostCreate from '../PostCreate/PostCreate'

export default function Home() {

const {data,isLoading,isError,isFetching ,error}= useQuery({
  queryKey:['allPosts'],
  queryFn:allPosts,
  select:(data)=>data?.data?.data?.posts,
  // refetchOnMount:false, 
  // refetchInterval:1000 
  // staleTime:2000 
  // gcTime:2000 
})
 

// console.log(data);

if (isLoading) {
  return <Loader/>
}
if (isError) {
  return <Error error={error.message}/>
}

  return (
<>
<PostCreate/>
    <div className='container md:w-[85%] py-5 m-auto'>
     {data.map((post)=>{
      return <CardPost key={post.id} post={post}/>
     })}
      
    </div>
</>
  )
}
