import { createUser, findUserByEmail } from "../dao/user.dao.js";
import AppError from "../errors/AppError.js";
import { signToken } from "../utils/helper.utils.js";

export const registerUserService = async (name, email, password) => {
    const user = await findUserByEmail(email);

    if (user) {
        throw new AppError("User already exists", 409);
    }

    const newUser = await createUser(name, email, password);

    if (!newUser) {
        throw new AppError("Failed to create user", 500);
    }

    const token = signToken({ id: newUser._id });
    return { token, newUser };
};

export const loginUserService = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new AppError("Invalid email or password", 404);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({ id: user._id });
    // Remove password before returning
    const userSafe = user.toObject();
    delete userSafe.password;

    return { token, user: userSafe };
};

