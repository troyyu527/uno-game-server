const router = require("express").Router();
const bcrypt = require('bcrypt');
const registerValidation = require("../validation").registerValidation
const loginValidation = require("../validation").loginValidation
const modifyValidation = require("../validation").modifyValidation
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
    gender:req.body.gender,
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
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      return res.status(401).send("User not found");
    }
    const isMatch = await user.comparePassword(req.body.password,function(err,isMatch){
      if(err) return res.status(400).send(err)
      if(isMatch){
        const tokenObj = {_id:user._id,email:user.email};
        const token = jwt.sign(tokenObj,process.env.PASSPORT_SECRET)
        res.send({success:true,token:"JWT "+token,_id:user._id,user:user.username,email:user.email,gender:user.gender,role:user.role})
      }else{
        res.status(401).send("Wrong password.")
      }
    });
  } catch(err){
    res.status(400).send(err);
  }
 
})

//route to modify(patch)
router.patch("/modify/:_id", async (req, res) => {
  const { error } = modifyValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const modifyUser = req.body;
  try {
    const hash = await bcrypt.hash(modifyUser.password, 10);
    modifyUser.password = hash;

    const updatedUser = await User.findByIdAndUpdate(req.params._id, { $set: modifyUser }, { new: true }).exec();
    return res.status(200).send("Data modified");
  } catch (err) {
    return res.status(400).send(err);
  }
});
//route to delete(delete)
router.delete("/:user",async (req,res)=>{
  try{
    const user = req.params.user;
    const deletedUser = await User.findOneAndRemove({ username: user }).exec();
    if (!deletedUser) {
      // User not found
      return res.status(404).json({ error: 'User not found' });
    }
    // Return the deleted user
    return res.json(deletedUser);
  } catch(err){
    res.status(400).send(err);
  }
}) 

module.exports = router