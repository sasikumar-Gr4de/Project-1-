import express from "express";
import PlayerController from "../controllers/PlayerController.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validatePlayerData,
  validatePlayerOwnership,
  parsePlayerFilters,
} from "../middleware/player.middleware.js";

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Player statistics and filter options (public for authenticated users)
router.get("/stats", PlayerController.getPlayerStats);
router.get("/filters", PlayerController.getFilterOptions);

// Player CRUD operations
router.post("/", validatePlayerData, PlayerController.createPlayer);

router.get("/", parsePlayerFilters, PlayerController.getAllPlayers);

router.get("/:id", PlayerController.getPlayer);

router.put(
  "/:id",
  validatePlayerOwnership,
  validatePlayerData,
  PlayerController.updatePlayer
);

router.delete("/:id", validatePlayerOwnership, PlayerController.deletePlayer);

// Bulk operations
router.post("/import", PlayerController.importPlayers);

export default router;
