import express from "express";
import MatchesController from "../controllers/MatchesController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, MatchesController.createMatch);
router.get("/", protect, MatchesController.getAllMatches);
router.get("/:id", protect, MatchesController.getMatch);
router.put("/:id", protect, MatchesController.updateMatch);
router.delete("/:id", protect, MatchesController.deleteMatch);
router.get("/club/:clubId", protect, MatchesController.getClubMatches);
router.get("/player/:playerId", protect, MatchesController.getPlayerMatches);

export default router;
