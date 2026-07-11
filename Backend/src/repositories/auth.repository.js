import prisma from "../config/prisma.js";

export const findUserByEmailAndSchoolCode = async (email, schoolCode) => {
    return prisma.user.findFirst({
        where: {
            email,
            schoolCode,
        },
    });
};

export const updateUserRefreshToken = async (userId, refreshToken) => {
    return prisma.user.update({
        where: { id: userId },
        data: { refreshToken },
    });
};

export const findUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
    });
};

export const clearUserRefreshToken = async (userId) => {
    return prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};