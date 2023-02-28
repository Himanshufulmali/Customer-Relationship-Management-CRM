const {Kafka} = require("kafkajs");

const brokers = ["localhost:9092"];
const clientId = "Himanshu12";
const topic = "my-collection";

const kafka = new Kafka({brokers,clientId});
const producer = kafka.producer();

exports.startKafka = async(msg,response) => {

    await producer.connect();
     
    await producer.send({
      topic,
      messages : [{
          value : `${msg} : ${JSON.stringify(response)}`
      }]
   
  })
  } 