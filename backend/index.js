import {app} from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { Server } from 'socket.io'


dotenv.config({
    path : './.env'
})


const server =  app.listen(process.env.PORT || 4000,()=>{
        console.log("Server is running on Port ",process.env.PORT);})
        
    
const io = new Server(server,{
    pingTimeout : 60000,
    cors : {
        origin : '*',
        credentials : true
    }
})        

connectDB()
.then(()=>{
    console.log("Connected Successfully");
    
})
.catch(err=>{
    console.log("MongoDB conncetion failed !! ", err);
    
})



io.on('connection',(socket)=>{
    console.log("Connected to socket.io");


    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        console.log(userData._id);
        
        socket.emit("Connected")
    })

    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log("user joined room " , room);
        
    })

    socket.on('new message',(newMessageReceived)=>{
            var chat = newMessageReceived.chat

            if(!chat.users) return console.log('chat.users not defined');

            chat.users.forEach((user)=>{
                if(user._id === newMessageReceived.sender._id) return;


                socket.in(user._id).emit('message received',newMessageReceived)
            })
            
    })

    socket.off('setup',()=>{
        console.log("User Disconnected");
        socket.leave(userData._id)
        
    })
    
})