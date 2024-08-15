//import { ApiError } from "../utils/ApiError";
import jwt from 'jsonwebtoken'
import User from "../models/user.models.js";

async function authToken(req, res, next){
    try{
        const token = req.cookies?.token
        console.log(token);
        
console.log("1");

        if(!token){
            console.log("token nhi hai");
            
            return res.status(200).json({
                message :"Please Login First",
                error : true,
                success : false
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await User.findById(decodedToken?._id)
console.log("2");

        if(!user){
            return res.status(200).json({
                message : "Unauthorized token",
                error : true,
                success : false
               })
        }
console.log("3");

        if(user){
            req.user = user
            next()
        }
        

    }
    catch(err){
      return  res.status(400).json({
           message : err.message,
           error : true,
           success : false
           
       })
       
   }

}

export {authToken}