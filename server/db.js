const mongoose = require("mongoose");
const {
  MONGODB_URI,
  MONGO_MAX_POOL_SIZE,
  MONGO_SOCKET_TIMEOUT_MS,
} = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: parseInt(MONGO_MAX_POOL_SIZE),
      socketTimeoutMS: parseInt(MONGO_SOCKET_TIMEOUT_MS),
      retryWrites: true,
      writeConcern: {
        w: "majority",
        j: true,
        wtimeout: 1000,
      },
    });

    console.log("MongoDB connected successfully");

    // Connection events for better error handling
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from DB");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
