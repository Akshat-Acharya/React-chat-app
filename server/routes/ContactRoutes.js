const express = require("express");
const { verifyToken } = require("../middlewares/AuthMiddlewares");
const { searchContacts, getContactForDMList } = require("../controllers/ContactsController");


const contactRoutes = express.Router();


contactRoutes.post("/search",verifyToken,searchContacts)
contactRoutes.get("/get-contacts-for-dm",verifyToken,getContactForDMList)


module.exports = contactRoutes; 