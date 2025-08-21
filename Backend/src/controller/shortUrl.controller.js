import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import AppError from "../errors/AppError.js";
import { incAggCounters } from "../dao/analytics.dao.js";
import { getShortUrlForRedirect, getShortUrlNoInc } from "../dao/shortUrl.dao.js";
import { createShortUrlWithUser, createShortUrlWithoutUser, setTagsService, setFolderService } from "../services/shortUrl.service.js";
import { setStatusService, softDeleteService, hardDeleteService } from "../services/link.service.js";
import Folder from "../models/folder.model.js";

const getClientIp = (req) => {
    const xfwd = req.headers["x-forwarded-for"];
    if (xfwd) return xfwd.split(",")[0].trim();
    return req.socket?.remoteAddress || "";
};
const truncateToDayUTC = (d = new Date()) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

export const createShortUrl = async (req, res) => {
    const data = req.body;
    let url = data.url;
    const slug = data.slug;
    if (!url) throw new AppError("URL is required", 400);
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const outSlug = req.user
        ? await createShortUrlWithUser(url, req.user._id, slug)
        : await createShortUrlWithoutUser(url);

    return res.status(201).json({ shortUrl: process.env.APP_URL + outSlug });
};

export const createCustomShortUrl = async (req, res) => {
    const { url, slug } = req.body;
    if (!url) throw new AppError("URL is required", 400);

    const outSlug = req.user
        ? await createShortUrlWithUser(url, req.user._id, slug)
        : await createShortUrlWithoutUser(url);

    return res.status(201).json({ shortUrl: process.env.APP_URL + outSlug });
};

export const redirectFromShortUrl = async (req, res) => {
    const slug = req.params.id;
    const doc = await getShortUrlForRedirect(slug);

    if (!doc) {
        const meta = await getShortUrlNoInc(slug);
        if (!meta) throw new AppError("Short URL not found", 404);
        if (meta.status === "paused") {
            return res.status(403).send("This short link is temporarily paused by its owner.");
        }
        throw new AppError("Short URL not found", 404);
    }

    // analytics capture (non-blocking)
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

    console.log("analytics capture for", doc._id.toString());
    return res.redirect(doc.fullUrl);
};

// LINK MANAGEMENT
export const updateLinkStatusController = async (req, res) => {
    const updated = await setStatusService(req.user._id, req.params.id, req.body.status);
    return res.status(200).json({ message: "Status updated", link: updated });
};

export const softDeleteLinkController = async (req, res) => {
    const updated = await softDeleteService(req.user._id, req.params.id);
    return res.status(200).json({ message: "Link disabled (soft deleted)", link: updated });
};

export const hardDeleteLinkController = async (req, res) => {
    await hardDeleteService(req.user._id, req.params.id);
    return res.status(200).json({ message: "Link permanently deleted" });
};

// PATCH /api/links/:id/tags  { tags: string[] }
export const updateLinkTagsController = async (req, res) => {
    const { id } = req.params;
    const { tags = [] } = req.body;
    const updated = await setTagsService(id, req.user._id, tags);
    if (!updated) throw new AppError("Link not found", 404);
    return res.json({ message: "Tags updated", link: updated });
};

// PATCH /api/links/:id/folder  { folderId: string|null }
export const moveLinkFolderController = async (req, res) => {
    const { id } = req.params;
    let { folderId = null } = req.body;

    if (folderId) {
        const f = await Folder.findOne({ _id: folderId, user: req.user._id }).lean();
        if (!f) throw new AppError("Folder not found", 404);
    }

    const updated = await setFolderService(id, req.user._id, folderId);
    if (!updated) throw new AppError("Link not found", 404);
    return res.json({ message: "Folder updated", link: updated });
};
