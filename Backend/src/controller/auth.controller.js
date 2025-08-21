import { cookieOptions } from "../config/config.js";
import { loginUserService, registerUserService } from "../services/auth.service.js";

export const registerUserController = async (req, res) => {
    const { name, email, password } = req.body;
    const { token, newUser } = await registerUserService(name, email, password);
    req.user = newUser;
    res.cookie("accessToken", token, cookieOptions);
    return res.status(201).json({ message: "User registered successfully" });
};

export const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    const { token, user } = await loginUserService(email, password);
    req.user = user;
    res.cookie("accessToken", token, cookieOptions);
    return res.status(200).json({ user, message: "User logged in successfully" });
};

export const logoutUserController = async (req, res) => {
    res.clearCookie("accessToken", {
        ...cookieOptions,
        expires: new Date(0),
        maxAge: 0,
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

export const meController = async (req, res) => {
    return res.status(200).json({ user: req.user });
};
