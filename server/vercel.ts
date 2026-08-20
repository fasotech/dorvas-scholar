
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { appRouter } from "./routers";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cookieParser());

let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set!");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

const JWT_SECRET = process.env.JWT_SECRET || "default_unsafe_secret";

app.use(
  "/api/trpc",
  async (req, res, next) => {
    await connectDB();
    next();
  },
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      let user = null;
      const authHeader = req.headers.authorization;
      const token = (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null) || req.cookies?.auth_token;
      if (token) {
        try {
          user = jwt.verify(token, JWT_SECRET) as any;
        } catch (e) {}
      }
      return { req, res, user };
    },
  })
);

export default app;

