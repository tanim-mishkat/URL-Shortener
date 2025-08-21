import { createFolder, listFolders, renameFolder, deleteFolder } from "../dao/folder.dao.js";

export const createFolderService = (userId, name) => createFolder(userId, name);
export const listFoldersService = (userId) => listFolders(userId);
export const renameFolderService = (userId, id, name) => renameFolder(userId, id, name);
export const deleteFolderService = (userId, id) => deleteFolder(userId, id);
