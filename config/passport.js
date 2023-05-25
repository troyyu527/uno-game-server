const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").userModel;

module.exports = (passport)=>{
  let opts={};
  opts.jwtFromRequest = extractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    new jwtStrategy(opts,function(jwt_payload,done){
      User.findOne({_id:jwt_payload._id})
        .exec()
        .then((user)=>{
          if(!user){
            done(null,false);
          }else{
            done(null,user);
          } 
        })
        .catch((err)=>{
          done(err,false)
        })
    })
    
  )
}