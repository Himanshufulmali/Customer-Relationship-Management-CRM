const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRoute = require('../routes/user-route');
const {Kafka} = require("kafkajs");


const redis = require('redis');
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

const brokers = ["localhost:9092"];
const clientId = "Himanshu12";
const topic = "my-collection";

const kafka = new Kafka({brokers,clientId});
const producer = kafka.producer();
 
exports.signup = async(req,res) => {
    try{

        if(req.body.userType !== "CUSTOMER"){
            req.body.userStatus = "PENDING"
        }

    const userObj = {
     name : req.body.name,
     email : req.body.email,
     password : bcrypt.hashSync(req.body.password,6),
     userType : req.body.userType,
     userStatus : req.body.userStatus
    }
     
    const userCreated = await User.create(userObj);     

    let response = {
        mongoId : userCreated.id, 
        userId : userCreated.userId,
        name : userCreated.name,
        email : userCreated.email, 
        userType : userCreated.userType,
        userStatus : userCreated.userStatus,
        createdAt : userCreated.createdAt,
        updatedAt : userCreated.updatedAt
    }

    arr.push(response);
    await client.hSet(key,field,JSON.stringify(arr));
    console.log(`added new user to redis`);
     
    const startKafka = async() => {

  await producer.connect();
   
  await producer.send({
    topic,
    messages : [{
        value : `new user signed up
        ${JSON.stringify(response)}`
    }]
 
})

    } 
    startKafka();
    
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

    res.status(200).send(response);
}catch(err){ 
    res.status(500).send(`error while signin ${err}`);
}

}

exports.findData = async(req,res) => {
    try{

        let nameQ = req.query.name;
        let user;
        
        const getRedisData = await client.hGet(key,field);
        
        if(getRedisData){
          user = JSON.parse(getRedisData);
          console.log(`got data from redis`);
        }

        else if(nameQ){
            user = await User.find({name : nameQ})
        }

      else{ 
        user = await User.find();

    //    arr.push(user);
    //    await client.hSet(key,field,JSON.stringify(arr));
    //    console.log(`set cache`);
      }
    
        res.status(200).send(user.map((data) => {
        return{
        mongoId : data.id,
        userId : data.userId, 
        name : data.name, 
        email : data.email,
        userType : data.userType,
        userStatus : data.userStatus,
        createdAt : data.createdAt,
        updatedAt : data.updatedAt

        }})); 

    }catch(err){
   res.status(500).send(`error in finding data ${err}`);
    }
}

exports.findWithId = async(req,res) => {
    try{
   const user = await User.findOne({userId : req.params.userId});
   
   res.status(200).send({
   
    mongoId : user.id,
    userId : user.userId,
    name : user.name,
    email : user.email,
    userType : user.userType,
    userStatus : user.userStatus,
    createdAt : user.createdAt,
    updatedAt : user.updatedAt

   })

    }catch(err){
        res.status(500).send(`error while findWithId ${err}`);
    }
}

exports.updateData = async(req,res) => {
    try{
        const user = await User.findOne({userId : req.params.userId});

        req.name = req.body.name ? req.body.name : user.name;
        req.email = req.body.email ? req.body.email : userRoute.email;
        req.password = req.body.password ? bcrypt.hashSync(req.body.password) : user.password;
       
        await user.save();
       
    
        res.status(201).send({
             mongoId : user.id,
             userId : user.userId,
             name : user.name,
             email : user.email,
             userType : user.userType,
             userStatus : user.userStatus,
             createdAt : user.createdAt,
             updatedAt : user.updatedAt
    
            });

    }catch(err){
   res.status(500).send(`error while updating data ${err}`);
    }   
}

exports.deleteData = async(req,res) => {
    try{

    await User.deleteOne({userId : req.params.userId});
    
    res.status(200).send(`user deleted successfully`);

    }catch(err){
        res.status(500).send(`error while deleting data ${err}`);  
    }
   
}