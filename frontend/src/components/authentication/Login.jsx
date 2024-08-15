import React from 'react'
import {  Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Show, useToast, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState(false)
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const handleClick = ()=>setShow(!show)
    const submitHandle =async ()=>{
        setLoading(true)

        if(!email && !password){
            toast({
                title : "All fields are required",
                status : "warning",
                duration : 2000,
                isClosable : true,
                position : 'top'
            })
            setLoading(false)
            return ;
        }
        try{
            const res = await axios.post('http://localhost:4000/api/user/login',{
                email,
                password
            },{
                
                    withCredentials : true
                  
            })
    
            console.log(res.data.details.user);
            toast({
                title : "Login Successfully",
                status : "success",
                duration : 2000,
                isClosable : true,
                position : 'top'
                
            })
             localStorage.setItem("userInfo",JSON.stringify(res.data.details.user))
            setLoading(false)
            navigate('/chats')
         }
        catch(err){
            toast({
                title : "Error Occured",
                description : err.response.data.message,    
                status : "error",
                duration : 2000,
                isClosable : true,
                  position : 'top'
                
            })
            // console.log("yghtrhrh",err.response.data.message);
            
          setLoading(false)
        }
    }


  return (
    <div>
      <VStack spacing={'5px'} color={'black'}>

        <FormControl id='email' isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input 
            placeholder='Enter Your Email'
            onChange={(e)=>{
                setEmail(e.target.value)
            }}></Input>
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>
                Password
            </FormLabel>
            <InputGroup>
            <Input 
            type={show ? 'password' : 'text'}
            placeholder='Enter Your Password'
            onChange={(e)=>{
                setPassword(e.target.value)
            }} />
            <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                {show ? "Show" : "Hide"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        
        <Button
        colorScheme={'blue'}
        width={'100%'}
        style={{marginTop : 15}}
        onClick={submitHandle}
        >Login</Button>

        

    </VStack>
    </div>
  )
}

export default Login
