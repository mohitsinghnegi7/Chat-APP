import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogic'
import { ChatState } from '../context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({message}) => {

    //console.log(message[0].content);
    

    const {user} = ChatState()
  return (
      <ScrollableFeed>
        {message && message.map((m,i)=>(
            <div 
            key={m._id}
            className='flex'
            >
                {
                    (isSameSender(message, m, i, user._id)||isLastMessage(message,i,user._id)) && (
                        <Tooltip
                        label={m.sender.name}
                        placement='bottom-start'
                        hasArrow
                        >
                            <Avatar
                            mt={'7px'}
                            mr={1}
                            size={'sm' }
                            cursor={'pointer'}
                            name='m.sender.name'
                            src='m.sender.pic'/>
                 
                        </Tooltip>
                    )
                }
                <span style={{backgroundColor : `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                borderRadius:"20px",
            padding : "5px 15px",
        maxWidth:"75%",
        maxWidth:"75%",
        marginLeft : isSameSenderMargin(message, m, i, user._id),
        marginTop : isSameUser(message, m, i, user._id) ? 3 : 10
        
        }} >
                    {m.content}
                </span>
            </div>
        ))}
      </ScrollableFeed>
  )
}

export default ScrollableChat
