import mongoose
 from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connect() {
  try {
    await mongoose.connect(process.env.mongo_url as string);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.once("connected", () => {
        console.log("MongoDB connected successfully");
        });
    db.once("disconnected", () => {
        console.log("MongoDB disconnected");
    });

  
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
