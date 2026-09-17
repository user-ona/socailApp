import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { FaImage, FaRegBookmark, FaRegComment, FaRegShareSquare } from 'react-icons/fa';
import relativeTime from "dayjs/plugin/relativeTime"
import Comment from '../Comment/Comment';
import CommentCreate from '../CommentCreate/CommentCreate';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import allComments from '../../api/allComments.api';
import { FaBookmark } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Description, Dropdown, Header, Kbd, Label, Separator} from "@heroui/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import { MdDelete, MdGifBox } from "react-icons/md";
import { deletePost } from '../../api/deletePost.api';
import { UserContext } from '../../CounterContext/UserContext';
import {Button, Modal} from "@heroui/react";
import { VscStarEmpty } from 'react-icons/vsc';
import { BsCameraVideo } from 'react-icons/bs';

export default function CardPost({post}) {
    const [showComments, setShowComments] = useState(false)
  const likedStorageKey = `likedPost_${post.id}`
  const [isLiked, setIsLiked] = useState(() => post.isLiked === true || localStorage.getItem(likedStorageKey) === 'true')
  const [isOpen,setisOpen]=useState(false)
const [body,setbody]=useState()
const [image,setimage]=useState(null)



   dayjs.extend(relativeTime)
  // console.log(post);
  const {loggedId}=useContext(UserContext)
  const userId=post?.user?._id
  // console.log(loggedId);
  // console.log(userId);
  
  const queryClient=useQueryClient()

  
  // ////////////////////////////////////////////////{allComments}///////////////////////////////
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['allComments', post.id],
    queryFn: () => allComments({ id: post.id }),
    select: (response) => response?.data?.data?.comments,
    enabled: showComments,
  })

  useEffect(() => {
    if (typeof post.isLiked === 'boolean') {
      setIsLiked(post.isLiked)
      localStorage.setItem(likedStorageKey, String(post.isLiked))
    }
  }, [post.isLiked, likedStorageKey])
// ////////////////////////////////////////////////////{likePost}/////////////////////////
 async function likePost(){
 return await axios.put(`https://route-posts.routemisr.com/posts/${post.id}/like`,{},{
  headers:{
    Authorization:`Bearer ${localStorage.getItem('userToken')}`
  }
 })
  }

  const {data,mutate}=useMutation({
    mutationFn:likePost,
    onSuccess:(response)=>{
      console.log("like post success",response.data);
    queryClient.invalidateQueries({
      queryKey:['allPosts']
    }),
     queryClient.invalidateQueries({
      queryKey:['singlePost', post.id]
    })
    
    },

  })
// //////////////////////////////////////////////////{bookmark}///////////////////
  function handleBookmark() {
    return axios.put(`https://route-posts.routemisr.com/posts/${post.id}/bookmark`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    })
  }
 const { mutate: book ,data:book2 } = useMutation({
    mutationFn: handleBookmark,
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:['allPosts']
      }),
      queryClient.invalidateQueries({
        queryKey:['singlePost', post.id]
      })
      if (!post.bookmarked) {
        toast.success('Post Saved')
      }
      if (post.bookmarked) {
        toast.error('Post Unsaved')
      }

    }
 })
// //////////////////////////////////////////////////{delete}///////////////////
 const {data:delete1,mutate:delete2}=useMutation({
  mutationFn:()=>deletePost({id:post?.id}),
  onSuccess:()=>{
    
    queryClient.invalidateQueries({
      queryKey:['allPosts']
    })
     queryClient.invalidateQueries({
      queryKey:['profile']
    })
    toast.success('post deleted successfully')
  },
  onError:(error)=>{
    toast.error(error?.response?.data?.message || 'Could not delete post')
  }

 })

  //////////////////////////////////////{update post}////////////////////////////////////////
 
  async function updatePost(formData) {
   return await axios.put(`https://route-posts.routemisr.com/posts/${post.id}`,formData,{
    headers:{
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }
   })
  }

  const { mutate: update1,ispending:update2 }=useMutation({
    mutationFn:updatePost,
    onSuccess:()=>{
      console.log('post edit');
      
      queryClient.invalidateQueries({
        queryKey:['allPosts']
      })
      queryClient.invalidateQueries({
        queryKey:['profile']
      })
      toast.success('post updated successfully')
    },
    onError:(error)=>{
      toast.error(error?.response?.data?.message || 'Could not update post')}
  })

  function editPost() {
    setisOpen(true)
    setbody(post.body || "")
    setimage(null)
  }
  function Data() {
    const formData = new FormData()
    if (body) {
      formData.append('body', body)
    }
    if (image) {
      formData.append('image', image)
    }
    update1(formData)
  }

   
  return (
    <>
    <div className="card bg-base-100 md:w-[80%] lg:w-[70%] xl:w-[60%] m-auto mb-8">
  <div className="card-body">
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-2 '>
        <Link to={`/user-profile/${encodeURIComponent(post.user.username)}`}>
          <img src={post.user.photo} className='w-10 h-10 rounded-full cursor-pointer' alt={post.user.name} />
        </Link>
        <div>
            <h4 className='font-medium'>{post.user.name}</h4>
            <h5>{dayjs(post.createdAt).fromNow()}</h5>
        </div>
    </div>
    <div>
      

    <Dropdown>
      <Button isIconOnly aria-label="Menu"  className="bg-transparent ">
        
        <HiDotsHorizontal className="  text-black" />
      </Button>
      <Dropdown.Popover className="w-36 min-w-0 ">
        <Dropdown.Menu className="p-1" >
          <Dropdown.Section>
            {/* /////////////////////////////////////////////{bookmark}////////////////////////////////////////////// */}
              <Dropdown.Item id="bookmark" textValue="boomark file">
          <div className="flex  items-center gap-5">
             <div className="">
                <Label className='text-[18px]'>Save</Label>
              </div>
                <div onClick={() => book()} className='text-[20px] cursor-pointer '>
     {post.bookmarked ? <FaBookmark /> : <FaRegBookmark />
}

    </div>
             
          </div>
              
            </Dropdown.Item>
            
            {/* /////////////////////////////////////////////{update}////////////////////////////////////////////// */}

            {userId==loggedId&&<>
            <Dropdown.Item onClick={()=>editPost()} id="edit-file" textValue="Edit file">
          <div className="flex  items-center gap-5">
             <div className="">
                <Label className='text-[18px]'>Edit file</Label>
              </div>
                <div className="text-[20px]">
             <FaPen  />
              </div>
             
          </div>
            {/* /////////////////////////////////////////////{delete}////////////////////////////////////////////// */}
              
            </Dropdown.Item>
            <Dropdown.Item onClick={()=>delete2()} id="delete-file" textValue="Delete file" variant="danger">
           <div  className="flex  items-center gap-3">
              <div className="">
                <Label className='text-[18px] text-red'>Delete file</Label>
           
              </div>
              <div className="text-[20px]">
                <MdDelete />

              </div>
           </div>
             
           
            </Dropdown.Item></>}
          </Dropdown.Section>
         
       
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
    </div>
   
    </div>
  </div>
<Link to={`/postDetails/${post?.id}`}>
{post.body&& <h2 className="card-title mb-4">{post.body}</h2>}
    {post.image ?   <figure>
    <img
      src={post.image}
      alt={post.body} />
  </figure> : ""}
</Link>

  <div className='flex justify-between flex-row-reverse'>
    <div onClick={()=>{
      const previousLikeState = isLiked
      const nextLikeState = !previousLikeState
      setIsLiked(nextLikeState)
      localStorage.setItem(likedStorageKey, String(nextLikeState))
      mutate(undefined, {
        onError: () => {
          setIsLiked(previousLikeState)
          localStorage.setItem(likedStorageKey, String(previousLikeState))
        }
      })
    }} className={`flex items-center gap-2 p-2 hover:bg-gray-100 transition-all duration-150 rounded-xl cursor-pointer ${isLiked ? 'text-blue-500' : ''}`}>
        {isLiked ? <AiFillLike className='text-[22px]'/> : <AiOutlineLike className='text-[22px]'/>}
        <p>{post.likesCount}</p>

    </div>
    <div onClick={() => setShowComments((currentValue) => !currentValue)} className='flex items-center gap-2 p-2 hover:bg-gray-100 transition-all duration-150 rounded-xl  cursor-pointer'>
       <FaRegComment className='text-[22px]'/>

        <p>{post.commentsCount}</p>

    </div>
     <div className='flex items-center gap-2 p-2 hover:bg-gray-100 transition-all duration-150 rounded-xl  cursor-pointer'>
       <FaRegShareSquare className='text-[22px]'/>

        <p >{post.sharesCount}</p>

    </div>
            {/* /////////////////////////////////////////////{modal}////////////////////////////////////////////// */}
    
    <Modal isOpen={isOpen} onOpenChange={setisOpen}>
      <Modal.Backdrop>
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-125">
            <Modal.CloseTrigger />
            <Modal.Header>
              
              <Modal.Heading className='m-auto mt-0 text-[20px] mb-5'>edit post</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
             <textarea value={body} onChange={(e) => setbody(e.target.value)} id="" className='w-full  outline-0 resize-none ' placeholder='edit post'>

             </textarea>
         
            </Modal.Body>
            <Modal.Footer>
              <div className='flex items-center gap-5'>
                <Button onClick={()=>Data()} className="" slot="close">
                edit post
              </Button>
                <div className='flex gap-2.5 text-2xl'>
                    <label htmlFor="img" className=' cursor-pointer'>
                        <FaImage />
                          <input  onChange={(e)=>setimage(e.target.files[0])} type="file" id='img'  className='hidden'/>
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
  {showComments ? <>
    <CommentCreate id={post.id}/>
    {commentsLoading && <p className='text-center p-2'>Loading comments...</p>}
    {comments?.map((comment) => <Comment key={comment._id} comment={comment}/>) }
  </> : post.topComment && <Comment comment={post.topComment}/>} 
  
</div>
    </>
  )
}
