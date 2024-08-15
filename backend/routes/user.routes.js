import {Router} from 'express'
import { loginUser, registerUser, userDetail, userLogout, allUser } from '../controllers/user.controllers.js'
import {authToken} from '../middleware/authToken.js'

const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/detail").get(authToken, userDetail)
userRouter.route("/logout").get(authToken, userLogout)
userRouter.route('/').get(authToken,allUser)

export default userRouter