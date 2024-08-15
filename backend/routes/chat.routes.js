import { Router } from "express";
import { authToken } from "../middleware/authToken.js";
import { accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup } from "../controllers/chat.controllers.js";

const chatRouter = Router()

chatRouter.route('/').post(authToken,accessChat)
chatRouter.route('/').get(authToken,fetchChat)
chatRouter.route('/group').post(authToken, createGroupChat)
chatRouter.route('/rename').put(authToken,renameGroup)
chatRouter.route('/group-remove').put(authToken,removeFromGroup)
chatRouter.route('/group-add').put(authToken,addToGroup)

export default chatRouter