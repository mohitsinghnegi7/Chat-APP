import User from '../models/user.models.js'

import { ApiError } from '../utils/ApiError.js'

const registerUser = async(req,res)=>{
   try{
    const {name , email , password,pic} = req.body

    if(
        [name, email, password].some((field)=>field?.trim()==="")){
            throw new ApiError(400, "All fields are required")
        }


    const existedUser = await User.findOne({
        email
    })

    if(existedUser){
        throw new ApiError(400, "Email Already Registered")
    }

    const user = await User.create({
        name, 
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(200).json({
        _id : user._id,
        name : user.name,
        email : user.email,
        pic : user.pic,
        error : false,
        success : true
    })
    
   }
   catch(err){
    return res.status(err.statusCode || 500).json({
        message : err.message,
        error : true,
        success : false
    })
   }
}

const genToken = async function (userId){
    try{
        // console.log(token);
        // console.log(user);
        
        const user = await User.findById(userId)
        const token = user.generateToken()
        console.log(token);
        console.log(user);
        
        

        return token
    }catch(err){

        console.log("err", err);
        
        throw new ApiError(500, "Something went wrong")
    }
}

const loginUser = async(req, res)=>{
    try{
        const {email, password} = req.body

        if(!email && !password){
            throw new ApiError(400, "Email and Password are required")
        }

        const existedUser = await User.findOne({
            email
        })

        if(!existedUser){
            throw new ApiError(409, "User not found")

        }

        const isValidPassword = await existedUser.isPasswordCorrect(password)

        if(!isValidPassword){
            throw new ApiError(400, "Wrong Password")
        }
        // console.log(existedUser);
        

        const token =await genToken(existedUser._id)
        console.log("logintoken", token);
        
        const options = {
            httpOnly : true,
            secure : true
        }

        const loggedInUser = await User.findById(existedUser._id).select("-password")
        console.log("user from login",loggedInUser);

        //localStorage.setItem("userInfo",loggedInUser)
        
        return res.status(200).cookie("token",token,options).json({
            
            message : "Logged in Successfully",
            details :  {
                user : loggedInUser,
                token
            },
            error : false,
            success : true
        })

    }
    catch(err){
        return res.status(err.statusCode || 500).json({
            message : err.message,
            error : true,
            success : false
        })
    }
}

const userDetail = async(req, res)=>{
    try{
        const user = req.user
       
        console.log(user)

     return   res.status(200).json({
            data : {
                user
            },
            error : false,
            success : true,
            message : "User Detail"
          })
    }
    catch(err){
    console.log(err)
        
    }
}

const userLogout = async(req, res)=>{
    try{
        const user = req.user
        const options = {
            httpOnly : true,
            secure : true
        }

        return res.status(200).clearCookie("token",options).json({
            message : "User Logout Successfully",
            
        })
    }
    catch(err){
        return res.status(err.statusCode || 500).json({
            message : err.message,
            error : true,
            success : false
    })  
    }
}


const allUser = async(req,res)=>{
    const keyword = req.query.search ? {
        $or : [
            {
                name : { $regex: req.query.search, $options : "i"}
            }, 
             {
                email : { $regex: req.query.search, $options : "i"}
            }

        ]
    } : {};

    const users = await User.find(keyword).find({_id : { $ne : req.user._id}})
    res.send(users)
}

export {
    registerUser,
    loginUser,
    userDetail,
    userLogout,
    allUser
}