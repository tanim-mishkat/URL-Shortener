import express from "express";
import { authMiddleware } from "../middlewares/auth.middlware.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { timeseriesController, breakdownController } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/:linkId/timeseries", authMiddleware, wrapAsync(timeseriesController));
router.get("/:linkId/breakdown", authMiddleware, wrapAsync(breakdownController));

export default router;
