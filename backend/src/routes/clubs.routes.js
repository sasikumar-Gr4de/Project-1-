import express from "express";
import ClubsController from "../controllers/ClubsController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, ClubsController.createClub);
router.get("/", protect, ClubsController.getAllClubs);
router.get("/:id", protect, ClubsController.getClub);
router.put("/:id", protect, ClubsController.updateClub);
router.delete("/:id", protect, ClubsController.deleteClub);
router.get("/:id/players", protect, ClubsController.getClubPlayers);

export default router;
