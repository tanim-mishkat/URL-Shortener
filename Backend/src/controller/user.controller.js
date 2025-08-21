import { getAllUserUrls as fetchUserUrls } from "../dao/user.dao.js";

export const getAllUserUrls = async (req, res) => {
    const { _id } = req.user;
    const { folderId = "", tag = "" } = req.query;
    const urls = await fetchUserUrls(_id, { folderId, tag });
    if (!urls || urls.length === 0) {
        return res.status(404).json({ message: "No URLs found" });
    }
    return res.status(200).json({ urls });
};
