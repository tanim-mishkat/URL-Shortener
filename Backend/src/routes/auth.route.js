import express from "express";
import { loginUserController, registerUserController } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", (registerUserController));
router.post("/login", (loginUserController));

export default router;

