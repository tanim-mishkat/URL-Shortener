import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "./helper.utils.js";

export const attachUser = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return next();

    try {
        const decodedId = verifyToken(token);
        const user = await findUserById(decodedId);
        if (!user) return next();
        req.user = user;
        next();
    } catch (err) {
        next();
    }
};