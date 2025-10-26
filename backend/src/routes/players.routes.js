import express from "express";
import PlayersController from "../controllers/PlayersController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, PlayersController.createPlayer);
router.get("/", protect, PlayersController.getAllPlayers);
router.get("/:id", protect, PlayersController.getPlayer);
router.put("/:id", protect, PlayersController.updatePlayer);
router.delete("/:id", protect, PlayersController.deletePlayer);
router.get("/:id/club", protect, PlayersController.getPlayerClub);
router.get("/club/:clubId", protect, PlayersController.getPlayersByClubId);

export default router;
