import { cookieOptions } from "../config/config.js";
import { loginUserService, registerUserService } from "../services/auth.service.js";
import { wrapAsync } from "../utils/wrapAsync.js";

export const registerUserController = wrapAsync(async (req, res) => {
    const { name, email, password } = req.body;
    const { token, user } = await registerUserService(name, email, password);
    req.user = user;
    res.cookie("accessToken", token, cookieOptions);
    res.status(201).json({ message: "User registered successfully" });
});

export const loginUserController = wrapAsync(async (req, res) => {
    const { email, password } = req.body;
    const { token, user } = await loginUserService(email, password);
    req.user = user;
    console.log(user)
    res.cookie("accessToken", token, cookieOptions);
    console.log(token)
    res.status(200).json({ user: user, message: "User logged in successfully" });
});