import urlSchema from "../models/shortUrl.model.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    const newUrl = new urlSchema({
        fullUrl: longUrl,
        shortUrl: shortUrl,
    });
    if (userId) newUrl.user = userId;
    await newUrl.save();
};

export const getShortUrl = async (shortUrl) => {
    const url = await urlSchema.findOneAndUpdate({ shortUrl: shortUrl }, { $inc: { clicks: 1 } });
    return url
};