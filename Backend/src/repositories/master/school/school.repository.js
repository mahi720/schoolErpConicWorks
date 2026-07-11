import prisma from "../../../config/prisma.js";

const schoolSelect = {
    id: true,
    slug: true,
    schoolName: true,
    schoolCode: true,
    affiliationNumber: true,
    registrationNumber: true,
    contactPersonName: true,
    contactNumber: true,
    contactEmail: true,
    addressLine1: true,
    addressLine2: true,
    city: true,
    district: true,
    state: true,
    country: true,
    pinCode: true,
    logo: true,
    website: true,
    lectureCount: true,
    teachingSaturday: true,
    classrooms: true,
    plan: true,
    planStartDate: true,
    planEndDate: true,
    maxStudents: true,
    maxUsers: true,
    status: true,
    isActive: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
};

export const createSchoolRepo = async (data) => {
    return prisma.school.create({
        data,
        select: schoolSelect,
    });
};

export const getSchoolsRepo = async () => {
    return prisma.school.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: schoolSelect,
    });
};

export const getSchoolBySlugRepo = async (slug) => {
    return prisma.school.findUnique({
        where: {
            slug,
        },
        select: schoolSelect,
    });
};

export const getSchoolByCodeRepo = async (schoolCode) => {
    return prisma.school.findUnique({
        where: {
            schoolCode,
        },
        select: schoolSelect,
    });
};

export const findSchoolCodeForUpdateRepo = async (
    schoolCode,
    excludeSlug,
) => {
    return prisma.school.findFirst({
        where: {
            schoolCode,
            NOT: {
                slug: excludeSlug,
            },
        },
        select: {
            slug: true,
            schoolCode: true,
        },
    });
};

export const updateSchoolRepo = async (slug, data) => {
    return prisma.school.update({
        where: {
            slug,
        },
        data,
        select: schoolSelect,
    });
};

export const deleteSchoolRepo = async (slug) => {
    return prisma.school.update({
        where: {
            slug,
        },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
        select: schoolSelect,
    });
};

export const restoreSchoolRepo = async (slug) => {
    return prisma.school.update({
        where: {
            slug,
        },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
        select: schoolSelect,
    });
};