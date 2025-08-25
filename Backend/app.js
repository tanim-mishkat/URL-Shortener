import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectToDB from "./src/config/mongo.config.js";
import { redirectFromShortUrl } from "./src/controller/shortUrl.controller.js";

import authRoutes from "./src/routes/auth.route.js";
import analyticsRoutes from "./src/routes/analytics.route.js";
import folderRoutes from "./src/routes/folder.route.js";
import userRoutes from "./src/routes/user.route.js";
import { createRouter, linksRouter } from "./src/routes/shortUrl.route.js";

import { attachUserIfPresent, requireAuth } from "./src/middlewares/auth.middleware.js";
import { globalErrorHandler } from "./src/middlewares/error.middleware.js";
import { notFoundHandler } from "./src/middlewares/notFound.middleware.js";
import { wrapAsync } from "./src/utils/wrapAsync.js";
import { assetsHandler } from "./src/middlewares/assetsHandler.middleware.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- Proxy & CORS (must be first) ---------- */
// Behind Render’s proxy => enable secure cookies, correct IPs
app.set("trust proxy", 1);

// Build allow-list from env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const corsConfig = {
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    origin: (origin, cb) => {
        // Allow server-to-server / curl / health checks (no Origin header)
        if (!origin) return cb(null, true);
        // Allow exact allow-list matches
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("CORS blocked: " + origin));
    },
};

app.use(cors(corsConfig));

// (optional) Explicit preflight handler; regex avoids path-to-regexp error
app.options(/.*/, cors(corsConfig));

/* ---------- Parsers & cookies ---------- */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Auth context ---------- */
app.use(attachUserIfPresent);

/* ---------- API routes ---------- */
app.use("/api/auth", authRoutes);

// Public create, Protected links
app.use("/api/create", createRouter);
app.use("/api/links", requireAuth, linksRouter);

app.use("/api/folders", requireAuth, folderRoutes);
app.use("/api/user", requireAuth, userRoutes);
app.use("/api/analytics", requireAuth, analyticsRoutes);

/* ---------- Health check (keep BEFORE 404) ---------- */
app.get("/api/checkhealth", (_req, res) => res.status(200).send("ok"));

/* ---------- Public redirect ---------- */
app.get("/:id", assetsHandler, wrapAsync(redirectFromShortUrl));

/* ---------- 404 & error handlers (last) ---------- */
app.use(notFoundHandler);
app.use(globalErrorHandler);

/* ---------- Boot ---------- */
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

export default app;
