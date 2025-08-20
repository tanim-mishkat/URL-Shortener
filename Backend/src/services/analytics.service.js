import AppError from "../errors/AppError.js";
import shortUrlModel from "../models/shortUrl.model.js";
import { getTimeseries, getBreakdown } from "../dao/analytics.dao.js";
import { parseRangeFromQuery, validateDimension } from "../utils/analyticsRange.js";

const assertOwner = async (userId, linkId) => {
    const link = await shortUrlModel.findOne({ _id: linkId, user: userId }).lean();
    if (!link) throw new AppError("Link not found", 404);
    return link;
};

export const getTimeseriesForLink = async (userId, linkId, query) => {
    await assertOwner(userId, linkId);
    const { start, end } = parseRangeFromQuery(query);
    const series = await getTimeseries(linkId, start, end);
    return { series, range: { start, end } };
};

export const getBreakdownForLink = async (userId, linkId, query) => {
    const dim = validateDimension(query?.dimension || "country");
    const limit = Number(query?.limit) || 10;
    await assertOwner(userId, linkId);
    const { start, end } = parseRangeFromQuery(query);
    const rows = await getBreakdown(linkId, start, end, dim, limit);
    return { dimension: dim, rows, range: { start, end } };
};
