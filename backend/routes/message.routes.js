import { Router } from "express";
import { authToken } from "../middleware/authToken.js";
import { sendMessage,allMessage } from "../controllers/message.controllers.js";

const messageRouter = Router()

messageRouter.route('/').post(authToken,sendMessage)
messageRouter.route('/:chatId').get(authToken,allMessage)

export default messageRouter