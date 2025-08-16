import express from "express";
import { loginUserController, logoutUserController, meController, registerUserController } from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middlware.js";
const router = express.Router();

router.post("/register", (registerUserController));
router.post("/login", (loginUserController));
router.post("/logout", authMiddleware, logoutUserController);
router.get("/me", authMiddleware, meController);

export default router;

