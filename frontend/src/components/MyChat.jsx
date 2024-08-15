import React, { useState,useEffect } from 'react'
import { ChatState } from '../context/ChatProvider'
import axios from 'axios'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import { IoMdPersonAdd } from "react-icons/io";
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogic';
import GroupChatModal from './miscellaneous/GroupChatModal';


const MyChat = ({fetchAgain}) => {

  const {selectedChat, setSelectedChat, user,setChats, chat} = ChatState()
  const [loggedUser, setLoggedUser] = useState()
  const [chatArray, setChatArray] = useState()
  const toast = useToast()

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      

      const res = await axios.get("http://localhost:4000/api/chat", {
        withCredentials : true
      });

      console.log(res);
      
     setChats(res.data);
   
     
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    console.log(chat);
    
    // eslint-disable-next-line
  }, []);


  useEffect(()=>{
  console.log(chat);
},[chat])

  return (
    <div className='w-full md:w-1/3'>
      <div className=''>
      
      <div className='bg-white p-2 md:p-4 min- rounded-md md:min-h-[532px] '>  
         <div className='flex justify-between md:text-lg font-sans items-center'>
          <div className='font-semibold'>
            My Chats
          </div>
          <div>
            <GroupChatModal>
          <div className='hidden md:flex items-center bg-slate-200 p-2 rounded-md hover:bg-slate-300'>
          <button className='text-xs md:text-md lg:text-lg  text-nowrap flex items-center gap-2 cursor-pointer'>
            New Group Chat <span className='text-xl'><IoMdPersonAdd/></span>
          </button>
          </div>
          </GroupChatModal>
          </div>
         </div>
         <div className='mt-2 md:mt-4'>
         <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
      {
        chat ? (
          <Stack overflowY={'scroll'} minH={'200px'}  maxH={{ base: "200px", md: "430px" }}   sx={{
            '&::-webkit-scrollbar': {
              display: 'none', // For Chrome, Safari, and Opera
            },
            '-ms-overflow-style': 'none', // For Internet Explorer and Edge
            'scrollbar-width': 'none', // For Firefox
          }}>
            {!chat ? (<p>No Chats</p>) : (
                   chat.map((cha)=>(
                    <Box onClick={()=>setSelectedChat(cha)}
                    cursor={'pointer'}
                    bg={selectedChat === cha? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === cha? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius={'md'}
                    key={cha._id}
                    >
                      <Text>
                        {!cha.isGroupChat ? (
                          getSender(loggedUser,cha.users)
                        ) : (cha.chatName)}
                      </Text>
                    </Box>
                    
                  ))
            )
         
            }
          </Stack>
        ) : (
          <ChatLoading/>
        )
      }
      </Box>
         </div>
    </div>
    </div>
    </div>
  )
}

export default MyChat
