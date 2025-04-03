const { Server: SocketIOServer } = require("socket.io");
const Message = require("./models/MessagesModal");
const Channel = require("./models/ChannelModel");

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected : ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      console.log("Raw message received:", message);

      // Save message to database
      const createMessage = await Message.create(message);

      // Fetch the message with sender and recipient populated
      const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      console.log("Populated message:", messageData);

      // Ensure recipient is correctly populated before emitting
      if (!messageData.recipient) {
        console.warn(
          "Recipient is missing in the populated message",
          messageData
        );
      }

      // Send to recipient if online
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("recieveMessage", messageData);
        console.log(`Message sent to recipient: ${recipientSocketId}`);
      }

      // Send to sender
      if (senderSocketId) {
        io.to(senderSocketId).emit("recieveMessage", messageData);
        console.log(`Message sent to sender: ${senderSocketId}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendChannelMessage = async (message) => {
    try {
      const { channelId, sender, content, messageType, fileURL } = message;
  
      // Ensure the channel exists
      const channel = await Channel.findById(channelId);
      if (!channel) {
        console.error("❌ Channel not found:", channelId);
        return;
      }
  
      // Create and save message
      const createdMessage = await Message.create({
        sender,
        recipient: null,
        channel: channelId, // Ensure message is linked to channel
        content,
        messageType,
        timestamp: new Date(),
        fileURL,
      });
  
      console.log("✅ Message saved in DB:", createdMessage);
  
      // Push message into the channel's messages array
      const updatedChannel = await Channel.findByIdAndUpdate(
        channelId,
        { $push: { messages: createdMessage._id } },
        { new: true }
      );
  
      console.log("✅ Channel messages updated:", updatedChannel.messages);
  
      // Populate sender details
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .exec();
  
      console.log("✅ Populated message data:", messageData);
  
      // Notify all members in the channel
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieve-channel-message", messageData);
        }
      });
  
      // Notify admin
      const adminSocketId = userSocketMap.get(channel.admin.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-channel-message", messageData);
      }
  
    } catch (error) {
      console.error("❌ Error in sendChannelMessage:", error);
    }
  };
  
  

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with socket ID : ${socket.id}`);
    } else {
      console.log("User Id not provided during connection");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

module.exports = setupSocket;
