import shortUrlModel from "../models/shortUrl.model.js";
export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    const doc = new shortUrlModel({ fullUrl: longUrl, shortUrl });
    if (userId) doc.user = userId;
    await doc.save();
    return doc;
};

export const getShortUrlForRedirect = async (slug) => {
    return await shortUrlModel.findOneAndUpdate(
        { shortUrl: slug, status: "active" },
        { $inc: { clicks: 1 } },
        { new: true }
    );
};

export const getShortUrlNoInc = async (slug) => {
    return await shortUrlModel.findOne({ shortUrl: slug });
};

export const getCustomShortUrl = async (slug) => {
    return await shortUrlModel.findOne({ shortUrl: slug });
};

export const updateLinkStatus = async (id, userId, status) => {
    const now = status === "disabled" ? new Date() : null;
    return await shortUrlModel.findOneAndUpdate(
        { _id: id, user: userId },
        { status, deletedAt: now },
        { new: true }
    );
};

export const softDeleteLink = async (id, userId) => {
    return await shortUrlModel.findOneAndUpdate(
        { _id: id, user: userId },
        { status: "disabled", deletedAt: new Date() },
        { new: true }
    );
};

export const hardDeleteLink = async (id, userId) => {
    return await shortUrlModel.findOneAndDelete({ _id: id, user: userId });
};

export const getShortUrl = async (shortUrl) => {
    return await shortUrlModel.findOneAndUpdate(
        { shortUrl },
        { $inc: { clicks: 1 } },
        { new: true }
    );
};


const normalizeTags = (tags = []) => {
    const out = [];
    for (const t of tags) {
        if (!t) continue;
        const s = String(t).trim().toLowerCase();
        if (!s) continue;
        if (s.length > 20) continue;
        if (!out.includes(s)) out.push(s);
        if (out.length >= 10) break;
    }
    return out;
};

export const updateTags = async (linkId, userId, tags) => {
    const clean = normalizeTags(tags);
    const doc = await shortUrlModel.findOneAndUpdate(
        { _id: linkId, user: userId },
        { $set: { tags: clean } },
        { new: true }
    ).lean();
    return doc;
};

export const moveToFolder = async (linkId, userId, folderId) => {
    const doc = await shortUrlModel.findOneAndUpdate(
        { _id: linkId, user: userId },
        { $set: { folderId: folderId || null } },
        { new: true }
    ).lean();
    return doc;
};
