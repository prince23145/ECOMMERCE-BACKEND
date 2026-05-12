const jwt= require("jsonwebtoken")
const User = require("../Models/User.js")

// middelware to protect routes

const protect=async (req,res,next)=>{
    let token;

    if(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token=req.headers.authorization.split(" ")[1]
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
            
            req.user= await User.findById(decoded.user.id).select("-password");
            next()



        } catch (error) {
            res.status(401).json({message:"not authorised ,token failure"})
        }
    }
    else{
        res.status(401).json({message:"not authorized, No tokken provided"})
    }
    
}


module.exports={protect}