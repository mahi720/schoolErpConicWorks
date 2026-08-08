import crypto from "crypto";

import {
    runEmployeeSalaryTransactionRepo,
    findSalaryEmployeeBySlugRepo,
    findSalaryPayBandByNameRepo,
    getSalaryPayBandsRepo,
    getPayBandStructuresRepo,
    findEmployeeSalaryStructureRepo,
    createEmployeeSalaryStructureRepo,
    updateEmployeeSalaryStructureRepo,
    deleteEmployeeSalaryStructureItemsRepo,
    createEmployeeSalaryStructureItemsRepo,
    updateSalaryEmployeePayBandRepo,
    createEmployeeSalaryIncrementRepo,
    getEmployeeSalaryIncrementHistoryRepo,
} from "../../../repositories/HRM/employee/employeeSalaryStructure.repository.js";

const generateSlug = () => {
    return crypto.randomUUID();
};

const toNumber = (value) => {
    return Number(value || 0);
};

const getPayBandBasicSalary = (
    payBand,
) => {
    // Tere project me Pay Band ka naam/value hi Basic Salary hai.
    return toNumber(
        payBand?.payBandName,
    );
};

const getComponentName = (item) => {
    if (
        item.componentType ===
        "EARNING"
    ) {
        return (
            item.componentName ||
            item.earningType
                ?.earningType ||
            item.earningType
                ?.earningTypeName ||
            item.earningType?.name ||
            item.earningType
                ?.title ||
            "EARNING"
        );
    }

    return (
        item.componentName ||
        item.deductionType
            ?.deductionType ||
        item.deductionType
            ?.deductionTypeName ||
        item.deductionType
            ?.name ||
        item.deductionType
            ?.title ||
        "DEDUCTION"
    );
};

const calculateAmount = ({
    calculationType,
    value,
    calculationBase,
    basicPay,
    grossEarnings,
}) => {
    const numericValue =
        toNumber(value);

    if (
        calculationType ===
        "FIXED"
    ) {
        return numericValue;
    }

    if (
        calculationType ===
        "PERCENT"
    ) {
        const baseAmount =
            calculationBase ===
                "GROSS_EARNINGS"
                ? grossEarnings
                : basicPay;

        return (
            baseAmount *
            numericValue
        ) / 100;
    }

    return 0;
};

const buildPayBandPreview = ({
    employee,
    payBand,
    structures,
}) => {
    const basicPay =
        getPayBandBasicSalary(
            payBand,
        );

    const basicPayItem = {
        sourceSlug:
            null,

        componentType:
            "EARNING",

        componentName:
            "BASIC PAY",

        name:
            "BASIC PAY",

        earningTypeSlug:
            null,

        deductionTypeSlug:
            null,

        calculationType:
            "FIXED",

        value:
            basicPay,

        calculationBase:
            "BASIC_PAY",

        amount:
            basicPay,

        displayOrder:
            0,

        isBasicPay:
            true,
    };

    // Null earningTypeSlug wala existing base row BASIC PAY hai.
    // Usko duplicate earning ke roop me show nahi karna.
    const earningStructures =
        (structures || [])
            .filter(
                (item) =>
                    item.componentType ===
                    "EARNING",
            )
            .filter(
                (item) =>
                    item.earningTypeSlug,
            );

    const deductionStructures =
        (structures || []).filter(
            (item) =>
                item.componentType ===
                "DEDUCTION",
        );

    let runningGross =
        basicPay;

    const otherEarnings =
        earningStructures.map(
            (item, index) => {
                const value =
                    toNumber(
                        item.value,
                    );

                const amount =
                    calculateAmount({
                        calculationType:
                            item.calculationType,

                        value,

                        calculationBase:
                            item.calculationBase,

                        basicPay,

                        grossEarnings:
                            runningGross,
                    });

                runningGross +=
                    amount;

                const componentName =
                    getComponentName(
                        item,
                    );

                return {
                    sourceSlug:
                        item.slug,

                    componentType:
                        "EARNING",

                    componentName,

                    name:
                        componentName,

                    earningTypeSlug:
                        item.earningTypeSlug,

                    deductionTypeSlug:
                        null,

                    calculationType:
                        item.calculationType,

                    value,

                    calculationBase:
                        item.calculationBase,

                    amount,

                    displayOrder:
                        index + 1,

                    isBasicPay:
                        false,
                };
            },
        );

    const earnings = [
        basicPayItem,
        ...otherEarnings,
    ];

    const grossEarnings =
        earnings.reduce(
            (total, item) =>
                total +
                toNumber(
                    item.amount,
                ),
            0,
        );

    const deductions =
        deductionStructures.map(
            (item, index) => {
                const amount =
                    calculateAmount({
                        calculationType:
                            item.calculationType,

                        value:
                            item.value,

                        calculationBase:
                            item.calculationBase,

                        basicPay,

                        grossEarnings,
                    });

                const componentName =
                    getComponentName(
                        item,
                    );

                return {
                    sourceSlug:
                        item.slug,

                    componentType:
                        "DEDUCTION",

                    componentName,

                    name:
                        componentName,

                    earningTypeSlug:
                        null,

                    deductionTypeSlug:
                        item.deductionTypeSlug,

                    calculationType:
                        item.calculationType,

                    value:
                        toNumber(
                            item.value,
                        ),

                    calculationBase:
                        item.calculationBase,

                    amount,

                    displayOrder:
                        index,

                    isBasicPay:
                        false,
                };
            },
        );

    const totalDeductions =
        deductions.reduce(
            (total, item) =>
                total +
                toNumber(
                    item.amount,
                ),
            0,
        );

    const netSalary =
        grossEarnings -
        totalDeductions;

    return {
        source:
            "PAY_BAND",

        saved:
            false,

        employee: {
            slug:
                employee.slug,

            employeeId:
                employee.employeeId,

            employeeCode:
                employee.employeeCode,

            fullName:
                employee.fullName,

            department:
                employee.department
                    ? {
                        slug:
                            employee.department.slug,

                        name:
                            employee.department
                                .departmentName,
                    }
                    : null,

            designation:
                employee.designation
                    ? {
                        slug:
                            employee.designation.slug,

                        name:
                            employee.designation
                                .designationName,
                    }
                    : null,
        },

        payBand: {
            slug:
                payBand.slug,

            name:
                payBand.payBandName,
        },

        basicSalary:
            basicPay,

        grossEarnings,

        totalDeductions,

        netSalary,

        salaryGenerationStopped:
            false,

        earnings,

        deductions,
    };
};

const formatSavedSalaryStructure = (
    employee,
    structure,
) => {
    const earnings =
        structure.items
            .filter(
                (item) =>
                    item.componentType ===
                    "EARNING",
            )
            .map((item) => {
                const isBasicPay =
                    !item.earningTypeSlug &&
                    (
                        item.componentName ===
                        "BASIC PAY" ||
                        item.displayOrder ===
                        0
                    );

                const componentName =
                    isBasicPay
                        ? "BASIC PAY"
                        : getComponentName(
                            item,
                        );

                return {
                    slug:
                        item.slug,

                    componentType:
                        "EARNING",

                    componentName,

                    name:
                        componentName,

                    earningTypeSlug:
                        item.earningTypeSlug,

                    deductionTypeSlug:
                        null,

                    calculationType:
                        isBasicPay
                            ? "FIXED"
                            : item.calculationType,

                    value:
                        isBasicPay
                            ? toNumber(
                                structure.basicSalary,
                            )
                            : toNumber(
                                item.value,
                            ),

                    calculationBase:
                        isBasicPay
                            ? "BASIC_PAY"
                            : item.calculationBase,

                    amount:
                        isBasicPay
                            ? toNumber(
                                structure.basicSalary,
                            )
                            : toNumber(
                                item.amount,
                            ),

                    displayOrder:
                        item.displayOrder,

                    isBasicPay,

                    isModified:
                        item.isModified,

                    isPayBandDefault:
                        item.isPayBandDefault,
                };
            });

    const hasBasicPay =
        earnings.some(
            (item) =>
                item.isBasicPay,
        );

    if (!hasBasicPay) {
        earnings.unshift({
            slug:
                null,

            componentType:
                "EARNING",

            componentName:
                "BASIC PAY",

            name:
                "BASIC PAY",

            earningTypeSlug:
                null,

            deductionTypeSlug:
                null,

            calculationType:
                "FIXED",

            value:
                toNumber(
                    structure.basicSalary,
                ),

            calculationBase:
                "BASIC_PAY",

            amount:
                toNumber(
                    structure.basicSalary,
                ),

            displayOrder:
                0,

            isBasicPay:
                true,

            isModified:
                false,

            isPayBandDefault:
                true,
        });
    }

    const deductions =
        structure.items
            .filter(
                (item) =>
                    item.componentType ===
                    "DEDUCTION",
            )
            .map((item) => {
                const componentName =
                    getComponentName(
                        item,
                    );

                return {
                    slug:
                        item.slug,

                    componentType:
                        "DEDUCTION",

                    componentName,

                    name:
                        componentName,

                    earningTypeSlug:
                        null,

                    deductionTypeSlug:
                        item.deductionTypeSlug,

                    calculationType:
                        item.calculationType,

                    value:
                        toNumber(
                            item.value,
                        ),

                    calculationBase:
                        item.calculationBase,

                    amount:
                        toNumber(
                            item.amount,
                        ),

                    displayOrder:
                        item.displayOrder,

                    isBasicPay:
                        false,

                    isModified:
                        item.isModified,

                    isPayBandDefault:
                        item.isPayBandDefault,
                };
            });

    return {
        source:
            "EMPLOYEE",

        saved:
            true,

        slug:
            structure.slug,

        employee: {
            slug:
                employee.slug,

            employeeId:
                employee.employeeId,

            employeeCode:
                employee.employeeCode,

            fullName:
                employee.fullName,

            department:
                employee.department
                    ? {
                        slug:
                            employee.department.slug,

                        name:
                            employee.department
                                .departmentName,
                    }
                    : null,

            designation:
                employee.designation
                    ? {
                        slug:
                            employee.designation.slug,

                        name:
                            employee.designation
                                .designationName,
                    }
                    : null,
        },

        payBand: {
            slug:
                structure.payBand.slug,

            name:
                structure.payBand
                    .payBandName,
        },

        basicSalary:
            toNumber(
                structure.basicSalary,
            ),

        grossEarnings:
            toNumber(
                structure.grossEarnings,
            ),

        totalDeductions:
            toNumber(
                structure.totalDeductions,
            ),

        netSalary:
            toNumber(
                structure.netSalary,
            ),

        salaryGenerationStopped:
            structure.salaryGenerationStopped,

        salaryStoppedAt:
            structure.salaryStoppedAt,

        salaryResumedAt:
            structure.salaryResumedAt,

        earnings,

        deductions,
    };
};

const calculateSavedStructure = ({
    basicSalary,
    earnings,
    deductions,
}) => {
    const basicPay =
        toNumber(
            basicSalary,
        );

    let runningGross = 0;

    const calculatedEarnings =
        earnings.map(
            (item, index) => {
                const isBasicPay =
                    item.isBasicPay ===
                    true ||
                    (
                        !item.earningTypeSlug &&
                        index === 0
                    );

                if (isBasicPay) {
                    runningGross +=
                        basicPay;

                    return {
                        ...item,

                        componentName:
                            "BASIC PAY",

                        name:
                            "BASIC PAY",

                        calculationType:
                            "FIXED",

                        value:
                            basicPay,

                        calculationBase:
                            "BASIC_PAY",

                        amount:
                            basicPay,

                        displayOrder:
                            0,

                        isBasicPay:
                            true,
                    };
                }

                const amount =
                    calculateAmount({
                        calculationType:
                            item.calculationType,

                        value:
                            item.value,

                        calculationBase:
                            item.calculationBase,

                        basicPay,

                        grossEarnings:
                            runningGross,
                    });

                runningGross +=
                    amount;

                return {
                    ...item,

                    amount,

                    isBasicPay:
                        false,
                };
            },
        );

    const grossEarnings =
        calculatedEarnings.reduce(
            (total, item) =>
                total +
                toNumber(
                    item.amount,
                ),
            0,
        );

    const calculatedDeductions =
        deductions.map(
            (item) => ({
                ...item,

                amount:
                    calculateAmount({
                        calculationType:
                            item.calculationType,

                        value:
                            item.value,

                        calculationBase:
                            item.calculationBase,

                        basicPay,

                        grossEarnings,
                    }),

                isBasicPay:
                    false,
            }),
        );

    const totalDeductions =
        calculatedDeductions.reduce(
            (total, item) =>
                total +
                toNumber(
                    item.amount,
                ),
            0,
        );

    return {
        earnings:
            calculatedEarnings,

        deductions:
            calculatedDeductions,

        grossEarnings,

        totalDeductions,

        netSalary:
            grossEarnings -
            totalDeductions,
    };
};

export const getEmployeeSalaryStructureService =
    async ({
        schoolSlug,
        employeeSlug,
    }) => {
        const employee =
            await findSalaryEmployeeBySlugRepo(
                schoolSlug,
                employeeSlug,
            );

        if (!employee) {
            throw new Error(
                "Employee not found",
            );
        }

        if (!employee.isActive) {
            throw new Error(
                "Inactive employee salary structure cannot be loaded",
            );
        }

        const savedStructure =
            await findEmployeeSalaryStructureRepo(
                schoolSlug,
                employeeSlug,
            );

        if (savedStructure) {
            return formatSavedSalaryStructure(
                employee,
                savedStructure,
            );
        }

        if (!employee.payBand) {
            throw new Error(
                "Employee pay band not found",
            );
        }

        const structures =
            await getPayBandStructuresRepo(
                schoolSlug,
                employee.payBandSlug,
            );

        return buildPayBandPreview({
            employee,

            payBand:
                employee.payBand,

            structures:
                structures || [],
        });
    };

export const getEmployeePayBandOptionsService =
    async ({
        schoolSlug,
    }) => {
        const payBands =
            await getSalaryPayBandsRepo(
                schoolSlug,
            );

        return payBands.map(
            (item) => ({
                slug:
                    item.slug,

                name:
                    item.payBandName,
            }),
        );
    };

export const previewEmployeePayBandService =
    async ({
        schoolSlug,
        employeeSlug,
        payBandName,
    }) => {
        const employee =
            await findSalaryEmployeeBySlugRepo(
                schoolSlug,
                employeeSlug,
            );

        if (!employee) {
            throw new Error(
                "Employee not found",
            );
        }

        const payBand =
            await findSalaryPayBandByNameRepo(
                schoolSlug,
                payBandName,
            );

        if (!payBand) {
            throw new Error(
                "Pay band not found",
            );
        }

        const structures =
            await getPayBandStructuresRepo(
                schoolSlug,
                payBand.slug,
            );

        // IMPORTANT:
        // Yahan DB UPDATE bilkul nahi hai.
        // Sirf preview return hoga.
        return buildPayBandPreview({
            employee,

            payBand,

            structures:
                structures || [],
        });
    };

export const saveEmployeeSalaryStructureService =
    async ({
        schoolSlug,
        employeeSlug,
        userSlug,
        payload,
    }) => {
        const employee =
            await findSalaryEmployeeBySlugRepo(
                schoolSlug,
                employeeSlug,
            );

        if (!employee) {
            throw new Error(
                "Employee not found",
            );
        }

        if (!employee.isActive) {
            throw new Error(
                "Inactive employee salary cannot be saved",
            );
        }

        const payBand =
            await findSalaryPayBandByNameRepo(
                schoolSlug,
                payload.payBand,
            );

        if (!payBand) {
            throw new Error(
                "Pay band not found",
            );
        }

        const calculated =
            calculateSavedStructure({
                basicSalary:
                    payload.basicSalary,

                earnings:
                    payload.earnings,

                deductions:
                    payload.deductions ||
                    [],
            });

        await runEmployeeSalaryTransactionRepo(
            async (tx) => {
                // MAIN SAVE par hi employee ka Pay Band update hoga.
                await updateSalaryEmployeePayBandRepo(
                    employeeSlug,
                    payBand.slug,
                    tx,
                );

                const existingStructure =
                    await findEmployeeSalaryStructureRepo(
                        schoolSlug,
                        employeeSlug,
                        tx,
                    );

                let structure;

                if (existingStructure) {
                    structure =
                        await updateEmployeeSalaryStructureRepo(
                            existingStructure.slug,
                            {
                                payBandSlug:
                                    payBand.slug,

                                basicSalary:
                                    payload.basicSalary,

                                grossEarnings:
                                    calculated.grossEarnings,

                                totalDeductions:
                                    calculated.totalDeductions,

                                netSalary:
                                    calculated.netSalary,
                            },
                            tx,
                        );

                    await deleteEmployeeSalaryStructureItemsRepo(
                        existingStructure.slug,
                        tx,
                    );
                } else {
                    structure =
                        await createEmployeeSalaryStructureRepo(
                            {
                                slug:
                                    generateSlug(),

                                schoolSlug,

                                employeeSlug,

                                payBandSlug:
                                    payBand.slug,

                                basicSalary:
                                    payload.basicSalary,

                                grossEarnings:
                                    calculated.grossEarnings,

                                totalDeductions:
                                    calculated.totalDeductions,

                                netSalary:
                                    calculated.netSalary,

                                salaryGenerationStopped:
                                    false,

                                salaryStoppedAt:
                                    null,

                                salaryResumedAt:
                                    null,

                                status:
                                    "active",

                                isActive:
                                    true,

                                deletedAt:
                                    null,
                            },
                            tx,
                        );
                }

                const earningItems =
                    calculated.earnings.map(
                        (item, index) => {
                            const isBasicPay =
                                item.isBasicPay ===
                                true ||
                                (
                                    !item.earningTypeSlug &&
                                    index === 0
                                );

                            return {
                                slug:
                                    generateSlug(),

                                schoolSlug,

                                employeeSalaryStructureSlug:
                                    structure.slug,

                                componentType:
                                    "EARNING",

                                // BASIC PAY static name DB me save hoga.
                                componentName:
                                    isBasicPay
                                        ? "BASIC PAY"
                                        : item.componentName ||
                                        item.name ||
                                        "EARNING",

                                earningTypeSlug:
                                    isBasicPay
                                        ? null
                                        : item.earningTypeSlug,

                                deductionTypeSlug:
                                    null,

                                calculationType:
                                    isBasicPay
                                        ? "FIXED"
                                        : item.calculationType,

                                value:
                                    isBasicPay
                                        ? payload.basicSalary
                                        : item.value,

                                calculationBase:
                                    isBasicPay
                                        ? "BASIC_PAY"
                                        : item.calculationBase,

                                amount:
                                    isBasicPay
                                        ? payload.basicSalary
                                        : item.amount,

                                displayOrder:
                                    isBasicPay
                                        ? 0
                                        : item.displayOrder,

                                isPayBandDefault:
                                    !item.isModified,

                                isModified:
                                    Boolean(
                                        item.isModified,
                                    ),

                                status:
                                    "active",

                                isActive:
                                    true,

                                deletedAt:
                                    null,
                            };
                        },
                    );

                const deductionItems =
                    calculated.deductions.map(
                        (item) => ({
                            slug:
                                generateSlug(),

                            schoolSlug,

                            employeeSalaryStructureSlug:
                                structure.slug,

                            componentType:
                                "DEDUCTION",

                            componentName:
                                item.componentName ||
                                item.name ||
                                "DEDUCTION",

                            earningTypeSlug:
                                null,

                            deductionTypeSlug:
                                item.deductionTypeSlug,

                            calculationType:
                                item.calculationType,

                            value:
                                item.value,

                            calculationBase:
                                item.calculationBase,

                            amount:
                                item.amount,

                            displayOrder:
                                item.displayOrder,

                            isPayBandDefault:
                                !item.isModified,

                            isModified:
                                Boolean(
                                    item.isModified,
                                ),

                            status:
                                "active",

                            isActive:
                                true,

                            deletedAt:
                                null,
                        }),
                    );

                const items = [
                    ...earningItems,
                    ...deductionItems,
                ];

                await createEmployeeSalaryStructureItemsRepo(
                    items,
                    tx,
                );

                // Increment tabhi history me save hoga
                // jab main Salary Save hoga.
                if (payload.increment) {
                    await createEmployeeSalaryIncrementRepo(
                        {
                            slug:
                                generateSlug(),

                            schoolSlug,

                            employeeSlug,

                            employeeSalaryStructureSlug:
                                structure.slug,

                            payBandSlug:
                                payBand.slug,

                            incrementType:
                                payload.increment.type,

                            incrementValue:
                                payload.increment.value,

                            previousBasicSalary:
                                payload.increment
                                    .previousBasicSalary,

                            incrementAmount:
                                payload.increment
                                    .incrementAmount,

                            newBasicSalary:
                                payload.increment
                                    .newBasicSalary,

                            createdBySlug:
                                userSlug ||
                                null,

                            status:
                                "active",

                            isActive:
                                true,

                            deletedAt:
                                null,
                        },
                        tx,
                    );
                }
            },
        );

        return getEmployeeSalaryStructureService({
            schoolSlug,
            employeeSlug,
        });
    };

export const updateSalaryGenerationStatusService =
    async ({
        schoolSlug,
        employeeSlug,
        stopped,
    }) => {
        const employee =
            await findSalaryEmployeeBySlugRepo(
                schoolSlug,
                employeeSlug,
            );

        if (!employee) {
            throw new Error(
                "Employee not found",
            );
        }

        let structure =
            await findEmployeeSalaryStructureRepo(
                schoolSlug,
                employeeSlug,
            );

        // Salary abhi save nahi hui hai to current Pay Band
        // se snapshot create kar denge.
        if (!structure) {
            const structures =
                await getPayBandStructuresRepo(
                    schoolSlug,
                    employee.payBandSlug,
                );

            const preview =
                buildPayBandPreview({
                    employee,

                    payBand:
                        employee.payBand,

                    structures:
                        structures || [],
                });

            await saveEmployeeSalaryStructureService({
                schoolSlug,

                employeeSlug,

                userSlug:
                    null,

                payload: {
                    payBand:
                        employee.payBand
                            .payBandName,

                    basicSalary:
                        preview.basicSalary,

                    earnings:
                        preview.earnings,

                    deductions:
                        preview.deductions,

                    increment:
                        null,
                },
            });

            structure =
                await findEmployeeSalaryStructureRepo(
                    schoolSlug,
                    employeeSlug,
                );
        }

        await updateEmployeeSalaryStructureRepo(
            structure.slug,
            stopped
                ? {
                    salaryGenerationStopped:
                        true,

                    salaryStoppedAt:
                        new Date(),
                }
                : {
                    salaryGenerationStopped:
                        false,

                    salaryResumedAt:
                        new Date(),
                },
        );

        return getEmployeeSalaryStructureService({
            schoolSlug,
            employeeSlug,
        });
    };

export const getEmployeeSalaryIncrementHistoryService =
    async ({
        schoolSlug,
        employeeSlug,
    }) => {
        const employee =
            await findSalaryEmployeeBySlugRepo(
                schoolSlug,
                employeeSlug,
            );

        if (!employee) {
            throw new Error(
                "Employee not found",
            );
        }

        const history =
            await getEmployeeSalaryIncrementHistoryRepo(
                schoolSlug,
                employeeSlug,
            );

        return history.map(
            (item, index) => ({
                sno:
                    index + 1,

                slug:
                    item.slug,

                payBand: {
                    slug:
                        item.payBand?.slug ||
                        null,

                    name:
                        item.payBand?.payBandName ||
                        "-",
                },

                incrementType:
                    item.incrementType,

                previousBasicSalary:
                    toNumber(
                        item.previousBasicSalary,
                    ),

                incrementValue:
                    toNumber(
                        item.incrementValue,
                    ),

                incrementAmount:
                    toNumber(
                        item.incrementAmount,
                    ),

                newBasicSalary:
                    toNumber(
                        item.newBasicSalary,
                    ),

                createdAt:
                    item.createdAt,
            }),
        );
    };