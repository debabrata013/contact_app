// import mongoose
//  from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// export async function connect() {
//   try {
//     await mongoose.connect(process.env.mongo_url as string);
//     const db = mongoose.connection;
//     db.on("error", console.error.bind(console, "MongoDB connection error:"));
//     db.once("connected", () => {
//         console.log("MongoDB connected successfully");
//         });
//     db.once("disconnected", () => {
//         console.log("MongoDB disconnected");
//     });

  
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable inside .env.local");
}

let isConnected = false; // Track the connection status

export async function connect() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "contact-app", // optional, if not already specified in URI
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); // optional: stop the app if DB fails
  }
}
