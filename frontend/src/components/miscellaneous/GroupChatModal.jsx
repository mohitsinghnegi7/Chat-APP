import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import UserListItem from '../useravatar/UserListItem'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserBadgeItem from '../useravatar/UserBadgeItem';


function GroupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast()

    const {user, chat , setChats} = ChatState()


    const handleGroup = (userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
        }

        setSelectedUsers([...selectedUsers,userToAdd])
    }

    const handleSearch = async(query)=>{
        setSearch(query)
        if(!query){
            return ;
        }

        try{
            const res = await axios.get(`http://localhost:4000/api/user?search=${search}`,{
                withCredentials : true
            })
            console.log(res.data);
            
            setLoading(false)
           setSearchResult(res.data)
        }
        catch(err){
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
        }
    }
    
    const handleSubmit = async()=>{
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return;
        } 
        try{
            const res = await axios.post('http://localhost:4000/api/chat/group',{
                name : groupChatName,
                users : JSON.stringify(selectedUsers.map(u=>u._id))
            },{
                withCredentials : true
            })

            console.log(res);
            

            setChats([res.data, ...chat])
            onClose()
            toast({
                title: "New Group Created!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
        }
        catch(err){
           console.log(err);
           
            toast({
                title: "Failed to Create the Chat!",
                description: err.response.data,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
        }

    }

    const handleDelete = (delUser)=>{
        setSelectedUsers(selectedUsers.filter(sel=>sel._id !== delUser._id))
    }

  return (
    <div>
 <span onClick={onOpen}>{children}</span>

<Modal onClose={onClose} isOpen={isOpen} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
      fontSize="30px"
      fontFamily="Work sans"
      d="flex"
      justifyContent="center"
    >
      Create Group Chat
    </ModalHeader>

    <ModalCloseButton />
    <ModalBody d="flex" flexDir="column" alignItems="center">
      <FormControl>
        <Input
          placeholder="Chat Name"
          mb={3}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <Input
          placeholder="Add Users eg: John, Piyush, Jane"
          mb={1}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </FormControl>
      <Box width="100%" display="flex" flexWrap="wrap">
        {selectedUsers.map((u) => (
          <UserBadgeItem
          
            key={u._id}
            user={u}
            handleFunction={() => handleDelete(u)}
          />
        ))}
      </Box>
      {loading ? (
        // <ChatLoading />
        <div>Loading...</div>
      ) : (
        searchResult
          ?.slice(0, 4)
          .map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => handleGroup(user)}
            />
          ))
      )}
    </ModalBody>
    <ModalFooter>
        
      <Button onClick={handleSubmit} colorScheme="blue">
        Create Chat
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  )
}

export default GroupChatModal
