const mongoose = require("mongoose");
const autoId = require("mongoose-sequence")(mongoose);

const User = new mongoose.Schema({
   userId : {
     type : Number 
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

User.plugin(autoId,{inc_field : 'userId'})

module.exports = mongoose.model('user',User);  