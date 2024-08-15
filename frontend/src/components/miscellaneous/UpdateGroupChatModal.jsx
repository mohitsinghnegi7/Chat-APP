import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import UserBadgeItem from '../useravatar/UserBadgeItem'
import { ChatState } from '../../context/ChatProvider';
import { IoEye } from "react-icons/io5";
import axios from 'axios';
import UserListItem from '../useravatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain,fetchMessages, setFetchAgain}) => {

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const { user,selectedChat,setSelectedChat } = ChatState()

    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()

    // console.log(selectedChat);
        const handleRemove =async (user1)=>{
            if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
                toast({
                  title: "Only admins can remove someone!",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom",
                });
                return;
              }
          
              try {
              
                const { data } = await axios.put(
                  `http://localhost:4000/api/chat/group-remove`,
                  {
                    chatId: selectedChat._id,
                    userId: user1._id,
                  },
                  {
                    withCredentials : true
                  }
                );
          
                user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
                setFetchAgain(!fetchAgain);
                fetchMessages();
                setLoading(false);
              } catch (error) {
                toast({
                  title: "Error Occured!",
                  description: error.response.data.message,
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                  position: "top",
                });
                setLoading(false);
              }
              setGroupChatName("");
    }

    const handleRename =async ()=>{
        if (!groupChatName) return;

        try {
          setRenameLoading(true);
        
          
          const res = await axios.put(
            `http://localhost:4000/api/chat/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
           {
            withCredentials : true
           }
          );
    
          setSelectedChat(res.data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          setRenameLoading(false);
        }
        setGroupChatName("");
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

    const handleAddUser =async (user1)=>{
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
              title: "User Already in group!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }
      
          if (selectedChat.groupAdmin._id !== user._id) {
            toast({
              title: "Only admins can add someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }
      
          try {
            setLoading(true);
          
            const { data } = await axios.put(
              `http://localhost:4000/api/chat/group-add`,
              {
                chatId: selectedChat._id,
                userId: user1._id,
              },
              {
                withCredentials : true
              }
            );
      
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            setLoading(false);
          }
          setGroupChatName("");
    }

  return (
    <div className=''>
        
       <IconButton display={{ base: "flex" }} icon={<IoEye />} onClick={onOpen} />

<Modal onClose={onClose} isOpen={isOpen} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
      fontSize="25px"
      fontFamily="Work sans"
      display="flex"
      justifyContent="center"
    >
      {selectedChat.chatName}
    </ModalHeader>

    <ModalCloseButton />
    <ModalBody display="flex" flexDir="column" alignItems="center">
       <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
        {selectedChat.users.map((u) => (
          <UserBadgeItem
            key={u._id}
            user={u}
            admin={selectedChat.groupAdmin}
            handleFunction={() => handleRemove(u)}
          />
        ))}
      </Box>

      <FormControl display="flex">
        <Input
          placeholder="Chat Name"
          mb={3}
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <Button
          variant="solid"
          colorScheme="teal"
          ml={1}
          isLoading={renameloading}
          onClick={handleRename}
        >
          Update
        </Button>
      </FormControl>
      
      <FormControl>
        <Input
          placeholder="Add User to group"
          mb={1}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </FormControl>
      
      {loading ? (
        <Spinner size="lg" />
        
      ) : (
        searchResult?.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => handleAddUser(user)}
          />
        ))
      )} 
    </ModalBody>
    
    <ModalFooter>
       <Button onClick={() => handleRemove(user)} colorScheme="red">
        Leave Group
      </Button>    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  )
}

export default UpdateGroupChatModal
