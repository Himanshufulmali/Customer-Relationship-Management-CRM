const {Kafka} = require("kafkajs");

const brokers = ["localhost:9092"];
const clientId = "Himanshu12";
const topic = "my-collection";

const kafka = new Kafka({brokers,clientId});
const consumer = kafka.consumer({groupId:clientId});

const startKafka = async() => {
    await consumer.connect();
    await consumer.subscribe({topic});
    await consumer.run({
        eachMessage : ({message}) => {
            console.log(`${message.value}`);
        }
    })
}
startKafka()