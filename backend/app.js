import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import chatRouter from './routes/chat.routes.js'
import messageRouter from './routes/message.routes.js'



const app = express()



app.use(express.json())

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/chat",chatRouter)
app.use("/api/message",messageRouter)



export {app}
