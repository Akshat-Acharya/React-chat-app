const jwt = require('jsonwebtoken')

const User = require('../models/UserModal.js');
const { compare } = require('bcrypt');

const maxAge = 3*24*60*60*1000;

const createToken = (email,userId) => {
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
}


exports.signup = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message : "Something is missing"
            })
        }
        const user = await User.create({email,password});
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return res.status(200).json({
            success:true,
            message:"User Created Successfully",
            user:{
                id:user.id,
                email:user.email,
                profileSetup : user.profileSetup
            } 
        })
    }
    catch(e){
        console.log(e.message);
        return res.status(500).json({
            success : false,
            message : e.message
        })
    }
}

exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message : "Something is missing"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }
        const auth = await compare(password,user.password);
        if(!auth){
            return res.status(401).json({
                success : false,
                message : "Password mismatched"
            })
        }
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return res.status(200).json({
            success:true,
            message:"User Created Successfully",
            user:{
                id:user.id,
                email:user.email,
                profileSetup : user.profileSetup,
                firstName:user.firstName,
                lastName : user.lastName,
                image : user.image,
                color:user.color,
            } 
        })
    }
    catch(e){
        console.log(e.message);
        return res.status(500).json({
            success : false,
            message : e.message
        })
    }
}

exports.getUserInfo = async (req,res) => {
    try{
        
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"User Created Successfully",
           
                id:userData.id, 
                email:userData.email,
                profileSetup : userData.profileSetup,
                firstName:userData.firstName,
                lastName : userData.lastName,
                image : userData.image,
                color:userData.color,
             
        })   

    }
    catch(e){
        console.log(e.message);
        return res.status(500).json({
            success : false,
            message : e.message
        })     
    }
}