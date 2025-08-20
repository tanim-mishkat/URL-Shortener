import { generateNanoId } from "../utils/helper.utils.js";
import { getCustomShortUrl, saveShortUrl } from "../dao/shortUrl.dao.js";

export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = generateNanoId(7);
    await saveShortUrl(shortUrl, url);
    return shortUrl;
}
export const createShortUrlWithUser = async (url, userId, slug = null) => {
    const shortUrl = slug || generateNanoId(7);
    const exist = await getCustomShortUrl(slug);
    if (exist) throw new Error("Custom URL already exists");

    await saveShortUrl(shortUrl, url, userId);
    return shortUrl;
} 