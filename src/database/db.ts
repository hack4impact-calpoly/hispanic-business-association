import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hba_dev";
let connection: typeof mongoose | null = null;
let isConnecting = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async () => {
  try {
    if (connection) {
      return connection;
    }

    if (connectionPromise) {
      return connectionPromise;
    }

    if (isConnecting) {
      while (isConnecting) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      if (connection) {
        return connection;
      }
    }

    isConnecting = true;

    if (!process.env.MONGO_URI) {
      if (process.env.NODE_ENV === "development") {
        console.warn("No MONGO_URI provided. Using mock connection in development mode.");
        connection = mongoose;
        return connection;
      }
    }

    const opts = {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
    };

    connectionPromise = mongoose.connect(MONGO_URI, opts);

    try {
      connection = await connectionPromise;

      mongoose.connection.on("error", (err) => {
        console.error(`MongoDB connection error: ${err.message}`);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected. Will try to reconnect on next request.");
        connection = null;
      });

      console.log("MongoDB connected successfully");
      return connection;
    } finally {
      connectionPromise = null;
      isConnecting = false;
    }
  } catch (error) {
    isConnecting = false;
    connectionPromise = null;

    if (process.env.NODE_ENV === "development") {
      console.error("Error connecting to MongoDB:", error);

      connection = mongoose;
      return connection;
    }

    throw error;
  }
};

export default connectDB;
