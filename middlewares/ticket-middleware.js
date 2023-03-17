const User = require('../models/user-model');
const Ticket = require('../models/ticket-model');


exports.ticketUpdateValidation = async(req,res,next) => {
    try{

        const user = await User.findOne({email : req.email});
        const ticket = await Ticket.findOne({_id : req.params.id});

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

        /**
         * we're checking for admin to assign new engineer
         * otherwise request should not process
         */


        if(req.body.assignee && user.userType !== "ADMIN"){
         return res.status(401).send(`Only Admin is allowed to reassign ticket`);
        }
         
        
        const newEngineer = await User.findOne({userId : req.body.assignee});
        
        if(newEngineer == null){
            return res.status(401).send(`Engineer userId passed is wrong`);
        }

        next();

    }catch(err){
     res.status(500).send(`error in ticketUpdateValidation ${err}`);
    }
}