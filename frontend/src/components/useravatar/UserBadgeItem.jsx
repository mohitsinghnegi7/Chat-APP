import { Box } from '@chakra-ui/react'
import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";

const UserBadgeItem = ({handleFunction,user}) => {
  return (
    <div>
      <Box
      px={2}
      py={1}
      borderRadius={'lg'}
      m={1}
      mb={2}
      variant={'solid'}
      fontSize={16}
     backgroundColor={'purple'}
     color={'white'}
      cursor={'pointer'}
      onClick={handleFunction}
      display={'flex'}
      flexDir={'row'}
      alignItems={'center'}
      gap={1}
      >
        {user.name}
        
        <div className='text-xl'>
            <IoMdCloseCircle/>
        </div>
      </Box>
    </div>
  )
}

export default UserBadgeItem
