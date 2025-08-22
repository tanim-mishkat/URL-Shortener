import AppError from "../errors/AppError.js";
import shortUrlModel from "../models/shortUrl.model.js";
import { updateLinkStatus, softDeleteLink, hardDeleteLink } from "../dao/shortUrl.dao.js";
import { hardDeleteMany } from "../dao/shortUrl.dao.js";


const assertOwnerById = async (userId, linkId) => {
    const link = await shortUrlModel.findOne({ _id: linkId, user: userId }).lean();
    if (!link) throw new AppError("Link not found", 404);
    return link;
};

export const setStatusService = async (userId, linkId, status) => {
    if (!["active", "paused", "disabled"].includes(status)) {
        throw new AppError("Invalid status", 400);
    }
    await assertOwnerById(userId, linkId);
    const updated = await updateLinkStatus(linkId, userId, status);
    if (!updated) throw new AppError("Link not found", 404);
    return updated;
};

export const softDeleteService = async (userId, linkId) => {
    await assertOwnerById(userId, linkId);
    const updated = await softDeleteLink(linkId, userId);
    if (!updated) throw new AppError("Link not found", 404);
    return updated;
};

export const hardDeleteService = async (userId, linkId) => {
    await assertOwnerById(userId, linkId);
    const removed = await hardDeleteLink(linkId, userId);
    if (!removed) throw new AppError("Link not found", 404);
    return removed;
};

export const hardDeleteManyService = async (userId, ids) => {
    return hardDeleteMany(userId, ids);
};