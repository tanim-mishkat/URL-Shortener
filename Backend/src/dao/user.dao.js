import shortUrlModel from "../models/shortUrl.model.js";
import User from "../models/user.model.js";

export const findUserByEmail = (email) =>
    User.findOne({ email }).select("+password");

export const findUserById = (id) =>
    User.findById(id);

export const createUser = (name, email, password) =>
    User.create({ name, email, password });

// filters: { folderId?: string | 'unfiled', tag?: string }
export const getAllUserUrls = async (userId, filters = {}) => {
    const { folderId, tag } = filters;
    const query = { user: userId };

    if (folderId === "unfiled") query.folderId = null;
    else if (folderId) query.folderId = folderId;

    if (tag) query.tags = String(tag).trim().toLowerCase();

    return shortUrlModel.find(query).sort({ createdAt: -1 }).lean();
};
