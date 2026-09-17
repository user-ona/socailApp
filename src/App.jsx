import { Profiler, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Register from './Auth/Register/Register'
import Login from './Auth/Login/Login'
import UserContextProvider from './CounterContext/UserContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Profile from "./components/Profile/Profile"
import AuthRoute from './components/AuthRoute/AuthRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostDetails from './components/PostDetails/PostDetails'
import UserProfile from './components/UserProfile/UserProfile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNetworkState } from 'react-use'
import ChangePassword from './components/ChangePassword/ChangePassword'

let router=createBrowserRouter([
{path:'',element:<Layout/>,children:[
  {path:'home',element:<ProtectedRoute><Home/></ProtectedRoute>},
  {index:true,element:<AuthRoute><Register/></AuthRoute>},
  {path:'profile',element:<ProtectedRoute><Profile/></ProtectedRoute>},
  {path:'ChangePassword',element:<ProtectedRoute><ChangePassword/></ProtectedRoute>},
  {path:'user-profile/:username',element:<ProtectedRoute><UserProfile/></ProtectedRoute>},
  {path:'postDetails/:id',element:<ProtectedRoute><PostDetails/></ProtectedRoute>},
  {path:'login',element:<AuthRoute><Login/></AuthRoute>}
]}
])



function App() {
  const { online } = useNetworkState()
  const [count, setCount] = useState(0)
  const query = new QueryClient()

  return (
    <>
   {!online&& <div className={'bg-gray-800/65 fixed inset-0 z-50 flex items-center justify-center text-white text-4xl font-bold '}>
      <h1>Yuo are offline now!...</h1>
    </div>}
 <QueryClientProvider client={query}>
<UserContextProvider>

     <RouterProvider router={router} />
    <ToastContainer autoClose={1000} />
</UserContextProvider>

 </QueryClientProvider>

 
   
   
    </>
  )
}

export default App
