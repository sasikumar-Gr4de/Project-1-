import express from "express";
import { User } from "../models/User.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All routes require admin privileges
router.use(protect);
router.use(authorize("admin"));

// User management
router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, is_active } = req.query;

    const filters = {
      role,
      search,
      is_active: is_active !== undefined ? is_active === "true" : undefined,
    };

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await User.findAll(filters, pagination);

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

router.get("/users/stats", async (req, res) => {
  try {
    const stats = await User.getUsersStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

router.patch("/users/:id/deactivate", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.deactivateUser(id);

    res.json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Deactivate user error:", error);
    res.status(500).json({
      success: false,
      message: "Error deactivating user",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

router.patch("/users/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.activateUser(id);

    res.json({
      success: true,
      message: "User activated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Activate user error:", error);
    res.status(500).json({
      success: false,
      message: "Error activating user",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// System health check
router.get("/health", async (req, res) => {
  try {
    const health = {
      database: "healthy", // You would check database connection
      storage: "healthy", // You would check S3 connection
      api: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.APP_VERSION || "1.0.0",
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      success: false,
      message: "Error performing health check",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

export default router;
