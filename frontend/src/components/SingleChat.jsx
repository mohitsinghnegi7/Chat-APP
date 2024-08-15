import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useEditable, useToast } from '@chakra-ui/react'
import { IoEye } from "react-icons/io5";
import { getSender,getSenderFull } from '../config/ChatLogic';
import ProfileModel from './miscellaneous/ProfileModel'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'


const ENDPOINT = 'http://localhost:4000'
var socket, selectedChatCompare;


const SingleChat = ({fetchAgain, setFetchAgain}) => {

  const [message, setMessage] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState()
  const [socketConnected, setSocketConnected] = useState(false)

  const toast = useToast()

    const {user, selectedChat, setSelectedChat,notification,setNotification} = ChatState()

 
const fetchMessages = async()=>{
  if(!selectedChat)
    return;

  try{
    const res = await axios.get(`http://localhost:4000/api/message/${selectedChat._id}`,{
      withCredentials : true
    })

    console.log(res);
    

    setMessage(res.data)
    setLoading(false)
    socket.emit('join chat',selectedChat._id)
  }
  catch(err){
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Messages",
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  }
}

const sendMessage =async (e)=>{
  if(e.key ==="Enter" && newMessage)
  {
    try{
      setNewMessage("")
      const res = await axios.post('http://localhost:4000/api/message',{
        content : newMessage,
        chatId : selectedChat._id
      },{
        withCredentials : true
      })

      socket.emit('new message',res.data)
      //console.log(res.data)
      setMessage([...message,res.data])
    }
    catch(err){
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  }
}

useEffect(()=>{
  socket = io(ENDPOINT);
  socket.emit('setup',user)
  socket.on('connected',()=>{
    setSocketConnected(true)
  })
  },[])

useEffect(()=>{
  fetchMessages()
  selectedChatCompare = selectedChat;
},[selectedChat])


useEffect(()=>{
  socket.on('message received',(newMessageReceived)=>{
    if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
      if(!notification.includes(newMessageReceived)){
        setNotification([newMessageReceived,...notification])
        setFetchAgain(!fetchAgain)
      }
    }
    else{
      setMessage([...message, newMessageReceived])
    }
  })
})

 
const typingHandler = (e)=>{
  setNewMessage(e.target.value)

}

console.log(message);


  return (
    <div className='h-full' >
     {
        selectedChat ? (
            <div>
                
          <Text
            fontSize={{ base: "20px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            
            {
              !selectedChat.isGroupChat ? (
                <>
                <div className='flex justify-between'>
                 {getSender(user, selectedChat.users) }
                  <ProfileModel
                    user={getSenderFull(user, selectedChat.users)}
                  />
                  </div>
                </>
              ) : (
                <>
                  {  selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
          </Text>
      
          <div className='flex flex-col justify-end p-3 bg-slate-300 w-full min-h-[400px] md:min-h-[430px] overflow-hidden max-h-[430px] rounded-md'>
              {loading ? (
                <Spinner 
                size={'xl'} 
                w={20}
                h={20}
                alignSelf={'center'}
                margin={'auto'}
                />

              )
               : (
                <>
                <div className='flex flex-col overflow-scroll '>
                  <ScrollableChat message={message} />
                </div>
                </>
               )}

               <FormControl
               onKeyDown={sendMessage}
               isRequired mt={3}
               >
                <Input 
                variant={'filled'}
                placeholder='Enter a message'
                onChange={typingHandler}
                value={newMessage}
                />
               </FormControl>
          </div>
            </div>
        ) : (
            <div
            className='flex items-center justify-center h-full '
            >
               <p className='text-lg md:text-2xl pb-3 font-sans'> Click on a user to start Chatting</p>
            </div>
        )
     }
    </div>
  )
}

export default SingleChat
