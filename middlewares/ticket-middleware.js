const User = require('../models/user-model');
const Ticket = require('../models/ticket-model');


exports.ticketUpdateValidation = async(req,res,next) => {
    try{

        const user = await User.findOne({email : req.email});
        const ticket = await Ticket.findOne({_id : req.params._id});

        if(user.userType == "CUSTOMER"){
        const reporter = ticket.reporter;
        
        if(user.userId !== reporter){
         return res.status(403).send(`You cant update as you're not reporter,engineer or admin`);
        }

         next();

        }

        else if(user.userType == "ENGINEER"){

        const assignee = ticket.assignee;
        const reporter = ticket.reporter;

        if(user.userId !== reporter && user.userId !== assignee){
         return res.status(403).send(`You cant update as you're not reporter,engineer or admin`);
        }
        
        }

        if(req.body.assignee !== undefined && user.userType !== "ADMIN"){
         return res.status(403).send(`You cant update as you're not the admin`);
        }
         
        if(req.body.assignee !== undefined){

        const newEngineer = await User.findOne({userId : req.body.assignee});
        
        if(newEngineer == null){
            return res.status(403).send(`userId passed is wrong`);
        }

    }
        next();

    }catch(err){
     res.status(500).send(`error in ticketUpdateValidation ${err}`);
    }
}