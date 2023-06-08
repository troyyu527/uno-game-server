const router = require("express").Router();
const dataValidation = require("../validation").dataValidation
const Data = require("../models").gameDataModel;

router.use((req,res,next)=>{
  console.log("A request is coming in to data-route.js")
  next();
});
router.get("/",(req,res)=>{
  Data.find({})
    .populate("liked",["username","email"])
    .then((obj)=>{
      res.send(obj);
    })
    .catch((err)=>{
      res.status(500).send(err)
    })
})
router.get("/:_id",(req,res)=>{
  console.log("hello")
  let {_id} = req.params
  Item.findOne({_id})
    .populate("liked",["email"])
    .then((obj)=>{
      res.send(obj);
    })
    .catch((err)=>{
      res.status(500).send(err)
    })
})
router.get("/member/:_member_id",(req,res)=>{
  let {_member_id}=req.params;
  Item.find({member:_member_id})
    .populate("Member",["username","email"])
    .then((data)=>{
      res.send(data)
    }).catch(()=>{
      res.status(500).send("can't get data")
    })
})

router.post("/items",async(req,res)=>{
  //validation
  const {error} = itemValidation(req.body)
  console.log(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  let {title,description,price}=req.body;
  if(req.user.isVisitor()){
    return res.status(400).send("Only Admin can do this.")
  }
  let newItem = new Item({
    title,
    description,
    price,
    liked:req.user._id,
  })
  try{
    await newItem.save();
    res.status(200).send("New item saved")
  }catch(err){
    res.status(400).send("Fail to save item")
  }

})

module.exports = router