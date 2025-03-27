const express = require("express");
const { verifyToken } = require("../middlewares/AuthMiddlewares");
const { searchContacts } = require("../controllers/ContactsController");


const contactRoutes = express.Router();


contactRoutes.post("/search",verifyToken,searchContacts)


module.exports = contactRoutes; 