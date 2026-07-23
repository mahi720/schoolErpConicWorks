import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";
import { errorResponse } from "../../utils/apiResponse.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return errorResponse(
                res,
                401,
                "Access token missing",
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET,
        );

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },

            select: {
                id: true,

                // Important: attendance relations ke liye
                slug: true,

                name: true,
                email: true,
                role: true,
                schoolSlug: true,
                schoolCode: true,
                isActive: true,
            },
        });

        if (!user || !user.isActive) {
            return errorResponse(
                res,
                401,
                "Unauthorized user",
            );
        }

        if (!user.slug) {
            return errorResponse(
                res,
                401,
                "User slug is missing",
            );
        }

        if (!user.schoolSlug && user.role !== "SUPER_ADMIN") {
            return errorResponse(
                res,
                401,
                "User school information is missing",
            );
        }

        req.user = user;

        return next();
    } catch (error) {
        if (error?.name === "TokenExpiredError") {
            return errorResponse(
                res,
                401,
                "Access token expired",
            );
        }

        if (error?.name === "JsonWebTokenError") {
            return errorResponse(
                res,
                401,
                "Invalid access token",
            );
        }

        return errorResponse(
            res,
            401,
            "Invalid or expired token",
        );
    }
};