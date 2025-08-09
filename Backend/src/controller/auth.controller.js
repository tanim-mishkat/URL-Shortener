import { cookieOptions } from "../config/config.js";
import { registerUserService } from "../services/auth.service.js";
import { wrapAsync } from "../utils/wrapAsync.js";

export const registerUserController = wrapAsync(async (req, res) => {
    const { name, email, password } = req.body;
    const token = await registerUserService(name, email, password);
    res.cookie("accessToken", token, cookieOptions);
    res.status(201).json({ message: "User registered successfully" });
});

export const loginUserController = wrapAsync(async (req, res) => {
    const { username, password } = req.body;
    res.json({ username, password });
});