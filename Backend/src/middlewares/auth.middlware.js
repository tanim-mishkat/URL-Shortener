import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "../utils/helper.utils.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decodedId = verifyToken(token);
        const user = await findUserById(decodedId);
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }

};