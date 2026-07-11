import prisma from "../../../config/prisma.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import AppError from "../../../utils/appError.js";
import { generateSlug } from "../../../utils/generateSlug.js";

const allowedStatus = ["active", "closed"];

const getSchoolSlug = (req) => {
    return req.user?.schoolSlug;
};

// CREATE SESSION
export const createSession = asyncHandler(async (req, res, next) => {
    const schoolSlug = getSchoolSlug(req);

    if (!schoolSlug) {
        return next(new AppError("School schoolSlug not found. Please login again.", 401));
    }

    const { name, startDate, endDate, status = "active" } = req.body;

    if (!name || !startDate || !endDate) {
        return next(
            new AppError("Session name, start date and end date are required", 400)
        );
    }

    if (!allowedStatus.includes(status)) {
        return next(new AppError("InvalschoolSlug session status", 400));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
        return next(new AppError("Invalid start date", 400));
    }

    if (isNaN(end.getTime())) {
        return next(new AppError("Invalid end date", 400));
    }

    if (end <= start) {
        return next(new AppError("End date must be greater than start date", 400));
    }

    const school = await prisma.school.findFirst({
        where: {
            slug: schoolSlug,
            isActive: true,
            deletedAt: null,
        },
    });

    if (!school) {
        return next(new AppError("School not found or inactive", 404));
    }

    const existingSession = await prisma.session.findFirst({
        where: {
            schoolSlug,
            name: name.trim(),
            isActive: true,
            deletedAt: null,
        },
    });

    if (existingSession) {
        return next(new AppError("Session already exists for this school", 409));
    }

    const session = await prisma.session.create({
        data: {
            slug: generateSlug("SES"),
            schoolSlug,
            name: name.trim(),
            startDate: start,
            endDate: end,
            status,
            isActive: true,
        },
    });

    return res.status(201).json({
        success: true,
        message: "Session created successfully",
        data: session,
    });
});

// GET ALL SESSIONS
export const getSessions = asyncHandler(async (req, res, next) => {
    const schoolSlug = getSchoolSlug(req);

    if (!schoolSlug) {
        return next(new AppError("School slug not found. Please login again.", 401));
    }

    const sessions = await prisma.session.findMany({
        where: {
            schoolSlug,
            isActive: true,
            deletedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return res.status(200).json({
        success: true,
        message: "Sessions fetched successfully",
        data: sessions,
    });
});

// GET SINGLE SESSION
export const getSessionBySlug = asyncHandler(async (req, res, next) => {
    const schoolSlug = getSchoolSlug(req);
    const { slug } = req.params;

    if (!schoolSlug) {
        return next(new AppError("School slug not found. Please login again.", 401));
    }

    const session = await prisma.session.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: true,
            deletedAt: null,
        },
    });

    if (!session) {
        return next(new AppError("Session not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "Session fetched successfully",
        data: session,
    });
});

// UPDATE SESSION
export const updateSession = asyncHandler(async (req, res, next) => {
    const schoolSlug = getSchoolSlug(req);
    const { slug } = req.params;
    const { name, startDate, endDate, status } = req.body;

    if (!schoolSlug) {
        return next(new AppError("School slug not found. Please login again.", 401));
    }

    const existingSession = await prisma.session.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: true,
            deletedAt: null,
        },
    });

    if (!existingSession) {
        return next(new AppError("Session not found", 404));
    }

    const updateData = {};

    if (name) {
        const duplicateSession = await prisma.session.findFirst({
            where: {
                schoolSlug,
                name: name.trim(),
                slug: {
                    not: slug,
                },
                isActive: true,
                deletedAt: null,
            },
        });

        if (duplicateSession) {
            return next(new AppError("Session name already exists", 409));
        }

        updateData.name = name.trim();
    }

    if (startDate) {
        const start = new Date(startDate);

        if (isNaN(start.getTime())) {
            return next(new AppError("Invalid start date", 400));
        }

        updateData.startDate = start;
    }

    if (endDate) {
        const end = new Date(endDate);

        if (isNaN(end.getTime())) {
            return next(new AppError("Invalid end date", 400));
        }

        updateData.endDate = end;
    }

    if (status) {
        if (!allowedStatus.includes(status)) {
            return next(new AppError("Invalid session status", 400));
        }

        updateData.status = status;
    }

    const finalStartDate = updateData.startDate || existingSession.startDate;
    const finalEndDate = updateData.endDate || existingSession.endDate;

    if (finalEndDate <= finalStartDate) {
        return next(new AppError("End date must be greater than start date", 400));
    }

    const updatedSession = await prisma.session.update({
        where: {
            slug,
        },
        data: updateData,
    });

    return res.status(200).json({
        success: true,
        message: "Session updated successfully",
        data: updatedSession,
    });
});

// DELETE SESSION - SOFT DELETE
export const deleteSession = asyncHandler(async (req, res, next) => {
    const schoolSlug = getSchoolSlug(req);
    const { slug } = req.params;

    if (!schoolSlug) {
        return next(new AppError("School schoolSlug not found. Please login again.", 401));
    }

    const existingSession = await prisma.session.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: true,
            deletedAt: null,
        },
    });

    if (!existingSession) {
        return next(new AppError("Session not found", 404));
    }

    await prisma.session.update({
        where: {
            slug,
        },
        data: {
            isActive: false,
            deletedAt: new Date(),
        },
    });

    return res.status(200).json({
        success: true,
        message: "Session deleted successfully",
    });
});