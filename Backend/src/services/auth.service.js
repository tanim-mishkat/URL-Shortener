import { createUser, findUserByEmail } from "../dao/user.dao.js";
import AppError from "../errors/AppError.js";
import { signToken } from "../utils/helper.utils.js";

export const registerUserService = async (name, email, password) => {
    const user = await findUserByEmail(email);

    if (user) {
        throw new AppError("User already exists", 400);
    }

    const newUser = await createUser(name, email, password);

    if (!newUser) {
        throw new AppError("Failed to create user", 500);
    }

    const token = signToken({ id: newUser._id });
    return token;
};
