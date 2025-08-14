import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

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
            select: false,
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

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


export default mongoose.model("user", userSchema);
