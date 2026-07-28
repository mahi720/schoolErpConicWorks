import prisma from "../../../config/prisma.js";

const otherInformationInclude = {
    student: {
        select: {
            slug: true,
            admissionNumber: true,
            studentName: true,
            gender: true,
            category: true,
            fatherName: true,
            motherName: true,
            profileImage: true,
        },
    },
};

export const findOtherInfoStudentBySlugRepo = async (
    schoolSlug,
    studentSlug,
) => {
    return prisma.student.findFirst({
        where: {
            schoolSlug,
            slug: studentSlug,
        },
    });
};

export const findOtherInformationDuplicateRepo = async ({
    schoolSlug,
    studentSlug,
}) => {
    return prisma.studentOtherInformation.findFirst({
        where: {
            schoolSlug,
            studentSlug,
        },
    });
};

export const createOtherInformationRepo = async (data) => {
    return prisma.studentOtherInformation.create({
        data,
        include: otherInformationInclude,
    });
};

export const findOtherInformationBySlugRepo = async (
    slug,
    schoolSlug,
) => {
    return prisma.studentOtherInformation.findFirst({
        where: {
            slug,
            schoolSlug,
        },
        include: otherInformationInclude,
    });
};

export const findOtherInformationByStudentRepo = async ({
    schoolSlug,
    studentSlug,
}) => {
    return prisma.studentOtherInformation.findFirst({
        where: {
            schoolSlug,
            studentSlug,
        },
        include: otherInformationInclude,
    });
};

export const updateOtherInformationRepo = async (
    slug,
    data,
) => {
    return prisma.studentOtherInformation.update({
        where: {
            slug,
        },
        data,
        include: otherInformationInclude,
    });
};

export const deleteOtherInformationRepo = async (slug) => {
    return prisma.studentOtherInformation.update({
        where: {
            slug,
        },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
        include: otherInformationInclude,
    });
};

export const restoreOtherInformationRepo = async (slug) => {
    return prisma.studentOtherInformation.update({
        where: {
            slug,
        },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
        include: otherInformationInclude,
    });
};