const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    recipient : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false,
    },
    messageType : {
        type:String,
        enum:["text","file"],
        required:true,
    },
    content : {
        type:String,
        required : () =>{
            return this.messageType === "text" 
        },
    },
    fileURL : {
        type:String,
        required : () =>{
            return this.messageType === "file" 
        },
    },
    timestamp : {
        type:Date,
        default:Date.now,
    }
})

module.exports = mongoose.model("Messages", messageSchema)