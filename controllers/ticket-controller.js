const Ticket = require('../models/ticket-model');
const User = require('../models/user-model');



exports.createTicket = async(req,res) => {

    try{

        const ticketObj = {
            title : req.body.title,
            ticketPriority : req.body.ticketPriority,
            description : req.body.description,
            status : req.body.status,
            reporter : req.email   /// it'll be obtain from where we decoded the jwt token
    
        }
    
        const engineer = await User.findOne({
            userType : "ENGINEER",
            userStatus : "APPROVED"
        });
    
         if(engineer){
         ticketObj.assignee = engineer.userId; 
         }
    
         const ticketCreated = await Ticket.create(ticketObj);


         if(ticketCreated){
            const customer = await User.findOne({email : req.email})

            customer.ticketsCreated.push(ticketCreated._id);
            await customer.save();

            if(engineer){ 
                engineer.ticketsAssigned.push(ticketCreated._id);
                await engineer.save();
            }
            res.status(201).send(ticketCreated);
         }


    }catch(err){
        res.status(500).send(`error happened in createTicket ${err}`);
        console.log(`error happened in createTicket ${err}`);
    }
   
}

exports.getAllTickets = async(req,res) => {
    try{

        const user = await User.findOne({email : req.email});
        const queryObj = {};
        const reporter = user.ticketsCreated;
        const assignee = user.ticketsAssigned;

        if(user.userType == "CUSTOMER"){
            
            if(!reporter){
                return res.status(200).send(`no tickets are created by user`);
            }
            
            queryObj['_id'] = { $in : reporter };

        }
       else if(user.userType == "ENGINEER"){
            queryObj['$or'] = [{"_id" : {$in : reporter}}, {"_id" : {$in : assignee}}];  

        }
         
       const getTickets = await User.find(queryObj);

       res.status(200).send(getTickets);

    }catch(err){
        res.status(500).send(`error in getAllTickets ${err}`);
        console.log(`error in getAllTickets ${err}`);
    }
}


exports.updateTicket = async(req,res) => {
    try{
        const ticket = await Ticket.findOne({_id : req.params.id});

        ticket.title = req.body.title ? req.body.title : ticket.title;
        ticket.description = req.body.description ? req.body.description : ticket.description;
        ticket.status = req.body.status ? req.body.status : ticket.status;
        ticket.ticketPriority = req.body.ticketPriority ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.assignee = req.body.assignee ? req.body.assignee : ticket.assignee;
        
        await ticket.save();

        res.status(201).send(ticket);

    }catch(err){
        res.status(500).send(`error happened in updateTicket ${err}`);
    }
}