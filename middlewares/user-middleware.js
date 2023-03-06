const User = require("../models/user-model");
const jwt = require('jsonwebtoken');

exports.signupMw = async(req,res,next) => {
    try{
           
    const user = await User.findOne({email : req.body.email});
    const users = await User.findOne({userId : req.body.userId});
    if(!req.body.userId){
        return res.status(400).send(`userId is not provided`); 
    }
    if(req.body.userId === "admin"){
        return res.status(400).send(`userId cannot be admin for security purpose`);
    }
    if(users !== null){ 
        return res.status(400).send(`userId is taken`);
    }  
     
 
    if(!req.body.name){ 
     return res.status(400).send(`Name is not provided`);
    }
    
    if(!req.body.email){
        return res.status(400).send(`Email cant be empty`);
    }
    if(user !== null){
      return res.status(400).send(`Email is already registered`);
    }
    if(!req.body.userType){
     return res.status(400).send(`UserType is not provided`);
    }
    const userTypes = ['CUSTOMER','ENGINEER'];

    if(!userTypes.includes(req.body.userType)){
        return res.status(400).send(`User Can Only Signup For ENGINEER | CUSTOMER`);
    }
    if(req.body.userType === "ADMIN" ){
        return res.status(400).send(`User Can Only Signup For ENGINEER | CUSTOMER`);
    }
    if(!req.body.password){
        return res.status(400).send(`Password should be provided`);
    }

    if(!checkingEmail(req.body.email)){
        return res.status(400).send(`Email is not valid`);
    }
  


 next();
 
}catch(err){
    res.status(500).send(`error in signupMw ${err}`);
}
}

const checkingEmail = (email) => {
   return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}


exports.signinMw = async(req,res,next) => {

    try{
    
    if(!req.body.email){
    return res.status(400).send(`Email is must for signin`);
    }
   
    if(!req.body.password){
        return res.status(400).send(`Password is must for signin`);
    }
    

   next();

}catch(err){
    res.status(500).send(`error in signinMw ${err}`);
}
}

exports.verifyJwtToken = async(req,res,next) => {
   
    try{

     //    const user = await User.findOne({userId : "admin"});

        const token = req.headers['access-token'];
        if(!token){
           return res.status(403).send(`token is not provided, please provide it`);
        }

        jwt.verify(token,process.env.secret, (err,decoded) => {
            if(err){
               return res.status(401).send(`token is not valid, please recheck it`);
            }

            req.email = decoded.id; 

            /** by below method also we can make sure that only admin 
             * can perform find call
             */

            // if(req.email !== user.email){
            //     return res.status(403).send(`only admin can perform this action`);
            // }

            next();

        })  

    }catch(err){
        res.status(500).send(`error in verifyJwtTokenForFindCall ${err}`);
        console.log(`err in verifyJwtToken ${err}`);
    }

}

exports.checkingIfAdmin = async(req,res,next) => {
    /** Here we put req.email value from above middleware to email */

    const user = await User.findOne({email : req.email});

    if(user && user.userType == "ADMIN"){
      next();
    }
    else{
        return res.status(500).send(`This action can only be performed by admin`);
    }

}

exports.userIdIsPresent = async(req,res,next) => {
    try{

        const user = await User.findOne({userId : req.params.userId});
        if(!user){
            res.status(400).send(`userId is wrong, please check again`);
        }
        
        next();

    }catch(err){
        res.status(500).send(`error in userIdIsPresent ${err}`);
    }
}

exports.checkingIfUserIsOwnerOrAdmin = async(req,res,next) => {
    try{
         
        const user = await User.findOne({email : req.email});

   if(user.userType == "ADMIN" || user.userId == req.params.userId ){ 
    next();
   }
   else{
     return res.status(401).send(`you cant perform this action, you should be admin or owner`);
   }

    }catch(err){
        res.status(500).send(`error happened in checkingUserIsOwnerOrAdmin ${err}`);
    }
 

}  


