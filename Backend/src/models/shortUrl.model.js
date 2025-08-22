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
        tags: { type: [String], default: [] },
        folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    },



    { timestamps: true }
);

shortUrlSchema.index({ user: 1, status: 1 });
shortUrlSchema.index({ user: 1, folderId: 1, createdAt: -1 });
shortUrlSchema.index({ user: 1, tags: 1 });
shortUrlSchema.index({ user: 1, fullUrl: 1 });

export default mongoose.model("shortUrl", shortUrlSchema);
