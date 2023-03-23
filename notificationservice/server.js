const express = require("express");
const mongoose = require("mongoose");

const {PORT} = require("./configs/server-config");


const app = express();

app.use(express.json({urlencoded : {extended : true}}));

mongoose.set({strictQuery : false})
mongoose.connect(process.env.mongo);
const db = mongoose.connection;

db.on("error",(err) => {
    console.log(`error while connecting db ${err}`);
});

db.once("open",() => {
    console.log(`mongodb is connected`);
})


require("./routes/notification-route")(app);

require("./schedulars/email-schedular");


const notificationServer = async(err) => { 
    if(err){
        console.log(`error happened while notification server ${err}`);
    }
    await app.listen(PORT);
    console.log(`notification server connected on port : ${PORT}`);
}
notificationServer();