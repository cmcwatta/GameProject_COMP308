// config/config.js
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

export const config = {
  // -------------------------
  // Server Configuration
  // -------------------------
  server: {
    port: process.env.engagement_service_port || 4004,
  },

  // -------------------------
  // MongoDB
  // -------------------------
  database: {
    uri:
      process.env.CIVIC_MONGO_URI ||
      "mongodb://localhost:27017/civic_engagement_service",
  },

  // -------------------------
  // CORS
  // -------------------------
  cors: {
    origin: process.env.CLIENT_URL?.split(',') || [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175'
    ],
    credentials: true,
  },

  // -------------------------
  // JWT Handling
  // -------------------------
  jwt: {
    secret: process.env.JWT_SECRET || "supersecretkey",
    expiresIn: "7d",
  },

  // -------------------------
  // File Uploading (Optional)
  // -------------------------
  uploads: {
    folder: process.env.UPLOADS_FOLDER || "uploads/issues",
  },

  // -------------------------
  // AI Config
  // -------------------------
  ai: {
    model: process.env.AI_MODEL || "gpt-4o-mini",
  }
};