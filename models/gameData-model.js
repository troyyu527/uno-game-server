const mongoose = require("mongoose")
const gameDataSchema = new mongoose.Schema({
  user:{
    type:String,
  },
  index:{
    type:Number,  
  },
  name:{
    type:String,
  },
  date:{
    type:Number,
  },
  currentPlayer:{
    type:String,
  },
  currentPlayerQueue:{
    type:Array,
  },
  isReverse:{
    type:Boolean,
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