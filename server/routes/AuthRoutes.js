const express = require('express');
const {signup,login,getUserInfo} = require('../controllers/AuthController.js')

const authRoutes = express.Router();

authRoutes.post('/signup',signup)
authRoutes.post('/login',login)
authRoutes.get('user-info',getUserInfo)

module.exports = authRoutes