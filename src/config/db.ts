import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();


const uri = process.env.MONGO_DB_URI as string;


export const client =
new MongoClient(uri);


export const db =
client.db(
  process.env.DB_NAME
);