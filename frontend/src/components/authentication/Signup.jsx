import React, { useEffect } from 'react'
import {  Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Signup = () => {

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()
    const [show, setShow] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const toast = useToast()
    const navigate = useNavigate()


    const handleClick = ()=>setShow(!show)
    const handleShow = ()=>setShowConfirmPassword(!showConfirmPassword)

    const postDetail = (pics)=>{
        
        //console.log(pics);
        
        setLoading(true);
        if(pics===undefined){
            toast({
                title: 'Please Select an image',
                status: 'success',
                duration: 2000,
                isClosable: true,
              })

              return;
        }
        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData()
            data.append("file",pics)
            data.append("upload_preset","z7bu6sks")
            data.append("cloud_name","dzbvfl7vl")
           
            
            
           axios.post("https://api.cloudinary.com/v1_1/dzbvfl7vl/image/upload", data
            )
            .then((data)=>{
             //   console.log(data.data);
                
                setPic(data.data.url.toString())
                setLoading(false)
            }).catch((err)=>{
               // console.log(err);
                setLoading(false)
                
            })

        }else{
            toast({
                title: 'Please Select an image',
                status: 'success',
                duration: 2000,
                isClosable: true,
              })
        }
    }
    

    const submitHandle =async ()=>{
        setLoading(true)
        if(!name || !email || !password || !confirmPassword){
            toast({
                title : "please fill all the fields",
                status : "warning",
                duration : 2000,
                isClosable : true,position : 'top'
            
            })
            setLoading(false)
            return ;
        }

        if(password !== confirmPassword){
            toast({
                title : "Password does not match",
                status : "warning",
                duration : 2000,
                isClosable : true,
                  position : 'top'
            
            })
            return;
        }
try{
        const {data} = await axios.post('http://localhost:4000/api/user/register',{
            name,
            email,
            password,
            pic
        },{
            headers : {
                "Content-Type" : "application/json"
            }
        })

        console.log(data);
        toast({
            title : "Registration Successfully",
            status : "success",
            duration : 2000,
            isClosable : true,
            position : 'top'
            
        })
        localStorage.setItem("userInfo",JSON.stringify(data))
        setLoading(false)
        navigate('/chats')
        
    }
    catch(err){
        toast({
            title : "Error Occured",
            description : err.response.data.message ,    
            status : "error",
            duration : 2000,
            isClosable : true,
              position : 'top'
            
        })
        setLoading(false)
    }
    }


  return (
    <VStack spacing={'5px'} color={'black'}>
        <FormControl id='first-name' isRequired>
            <FormLabel>
                Name
            </FormLabel>
            <Input 
            placeholder='Enter Your Name'
            onChange={(e)=>{
                setName(e.target.value)
            }}></Input>
        </FormControl>

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

        <FormControl id='confirmPassword' isRequired>
            <FormLabel>
               Confirm Password
            </FormLabel>
            <InputGroup>
            <Input 
            type={showConfirmPassword ? 'password' : 'text'}
            placeholder='Enter Your Password again'
            onChange={(e)=>{
                setConfirmPassword(e.target.value)
            }} />
            <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={handleShow}>
                {showConfirmPassword ? "Show" : "Hide"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='pic' isRequired>
            <FormLabel>
               Upload Your Pic
            </FormLabel>
           
            <Input 
            type='file'
            p={1.5}
            accept="image/*"
            onChange={(e)=>{
           
                postDetail(e.target.files[0])
            }} />
        
        </FormControl>
        <Button
        colorScheme={'blue'}
        width={'100%'}
        style={{marginTop : 15}}
        onClick={submitHandle}
        isLoading={loading}
        >Submit</Button>



    </VStack>
  )
}

export default Signup
