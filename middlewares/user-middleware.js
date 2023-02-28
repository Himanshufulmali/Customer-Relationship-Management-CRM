const User = require("../models/user-model");


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

