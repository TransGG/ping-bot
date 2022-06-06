import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env["mongoConnectionString"] ?? console.log("You need to provide mongoConnectionString=") ?? process.exit(1));
const database = mongoClient.db("ping-bot");

console.log(`[Ping bot:mongo] Connecting to database`);
await mongoClient.connect();
console.log(`[Ping bot:mongo] Database connection complete`);

export interface replyPingUser {
  alwaysPing: boolean;
  usePluralkit: boolean;
}

export { mongoClient, database };
