const express = require("express");
const { PORT } = require("./configs/server-config");
const mongoose = require('mongoose');
const User = require("./models/user-model");
const bcrypt = require('bcryptjs');


const app = express();
app.use(express.json({urlencoded : {extended : true}}));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.mongo);
const db = mongoose.connection; 
 
db.on('error', (err) => {
    console.log(`error while connecting db ${err}`);
});

db.once('open', () => {
    console.log(`connected to mongodb successfully`);
    init();
})


const init = async() =>{
    try{
    const user = await User.findOne({userId : "admin"});
    
    if(user){
   console.log(`Admin is already present`);
   console.log(user);
}
else{ 
    const user = await User.create({
    userId : "admin",    
    name : "Himanshu", 
    email : "str.piyush@gmail.com",   
    password : bcrypt.hashSync(process.env.password),
    userType : "ADMIN"
  });
  console.log(`Admin has been created ${user}`); 
}   
    }catch(err){
        console.log(`error while init()`);  
    }
} 

const mongodata = () => { 
 
 } 
 mongodata();   

require("./routes/user-route")(app);
require("./routes/ticket-route")(app);

 
const start = async(err) => {
    if(err){ 
        console.log(`error while connecting server ${err}`);
    }
    await app.listen(PORT);
    console.log(`server connected successfully on PORT ${PORT}`);
}

start();