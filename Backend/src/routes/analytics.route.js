import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { timeseriesController, breakdownController } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/:linkId/timeseries", wrapAsync(timeseriesController));
router.get("/:linkId/breakdown", wrapAsync(breakdownController));

export default router;
