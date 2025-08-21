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

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(attachUserIfPresent);

app.use("/api/auth", authRoutes);

// Public create, Protected links
app.use("/api/create", createRouter);
app.use("/api/links", requireAuth, linksRouter);

app.use("/api/folders", requireAuth, folderRoutes);
app.use("/api/user", requireAuth, userRoutes);
app.use("/api/analytics", requireAuth, analyticsRoutes);



app.get("/:id", assetsHandler, wrapAsync(redirectFromShortUrl));

app.use(notFoundHandler);
app.use(globalErrorHandler);

connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

export default app;
