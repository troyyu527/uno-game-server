const joi = require("joi")

const registerValidation = (data) =>{
  const schema = joi.object({
    username:joi.string().min(3).max(50).required(),
    email:joi.string().min(6).max(50).required().email(),
    password:joi.string().min(6).max(255).required(),
    gender:joi.string().required().valid("Male","Female","Secret"),
    role:joi.string().required().valid("Admin","Member","Visitor")
  });
  return schema.validate(data);
}

const loginValidation = (data) =>{
  const schema = joi.object({
    username:joi.string().min(3).max(50).required(),
    password:joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
}

const modifyValidation = (data) =>{
  const schema = joi.object({
    username:joi.string().min(3).max(50).required(),
    email:joi.string().min(6).max(50).email().required(),
    password:joi.string().min(6).max(255).required(),
    gender:joi.string().valid("Male","Female","Secret").required(),
  });
  return schema.validate(data);
}

const itemValidation = (data) =>{
  const schema = joi.object({
    title:joi.string().min(6).max(50).required(),
    description:joi.string().min(6).max(50).required(),
    price:joi.number().min(1).max(9999).required(),
  });
  return schema.validate(data);
}

const dataValidation = (data) =>{
  const schema = joi.object({
    user:joi.string().required(),
    index:joi.number().required(),
    name:joi.string().required(),
    date:joi.number(),
    currentPlayer:joi.string(),
    currentPlayerQueue:joi.array(),
    isReverse:joi.boolean(),
    main:joi.array(),
    discard:joi.array(),
    p1:joi.array(),
    p2:joi.array(),
    p3:joi.array(),
    p4:joi.array(),
    
  });
  return schema.validate(data);
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.itemValidation = itemValidation;
module.exports.dataValidation = dataValidation;
module.exports.modifyValidation = modifyValidation