const mongoose = require("mongoose");

const Notification = new mongoose.Schema({
    subject : {
        type : String,
        required : true
    },
    recepientEmail : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    requestor : {
        type : String
    },
    status : {
        type : String,
        default : "UN-SENT",
        enum : ["SENT","UN-SENT"]
    }
},{
    timestamps : true,
    versionKey : false
});

module.exports = mongoose.model("notification",Notification);