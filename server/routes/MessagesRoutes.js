const express = require("express");
const { verifyToken } = require("../middlewares/AuthMiddlewares");
const { getMessages, uploadFile } = require("../controllers/MessagesController");
const multer = require("multer");

const messageRoutes = express.Router();
const upload = multer({ dest: "uploads/files" }); // ✅ Make sure the path exists

messageRoutes.post("/get-messages", verifyToken, getMessages);

// ✅ Ensure multer handles `file` AND `text fields` correctly
messageRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

module.exports = messageRoutes;
