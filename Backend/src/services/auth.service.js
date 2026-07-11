import bcrypt from "bcrypt";
import {
    findUserByEmailAndSchoolCode,
    findUserById,
    updateUserRefreshToken,
} from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const loginUserService = async ({ email, password, schoolCode }) => {
    const user = await findUserByEmailAndSchoolCode(email, schoolCode);

    if (!user) {
        throw new Error("Invalid email, password or school code");
    }

    if (!user.isActive) {
        throw new Error("Your account is inactive");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error("Invalid email, password or school code");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateUserRefreshToken(user.id, refreshToken);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolCode: user.schoolCode,
        },
    };
};

export const refreshAuthService = async (refreshToken) => {
    if (!refreshToken) throw new Error("Refresh token missing");

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await findUserById(decoded.id);

    if (!user || !user.isActive || user.refreshToken !== refreshToken) {
        throw new Error("Invalid refresh token");
    }

    const accessToken = generateAccessToken(user);

    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolCode: user.schoolCode,
        },
    };
}