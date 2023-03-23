const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : "str.piyush@gmail.com",
        pass : process.env.pass
    }
});