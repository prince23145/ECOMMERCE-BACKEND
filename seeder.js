const mongoose=require("mongoose")
const dotenv=require("dotenv")
const Product=require("./Models/Products.js")
const User=require("./Models/User.js")
const products=require("./Data/products.js")


dotenv.config();
// CONECT TO DB
mongoose.connect(process.env.MONGODB_URI)
console.log("mongo db connected")

// FUNCTION to seed data

const seedData=async ()=>{
    try{
        // clear existing data
        await Product.deleteMany()
        await User.deleteMany()

        // Create a Default Admin
        const createdUser= await User.create({
            name:"admin",
            email:"admin@example.com",
            password:"admin@123456",
            role:"admin",
        })
        const userID= createdUser._id;
        const sampleProduct =products.map((product)=>{
            return{...product,user:userID}
        })
        User.create()
        console.log("user creater succesfully")
        await Product.insertMany(sampleProduct)
        console.log("product data seeding succesfull")
        process.exit()

    }catch (error){
        console.log(error)
        process.exit(1)
    }
}


seedData();