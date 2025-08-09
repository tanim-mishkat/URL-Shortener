import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: function () {
                const hash = crypto
                    .createHash("md5")
                    .update(this.email.trim().toLowerCase())
                    .digest("hex");
                return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("user", userSchema);
