import {
    createFolderService,
    listFoldersService,
    listFoldersWithCountsService,
    renameFolderService,
    deleteFolderService,
} from "../services/folder.service.js";

export const listFoldersController = async (req, res) => {
    if (req.query.withCounts === "1") {
        const rows = await listFoldersWithCountsService(req.user._id);
        return res.json({ folders: rows });
    }
    const rows = await listFoldersService(req.user._id);
    return res.json({ folders: rows });
};

export const createFolderController = async (req, res) => {
    const { name } = req.body;
    const row = await createFolderService(req.user._id, name);
    return res.status(201).json({ folder: row });
};

export const renameFolderController = async (req, res) => {
    const { name } = req.body;
    const row = await renameFolderService(req.user._id, req.params.id, name);
    if (!row) return res.status(404).json({ message: "Folder not found" });
    return res.json({ folder: row });
};

export const deleteFolderController = async (req, res) => {
    const row = await deleteFolderService(req.user._id, req.params.id);
    if (!row) return res.status(404).json({ message: "Folder not found" });
    return res.json({ message: "Folder removed and links unfiled" });
};
