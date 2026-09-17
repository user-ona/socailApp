import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"





export let UserContext=createContext()




export default function UserContextProvider({children}) {

const [userLogin,setuserLogin]=useState(localStorage.getItem('userToken'))
const [loggedId,setLoggedId]=useState(null)
useEffect(()=>{
if (localStorage.getItem('userToken')) {
    const {user}=jwtDecode(localStorage.getItem('userToken'))
   
setLoggedId(user)
}
},[userLogin])


    return <UserContext.Provider value={{userLogin,setuserLogin,loggedId}}>
{children}
    </UserContext.Provider>
    
}