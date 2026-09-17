
import { useRef,useState } from 'react'
import { FiBookmark, FiCamera, FiEdit2, FiGrid, FiImage, FiMoreHorizontal, FiPlus } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getProfile } from '../../api/getProfile.api'
import { allPosts } from '../../api/getAllPosts.api'
import Loader from '../Loader/Loader'
import Error from '../Error/Error'
import CardPost from '../CardPost/CardPost'
import PostCreate from '../PostCreate/PostCreate'
import { FaCamera, FaImage } from 'react-icons/fa'
import {Button, Modal} from "@heroui/react";
import { MdGifBox } from 'react-icons/md'
import { VscStarEmpty } from 'react-icons/vsc'
import { BsCameraVideo } from 'react-icons/bs'
import { uploadPhoto } from '../../api/uploadPhoto.api.js'
import { IoIosCloseCircle } from 'react-icons/io'
import { toast } from 'react-toastify'
export default function Profile() {

  
const queryClient=useQueryClient()
  const [isOpen,setisOpen]=useState(false)
const [isUpload,setisUpload]=useState(false)
const img=useRef(null)
  const [activeTab, setActiveTab] = useState('Posts')
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    select: (profile) =>  profile?.data?.data
  })
  
  const { data: posts = [], isLoading: postsLoading, isError: postsError, error: postsQueryError } = useQuery({
    queryKey: ['allPosts'],
    queryFn: allPosts,
    select: (response) => response?.data?.data?.posts ?? [],
  })
// console.log(profile)

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\{uploadPhoto}//////////////////////////////////
 function Data(){

      const formData=new FormData()
     
      if (img.current?.files[0]) {
        formData.append('photo', img.current?.files[0])
      }
      
      return formData
    }
const { mutate, isPending ,data} = useMutation({
  mutationFn: () => uploadPhoto(Data()),
  onSuccess: () => {
    setisUpload(false)
    setisOpen(false)
    queryClient.invalidateQueries({
      queryKey: ['profile']
    })
    queryClient.invalidateQueries({
      queryKey: ['allPosts']
    })
    console.log('success')
    toast.success('photo uploaded successfully')
  },
  onError: (error) =>{
    toast.error('error uploading photo')
  }
})
    console.log(data)

    
   
    function handleImage(e) {
      console.log(e.target.files[0]);
      const image=e.target.files[0]
      const pathImg=URL.createObjectURL(e.target.files[0])
      setisUpload(pathImg)
      
    


    }
      const tabs = [
    { label: 'Posts', icon: FiGrid },
    { label: 'Saved', icon: FiBookmark },
    { label: 'Photos', icon: FiImage },
  ]
  if (isLoading) return <Loader />
  if (isError) return <Error error={error?.message} />

  const profileBio = profile?.bio || 'Designing useful things, collecting good stories, and finding the best coffee in every city.'
  const userPosts = posts.filter((post) => (
    post.user?.id === profile?.user?.id
    || post.user?._id === profile?.user?._id
    || post.user?.username === profile?.user?.username
  ))
  const photoPosts = userPosts.filter((post) => post.image)
  const bookmarkedPosts = posts.filter((post) => post.bookmarked)
  return (
    <main className="min-h-screen bg-slate-100 pb-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden bg-white shadow-sm sm:rounded-b-xl">
          <div className="relative h-52 bg-slate-300 sm:h-72">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85"
              alt="Mountain landscape cover"
            />
            <button
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50"
              type="button"
            >
              <FiCamera />
              <span className="hidden sm:inline">Edit cover photo</span>
            </button>
          </div>

          <div className="px-4 sm:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <div className="relative -mt-16 shrink-0 sm:-mt-20">
                <img
                  className="h-32 w-32  rounded-full border-4 border-white object-cover shadow-md sm:h-40 sm:w-40"
                  src={profile?.user?.photo}
                  alt={profile?.user?.name}
                />
                <button onClick={()=>setisOpen(true)}
                  className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-gray-100 cursor-pointer text-black"
                  type="button"
                  aria-label="Change profile photo"
                >
                  <FaCamera />

                </button>
                 <Modal isOpen={isOpen} onOpenChange={setisOpen}>
                      <Modal.Backdrop>
                        <Modal.Container placement="center">
                          <Modal.Dialog className="sm:max-w-125">
                            <Modal.CloseTrigger />
                            <Modal.Header>
                              
                              <Modal.Heading className='m-auto mt-0 text-[20px] mb-5'>Create post</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                             
                          {isUpload&&<div className='relative'>
                                <img 
                          alt="AI Builders community"
                          className="pointer-events-none  rounded-2xl"
                          loading="lazy"
                          src={isUpload}
                        />
                        <IoIosCloseCircle onClick={()=>setisUpload(false)}  className=' cursor-pointer absolute top-2.5 right-2.5 text-3xl text-black bg-gray-500 rounded-[5px]'/>
                
                          </div>}
                            </Modal.Body>
                             <input   id="" className='w-full hidden outline-0 resize-none ' placeholder='Add text'>

             </input>
                            <Modal.Footer>
                              <div className='flex items-center gap-5'>
                                <Button onClick={()=>mutate()} className="" slot="close" disabled={isPending}>
                                {isPending ? 'Uploading...' : 'Add post'}
                              </Button>
                                <div className='flex gap-2.5 text-2xl'>
                                    <label htmlFor="img" className=' cursor-pointer'>
                                        <FaImage />
                                          <input ref={img} onChange={handleImage} type="file" id='img'  className='hidden'/>
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

              <div className="flex-1 pb-2 text-center sm:text-left">
                <h1 className="text-2xl font-bold sm:text-3xl">{profile?.user?.name}</h1>
                <p className="mt-1 text-sm text-slate-500">@{profile?.user?.username}</p>
              </div>
          

              <div className="mb-3 flex w-full gap-2 sm:w-auto">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex-none" type="button">
                  <FiPlus />
                  Add Story
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 sm:flex-none" type="button">
                  <FiEdit2 />
                  Edit Profile
                </button>
                <button className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300" type="button" aria-label="More options">
                  <FiMoreHorizontal />
                </button>
              </div>
            </div>

            <div className="border-b border-slate-200 py-5">
              <p className="max-w-2xl text-sm leading-6 text-slate-600">{profile?.user?.bio}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className='font-medium'>Joined  {profile?.user?.dateOfBirth?.split('-')[0]}</span>
              <p className='font-medium'>Followers: {profile?.user?.followersCount}</p>

              </div>
            </div>

            <nav className=" flex justify-around sm:justify-start sm:gap-2" aria-label="Profile sections">
              {tabs.map(({ label, icon: Icon }) => (
                <button
                  className={`cursor-pointer relative inline-flex items-center gap-2 px-4 py-4 text-sm font-semibold ${activeTab === label ? 'text-blue-600 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-1 after:rounded-t-full after:bg-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(label)}
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {activeTab === 'Posts' && <PostCreate  />}

        <section className="mt-5  px-4 sm:px-0" aria-live="polite">
          {activeTab === 'Posts' && (
            postsLoading ? <Loader /> : postsError ? <Error error={postsQueryError?.message} /> : (
              <div className="flex flex-col gap-5">
                {userPosts.map((post) => <CardPost key={post.id} post={post} />)}
              </div>
            )
          )}
          {activeTab === 'Saved' && (
            postsLoading ? <Loader /> : postsError ? <Error error={postsQueryError?.message} /> : (
              <div className="flex flex-col gap-5">
                {bookmarkedPosts.map((post) => <CardPost key={post.id} post={post} />)}
              </div>
            )
          )}
          {activeTab === 'Photos' && (
            postsLoading ? <Loader /> : postsError ? <Error error={postsQueryError?.message} /> : (
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-white p-2 shadow-sm sm:grid-cols-3">
                {photoPosts.map((post) => (
                  <Link className="block" key={post.id} to={`/postDetails/${post.id}`}>
                    <img className="aspect-square w-full rounded-lg object-cover" src={post.image} alt={post.body || 'Post photo'} />
                  </Link>
                ))}
              </div>
            )
          )}
        </section>
      </div>
    </main>
  )
}
