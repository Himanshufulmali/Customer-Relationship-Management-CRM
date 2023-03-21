

exports.notificationCreateMw = async(req,res,next) => {
    try{

        if(!req.body.subject){
            return res.status(400).send(`subject is not provided`);
        }
        if(!req.body.recepientEmail){
            return res.status(400).send(`recepientEmail is not provided`);
        }
        if(!req.body.content){
            return res.status(400).send(`content is not provided`);
        }
        
       next();

    }catch(err){
        res.status(500).send(`error happened in notification create mw`)
    }
}