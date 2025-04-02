const express = require("express");
const { verifyToken } = require("../middlewares/AuthMiddlewares");
const { searchContacts, getContactForDMList, getAllContacts } = require("../controllers/ContactsController");


const contactRoutes = express.Router();


contactRoutes.post("/search",verifyToken,searchContacts)
contactRoutes.get("/get-contacts-for-dm",verifyToken,getContactForDMList)
contactRoutes.get('/get-all-contacts',verifyToken,getAllContacts)


module.exports = contactRoutes; 