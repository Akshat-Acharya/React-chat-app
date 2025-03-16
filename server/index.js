const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const authRoutes = require('./routes/AuthRoutes.js');

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;

const databaseURL = process.env.DATABASE_URL;

    app.use(cors({
        origin:[process.env.ORIGIN],
        methods:['GET','POST','DELETE','PUT','PATCH'],
        credentials:true,
    }))

    app.use(cookieParser());
    app.use(express.json());

    app.use('/api/auth',authRoutes)

const server = app.listen(port,() => {
    console.log("Server sttarted at port : ",port);
})

mongoose.connect(databaseURL).then(() => {
    console.log("Database Connection is successfull");
}).catch((err) => console.log("Error : ",err.messsage));