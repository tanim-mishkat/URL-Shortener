import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
    {
        fullUrl: { type: String, required: true },
        shortUrl: { type: String, required: true, unique: true, index: true },
        clicks: { type: Number, required: true, default: 0 },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

        status: {
            type: String,
            enum: ["active", "paused", "disabled"], 
            default: "active",
            index: true,
        },
        deletedAt: { type: Date, default: null, index: true },

        privacy: {
            type: String,
            enum: ["private", "unlisted", "public"],
            default: "private",
        },
    },
    { timestamps: true }
);

shortUrlSchema.index({ user: 1, status: 1 });

export default mongoose.model("shortUrl", shortUrlSchema);
