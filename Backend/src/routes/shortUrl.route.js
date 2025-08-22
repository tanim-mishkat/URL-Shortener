import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import {
    createShortUrl,
    updateLinkStatusController,
    softDeleteLinkController,
    hardDeleteLinkController,
    updateLinkTagsController,
    moveLinkFolderController,
    listLinksController,
    batchLinksController,
    restoreLinkController,
} from "../controller/shortUrl.controller.js";

export const createRouter = express.Router();
createRouter.post("/", wrapAsync(createShortUrl));

export const linksRouter = express.Router();

linksRouter.get("/", wrapAsync(listLinksController));
linksRouter.post("/batch", wrapAsync(batchLinksController));
linksRouter.patch("/:id/restore", wrapAsync(restoreLinkController));
linksRouter.patch("/:id/status", wrapAsync(updateLinkStatusController));
linksRouter.delete("/:id", wrapAsync(softDeleteLinkController));
linksRouter.delete("/:id/permanent", wrapAsync(hardDeleteLinkController));
linksRouter.patch("/:id/tags", wrapAsync(updateLinkTagsController));
linksRouter.patch("/:id/folder", wrapAsync(moveLinkFolderController));