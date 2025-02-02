import {  createContext,useContext, useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom'


const ChatContext = createContext()

const ChatProvider = ({children})=>{

    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chat, setChats] = useState([])
    const navigate = useNavigate()
    const [notification, setNotification] = useState([])

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo)

        console.log(userInfo);
        
        if(!userInfo){
            navigate("/")
        }
    },[navigate])

    console.log(user);
    
    return (
        <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chat, setChats,notification,setNotification}}>{children}</ChatContext.Provider>
    )
}

export const ChatState = ()=>{
    return useContext(ChatContext)
}



export default ChatProvider