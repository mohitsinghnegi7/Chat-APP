import React,{useState} from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import ChatBox from '../components/ChatBox'
import MyChat from '../components/MyChat'

const ChatPage = () => {

  const { user } =  ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div className='w-full'>
     {user && <SideDrawer/>}
  
      <div className='md:flex justify-between w-full p-2.5 h-[85vh] gap-3'>
      {user && <MyChat fetchAgain={fetchAgain} /> }
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </div>
     
    </div>
  )
}

export default ChatPage
