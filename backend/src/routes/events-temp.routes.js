import express from "express";
import EventsTempController from "../controllers/EventsTempController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, EventsTempController.createEvent);
router.post("/bulk", protect, EventsTempController.createBulkEvents);
router.get("/", protect, EventsTempController.getAllEvents);
router.get("/:id", protect, EventsTempController.getEvent);
router.put("/:id", protect, EventsTempController.updateEvent);
router.delete("/:id", protect, EventsTempController.deleteEvent);
router.get("/match/:matchId", protect, EventsTempController.getEventsByMatch);
router.get(
  "/player/:playerId",
  protect,
  EventsTempController.getEventsByPlayer
);
router.get(
  "/match/:matchId/player/:playerId",
  protect,
  EventsTempController.getEventsByMatchAndPlayer
);
router.delete(
  "/match/:matchId",
  protect,
  EventsTempController.deleteEventsByMatch
);

export default router;
