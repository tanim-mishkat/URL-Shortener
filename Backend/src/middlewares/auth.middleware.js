import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "../utils/helper.utils.js";

const extractToken = (req) => {
    if (req.cookies?.accessToken) return req.cookies.accessToken;
    const h = req.headers?.authorization || req.headers?.Authorization;
    if (h && h.startsWith("Bearer ")) return h.slice("Bearer ".length);
    return null;
};

export const attachUserIfPresent = async (req, _res, next) => {
    const token = extractToken(req);
    if (!token) return next();

    try {
        const decoded = verifyToken(token);
        const userId = typeof decoded === "string" ? decoded : decoded?.id || decoded?._id;
        if (!userId) return next();

        const user = await findUserById(userId);
        if (user) req.user = user;
    } catch {
        // swallow errors (invalid/expired token) for public routes
    }
    return next();
};

export const requireAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = verifyToken(token);
        const userId = typeof decoded === "string" ? decoded : decoded?.id || decoded?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const user = await findUserById(userId);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        req.user = user;
        return next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
