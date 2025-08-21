import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import {
    loginUserController,
    logoutUserController,
    meController,
    registerUserController,
} from "../controller/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", wrapAsync(registerUserController));
router.post("/login", wrapAsync(loginUserController));
router.post("/logout", requireAuth, wrapAsync(logoutUserController));
router.get("/me", requireAuth, wrapAsync(meController));

export default router;
