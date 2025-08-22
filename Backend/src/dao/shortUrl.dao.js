import mongoose from "mongoose";
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

export const getShortUrl = async (shortUrl) => {
    return await shortUrlModel.findOneAndUpdate(
        { shortUrl },
        { $inc: { clicks: 1 } },
        { new: true }
    );
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
    const doc = await shortUrlModel
        .findOneAndUpdate(
            { _id: linkId, user: userId },
            { $set: { tags: clean } },
            { new: true }
        )
        .lean();
    return doc;
};

export const moveToFolder = async (linkId, userId, folderId) => {
    const doc = await shortUrlModel
        .findOneAndUpdate(
            { _id: linkId, user: userId },
            { $set: { folderId: folderId || null } },
            { new: true }
        )
        .lean();
    return doc;
};

export const listLinks = async ({
    userId,
    limit,
    cursor,
    folderId,
    status,
    q,
    tags,
    range,
}) => {
    const query = { user: userId };

    if (folderId === "null") query.folderId = null;
    else if (folderId) query.folderId = new mongoose.Types.ObjectId(folderId);

    if (status) query.status = status;
    if (tags && tags.length) query.tags = { $all: tags };

    if (range?.from || range?.to) {
        query.createdAt = {};
        if (range.from) query.createdAt.$gte = range.from;
        if (range.to) query.createdAt.$lte = range.to;
    }

    if (q) {
        query.fullUrl = { $regex: String(q).slice(0, 200), $options: "i" };
    }

    const sort = { createdAt: -1, _id: -1 };

    if (cursor) {
        const [ts, id] = cursor.split("_");
        const curDate = new Date(Number(ts));
        query.$or = [
            { createdAt: { $lt: curDate } },
            { createdAt: curDate, _id: { $lt: new mongoose.Types.ObjectId(id) } },
        ];
    }

    const items = await shortUrlModel.find(query).sort(sort).limit(limit).lean();

    let nextCursor = null;
    if (items.length === limit) {
        const last = items[items.length - 1];
        nextCursor = `${new Date(last.createdAt).getTime()}_${last._id}`;
    }
    return { items, nextCursor };
};

export const bulkUpdate = async (ids, userId, set) => {
    const r = await shortUrlModel.updateMany(
        { _id: { $in: ids }, user: userId },
        { $set: set }
    );
    return r.modifiedCount || 0;
};

export const bulkMoveFolder = async (ids, userId, folderId) => {
    const set = { folderId: folderId ? new mongoose.Types.ObjectId(folderId) : null };
    const r = await shortUrlModel.updateMany(
        { _id: { $in: ids }, user: userId },
        { $set: set }
    );
    return r.modifiedCount || 0;
};

const norm = (arr = []) =>
    [...new Set(arr.map((s) => String(s).trim().toLowerCase()).filter(Boolean))].slice(0, 10);

export const bulkAddTags = async (ids, userId, tags = []) => {
    const clean = norm(tags);
    if (!clean.length) return 0;
    const r = await shortUrlModel.updateMany(
        { _id: { $in: ids }, user: userId },
        { $addToSet: { tags: { $each: clean } } }
    );
    return r.modifiedCount || 0;
};

export const bulkRemoveTags = async (ids, userId, tags = []) => {
    const clean = norm(tags);
    if (!clean.length) return 0;
    const r = await shortUrlModel.updateMany(
        { _id: { $in: ids }, user: userId },
        { $pull: { tags: { $in: clean } } }
    );
    return r.modifiedCount || 0;
};

export const restoreSoftDeleted = async (id, userId) => {
    return shortUrlModel
        .findOneAndUpdate(
            { _id: id, user: userId, status: "disabled" },
            { $set: { status: "active", deletedAt: null } },
            { new: true }
        )
        .lean();
};


export const hardDeleteMany = async (userId, ids) => {
    const objIds = ids.map((x) =>
        x instanceof mongoose.Types.ObjectId ? x : new mongoose.Types.ObjectId(x)
    );
    const result = await shortUrlModel.deleteMany({
        _id: { $in: objIds },
        user: userId,
    });
    return {
        attempted: objIds.length,
        deletedCount: result?.deletedCount ?? 0,
    };
};
