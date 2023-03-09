const mongoose = require('mongoose');

const ticket = new mongoose.Schema({

    title : {
        type : String,
        required : true
    },
    tickePriority : {
    type : Number,
    required : true,
    default : 4
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : "OPEN",
        enum : ["OPEN","CLOSED","BLOCKED"]
    },
    reporter : {
        type : String,
        required : true
    },
    assignee : {
        type : String
    }
},{
    timestamps : true, 
    versionKey : false /// this will ensure that __v is not created by mongoose
})


module.exports = mongoose.model("ticket",ticket);