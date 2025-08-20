import mongoose from "mongoose";

const countsMap = { type: Map, of: Number, default: {} };

const clickAggSchema = new mongoose.Schema(
    {
        linkId: { type: mongoose.Schema.Types.ObjectId, ref: "shortUrl", index: true, required: true },
        day: { type: Date, required: true, index: true }, // truncated to UTC 00:00 for that day

        total: { type: Number, default: 0 },

        country: countsMap,   
        referrer: countsMap, 
        device: {
            desktop: { type: Number, default: 0 },
            mobile: { type: Number, default: 0 },
            tablet: { type: Number, default: 0 },
            bot: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

clickAggSchema.index({ linkId: 1, day: 1 }, { unique: true });

export default mongoose.model("clickAgg", clickAggSchema);
