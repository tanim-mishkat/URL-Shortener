import mongoose from "mongoose";
import ClickAgg from "../models/clickAgg.model.js";

export const incAggCounters = async ({ linkId, day, country, refHost, device }) => {
    await ClickAgg.updateOne(
        { linkId, day },
        {
            $inc: {
                total: 1,
                [`country.${country}`]: 1,
                [`referrer.${refHost}`]: 1,
                [`device.${device}`]: 1,
            },
            $setOnInsert: { linkId, day },
        },
        { upsert: true }
    );
};

export const getTimeseries = async (linkId, start, end) => {
    return ClickAgg.find({ linkId: new mongoose.Types.ObjectId(linkId), day: { $gte: start, $lte: end } })
        .select({ day: 1, total: 1, _id: 0 })
        .sort({ day: 1 })
        .lean();
};

export const getBreakdown = async (linkId, start, end, field, limit = 10) => {
    const pipeline = [
        { $match: { linkId: new mongoose.Types.ObjectId(linkId), day: { $gte: start, $lte: end } } },
        { $project: { kv: { $objectToArray: `$${field}` } } },
        { $unwind: "$kv" },
        { $group: { _id: "$kv.k", count: { $sum: "$kv.v" } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { label: "$_id", count: 1, _id: 0 } },
    ];
    return ClickAgg.aggregate(pipeline);
};
