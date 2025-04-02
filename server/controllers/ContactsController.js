const { default: mongoose } = require("mongoose");
const User = require("../models/UserModal");
const Message = require("../models/MessagesModal");

exports.searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(403).json({
        success: false,
        message: "No search Term found",
      });
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "User found",
      contacts,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getContactForDMList = async (req, res) => {
  try {
    console.log("🔹 Request received for getContactForDMList");

    let userId = req.userId;
    console.log("🔹 Extracted UserId:", userId);

    if (!userId) {
      console.log("❌ UserId is missing");
      return res
        .status(400)
        .json({ success: false, message: "User ID is missing" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("❌ Invalid UserId format:", userId);
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    userId = new mongoose.Types.ObjectId(userId);
    console.log("✅ Converted UserId to ObjectId:", userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: {
          lastMessageTime: -1,
        },
      },
    ]);

    console.log("🔹 Aggregated Contacts:", contacts);

    return res.status(200).json({
      success: true,
      message: "Contacts fetched",
      contacts,
    });
  } catch (error) {
    console.error("❌ Error in getContactForDMList:", error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch the contacts",
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      "firstName lastName _id"
    );
    const contacts = users.map((user) => ({
      label: user.firstName?`${user.firstName} ${user.lastName}`:user.email,
      value: user._id
    }))

    return res.status(200).json({
      success: true,
      message: "Contacts fetched",
      contacts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot fetch the contacts",
    });
  }
};
