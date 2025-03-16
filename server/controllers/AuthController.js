const jwt = require('jsonwebtoken')

const User = require('../models/UserModal.js')

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
        res.cookie("jwt",createToken(email,user,id),{
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
                // firstName : user.firstName,
                // lastName : user.lastName,
                // image:user.image,
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