import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { authMiddleware } from "../middlewares/auth.middlware.js";
import {
    createShortUrl,
    updateLinkStatusController,
    softDeleteLinkController,
    hardDeleteLinkController,
} from "../controller/shortUrl.controller.js";

const router = express.Router();

router.post("/", wrapAsync(createShortUrl));
router.patch("/:id/status", authMiddleware, wrapAsync(updateLinkStatusController));
router.delete("/:id", authMiddleware, wrapAsync(softDeleteLinkController));
router.delete("/:id/permanent", authMiddleware, wrapAsync(hardDeleteLinkController));

export default router;
