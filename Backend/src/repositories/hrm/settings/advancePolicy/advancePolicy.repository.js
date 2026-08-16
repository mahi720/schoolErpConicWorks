import prisma from "../../../../config/prisma.js";

const advancePolicyInclude = {
    department: {
        select: {
            slug: true,
            departmentName: true,
        },
    },
};

export const findAdvancePolicyDepartmentByNameRepo = async ({
    schoolSlug,
    departmentName,
    db = prisma,
}) => {
    return db.hrmDepartment.findFirst({
        where: {
            schoolSlug,

            departmentName,

            isActive: true,
        },

        select: {
            slug: true,
            departmentName: true,
        },
    });
};

export const findAdvancePolicyDepartmentBySlugRepo = async ({
    schoolSlug,
    departmentSlug,
    db = prisma,
}) => {
    return db.hrmDepartment.findFirst({
        where: {
            schoolSlug,

            slug: departmentSlug,

            isActive: true,
        },

        select: {
            slug: true,
            departmentName: true,
        },
    });
};

export const findDuplicateAdvancePolicyRepo = async ({
    schoolSlug,
    policyName,
    departmentSlug,
    excludeSlug,
    db = prisma,
}) => {
    return db.hrmAdvancePolicy.findFirst({
        where: {
            schoolSlug,

            policyName,

            departmentSlug: departmentSlug || null,

            ...(excludeSlug
                ? {
                    slug: {
                        not: excludeSlug,
                    },
                }
                : {}),
        },
    });
};

export const findActiveGlobalAdvancePolicyRepo = async ({
    schoolSlug,
    excludeSlug,
    db = prisma,
}) => {
    return db.hrmAdvancePolicy.findFirst({
        where: {
            schoolSlug,

            departmentSlug: null,

            isActive: true,

            ...(excludeSlug
                ? {
                    slug: {
                        not: excludeSlug,
                    },
                }
                : {}),
        },
    });
};

export const findActiveDepartmentAdvancePolicyRepo = async ({
    schoolSlug,
    departmentSlug,
    excludeSlug,
    db = prisma,
}) => {
    return db.hrmAdvancePolicy.findFirst({
        where: {
            schoolSlug,

            departmentSlug,

            isActive: true,

            ...(excludeSlug
                ? {
                    slug: {
                        not: excludeSlug,
                    },
                }
                : {}),
        },
    });
};

export const createAdvancePolicyRepo = async (data, db = prisma) => {
    return db.hrmAdvancePolicy.create({
        data,

        include: advancePolicyInclude,
    });
};

export const getAdvancePoliciesRepo = async ({
    schoolSlug,
    search,
    departmentSlug,
    isActive,
    calculationBasis,
    interestType,
    db = prisma,
}) => {
    return db.hrmAdvancePolicy.findMany({
        where: {
            schoolSlug,

            ...(typeof isActive === "boolean"
                ? {
                    isActive,
                }
                : {}),

            ...(departmentSlug
                ? {
                    departmentSlug,
                }
                : {}),

            ...(calculationBasis
                ? {
                    calculationBasis,
                }
                : {}),

            ...(interestType
                ? {
                    interestType,
                }
                : {}),

            ...(search
                ? {
                    OR: [
                        {
                            policyName: {
                                contains: search,
                            },
                        },

                        {
                            department: {
                                departmentName: {
                                    contains: search,
                                },
                            },
                        },
                    ],
                }
                : {}),
        },

        include: advancePolicyInclude,

        orderBy: [
            {
                isActive: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
};

export const findAdvancePolicyBySlugRepo = async ({
    schoolSlug,
    slug,
    db = prisma,
}) => {
    return db.hrmAdvancePolicy.findFirst({
        where: {
            schoolSlug,
            slug,
        },

        include: advancePolicyInclude,
    });
};

export const updateAdvancePolicyRepo = async ({ slug, data, db = prisma }) => {
    return db.hrmAdvancePolicy.update({
        where: {
            slug,
        },

        data,

        include: advancePolicyInclude,
    });
};

export const findApplicableAdvancePolicyRepo = async ({
    schoolSlug,
    departmentSlug,
    db = prisma,
}) => {
    if (departmentSlug) {
        const departmentPolicy = await db.hrmAdvancePolicy.findFirst({
            where: {
                schoolSlug,

                departmentSlug,

                isActive: true,
            },

            include: advancePolicyInclude,

            orderBy: {
                updatedAt: "desc",
            },
        });

        if (departmentPolicy) {
            return departmentPolicy;
        }
    }

    return db.hrmAdvancePolicy.findFirst({
        where: {
            schoolSlug,

            departmentSlug: null,

            isActive: true,
        },

        include: advancePolicyInclude,

        orderBy: {
            updatedAt: "desc",
        },
    });
};
