const express = require('express');
const {signup} = require('../controllers/AuthController.js')

const authRoutes = express.Router();

authRoutes.post('/signup',signup)

module.exports = authRoutes