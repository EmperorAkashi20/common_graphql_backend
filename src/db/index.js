import mongoose from "mongoose";
import logger from "../winston/index.js";
// Load MongoDB URL from config

// Connection handling
mongoose.connection.on("connected", () => logger.info("Connected to MongoDB"));
mongoose.connection.on("error", (err) =>
  logger.error("MongoDB Connection Error: " + err)
);

// Disconnect on process exit
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    logger.info("MongoDB connection disconnected");
    process.exit(0);
  });
});

// Export mongoose instance
export default mongoose;
