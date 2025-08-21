import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { getAllUserUrls } from "../controller/user.controller.js";

const router = express.Router();

router.get("/urls", wrapAsync(getAllUserUrls));

export default router;
