import prisma from "../../../config/prisma.js";

export const runEmployeeTransactionRepo = async (callback) => {
    return prisma.$transaction(callback);
};

export const findEmployeeDepartmentByNameRepo = async (
    schoolSlug,
    departmentName,
    db = prisma,
) => {
    return db.hrmDepartment.findFirst({
        where: {
            schoolSlug,
            departmentName,
            isActive: true,
        },
    });
};

export const findEmployeeDesignationByNameRepo = async (
    schoolSlug,
    departmentSlug,
    designationName,
    db = prisma,
) => {
    return db.hrmDesignation.findFirst({
        where: {
            schoolSlug,
            departmentSlug,
            designationName,
            isActive: true,
        },
    });
};

export const findEmployeePayBandByNameRepo = async (
    schoolSlug,
    payBandName,
    db = prisma,
) => {
    return db.hrmPayBand.findFirst({
        where: {
            schoolSlug,
            payBandName,
            isActive: true,
        },
    });
};

export const findEmployeeByEmailRepo = async (
    schoolSlug,
    email,
    excludeSlug = null,
    db = prisma,
) => {
    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,
            email,
            isActive: true,

            ...(excludeSlug && {
                NOT: {
                    slug: excludeSlug,
                },
            }),
        },
    });
};

export const findEmployeeByPhoneRepo = async (
    schoolSlug,
    phoneNumber,
    excludeSlug = null,
    db = prisma,
) => {
    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,
            phoneNumber,
            isActive: true,

            ...(excludeSlug && {
                NOT: {
                    slug: excludeSlug,
                },
            }),
        },
    });
};

export const findEmployeeByCodeRepo = async (
    schoolSlug,
    employeeCode,
    excludeSlug = null,
    db = prisma,
) => {
    if (!employeeCode) {
        return null;
    }

    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,
            employeeCode,
            isActive: true,

            ...(excludeSlug && {
                NOT: {
                    slug: excludeSlug,
                },
            }),
        },
    });
};

export const findLastEmployeeSerialRepo = async (
    schoolSlug,
    db = prisma,
) => {
    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,
        },
        orderBy: {
            employeeSerial: "desc",
        },
        select: {
            employeeSerial: true,
        },
    });
};

export const findUserByEmailRepo = async (
    schoolSlug,
    email,
    db = prisma,
) => {
    return db.user.findFirst({
        where: {
            schoolSlug,
            email,
        },
    });
};

export const createEmployeeUserRepo = async (
    data,
    db = prisma,
) => {
    return db.user.create({
        data,
    });
};

export const createEmployeeRepo = async (
    data,
    db = prisma,
) => {
    return db.hrmEmployee.create({
        data,
    });
};

export const createEmployeeBankDetailRepo = async (
    data,
    db = prisma,
) => {
    return db.hrmEmployeeBankDetail.create({
        data,
    });
};

export const createEmployeeLoginSettingRepo = async (
    data,
    db = prisma,
) => {
    return db.hrmEmployeeLoginSetting.create({
        data,
    });
};

export const getEmployeeBySlugRepo = async (
    schoolSlug,
    slug,
    db = prisma,
) => {
    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,
            slug,
        },
        include: {
            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },

            designation: {
                select: {
                    slug: true,
                    designationName: true,
                    designationLevel: true,
                },
            },

            payBand: {
                select: {
                    slug: true,
                    payBandName: true,
                },
            },

            bankDetail: true,

            loginSetting: true,

            user: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                },
            },
        },
    });
};

export const getEmployeesRepo = async ({
    schoolSlug,
    search,
    departmentSlug,
    designationSlug,
    natureOfAppointment,
    employmentStatus,
    status,
}) => {
    return prisma.hrmEmployee.findMany({
        where: {
            schoolSlug,

            ...(status && {
                status,
            }),

            ...(departmentSlug && {
                departmentSlug,
            }),

            ...(designationSlug && {
                designationSlug,
            }),

            ...(natureOfAppointment && {
                natureOfAppointment,
            }),

            ...(employmentStatus && {
                employmentStatus,
            }),

            ...(search && {
                OR: [
                    {
                        fullName: {
                            contains: search,
                        },
                    },
                    {
                        employeeId: {
                            contains: search,
                        },
                    },
                    {
                        employeeCode: {
                            contains: search,
                        },
                    },
                    {
                        phoneNumber: {
                            contains: search,
                        },
                    },
                    {
                        email: {
                            contains: search,
                        },
                    },
                ],
            }),
        },

        include: {
            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },

            designation: {
                select: {
                    slug: true,
                    designationName: true,
                    designationLevel: true,
                },
            },

            payBand: {
                select: {
                    slug: true,
                    payBandName: true,
                },
            },

            loginSetting: true,

            user: {
                select: {
                    slug: true,
                    email: true,
                    role: true,
                    isActive: true,
                },
            },
        },

        orderBy: [
            {
                isActive: "desc",
            },
            {
                employeeSerial: "asc",
            },
        ],
    });
};

export const updateEmployeeRepo = async (
    slug,
    data,
    db = prisma,
) => {
    return db.hrmEmployee.update({
        where: {
            slug,
        },
        data,
    });
};

export const upsertEmployeeBankDetailRepo = async (
    employeeSlug,
    data,
    db = prisma,
) => {
    const {
        slug: recordSlug,
        ...updateData
    } = data;

    return db.hrmEmployeeBankDetail.upsert({
        where: {
            employeeSlug,
        },

        update: updateData,

        create: {
            slug: recordSlug,
            ...updateData,
            employeeSlug,
        },
    });
};

export const upsertEmployeeLoginSettingRepo = async (
    employeeSlug,
    data,
    db = prisma,
) => {
    const {
        slug: recordSlug,
        ...updateData
    } = data;

    return db.hrmEmployeeLoginSetting.upsert({
        where: {
            employeeSlug,
        },

        update: updateData,

        create: {
            slug: recordSlug,
            ...updateData,
            employeeSlug,
        },
    });
};

export const disableEmployeeUserRepo = async (
    userSlug,
    db = prisma,
) => {
    return db.user.update({
        where: {
            slug: userSlug,
        },

        data: {
            isActive: false,
            refreshToken: null,
        },
    });
};

export const enableEmployeeUserRepo = async (
    userSlug,
    db = prisma,
) => {
    return db.user.update({
        where: {
            slug: userSlug,
        },

        data: {
            isActive: true,
        },
    });
};

export const updateEmployeeUserRepo = async (
    userSlug,
    data,
    db = prisma,
) => {
    return db.user.update({
        where: {
            slug: userSlug,
        },
        data,
    });
};

export const createTransferredEmployeeRepo = async (
    data,
    db = prisma,
) => {
    return db.hrmEmployee.create({
        data,
    });
};

export const markEmployeeTransferredRepo = async (
    slug,
    data,
    db = prisma,
) => {
    return db.hrmEmployee.update({
        where: {
            slug,
        },
        data,
    });
};

export const moveEmployeeBankDetailRepo = async (
    employeeSlug,
    newEmployeeSlug,
    db = prisma,
) => {
    const bankDetail =
        await db.hrmEmployeeBankDetail.findUnique({
            where: {
                employeeSlug,
            },
        });

    if (!bankDetail) {
        return null;
    }

    return db.hrmEmployeeBankDetail.update({
        where: {
            employeeSlug,
        },
        data: {
            employeeSlug: newEmployeeSlug,
        },
    });
};

export const moveEmployeeLoginSettingRepo = async (
    employeeSlug,
    newEmployeeSlug,
    db = prisma,
) => {
    const loginSetting =
        await db.hrmEmployeeLoginSetting.findUnique({
            where: {
                employeeSlug,
            },
        });

    if (!loginSetting) {
        return null;
    }

    return db.hrmEmployeeLoginSetting.update({
        where: {
            employeeSlug,
        },
        data: {
            employeeSlug: newEmployeeSlug,
        },
    });
};