import { wrapAsync } from "../utils/wrapAsync.js";
import { getAllUserUrls as fetchUserUrls } from "../dao/user.dao.js";

export const getAllUserUrls = wrapAsync(async (req, res) => {
    const { _id } = req.user;
    const urls = await fetchUserUrls(_id);
    if (!urls) {
        return res.status(404).json({ message: "No URLs found" });
    }
    res.status(200).json({ urls });
});