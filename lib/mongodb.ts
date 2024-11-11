import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Use the same URI as in your Mongoose connection
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve connection in dev mode
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient and connect once
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
