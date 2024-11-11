import mongoose from "mongoose";

let isConnected = false; // Track connection status

async function dbConnect() {
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    isConnected = db.connections[0].readyState === 1; // Check connection state
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Database connection failed");
  }
}

export default dbConnect;
