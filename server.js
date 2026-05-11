const express = require("express");
const cors = require("cors");
const dotenv=require("dotenv")
const dbConnection=require("./Config/Mongodb")
const app = express();
dotenv.config()

app.use(express.json());
app.use(cors());


dbConnection()

const Port=process.env.Port || 5000
app.get("/", (req, res) => {
  res.send("welcome  on backend server ");
});

app.listen(Port, () => {
  console.log(`server is running on http://localhost:${Port}`);
});
