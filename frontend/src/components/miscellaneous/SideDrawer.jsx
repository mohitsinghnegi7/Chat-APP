import { Avatar, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay,Box, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tooltip,  useStatStyles, useToast, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../useravatar/UserListItem';
import { getSender } from '../../config/ChatLogic';

const SideDrawer = () => {

    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    
    const navigate = useNavigate()

    const {user, setSelectedChat, chat, setChats, notification, setNotification } = ChatState()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const logoutHandler = async ()=>{
        const res = await axios.get('http://localhost:4000/api/user/logout',{ 
            withCredentials : true
          })
       // console.log(res);
        
        localStorage.removeItem('userInfo')
        navigate('/')
        
    }

    const toast = useToast()

    const handleSearch =async ()=>{
        if(!search){
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }

        try{
            setLoading(true)
            const res = await axios.get(`http://localhost:4000/api/user?search=${search}`,{
                withCredentials : true
            })

         // console.log(res.data);
            setLoading(false)
            setSearchResult(res.data)
            
        
        }
        catch(err){
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        }
    }
  //  console.log((searchResult));

    

    const accessChat =async (userId)=>{
        console.log(userId);
        try {
            setLoadingChat(true);
          
        
            const res = await axios.post(`http://localhost:4000/api/chat`, { userId },{
                withCredentials : true
            });
            console.log(res);
            
            if (!chat.find((c) => c._id === data._id)) setChats([data, ...chat]);
             setSelectedChat(res.data);
            setLoadingChat(false);
             onClose();

          }
           catch (error) {
            toast({
              title: "Error fetching the chat",
              description: error.message,
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          }
    }

  return (
    <div>
    <div className='flex justify-between items-center bg-white w-full py-3 px-10 border-[2px]'>
      <Tooltip label={'Search Users to chat'} hasArrow placement={'bottom-end'}>
        <Button  variant="ghost" onClick={onOpen}>
            <FaSearch/>
            <p className='hidden md:flex px-4'>Search User</p>

        </Button>
      </Tooltip>
     
        <p className='text-2xl font-sans'>Talk-A-Tive</p>
        <div className='flex gap-2'>
            <Menu>
                <MenuButton p={1}>
                    <FaBell className='text-2xl m-1'/>
                </MenuButton>
                <MenuList pl={2}>
                    {!notification.length && "No new message"}
                    {
                        notification.map(notif=>(
                            <MenuItem key={notif._id} onClick={()=>{
                                setSelectedChat(notif.chat)
                                setNotification(notification.filer((n)=>n !== notif))
                            }
                            }>
                                {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user,notif.chat.users)}`} 
                            </MenuItem>
                        )
                        )
                    }
                </MenuList>
                
            </Menu>
            <Menu>
            <MenuButton as={Button} rightIcon={<FaAngleDown/>}>
                   <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} />
                </MenuButton>
                <MenuList>
                    <ProfileModel user={user}>
                        <MenuItem>My Profile</MenuItem>
                    </ProfileModel>
                    <MenuDivider/>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
     
    </div>

    <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}  >
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
            <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
        <DrawerBody>
           <Box display={'flex'} pb={2} >
                <Input 
                placeholder={'Search by name or email'}
                mr={2}
                value={search}
                onChange={(e)=>setSearch(e.target.value)} 
                />
                <Button onClick={handleSearch}>
                    Go
                </Button>
            </Box>
            {loading ? 
                <ChatLoading/>
             : (
                searchResult?.map(user=>(
                     <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={()=>accessChat(user._id)}
                    />
                ))
                         )}
                         {
                            loadingChat && <Spinner ml={'auto'} display={'flex'} />
                         }
        </DrawerBody>
                </DrawerContent>
        </Drawer>
    </div>
  )
}

export default SideDrawer
