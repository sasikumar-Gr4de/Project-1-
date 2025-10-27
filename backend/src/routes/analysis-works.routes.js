import express from "express";
import AnalysisWorksController from "../controllers/AnalysisWorksController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, AnalysisWorksController.createAnalysisWork);
router.get("/", protect, AnalysisWorksController.getAllAnalysisWorks);
router.get("/:id", protect, AnalysisWorksController.getAnalysisWork);
router.put("/:id", protect, AnalysisWorksController.updateAnalysisWork);
router.delete("/:id", protect, AnalysisWorksController.deleteAnalysisWork);
router.get(
  "/match/:matchId",
  protect,
  AnalysisWorksController.getAnalysisWorkByMatch
);
router.get(
  "/user/:userId",
  protect,
  AnalysisWorksController.getAnalysisWorksByUser
);
router.patch(
  "/:id/status",
  protect,
  AnalysisWorksController.updateAnalysisWorkStatus
);
router.patch(
  "/:id/progress",
  protect,
  AnalysisWorksController.updateAnalysisWorkProgress
);

export default router;
