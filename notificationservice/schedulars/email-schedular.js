const cron = require("node-cron");
const Notification = require("../models/notification-model");
const { transporter } = require("../notifier/email-server");

cron.schedule(" */5 * * * * * ", async() => {

    const notification = await Notification.find({status : "UN-SENT"});


    if(notification){

        notification.map((n) => {
            const mail = {
            from : "CRM",
            to : n.recepientEmail, 
            subject : n.subject,
            text : n.content
            }

            console.log("total notifications are",notification.length);

            transporter.sendMail(mail,async(err,info) => {
                if(err){
                    console.log(`error while sending mail ${err}`);
                }
                // console.log("total notifications are",notification.length);

                console.log("email sent successfully", info);
                n.status = "SENT"
                await n.save();
            })

        })

    }
 
})
