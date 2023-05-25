const router = require("express").Router();
const registerValidation = require("../validation").registerValidation
const loginValidation = require("../validation").loginValidation
const User = require("../models").userModel;
const jwt =require("jsonwebtoken")

router.use((req,res,next)=>{
  console.log("A request is coming in to auth.js")
  next();
});
// router.get("/testAPI",(req,res)=>{
//   const msgObj = {
//     message: "Test API is working",
//   }
//   return res.json(msgObj);
// })

//route to register
router.post("/register",async (req,res)=>{
  console.log("registering...")
  console.log(registerValidation(req.body))

  const {error} = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  //check if user exist 
  const emailExist = await User.findOne({email:req.body.email});
  if (emailExist) return res.status(400).send("Email has already been registered.")
  const newUser = new User({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
    role:req.body.role,
  });
  try{
    const savedUser = await newUser.save();
    res.status(200).send({
      msg:"Account Saved successfully",
      saveObject: savedUser,
    });
  }catch(err){
    res.status(400).send("Fail to save account")
  }
})
//route to login
router.post("/login",async (req,res)=>{
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message) 
  try{
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(401).send("User not found");
    }
    const isMatch = await user.comparePassword(req.body.password,function(err,isMatch){
      if(err) return res.status(400).send(err)
      if(isMatch){
        const tokenObj = {_id:user._id,email:user.email};
        const token = jwt.sign(tokenObj,process.env.PASSPORT_SECRET)
        res.send({success:true,token:"JWT "+token,user})
      }else{
        res.status(401).send("Wrong password.")
      }
    });
  } catch(err){
    res.status(400).send(err);
  }
  // User.findOne({email:req.body.email},function (err,user){
  //   if(err){
  //     res.status(400).send(err)
  //   }
  //   if(!user){
  //     res.status(401).send("User not found")
  //   }else{
  //     user.comparePassword(req.body.password,function(err,isMatch){
  //       if(err) return res.status(400).send(err)
  //       if(isMatch){
  //         const tokenObj = {_id:user._id,email:user.email};
  //         const token = jwt.sign(tokenObj,process.env.PASSPORT_SECRET)
  //         res.send({success:true,token:"JWT"+token,user})
  //       }else{
  //         res.status(401).send("Wrong password.")
  //       }
  //     })
  //   }
  // })
})

module.exports = router