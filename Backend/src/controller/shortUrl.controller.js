import { getShortUrl } from "../dao/shortUrl.js";
import AppError from "../errors/AppError.js";
import { createShortUrlWithUser, createShortUrlWithoutUser } from "../services/shortUrl.service.js";

export const createShortUrl = async (req, res, next) => {

    const data = req.body;
    let url = data.url;
    let slug = data.slug;
    if (!url) return next(new AppError("URL is required", 400));

    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    try {
        let shortUrl;
        if (req.user) {
            shortUrl = await createShortUrlWithUser(url, req.user._id, slug);
        } else {
            shortUrl = await createShortUrlWithoutUser(url);
        }
        res.status(201).json({ shortUrl: process.env.APP_URL + shortUrl });
    } catch (err) {
        next(err);
    }
};

export const createCustomShortUrl = async (req, res) => {
    const { url, slug } = req.body;
    if (req.user) {
        const shortUrl = await createShortUrlWithUser(url, req.user._id);
    } else { const shortUrl = await createShortUrlWithoutUser(url); }
    res.status(201).json({ shortUrl: process.env.APP_URL + shortUrl });
}

export const redirectFromShortUrl = async (req, res, next) => {
    try {
        const shortUrl = req.params.id;
        const url = await getShortUrl(shortUrl);
        if (!url) return next(new AppError("Short URL not found", 404));
        res.redirect(url.fullUrl);
    } catch (err) {
        next(err);
    }
};

