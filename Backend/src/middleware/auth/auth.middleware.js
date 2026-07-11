import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";
import { errorResponse } from "../../utils/apiResponse.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return errorResponse(res, 401, "Access token missing");
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // schoolId: true,
                schoolSlug: true,
                schoolCode: true,
                isActive: true,
            },
        });

        if (!user || !user.isActive) {
            return errorResponse(res, 401, "Unauthorized user");
        }

        req.user = user;
        next();
    } catch {
        return errorResponse(res, 401, "Invalid or expired token");
    }
};