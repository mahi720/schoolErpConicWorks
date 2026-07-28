import prisma from "../../../config/prisma.js";

const healthAssessmentInclude = {
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

    session: {
        select: {
            slug: true,
            name: true,
        },
    },
};

export const findStudentBySlugRepo = async (
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

export const findHealthSessionByNameRepo = async (
    schoolSlug,
    name,
) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name,
        },
    });
};

export const findStudentAcademicMappingRepo = async ({
    schoolSlug,
    studentSlug,
    sessionSlug,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            studentSlug,
            sessionSlug,
            academicStatus: "CURRENT",
            isActive: true,
        },
    });
};

export const findHealthAssessmentDuplicateRepo = async ({
    schoolSlug,
    studentSlug,
    sessionSlug,
}) => {
    return prisma.studentHealthAssessment.findFirst({
        where: {
            schoolSlug,
            studentSlug,
            sessionSlug,
        },
    });
};

export const createHealthAssessmentRepo = async (data) => {
    return prisma.studentHealthAssessment.create({
        data,
        include: healthAssessmentInclude,
    });
};

export const findHealthAssessmentBySlugRepo = async (
    slug,
    schoolSlug,
) => {
    return prisma.studentHealthAssessment.findFirst({
        where: {
            slug,
            schoolSlug,
        },
        include: healthAssessmentInclude,
    });
};

export const findHealthAssessmentByStudentRepo = async ({
    schoolSlug,
    studentSlug,
    sessionSlug,
}) => {
    return prisma.studentHealthAssessment.findFirst({
        where: {
            schoolSlug,
            studentSlug,
            sessionSlug,
        },
        include: healthAssessmentInclude,
    });
};

export const updateHealthAssessmentRepo = async (
    slug,
    data,
) => {
    return prisma.studentHealthAssessment.update({
        where: {
            slug,
        },
        data,
        include: healthAssessmentInclude,
    });
};

export const deleteHealthAssessmentRepo = async (slug) => {
    return prisma.studentHealthAssessment.update({
        where: {
            slug,
        },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
        include: healthAssessmentInclude,
    });
};

export const restoreHealthAssessmentRepo = async (slug) => {
    return prisma.studentHealthAssessment.update({
        where: {
            slug,
        },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
        include: healthAssessmentInclude,
    });
};