const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    minLength:3,
    maxLength:20,
  },
  email:{
    type:String,
    required:true,
    minLength:6,
    maxLength:50,
  },
  password:{
    type:String,
    required:true,
    minLength:6,
    maxLength:1024,
  },
  role:{
    type:String,
    enum:["Admin","Member","Visitor"],
    required:true
  },
  data:{
    type:Date,
    default:Date.now,
  }
})

userSchema.methods.isVisitor = function (){
  return this.role == "Visitor"
}
userSchema.methods.isMember = function (){
  return this.role == "Member"
}
userSchema.methods.isAdmin = function (){
  return this.role == "Admin"
}

//middleware
userSchema.pre("save", async function(next){
  if(this.isModified("password") || this.isNew){
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
  }
  return next()
})

userSchema.methods.comparePassword = function (password,cb){
  bcrypt.compare(password, this.password,(err,isMatch)=>{
    if(err){
      return cb(err, isMatch)
    }
    cb(null,isMatch)
  })
}

module.exports = mongoose.model("User",userSchema)