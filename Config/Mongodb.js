const mongoose = require("mongoose")

const dbConnection=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongo db connected")
    } catch(err){
        console.log("connection error",err)
        process.exit(1)
    }
}
module.exports= dbConnection;