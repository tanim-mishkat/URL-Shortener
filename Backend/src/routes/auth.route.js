import express from "express";
import { loginUserController, meController, registerUserController } from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middlware.js";
const router = express.Router();

router.post("/register", (registerUserController));
router.post("/login", (loginUserController));
router.get("/me", authMiddleware, meController);

export default router;

