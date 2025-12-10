import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { config } from "./config/config.js";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import { connectDB } from "./config/mongoose.js";
// Connect to MongoDB
connectDB();
const app = express();
app.use(cors({
  origin: Array.isArray(config.cors.origin) ? config.cors.origin : [config.cors.origin],
  credentials: config.cors.credentials,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// File upload setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadFolder = path.join(__dirname, "..", config.uploads.folder);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });
// GraphQL schema and server setup
const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
const server = new ApolloServer({
  schema,
  introspection: true,
});
async function startServer() {
  await server.start();
  
  app.use("/graphql", cors({
    origin: Array.isArray(config.cors.origin) ? config.cors.origin : [config.cors.origin, "https://studio.apollographql.com"],
    credentials: config.cors.credentials,
  }), expressMiddleware(server, {
    context: async ({ req, res }) => {
      // Authentication context
      const token = req.cookies?.token || 
                   req.headers.authorization?.split(' ')[1];
      
      let user = null;
      
      if (token) {
        try {
          // Verify JWT token
          const jwt = await import('jsonwebtoken');
          const decoded = jwt.verify(token, config.jwt.secret);
          user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
          };
        } catch (error) {
          console.error("Token verification failed:", error.message);
        }
      }
      
      return { user, req, res };
    },
  }));
  
  // File upload endpoint
  app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Return relative path for client
    const filePath = `/uploads/issues/${path.basename(req.file.path)}`;
    
    res.status(200).json({ 
      message: "File uploaded successfully", 
      filePath: filePath,
      filename: req.file.filename
    });
  });
  
  // Serve uploaded files
  app.use('/uploads', express.static(uploadFolder));
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'Engagement Service',
      timestamp: new Date().toISOString(),
      uploadsFolder: config.uploads.folder
    });
  });
  
  // Start the server
  const PORT = config.server.port;
  app.listen(PORT, () => {
    console.log(`🚀 Engagement Service running on port ${PORT}`);
    console.log(`📡 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`📁 Uploads folder: ${uploadFolder}`);
  });
}

startServer().catch(console.error);
