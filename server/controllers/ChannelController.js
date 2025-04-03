const User = require("../models/UserModal");
const Channel = require("../models/ChannelModel");
const { default: mongoose } = require("mongoose");

exports.createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    // Validate admin user
    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // Validate members
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid members list",
      });
    }

    // Fetch valid members
    const validMembers = await User.find({ _id: { $in: members } });
    if (!validMembers || validMembers.length !== members.length) {
      return res.status(402).json({
        success: false,
        message: "Some members are not found in the database",
      });
    }

    // Create channel
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });
    await newChannel.save();

    return res.status(200).json({
      success: true,
      message: "Channel created successfully",
      channel: newChannel,
    });
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create the channel",
    });
  }
};

exports.getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Channel created successfully",
      channels,
    });
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create the channel",
    });
  }
};

exports.getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });
    if(!channel){
      return res.status(400).json({
        success:false,
        message:"Cannot find Channel"
      })
    }
    const messages = channel.messages
    return res.status(200).json({
      success: true,
      message: "Channel created successfully",
      messages,
    });
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create the channel",
    });
  }
};
