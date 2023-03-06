const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const redis = require('redis');
const { mapData } = require('../utils/map-data');
const { startKafka } = require('../utils/kafka-function');

const client = redis.createClient();
const key = 'newData';
const field = 'data';
let arr = [];

const startRedis = async(err) => {
    if(err){
        console.log(`error while connecting redis`);
    }
    await client.connect(); 
    console.log(`redis connected successfully`);
} 
startRedis();


exports.signup = async(req,res) => {
    try{

        if(req.body.userType !== "CUSTOMER"){
            req.body.userStatus = "PENDING"
        }

    const userObj = {
     userId : req.body.userId,
     name : req.body.name,
     email : req.body.email,
     password : bcrypt.hashSync(req.body.password,6),
     userType : req.body.userType,
     userStatus : req.body.userStatus
    }
     
    const userCreated = await User.create(userObj);     

    let response = mapData(userCreated); 

    arr.push(response);

    await client.hSet(key,field,JSON.stringify(arr));
    console.log(`added new user to redis`);

    let msg = `A new user Signedup`;
    startKafka(msg,response);
      
    res.status(201).send(response);  

    }catch(err){
        res.status(500).send(`error while signup ${err}`);
    }

}


exports.signin = async(req,res) => {
    try{

    const user = await User.findOne({email : req.body.email});
    if(user === null){
        return res.status(400).send(`user is not registered`);
    }
    const validPass = bcrypt.compareSync(req.body.password,user.password);

    if(!validPass){
        return res.status(400).send(`password is incorrect`);
    }

    if(user.userStatus == "PENDING"){
        return res.status(400).send(`You're not approved yet, please wait sometime`);
    }

    const token = jwt.sign({ 
        id : user.email
    },process.env.secret,{
        expiresIn : 600
    });

    const response = {
        mongoId : user.id,
        userId : user.userId,
        name : user.name,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus,
        createdAt : user.createdAt,
        updatedAt : user.updatedAt,
        accessToken : token
    }

    let msg = `A new user Signedin`;
    startKafka(msg,response);

    res.status(200).send(response);
}catch(err){ 
    res.status(500).send(`error while signin ${err}`);
}

}

exports.findData = async(req,res) => {
    try{

        let nameQ = req.query.name;
        let statusQ = req.query.userStatus;
        let typeQ = req.query.userType;

        let user;
        
         const getRedisData = await client.hGet(key,field);
       
        if(nameQ){
            user = await User.find({name : nameQ})
        } 
        else if(statusQ){
            user = await User.find({userStatus : statusQ})
            // console.log(userStatus,statusQ); 
        }
        else if(typeQ){
            user = await User.find({userType : typeQ}) 
        }
         
       else if(getRedisData){
            user = JSON.parse(getRedisData);
            console.log(`got data from redis`);
          }

      else{ 
        user = await User.find();
       
      }

      let response = user.map((data) => {
        return{
        mongoId : data.id,
        userId : data.userId, 
        name : data.name, 
        email : data.email,
        userType : data.userType,
        userStatus : data.userStatus,
        createdAt : data.createdAt,
        updatedAt : data.updatedAt
        }})
         
        //  arr.push(await client.hSet(key,field,JSON.stringify(response)));
        //  console.log(`set cache`);

       let msg = `find call is responded with`;
       startKafka(msg,response);

        res.status(200).send(response);  

    }catch(err){  
   res.status(500).send(`error in finding data ${err}`);
    }
} 

exports.findWithId = async(req,res) => {
    try{
   const user = await User.findOne({userId : req.params.userId}); 

   let response = mapData(user);

   let msg = `find with id is responded with`;
   startKafka(msg,response);
   
   res.status(200).send(response);

    }catch(err){
        res.status(500).send(`error while findWithId ${err}`);
    }
}

exports.updateData = async(req,res) => { 
    try{
        const user = await User.findOne({userId : req.params.userId});

        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email ? req.body.email : user.email;
        user.password = req.body.password ? bcrypt.hashSync(req.body.password) : user.password;
        user.userType = req.body.userType ? req.body.userType : user.userType;
        user.userStatus = req.body.userStatus ? req.body.userStatus : user.userStatus;

        await user.save();
       
        let response = mapData(user);

        let msg = `User updated info`;
        startKafka(msg,response);
    
        res.status(201).send(response);

    }catch(err){
   res.status(500).send(`error while updating data ${err}`);
    }   
}

exports.deleteData = async(req,res) => {
    try{

     await User.deleteOne({userId : req.params.userId});

     let msg = `user deleted his account`;
     startKafka(msg,req.params.userId);

    res.status(200).send(`user deleted successfully ${req.params.userId}`);

    }catch(err){
        res.status(500).send(`error while deleting data ${err}`);  
    } 
   
}