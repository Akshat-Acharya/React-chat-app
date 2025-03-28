const { genSalt } = require("bcrypt");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");


const userSchema =new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
    },
    firstName:{
        type:String,
        required:false,
    },
    lastName:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:false,
    },
    color:{
        type:Number,
        required:false,
    },
    profileSetup:{
        type:Boolean,
        default:false
    }
});

userSchema.pre("save",async function(next){
    const salt = await genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

module.exports = mongoose.model("User", userSchema)
