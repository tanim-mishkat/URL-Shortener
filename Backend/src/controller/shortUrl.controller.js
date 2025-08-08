import { getShortUrl } from "../dao/shortUrl.js";
import AppError from "../errors/AppError.js";
import { createShortUrlWithUser, createShortUrlWithoutUser } from "../services/shortUrl.service.js";

export const createShortUrl = async (req, res) => {

    let { url } = req.body;
    if (!url) return next(new AppError("URL is required", 400));

    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    try {
        const shortUrl = await createShortUrlWithoutUser(url);
        res.status(201).json({ shortUrl: process.env.APP_URL + shortUrl });
    } catch (err) {
        next(err);
    }
};

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