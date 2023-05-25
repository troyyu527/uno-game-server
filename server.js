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
app.use("/api/user",authRoute)
//Use passport to protect all routes after /api
app.use("/api",passport.authenticate("jwt",{session:false}),itemRoute)

// app.listen(8080,()=>{
//   console.log("Server is running on port 8080")
// })
// Run the server and report out to the logs
app.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
