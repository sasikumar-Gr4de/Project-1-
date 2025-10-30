import express from "express";
import {
  createData,
  changeDataStatus,
  getDataByPlayerId,
} from "../controllers/dataController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createDataSchema,
  changeDataStatusSchema,
} from "../middleware/validation.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getDataByPlayerId);

// Protected routes
router.post("/", validate(createDataSchema), createData);
router.post("/:dataId", validate(changeDataStatusSchema), changeDataStatus);

export default router;
