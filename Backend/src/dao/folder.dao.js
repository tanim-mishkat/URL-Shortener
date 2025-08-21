import Folder from "../models/folder.model.js";
import shortUrlModel from "../models/shortUrl.model.js";

export const createFolder = async (userId, name) => {
    const clean = name.trim();
    if (!clean || clean.length > 40) throw new Error("Invalid folder name");
    return Folder.create({ user: userId, name: clean });
};

export const listFolders = async (userId) => {
    return Folder.find({ user: userId }).sort({ name: 1 }).lean();
};

export const renameFolder = async (userId, id, name) => {
    const clean = name.trim();
    if (!clean || clean.length > 40) throw new Error("Invalid folder name");
    return Folder.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: { name: clean } },
        { new: true }
    ).lean();
};

export const deleteFolder = async (userId, id) => {
    const f = await Folder.findOneAndDelete({ _id: id, user: userId });
    if (f) {
        // Unfile links, do not delete them
        await shortUrlModel.updateMany({ user: userId, folderId: id }, { $set: { folderId: null } });
    }
    return f;
};
