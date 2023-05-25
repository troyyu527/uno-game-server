const mongoose = require("mongoose")
const itemSchema = new mongoose.Schema({
  id:{
    type:String,
  },
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  price:{
    type:Number,
    required:true,
  },
  liked:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
})

module.exports = mongoose.model("Item",itemSchema)