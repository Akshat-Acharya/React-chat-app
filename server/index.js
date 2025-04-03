const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const authRoutes = require('./routes/AuthRoutes.js');
const contactRoutes = require('./routes/ContactRoutes.js');
const setupSocket = require('./socket.js');
const messageRoutes = require('./routes/MessagesRoutes.js');
const channelRoutes = require('./routes/ChannelRoutes.js');

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;

const databaseURL = process.env.DATABASE_URL;

    app.use(cors({
        origin:[process.env.ORIGIN],
        methods:['GET','POST','DELETE','PUT','PATCH'],
        credentials:true,
    }))

    app.use("/uploads/profiles",express.static("uploads/profiles"))
    app.use("/uploads/files",express.static("uploads/files"))

    app.use(cookieParser());
    app.use(express.json());

    app.use('/api/auth',authRoutes)
    app.use('/api/contacts',contactRoutes)
    app.use('/api/messages',messageRoutes)
    app.use('/api/channel',channelRoutes);

const server = app.listen(port,() => {
    console.log("Server sttarted at port : ",port);
})

    setupSocket(server)

mongoose.connect(databaseURL).then(() => {
    console.log("Database Connection is successfull");
}).catch((err) => console.log("Error : ",err.messsage));