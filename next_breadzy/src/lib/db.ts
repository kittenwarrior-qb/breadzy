import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "breadzy",
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

connectDB();