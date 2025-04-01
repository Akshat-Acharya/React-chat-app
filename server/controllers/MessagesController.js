const Message = require("../models/MessagesModal");
const fs = require("fs");
const path = require("path");

exports.getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).json({
        success: false,
        message: "Users not found",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({
      success: true,
      message: "All messages fetched",
      messages,
    });
  } catch (e) {
    console.error("❌ Error fetching messages:", e);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch messages",
      error: e.message,
    });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not found",
      });
    }

    const { sender, recipient } = req.body;

    // Validate sender and recipient
    if (!sender || !recipient) {
      return res.status(400).json({
        success: false,
        message: "Sender and recipient are required",
      });
    }

    // Generate file path
    const date = Date.now();
    const fileDirectory = path.join(__dirname, "..", "uploads", "files");
    const fileName = `${date}-${Math.floor(Math.random() * 1000000000)}${path.extname(req.file.originalname)}`;
    const finalPath = path.join(fileDirectory, fileName);

    // Ensure directory exists
    fs.mkdirSync(fileDirectory, { recursive: true });

    // Move file to final destination
    fs.renameSync(req.file.path, finalPath);

    // File URL (relative to server)
    const fileURL = `/uploads/files/${fileName}`;

    // Create message document with fileURL
    const message = new Message({
      sender,
      recipient,
      messageType: "file",
      content: "", // ✅ Required because `content` is in schema
      fileURL, // ✅ Ensuring fileURL is included
    });

    await message.save();

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileURL,
    });

  } catch (e) {
    console.error("❌ File Upload Error:", e);
    return res.status(500).json({
      success: false,
      message: "Cannot upload file",
      error: e.message,
    });
  }
};
