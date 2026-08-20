import mongoose from "mongoose";

let nextRetryAt = 0;
let lastConnectionError: string | null = null;

export async function getMongoConnection() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (Date.now() < nextRetryAt) return null;

  const uri = process.env.MONGODB_URI;
  if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
    lastConnectionError = "MONGODB_URI is missing or is not a MongoDB connection URI.";
    return null;
  }

  try {
    await mongoose.connect(uri, {
      connectTimeoutMS: 8_000,
      serverSelectionTimeoutMS: 8_000,
      maxPoolSize: 10,
    });
    lastConnectionError = null;
    return mongoose.connection;
  } catch (error) {
    lastConnectionError = error instanceof Error ? error.message : "MongoDB connection failed.";
    nextRetryAt = Date.now() + 30_000;
    await mongoose.disconnect().catch(() => undefined);
    return null;
  }
}

export function getMongoConnectionIssue() {
  return lastConnectionError;
}
