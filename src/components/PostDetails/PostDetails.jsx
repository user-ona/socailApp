import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useParams } from 'react-router-dom'
import { SinglePost } from '../../api/getSinglePost.api'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { FaRegComment, FaRegShareSquare } from 'react-icons/fa'
import Loader from '../Loader/Loader'
import allComments from '../../api/allComments.api'
import Comment from '../Comment/Comment'

import CommentCreate from '../CommentCreate/CommentCreate'
import { likePost } from '../../api/likePost.api'





export default function PostDetails() {
  dayjs.extend(relativeTime)

// formmmmmm


const {id} =useParams()
const queryClient = useQueryClient()
// singlePost
const {data,isError,isFetching,isLoading,error}=useQuery({
queryKey:['singlePost', id],
queryFn:()=>SinglePost({id}),
select:(data)=>data?.data?.data?.post
})
const likedStorageKey = `likedPost_${id}`
const [isLiked, setIsLiked] = useState(() => data?.isLiked === true || localStorage.getItem(likedStorageKey) === 'true')

useEffect(() => {
  if (typeof data?.isLiked === 'boolean') {
    setIsLiked(data.isLiked)
    localStorage.setItem(likedStorageKey, String(data.isLiked))
  }
}, [data?.isLiked, likedStorageKey])

const { mutate: like } = useMutation({
  mutationFn: () => likePost({ id }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['singlePost', id] })
    queryClient.invalidateQueries({ queryKey: ['allPosts'] })
  }
})


const {data:comment1,isError:comment2,isFetching:comment3,isLoading:comment4,error:comment5}=useQuery(
  {
    queryKey:['allComments',id],
    queryFn:()=>allComments({id}),
    select:(comment1)=>comment1?.data?.data?.comments

  }
)
// console.log(comment1);






if (isLoading) {
  return <Loader/>
  
}

  return (
    <>
        
   <div className="card bg-base-100 md:w-[60%] m-auto ">
  <div className="card-body">
    <div className='flex items-center '>
        <div>
            <img src={data?.user.photo} className='w-10 h-10 rounded-full' alt="" />

        </div>
        <div>
            <h4 className='font-medium'>{data?.user.name}</h4>
            <h5>{dayjs(data?.createdAt).fromNow()}</h5>
        </div>
    </div>
  </div>

{data?.body&& <h2 className="card-title">{data?.body}</h2>}
    {data?.image ?   <figure>
    <img
      src={data?.image}
      alt={data?.body} />
  </figure> : ""}


  <div className='flex justify-between flex-row-reverse'>
    <div onClick={() => {
      const previousLikeState = isLiked
      const nextLikeState = !previousLikeState
      setIsLiked(nextLikeState)
      localStorage.setItem(likedStorageKey, String(nextLikeState))
      like(undefined, {
        onError: () => {
          setIsLiked(previousLikeState)
          localStorage.setItem(likedStorageKey, String(previousLikeState))
        }
      })
    }} className={`flex items-center gap-2 p-2 hover:bg-gray-100 transition-all duration-150 rounded-xl cursor-pointer ${isLiked ? 'text-blue-500' : ''}`}>
        {isLiked ? <AiFillLike className='text-[22px]'/> : <AiOutlineLike className='text-[22px]'/>}
        <p>{data?.likesCount}</p>

    </div>
     <div className='flex items-center gap-2 p-2 hover:bg-gray-100 transition-all duration-150 rounded-xl  cursor-pointer'>
       <FaRegComment className='text-[22px]'/>

        <p>{data?.commentsCount}</p>

    </div>
     <div className='flex items-center gap-2 p-2 hover:bg-gray-100 transition-all duration-150 rounded-xl  cursor-pointer'>
       <FaRegShareSquare className='text-[22px]'/>

        <p >{data?.sharesCount}</p>

    </div>
    
  </div>
 
  <CommentCreate id={id}/>
 {comment1?.map((comment)=><Comment key={comment._id} comment={comment}/>)}
  
</div>  
    </>
  )
}
