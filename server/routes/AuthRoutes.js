const express = require('express');
const {signup,login,getUserInfo} = require('../controllers/AuthController.js');
const { verifyToken } = require('../middlewares/AuthMiddlewares.js');

const authRoutes = express.Router();

authRoutes.post('/signup',signup)
authRoutes.post('/login',login)
authRoutes.get('/user-info',verifyToken,getUserInfo)

module.exports = authRoutes