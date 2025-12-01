import express from "express";
import {
  createData,
  changeDataStatus,
  getDataByPlayerId,
  getAnalysisCallback,
  updateQueueData,
} from "../controllers/dataController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createDataSchema,
  changeDataStatusSchema,
} from "../middleware/validation.js";

const router = express.Router();

// ML Server Integration Routes
router.post("/ml/callbacks", getAnalysisCallback);
router.post("/ml/queue/update", updateQueueData);

// Player Data Routes
router.use(authenticateToken);
router.get("/", getDataByPlayerId);
router.post("/", validate(createDataSchema), createData);
router.post("/:dataId", validate(changeDataStatusSchema), changeDataStatus);

export default router;
