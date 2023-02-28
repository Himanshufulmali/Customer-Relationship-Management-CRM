const mongoose = require("mongoose");

const User = new mongoose.Schema({
   userId : {
     type : String,
     required : true,
     unique : true
   },
    name : {
        type : String, 
        required : true, 
        minLength : 2
    },
    email : {
        type : String,
        required : true, 
        unique : true,
        
    },
    password : {
        type : String,
        required : true,
        minLength : 4
    },
    userType :{
        type : String,
        required : true,
        default : "CUSTOMER"
    },
    userStatus : {
        type : String,
        required : true,
        default : "APPROVED"
    }
 
},{
    timestamps : true
})


module.exports = mongoose.model('user',User);  