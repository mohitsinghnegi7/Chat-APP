import Chat from "../models/chat.models.js";
import User from "../models/user.models.js";
import Message from "../models/message.models.js";


const sendMessage = async(req,res)=>{
    const {content, chatId}  = req.body

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.status(400).json({
            message  : "All field are required"
        });
      }
      console.log(req.user._id);
      
    
      var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
      };

      try{
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

      return  res.json(message);

      }
      catch(err){
       return res.status(400).json({
            msg : err.message
        });
        throw new Error(err.message);
      }


}

const allMessage = async(req,res)=>{
    try {
        const messages = await Message.find({ chat: req.params.chatId })
          .populate("sender", "name pic email")
          .populate("chat");
        res.json(messages);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }

}


export {
    allMessage,
    sendMessage
}


