import prisma from "../../../config/prisma.js";

export const runEmployeeSalaryTransactionRepo =
    async (callback) => {
        return prisma.$transaction(
            callback,
        );
    };

export const findSalaryEmployeeBySlugRepo =
    async (
        schoolSlug,
        employeeSlug,
        db = prisma,
    ) => {
        return db.hrmEmployee.findFirst({
            where: {
                schoolSlug,
                slug: employeeSlug,
            },

            include: {
                department: true,
                designation: true,
                payBand: true,
            },
        });
    };

export const findSalaryPayBandByNameRepo =
    async (
        schoolSlug,
        payBandName,
        db = prisma,
    ) => {
        const payBands =
            await db.hrmPayBand.findMany({
                where: {
                    schoolSlug,
                    isActive: true,
                },
            });

        return (
            payBands.find(
                (item) =>
                    String(
                        item.payBandName,
                    )
                        .trim()
                        .toLowerCase() ===
                    String(
                        payBandName,
                    )
                        .trim()
                        .toLowerCase(),
            ) || null
        );
    };

export const getSalaryPayBandsRepo =
    async (
        schoolSlug,
        db = prisma,
    ) => {
        return db.hrmPayBand.findMany({
            where: {
                schoolSlug,
                isActive: true,
            },

            orderBy: {
                payBandName:
                    "asc",
            },
        });
    };

export const getPayBandStructuresRepo =
    async (
        schoolSlug,
        payBandSlug,
        db = prisma,
    ) => {
        return db.hrmPayBandStructure.findMany({
            where: {
                schoolSlug,
                payBandSlug,
                isActive: true,
            },

            include: {
                earningType:
                    true,

                deductionType:
                    true,
            },

            orderBy: {
                displayOrder:
                    "asc",
            },
        });
    };

export const findEmployeeSalaryStructureRepo =
    async (
        schoolSlug,
        employeeSlug,
        db = prisma,
    ) => {
        return db.hrmEmployeeSalaryStructure.findFirst({
            where: {
                schoolSlug,
                employeeSlug,
                isActive: true,
            },

            include: {
                payBand: true,

                items: {
                    where: {
                        isActive:
                            true,
                    },

                    include: {
                        earningType:
                            true,

                        deductionType:
                            true,
                    },

                    orderBy: {
                        displayOrder:
                            "asc",
                    },
                },
            },
        });
    };

export const createEmployeeSalaryStructureRepo =
    async (
        data,
        db = prisma,
    ) => {
        return db.hrmEmployeeSalaryStructure.create({
            data,
        });
    };

export const updateEmployeeSalaryStructureRepo =
    async (
        slug,
        data,
        db = prisma,
    ) => {
        return db.hrmEmployeeSalaryStructure.update({
            where: {
                slug,
            },

            data,
        });
    };

export const deleteEmployeeSalaryStructureItemsRepo =
    async (
        employeeSalaryStructureSlug,
        db = prisma,
    ) => {
        return db.hrmEmployeeSalaryStructureItem.deleteMany({
            where: {
                employeeSalaryStructureSlug,
            },
        });
    };

export const createEmployeeSalaryStructureItemsRepo =
    async (
        data,
        db = prisma,
    ) => {
        if (!data.length) {
            return null;
        }

        return db.hrmEmployeeSalaryStructureItem.createMany({
            data,
        });
    };

export const updateSalaryEmployeePayBandRepo =
    async (
        employeeSlug,
        payBandSlug,
        db = prisma,
    ) => {
        return db.hrmEmployee.update({
            where: {
                slug:
                    employeeSlug,
            },

            data: {
                payBandSlug,
            },
        });
    };

export const createEmployeeSalaryIncrementRepo =
    async (
        data,
        db = prisma,
    ) => {
        return db.hrmEmployeeSalaryIncrement.create({
            data,
        });
    };

export const getEmployeeSalaryIncrementHistoryRepo =
    async (
        schoolSlug,
        employeeSlug,
        db = prisma,
    ) => {
        return db.hrmEmployeeSalaryIncrement.findMany({
            where: {
                schoolSlug,
                employeeSlug,
                isActive: true,
            },

            include: {
                payBand: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        });
    };