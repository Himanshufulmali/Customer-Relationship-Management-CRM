const Notification = require("../models/notification-model");


exports.createNotification = async(req,res) => {
    try{
       const notificationObj = {
           
        subject : req.body.subject,
        recepientEmail : req.body.recepientEmail,
        content : req.body.content,
        requester : req.body.requester,
        status : req.body.status

        }

        const createdNotification = await Notification.create(notificationObj);

        res.status(201).send({
            message : `Your request is acquired, here is your tracking id`,
            _id : createdNotification.id
        })

    }catch(err){
        res.status(500).send(`error happened in notification creation ${err}`)
    }
}

exports.getNotifications = async(req,res) => {
    try{
        const notifications = await Notification.find();

        res.status(200).send(notifications);

    }catch(err){
        res.status(500).send(`error happened in getting notification ${err}`)
    }
} 