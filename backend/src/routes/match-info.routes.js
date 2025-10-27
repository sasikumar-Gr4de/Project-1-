import express from "express";
import MatchInfoController from "../controllers/MatchInfoController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, MatchInfoController.createMatchInfo);
router.get("/", protect, MatchInfoController.getAllMatchInfo);
router.get("/:id", protect, MatchInfoController.getMatchInfo);
router.put("/:id", protect, MatchInfoController.updateMatchInfo);
router.delete("/:id", protect, MatchInfoController.deleteMatchInfo);
router.get("/match/:matchId", protect, MatchInfoController.getMatchInfoByMatch);
router.get("/club/:clubId", protect, MatchInfoController.getMatchInfoByClub);
router.get(
  "/player/:playerId",
  protect,
  MatchInfoController.getMatchInfoByPlayer
);
router.get(
  "/match/:matchId/lineup",
  protect,
  MatchInfoController.getMatchLineup
);
router.patch("/:id/end-time", protect, MatchInfoController.updatePlayerEndTime);

export default router;
