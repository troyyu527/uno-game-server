const router = require("express").Router();
const dataValidation = require("../validation").dataValidation
const Data = require("../models").gameDataModel;

router.use((req,res,next)=>{
  console.log("A request is coming in to data-route.js")
  next();
});
router.get("/",(req,res)=>{
  Data.find({})
    .then((obj)=>{
      res.send(obj);
    })
    .catch((err)=>{
      res.status(500).send(err)
    })
})
router.get("/:_user",(req,res)=>{
  let {_user} = req.params
  Data.find({user:_user})
    .then((obj)=>{
      res.send(obj);
    })
    .catch((err)=>{
      res.status(500).send(err)
    })
})
router.delete("/:_user/:_index",(req,res)=>{
  let {_user,_index} = req.params
  Data.findOneAndDelete({ user: _user, index: _index })
    .then(() => {
      res.send("Data deleted successfully");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
})
router.delete("/:_user", (req, res) => {
  let { _user } = req.params;
  Data.find({ user: _user })
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("No matching data found");
      } else {
        Data.deleteMany({ user: _user })
          .then(() => {
            res.send("Data deleted successfully");
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/data",async(req,res)=>{
  //validation
  const {error} = dataValidation(req.body)
  console.log(req.body.name)
  if (error) return res.status(400).send(error.details[0].message)
  let {user,index,name,date,img,currentPlayer,currentPlayerQueue,isReverse,main,discard,p1,p2,p3,p4}=req.body;
  let newData = new Data({
    user,
    index,
    name,
    date,
    currentPlayer,
    currentPlayerQueue,
    isReverse,
    main,
    discard,
    p1,
    p2,
    p3,
    p4,
  })
  try{
    await newData.save();
    res.status(200).send("New data saved")
  }catch(err){
    res.status(400).send("Fail to save data")
  }

})

module.exports = router