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
  origin: [config.cors.origin, "https://studio.apollographql.com"],
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
    app.use("/graphql", expressMiddleware(server, {
      context: async ({ req, res }) => {
        // You can add authentication context here if needed
        return { req, res };
        },
    }));
}
await startServer();
// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ message: "File uploaded successfully", filePath: req.file.path });
}
);
// Start the server
const PORT = config.server.port || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Issue Management Service running on port ${PORT}`);
});


