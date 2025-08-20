import ShortUrl from "../models/shortUrl.model.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    const doc = new ShortUrl({ fullUrl: longUrl, shortUrl });
    if (userId) doc.user = userId;
    await doc.save();
    return doc;
};

export const getShortUrlForRedirect = async (slug) => {
    return await ShortUrl.findOneAndUpdate(
        { shortUrl: slug, status: "active" },
        { $inc: { clicks: 1 } },
        { new: true }
    );
};

export const getShortUrlNoInc = async (slug) => {
    return await ShortUrl.findOne({ shortUrl: slug });
};

export const getCustomShortUrl = async (slug) => {
    return await ShortUrl.findOne({ shortUrl: slug });
};

export const updateLinkStatus = async (id, userId, status) => {
    const now = status === "disabled" ? new Date() : null;
    return await ShortUrl.findOneAndUpdate(
        { _id: id, user: userId },
        { status, deletedAt: now },
        { new: true }
    );
};

export const softDeleteLink = async (id, userId) => {
    return await ShortUrl.findOneAndUpdate(
        { _id: id, user: userId },
        { status: "disabled", deletedAt: new Date() },
        { new: true }
    );
};

export const hardDeleteLink = async (id, userId) => {
    return await ShortUrl.findOneAndDelete({ _id: id, user: userId });
};

export const getShortUrl = async (shortUrl) => {
    return await ShortUrl.findOneAndUpdate(
        { shortUrl },
        { $inc: { clicks: 1 } },
        { new: true }
    );
};
