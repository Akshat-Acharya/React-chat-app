const express = require("express");
const {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage
} = require("../controllers/AuthController.js");
const { verifyToken } = require("../middlewares/AuthMiddlewares.js");
const multer = require("multer")


const authRoutes = express.Router();

const upload = multer({dest:"uploads/profiles/"})
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"),addProfileImage);
authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)

module.exports = authRoutes;
