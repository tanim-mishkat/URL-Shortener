import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import AppError from "../errors/AppError.js";
import { incAggCounters } from "../dao/analytics.dao.js";
import { getShortUrlForRedirect, getShortUrlNoInc, } from "../dao/shortUrl.dao.js";
import { createShortUrlWithUser, createShortUrlWithoutUser } from "../services/shortUrl.service.js";
import { setStatusService, softDeleteService, hardDeleteService } from "../services/link.service.js";

// helpers
const getClientIp = (req) => {
    const xfwd = req.headers["x-forwarded-for"];
    if (xfwd) return xfwd.split(",")[0].trim();
    return req.socket?.remoteAddress || "";
};
const truncateToDayUTC = (d = new Date()) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));


export const createShortUrl = async (req, res, next) => {
    const data = req.body;
    let url = data.url;
    const slug = data.slug;
    if (!url) return next(new AppError("URL is required", 400));

    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    try {
        let outSlug;
        if (req.user) {
            outSlug = await createShortUrlWithUser(url, req.user._id, slug);
        } else {
            outSlug = await createShortUrlWithoutUser(url);
        }
        res.status(201).json({ shortUrl: process.env.APP_URL + outSlug });
    } catch (err) {
        next(err);
    }
};

export const createCustomShortUrl = async (req, res, next) => {
    try {
        const { url, slug } = req.body;
        if (!url) throw new AppError("URL is required", 400);
        let outSlug;
        if (req.user) {
            outSlug = await createShortUrlWithUser(url, req.user._id, slug);
        } else {
            outSlug = await createShortUrlWithoutUser(url);
        }
        res.status(201).json({ shortUrl: process.env.APP_URL + outSlug });
    } catch (err) {
        next(err);
    }
};

export const redirectFromShortUrl = async (req, res, next) => {
    try {
        const slug = req.params.id;

        const doc = await getShortUrlForRedirect(slug);

        if (!doc) {
            const meta = await getShortUrlNoInc(slug);
            if (!meta) return next(new AppError("Short URL not found", 404));
            if (meta.status === "paused") {
                return res
                    .status(403)
                    .send("This short link is temporarily paused by its owner.");
            }
            return next(new AppError("Short URL not found", 404));
        }

        //analytics capture (non-blocking) 
        (async () => {
            try {
                const ip = getClientIp(req);
                const gl = ip ? geoip.lookup(ip) : null;
                const country = (gl && gl.country) || "UNK";

                const parser = new UAParser(req.headers["user-agent"] || "");
                const deviceType = (parser.getDevice().type || "desktop").toLowerCase();
                const deviceBucket = ["mobile", "tablet", "desktop"].includes(deviceType)
                    ? deviceType
                    : /bot|crawler|spider/i.test(parser.getUA() || "")
                        ? "bot"
                        : "other";

                let ref = req.get("referer") || req.get("referrer") || "";
                let refHost = "direct";
                try {
                    if (ref) refHost = new URL(ref).hostname || "direct";
                } catch {
                    refHost = "direct";
                }

                const day = truncateToDayUTC(new Date());
                await incAggCounters({
                    linkId: doc._id,
                    day,
                    country,
                    refHost,
                    device: deviceBucket,
                });
            } catch (e) {
                if (process.env.NODE_ENV === "development")
                    console.error("Analytics error:", e?.message || e);
            }
        })();
        //END analytics capture

        return res.redirect(doc.fullUrl);
    } catch (err) {
        next(err);
    }
};


// LINK MANAGEMENT
export const updateLinkStatusController = async (req, res, next) => {
    try {
        const updated = await setStatusService(req.user._id, req.params.id, req.body.status);
        res.status(200).json({ message: "Status updated", link: updated });
    } catch (err) {
        next(err);
    }
};

export const softDeleteLinkController = async (req, res, next) => {
    try {
        const updated = await softDeleteService(req.user._id, req.params.id);
        res.status(200).json({ message: "Link disabled (soft deleted)", link: updated });
    } catch (err) {
        next(err);
    }
};

export const hardDeleteLinkController = async (req, res, next) => {
    try {
        await hardDeleteService(req.user._id, req.params.id);
        res.status(200).json({ message: "Link permanently deleted" });
    } catch (err) {
        next(err);
    }
};
