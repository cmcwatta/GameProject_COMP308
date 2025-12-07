import mongoose from "mongoose";
import { config } from "./config.js";

const MONGO_URI = config.database.uri;

export const connectDB = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🟢 MongoDB Connected:", MONGO_URI);
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000); // Retry logic
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔻 MongoDB disconnected on app termination");
  process.exit(0);
});