import { useDisclosure } from '@chakra-ui/hooks'
import { Avatar, Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import React from 'react'
import { IoEye } from "react-icons/io5";

const ProfileModel = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
        
      {children ? <span onClick={onOpen}>{children}</span> : (
        <IconButton
        d={{base : "flex"}}
        icon={<IoEye/>}
        onClick={onOpen}
        />
      ) }

      <Modal size={['xs', 'sm', 'md', 'lg']} isOpen={isOpen} onClose={onClose}  isCentered>
        <ModalOverlay/>
        <ModalContent  >
            <ModalHeader
            fontSize={{base : '18px', sm:'25px'}}
            display={'flex'}
            justifyContent={'center'}
            >{user.name}</ModalHeader>
            <ModalCloseButton/>
            <ModalBody 
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'center'}>
                  <Avatar borderRadius={'full'} boxSize={'150px'} size={'sm'} cursor={'pointer'} name={user.name} src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjlV1ttf0QxVT0-cBSPzujOUTgY6SwGOVpgQ&s'} />
            <Text 
            fontSize={{base : '18px', sm:'25px'}}
            >Email : {user.email}</Text>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme={'blue'} mr={3} onClick={onClose}>
                    Close
                </Button>
                
            </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModel
