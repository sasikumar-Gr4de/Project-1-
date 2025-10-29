import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(express.json({ limit: process.env.MAX_FILE_SIZE }));
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.MAX_FILE_SIZE,
  })
);

app.get("/api", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add at the top of your main server file (app.js or index.js)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:");
  console.error("Reason:", reason);
  console.error("Promise:", promise);
  // Don't exit the process, just log the error
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Don't exit the process for uncaught exceptions in development
});
