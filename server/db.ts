import mongoose from "mongoose";
import { getMongoConnection } from "./mongo";
import { ENV } from "./_core/env";

export interface InsertUser {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn?: Date;
  role?: string | null;
}

// Define the User schema for Mongoose
const userSchema = new mongoose.Schema({
  openId: { type: String, required: true, unique: true },
  name: { type: String, default: null },
  email: { type: String, default: null },
  loginMethod: { type: String, default: null },
  lastSignedIn: { type: Date, default: Date.now },
  role: { type: String, default: null },
});

// Avoid OverwriteModelError in hot reloads
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const conn = await getMongoConnection();
  if (!conn) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const updateSet: Record<string, unknown> = {};

    if (user.name !== undefined) updateSet.name = user.name ?? null;
    if (user.email !== undefined) updateSet.email = user.email ?? null;
    if (user.loginMethod !== undefined) updateSet.loginMethod = user.loginMethod ?? null;
    if (user.lastSignedIn !== undefined) updateSet.lastSignedIn = user.lastSignedIn;
    
    if (user.role !== undefined) {
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      updateSet.role = 'admin';
    }

    if (!updateSet.lastSignedIn) {
      updateSet.lastSignedIn = new Date();
    }

    await UserModel.findOneAndUpdate(
      { openId: user.openId },
      { $set: updateSet },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const conn = await getMongoConnection();
  if (!conn) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const user = await UserModel.findOne({ openId }).lean();
  return user || undefined;
}
