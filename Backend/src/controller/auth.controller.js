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
    res.cookie("accessToken", token, cookieOptions);
    res.status(200).json({ user: user, message: "User logged in successfully" });
});

export const logoutUserController = (req, res) => {
    // Clear the same cookie the login/register set
    res.clearCookie("accessToken", {
        ...cookieOptions,
        expires: new Date(0), 
        maxAge: 0,
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

export const meController = wrapAsync(async (req, res) => {
    res.status(200).json({ user: req.user });
})