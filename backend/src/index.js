import express from "express";
import cors from "cors";
import chalk from "chalk";
import serverless from "serverless-http";
import { testSupabaseConnection } from "./config/supabase.js";

// Import routes
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;
const log = console.log;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request logging middleware
app.use((req, res, next) => {
  log(chalk.green(`${new Date().toISOString()} - ${req.method} ${req.path}`));
  next();
});

// Routes
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const dbStatus = await testSupabaseConnection();

  res.json({
    success: true,
    message: "Gr4de Platform API is running",
    data: {
      service: "Gr4de Football Analytics API",
      version: process.env.APP_VERSION || "1.0.0",
      environment: process.env.NODE_ENV,
      database: dbStatus ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Gr4de Football Analytics Platform API",
    endpoints: {
      auth: "/api/auth",
      players: "/api/players",
      matches: "/api/matches",
      clubs: "/api/clubs",
      tournaments: "/api/tournaments",
      analytics: "/api/analytics",
      upload: "/api/upload",
      admin: "/api/admin",
    },
    documentation: "https://docs.gr4de.com/api",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }
  if (err.code === 23505) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// --- LOCAL SERVER ---
if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => {
    log(
      chalk.blueBright(
        `Gr4de Football Analytics Platform API is running on port ${PORT}`
      )
    );
  });
}

// --- VERCEL SERVERLESS EXPORT ---
export default serverless(app);
