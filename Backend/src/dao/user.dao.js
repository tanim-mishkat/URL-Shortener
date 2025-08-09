import userSchema from "../models/user.model.js";

export const findUserByEmail = async (email) => {
    const user = await userSchema.findOne({ email: email });
    return user;
}

export const findUserById = async (id) => {
    const user = await userSchema.findById(id);
    return user;
}

export const createUser = async (name, email, password) => {
    const user = await userSchema.create({ name, email, password });
    await user.save();
    return user;
}