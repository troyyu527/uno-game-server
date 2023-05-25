const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const itemRoute = require("./routes").item;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors")
//connect to DB
mongoose
  .connect(process.env.DB_CONNECT,{
    useUnifiedTopology:true,
    useNewUrlParser: true,
  })
  .then(()=>{
    console.log("Connect to Atlas Database")
  })
  .catch((e)=>{
    console.log(e)
  })

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get("/",(req,res)=>{
  res.send("Welcome to use Troy's UNO-GAME-SERVER")
})

app.use("/api/user",authRoute)
//Use passport to protect all routes after /api
app.use("/api",passport.authenticate("jwt",{session:false}),itemRoute)

// Run the server and report out to the logs
app.listen(8080,()=>{
  console.log("Server is running on port 8080")
})
