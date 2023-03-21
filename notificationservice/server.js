const express = require("express");

const {PORT} = require("./configs/server-config");

const app = express();


app.use(express.json({urlencoded : {extended : true}}));




const notificationServer = async(err) => {
    if(err){
        console.log(`error happened while notification server ${err}`);
    }
    await app.listen(PORT);
    console.log(`notification serverconnected success on port : ${PORT}`);
}
notificationServer();