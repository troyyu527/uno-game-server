const mongoose = require("mongoose")
const gameDataSchema = new mongoose.Schema({
  user:{
    type:String,
  },
  name:{
    type:String,
  },
  img:{
    data:Buffer,
    contentType:String,
  },
  date:{
    type:Number,
  },
  main:{
    type:Array,
  },
  discard:{
    type:Array,
  },
  p1:{
    type:Array,
  },
  p2:{
    type:Array,
  },
  p3:{
    type:Array,
  },
  p4:{
    type:Array,
  },
})

module.exports = mongoose.model("gameData",gameDataSchema)