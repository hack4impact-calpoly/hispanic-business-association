import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hba_dev";
let connection: typeof mongoose | null = null;

const connectDB = async () => {
  try {
    if (connection) {
      return connection;
    }

    if (!process.env.MONGO_URI) {
      if (process.env.NODE_ENV === "development") {
        connection = mongoose;
        return connection;
      }
    }

    const opts = {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    connection = await mongoose.connect(MONGO_URI, opts);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    return connection;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error connecting to MongoDB:", error);
    }

    if (process.env.NODE_ENV === "development") {
      connection = mongoose;
      return connection;
    }

    throw error;
  }
};

export default connectDB;
