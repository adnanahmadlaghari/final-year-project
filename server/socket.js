import { Server as SocketIoServer } from "socket.io";
import Message from "./models/messagesModel.js";
import Channel from "./models/channelModel.js";
import User from "./models/userModel.js";

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createMessage = await Message.create(message);
    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message) => {
    const { channelId, messageType, content, sender, fileUrl } = message;
    
    const createMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: Date.now(),
      fileUrl,
    });

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: {messages: createMessage._id}
    })

    const channel = await Channel.findById(channelId).populate("members")
    const finalData = {...messageData._doc, channelId: channel._id}

    if(channel && channel.members){
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString())
        if(memberSocketId){
          io.to(memberSocketId).emit("recieve-channel-message", finalData)
        }
      })
      const adminSocketId = userSocketMap.get(channel.admin._id.toString())
      if(adminSocketId){
        io.to(adminSocketId).emit("recieve-channel-message", finalData)
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
};

export default setupSocket;
