import mongoose from "mongoose";
const { Schema } = mongoose;

const folderSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 40 },
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    },
    { timestamps: true }
);

folderSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Folder", folderSchema);
