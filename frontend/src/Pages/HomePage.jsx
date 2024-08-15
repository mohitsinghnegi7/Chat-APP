import React from 'react'
import {Container,Box,Text, Divider} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Signup from '../components/authentication/Signup'
import Login from '../components/authentication/Login'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const HomePage = () => {

    const navigate = useNavigate()

    useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      console.log(userInfo);
      

    if(userInfo){
        navigate("/chats")
    }
},[navigate])
  return (
    <div className=' '>
      <div className='max-w-md p-1 flex justify-center flex-col mx-auto drop-shadow-xl' >
        <div className='w-full flex justify-center m-3 p-1 bg-white  mt-3 mb-1 rounded-lg'>
          <p className='text-4xl font-sans' >Talk-A-Tive</p>
        </div>
        <div className='bg-white  w-full p-3 m-3  rounded-lg'>
         
       <div>
       <Tabs variant='soft-rounded' >
  <TabList>
    <Tab width={'50%'}>Login</Tab>
    <Tab width={'50%'}>SignUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
       </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
