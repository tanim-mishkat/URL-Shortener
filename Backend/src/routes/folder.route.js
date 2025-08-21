import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import {
    listFoldersController,
    createFolderController,
    renameFolderController,
    deleteFolderController,
} from "../controller/folder.controller.js";

const router = express.Router();

router.get("/", wrapAsync(listFoldersController));
router.post("/", wrapAsync(createFolderController));
router.patch("/:id", wrapAsync(renameFolderController));
router.delete("/:id", wrapAsync(deleteFolderController));

export default router;
