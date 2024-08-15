import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {

  const {selectedChat} = ChatState()

  return (
    <div className='w-full mt-3 md:mt-0 md:w-2/3'>
     
    <div className='bg-white p-2 md:p-4  rounded-md min-h-[465px] md:min-h-[537px] max-h-[537px] '>
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
    </div>
  )
}

export default ChatBox
