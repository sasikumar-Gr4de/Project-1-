import express from "express";
import cors from "cors";
import chalk from "chalk";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import fileManagerRoutes from "./routes/file-manger.routes.js";
import playerRoutes from "./routes/player.routes.js";

import { testSupabaseConnection } from "./config/supabase.config.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const log = console.log;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request logging
app.use((req, res, next) => {
  log(chalk.green(`${new Date().toISOString()} - ${req.method} ${req.path}`));
  next();
});

// Mount routes

app.use("/api/auth", authRoutes);
app.use("/api/file-manager", fileManagerRoutes);
app.use("/players", playerRoutes);

app.get("/api/health", async (req, res) => {
  try {
    const dbStatus = await testSupabaseConnection();

    res.status(200).json({
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error connecting to database",
      error: err.message,
    });
  }
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

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError")
    error = { message: "Resource not found", statusCode: 404 };
  if (err.code === 23505)
    error = { message: "Duplicate field value entered", statusCode: 400 };
  if (err.name === "ValidationError")
    error = {
      message: Object.values(err.errors)
        .map((val) => val.message)
        .join(", "),
      statusCode: 400,
    };

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  log(
    chalk.blueBright(
      `Gr4de Football Analytics Platform API is running on port ${PORT}`
    )
  );
});

export default app;
