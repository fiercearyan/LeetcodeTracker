import mongoose from "mongoose";
import { env } from "@/lib/env";

/**
 * Cached Mongoose connection.
 * In serverless environments (Vercel) modules can be re-evaluated on every
 * invocation, so we cache the connection on the global object to avoid
 * exhausting the MongoDB connection pool.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null
};

if (!global._mongooseCache) {
  global._mongooseCache = cache;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
