const express = require("express");
const cors = require("cors");
const dotenv=require("dotenv")
const dbConnection=require("./Config/Mongodb")
const UserRoutes=require("./Routes/UserRoutes")
const ProductRoutes=require("./Routes/ProductRoutes")

const app = express();
dotenv.config()

app.use(express.json());
app.use(cors());

// connection database
dbConnection()


const Port=process.env.Port || 5000
app.get("/", (req, res) => {
  res.send("welcome  on backend server ");
});

// api routes here

app.use("/api/v1/users",UserRoutes)
app.use("/api/v1/products",ProductRoutes)


app.listen(Port, () => {
  console.log(`server is running on http://localhost:${Port}`);
});
