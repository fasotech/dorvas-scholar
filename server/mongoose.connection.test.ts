import mongoose from "mongoose";
import { afterAll, describe, expect, it } from "vitest";

describe("MongoDB Atlas configuration", () => {
  const mongoUri = process.env.MONGODB_URI;

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("connects with the configured URI and responds to a ping", async () => {
    expect(mongoUri).toMatch(/^mongodb(\+srv)?:\/\//);

    await mongoose.connect(mongoUri!, {
      serverSelectionTimeoutMS: 8_000,
      connectTimeoutMS: 8_000,
    });

    const result = await mongoose.connection.db?.admin().ping();
    expect(result).toMatchObject({ ok: 1 });
  }, 15_000);
});
