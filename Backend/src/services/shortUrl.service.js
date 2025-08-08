import { generateNanoId } from "../utils/helper.utils.js";
import { saveShortUrl } from "../dao/shortUrl.js";

export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = generateNanoId(7);
    await saveShortUrl(shortUrl, url);
    return shortUrl;
}
export const createShortUrlWithUser = async (url, userId) => {
    const shortUrl = generateNanoId(7);
    await saveShortUrl(shortUrl, url, userId);
    return shortUrl;
} 