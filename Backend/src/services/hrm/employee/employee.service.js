import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
    runEmployeeTransactionRepo,
    findEmployeeDepartmentByNameRepo,
    findEmployeeDesignationByNameRepo,
    findEmployeePayBandByNameRepo,
    findEmployeeByEmailRepo,
    findEmployeeByPhoneRepo,
    findEmployeeByCodeRepo,
    findLastEmployeeSerialRepo,
    findUserByEmailRepo,
    createEmployeeUserRepo,
    createEmployeeRepo,
    createEmployeeBankDetailRepo,
    createEmployeeLoginSettingRepo,
    getEmployeeBySlugRepo,
    getEmployeesRepo,
    updateEmployeeRepo,
    upsertEmployeeBankDetailRepo,
    upsertEmployeeLoginSettingRepo,
    disableEmployeeUserRepo,
    enableEmployeeUserRepo,
    updateEmployeeUserRepo,
    createTransferredEmployeeRepo,
    markEmployeeTransferredRepo,
    moveEmployeeBankDetailRepo,
    moveEmployeeLoginSettingRepo,
} from "../../../repositories/HRM/employee/employee.repository.js";

const normalizeOptionalValue = (value) => {
    if (value === undefined || value === null) {
        return null;
    }

    const normalizedValue = String(value).trim();

    return normalizedValue || null;
};

const generateSlug = () => {
    return crypto.randomUUID();
};

const generateEmployeeId = (
    employeeSerial,
    joiningDate,
) => {
    const year = new Date(joiningDate).getFullYear();

    return `EMP-${year}-${String(employeeSerial).padStart(4, "0")}`;
};

const formatEmployeeResponse = (employee) => {
    if (!employee) {
        return null;
    }

    return {
        slug: employee.slug,

        employeeId: employee.employeeId,
        employeeSerial: employee.employeeSerial,
        employeeCode: employee.employeeCode,

        fullName: employee.fullName,
        nickName: employee.nickName,

        phoneNumber: employee.phoneNumber,
        email: employee.email,

        dateOfBirth: employee.dateOfBirth,

        state: employee.state,
        city: employee.city,
        district: employee.district,
        pincode: employee.pincode,
        address: employee.address,

        qualification: employee.qualification,

        department: employee.department
            ? {
                slug: employee.department.slug,
                name: employee.department.departmentName,
            }
            : null,

        designation: employee.designation
            ? {
                slug: employee.designation.slug,
                name: employee.designation.designationName,
                level: employee.designation.designationLevel,
            }
            : null,

        natureOfAppointment: employee.natureOfAppointment,

        joiningDate: employee.joiningDate,

        payBand: employee.payBand
            ? {
                slug: employee.payBand.slug,
                name: employee.payBand.payBandName,
            }
            : null,

        jobRoleDescription: employee.jobRoleDescription,

        isDrfApplicable: employee.isDrfApplicable,

        employmentStatus: employee.employmentStatus,

        bankDetail: employee.bankDetail
            ? {
                bankName: employee.bankDetail.bankName,
                bankAccountNumber:
                    employee.bankDetail.bankAccountNumber,
                ifscCode: employee.bankDetail.ifscCode,
                panNumber: employee.bankDetail.panNumber,
                uanNumber: employee.bankDetail.uanNumber,
                aadharNumber: employee.bankDetail.aadharNumber,
            }
            : null,

        loginSetting: employee.loginSetting
            ? {
                loginStatus:
                    employee.loginSetting.loginStatus,

                inBufferMinutes:
                    employee.loginSetting.inBufferMinutes,

                outBufferMinutes:
                    employee.loginSetting.outBufferMinutes,
            }
            : null,

        loginAccount: employee.user
            ? {
                slug: employee.user.slug,
                email: employee.user.email,
                role: employee.user.role,
                isActive: employee.user.isActive,
            }
            : null,

        transferGroupSlug:
            employee.transferGroupSlug,

        transferSequence:
            employee.transferSequence,

        previousEmployeeSlug:
            employee.previousEmployeeSlug,

        isTransferred:
            employee.isTransferred,

        transferredAt:
            employee.transferredAt,

        status: employee.status,
        isActive: employee.isActive,
        deletedAt: employee.deletedAt,

        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
    };
};

const resolveEmployeeMasters = async ({
    schoolSlug,
    department,
    designation,
    payBand,
    db,
}) => {
    const departmentData =
        await findEmployeeDepartmentByNameRepo(
            schoolSlug,
            department,
            db,
        );

    if (!departmentData) {
        throw new Error("Department not found");
    }

    const designationData =
        await findEmployeeDesignationByNameRepo(
            schoolSlug,
            departmentData.slug,
            designation,
            db,
        );

    if (!designationData) {
        throw new Error(
            "Designation not found for selected department",
        );
    }

    const payBandData =
        await findEmployeePayBandByNameRepo(
            schoolSlug,
            payBand,
            db,
        );

    if (!payBandData) {
        throw new Error("Pay band not found");
    }

    return {
        departmentData,
        designationData,
        payBandData,
    };
};

export const createEmployeeService = async ({
    schoolSlug,
    schoolCode,
    payload,
}) => {
    if (!schoolSlug) {
        throw new Error("School is required");
    }

    const existingEmail = await findEmployeeByEmailRepo(
        schoolSlug,
        payload.email,
    );

    if (existingEmail) {
        throw new Error(
            "Employee with this email already exists",
        );
    }

    const existingPhone = await findEmployeeByPhoneRepo(
        schoolSlug,
        payload.phoneNumber,
    );

    if (existingPhone) {
        throw new Error(
            "Employee with this phone number already exists",
        );
    }

    if (payload.employeeCode) {
        const existingCode = await findEmployeeByCodeRepo(
            schoolSlug,
            payload.employeeCode,
        );

        if (existingCode) {
            throw new Error(
                "Employee code already exists",
            );
        }
    }

    const result = await runEmployeeTransactionRepo(
        async (tx) => {
            const {
                departmentData,
                designationData,
                payBandData,
            } = await resolveEmployeeMasters({
                schoolSlug,
                department: payload.department,
                designation: payload.designation,
                payBand: payload.payBand,
                db: tx,
            });

            const lastEmployee =
                await findLastEmployeeSerialRepo(
                    schoolSlug,
                    tx,
                );

            const employeeSerial =
                (lastEmployee?.employeeSerial || 0) + 1;

            const employeeId = generateEmployeeId(
                employeeSerial,
                payload.joiningDate,
            );

            let user = null;

            if (payload.createLogin) {
                const loginEmail =
                    payload.loginEmail || payload.email;

                const existingUser =
                    await findUserByEmailRepo(
                        schoolSlug,
                        loginEmail,
                        tx,
                    );

                if (existingUser) {
                    throw new Error(
                        "Login account with this email already exists",
                    );
                }

                const hashedPassword =
                    await bcrypt.hash(
                        payload.password,
                        10,
                    );

                user = await createEmployeeUserRepo(
                    {
                        slug: generateSlug(),
                        name: payload.fullName,
                        email: loginEmail,
                        password: hashedPassword,
                        role: payload.loginRole,
                        schoolSlug,
                        schoolCode:
                            schoolCode || null,
                        isActive: true,
                    },
                    tx,
                );
            }

            const employee =
                await createEmployeeRepo(
                    {
                        slug: generateSlug(),

                        schoolSlug,

                        userSlug:
                            user?.slug || null,

                        employeeId,
                        employeeSerial,

                        employeeCode:
                            normalizeOptionalValue(
                                payload.employeeCode,
                            ),

                        fullName: payload.fullName,

                        nickName:
                            normalizeOptionalValue(
                                payload.nickName,
                            ),

                        phoneNumber:
                            payload.phoneNumber,

                        email: payload.email,

                        dateOfBirth: new Date(
                            payload.dateOfBirth,
                        ),

                        state:
                            normalizeOptionalValue(
                                payload.state,
                            ),

                        city:
                            normalizeOptionalValue(
                                payload.city,
                            ),

                        district:
                            normalizeOptionalValue(
                                payload.district,
                            ),

                        pincode:
                            normalizeOptionalValue(
                                payload.pincode,
                            ),

                        address:
                            normalizeOptionalValue(
                                payload.address,
                            ),

                        qualification:
                            payload.qualification,

                        departmentSlug:
                            departmentData.slug,

                        designationSlug:
                            designationData.slug,

                        natureOfAppointment:
                            payload.natureOfAppointment,

                        payBandSlug:
                            payBandData.slug,

                        joiningDate: new Date(
                            payload.joiningDate,
                        ),

                        jobRoleDescription:
                            payload.jobRoleDescription,

                        isDrfApplicable:
                            payload.isDrfApplicable ??
                            false,

                        employmentStatus:
                            "ACTIVE",
                    },
                    tx,
                );

            const hasBankData =
                payload.bankName ||
                payload.bankAccountNumber ||
                payload.ifscCode ||
                payload.panNumber ||
                payload.uanNumber ||
                payload.aadharNumber;

            if (hasBankData) {
                await createEmployeeBankDetailRepo(
                    {
                        slug: generateSlug(),

                        schoolSlug,
                        employeeSlug:
                            employee.slug,

                        bankName:
                            normalizeOptionalValue(
                                payload.bankName,
                            ),

                        bankAccountNumber:
                            normalizeOptionalValue(
                                payload.bankAccountNumber,
                            ),

                        ifscCode:
                            normalizeOptionalValue(
                                payload.ifscCode,
                            ),

                        panNumber:
                            normalizeOptionalValue(
                                payload.panNumber,
                            ),

                        uanNumber:
                            normalizeOptionalValue(
                                payload.uanNumber,
                            ),

                        aadharNumber:
                            normalizeOptionalValue(
                                payload.aadharNumber,
                            ),
                    },
                    tx,
                );
            }

            await createEmployeeLoginSettingRepo(
                {
                    slug: generateSlug(),

                    schoolSlug,

                    employeeSlug:
                        employee.slug,

                    loginStatus:
                        payload.loginStatus ||
                        "DEFAULT",

                    inBufferMinutes:
                        payload.loginStatus ===
                            "FLEXIBLE"
                            ? payload.inBufferMinutes
                            : null,

                    outBufferMinutes:
                        payload.loginStatus ===
                            "FLEXIBLE"
                            ? payload.outBufferMinutes
                            : null,
                },
                tx,
            );

            return employee;
        },
    );

    return getEmployeeBySlugService({
        schoolSlug,
        slug: result.slug,
    });
};

export const getEmployeesService = async ({
    schoolSlug,
    query,
}) => {
    let departmentSlug = null;
    let designationSlug = null;

    if (query.department) {
        const department =
            await findEmployeeDepartmentByNameRepo(
                schoolSlug,
                query.department,
            );

        if (!department) {
            return [];
        }

        departmentSlug = department.slug;

        if (query.designation) {
            const designation =
                await findEmployeeDesignationByNameRepo(
                    schoolSlug,
                    department.slug,
                    query.designation,
                );

            if (!designation) {
                return [];
            }

            designationSlug =
                designation.slug;
        }
    }

    const employees =
        await getEmployeesRepo({
            schoolSlug,

            search:
                query.search?.trim() ||
                null,

            departmentSlug,
            designationSlug,

            natureOfAppointment:
                query.natureOfAppointment ||
                null,

            employmentStatus:
                query.employmentStatus ||
                null,

            status:
                query.status || null,
        });

    return employees.map(
        formatEmployeeResponse,
    );
};

export const getEmployeeBySlugService = async ({
    schoolSlug,
    slug,
}) => {
    const employee =
        await getEmployeeBySlugRepo(
            schoolSlug,
            slug,
        );

    if (!employee) {
        throw new Error(
            "Employee not found",
        );
    }

    return formatEmployeeResponse(
        employee,
    );
};

export const updateEmployeeService = async ({
    schoolSlug,
    slug,
    payload,
}) => {
    const existingEmployee =
        await getEmployeeBySlugRepo(
            schoolSlug,
            slug,
        );

    if (!existingEmployee) {
        throw new Error(
            "Employee not found",
        );
    }

    if (payload.email) {
        const duplicateEmail =
            await findEmployeeByEmailRepo(
                schoolSlug,
                payload.email,
                slug,
            );

        if (duplicateEmail) {
            throw new Error(
                "Employee with this email already exists",
            );
        }
    }

    if (payload.phoneNumber) {
        const duplicatePhone =
            await findEmployeeByPhoneRepo(
                schoolSlug,
                payload.phoneNumber,
                slug,
            );

        if (duplicatePhone) {
            throw new Error(
                "Employee with this phone number already exists",
            );
        }
    }

    if (payload.employeeCode) {
        const duplicateCode =
            await findEmployeeByCodeRepo(
                schoolSlug,
                payload.employeeCode,
                slug,
            );

        if (duplicateCode) {
            throw new Error(
                "Employee code already exists",
            );
        }
    }

    await runEmployeeTransactionRepo(
        async (tx) => {
            let departmentSlug =
                existingEmployee.department.slug;

            let designationSlug =
                existingEmployee.designation.slug;

            let payBandSlug =
                existingEmployee.payBand.slug;

            if (
                payload.department ||
                payload.designation
            ) {
                const departmentName =
                    payload.department ||
                    existingEmployee.department.name;

                const designationName =
                    payload.designation ||
                    existingEmployee.designation.name;

                const department =
                    await findEmployeeDepartmentByNameRepo(
                        schoolSlug,
                        departmentName,
                        tx,
                    );

                if (!department) {
                    throw new Error(
                        "Department not found",
                    );
                }

                const designation =
                    await findEmployeeDesignationByNameRepo(
                        schoolSlug,
                        department.slug,
                        designationName,
                        tx,
                    );

                if (!designation) {
                    throw new Error(
                        "Designation not found for selected department",
                    );
                }

                departmentSlug =
                    department.slug;

                designationSlug =
                    designation.slug;
            }

            if (payload.payBand) {
                const payBand =
                    await findEmployeePayBandByNameRepo(
                        schoolSlug,
                        payload.payBand,
                        tx,
                    );

                if (!payBand) {
                    throw new Error(
                        "Pay band not found",
                    );
                }

                payBandSlug =
                    payBand.slug;
            }

            const employeeData = {};

            if (
                payload.fullName !== undefined
            ) {
                employeeData.fullName =
                    payload.fullName;
            }

            if (
                payload.nickName !== undefined
            ) {
                employeeData.nickName =
                    normalizeOptionalValue(
                        payload.nickName,
                    );
            }

            if (
                payload.employeeCode !==
                undefined
            ) {
                employeeData.employeeCode =
                    normalizeOptionalValue(
                        payload.employeeCode,
                    );
            }

            if (
                payload.phoneNumber !==
                undefined
            ) {
                employeeData.phoneNumber =
                    payload.phoneNumber;
            }

            if (
                payload.email !== undefined
            ) {
                employeeData.email =
                    payload.email;
            }

            if (
                payload.dateOfBirth !==
                undefined
            ) {
                employeeData.dateOfBirth =
                    payload.dateOfBirth
                        ? new Date(
                            payload.dateOfBirth,
                        )
                        : null;
            }

            for (const field of [
                "state",
                "city",
                "district",
                "pincode",
                "address",
                "qualification",
                "jobRoleDescription",
            ]) {
                if (
                    payload[field] !== undefined
                ) {
                    employeeData[field] =
                        normalizeOptionalValue(
                            payload[field],
                        );
                }
            }

            if (
                payload.natureOfAppointment !==
                undefined
            ) {
                employeeData.natureOfAppointment =
                    payload.natureOfAppointment;
            }

            if (
                payload.joiningDate !==
                undefined
            ) {
                employeeData.joiningDate =
                    payload.joiningDate
                        ? new Date(
                            payload.joiningDate,
                        )
                        : existingEmployee.joiningDate;
            }

            if (
                payload.isDrfApplicable !==
                undefined
            ) {
                employeeData.isDrfApplicable =
                    payload.isDrfApplicable;
            }

            if (
                payload.employmentStatus !==
                undefined
            ) {
                employeeData.employmentStatus =
                    payload.employmentStatus;
            }

            employeeData.departmentSlug =
                departmentSlug;

            employeeData.designationSlug =
                designationSlug;

            employeeData.payBandSlug =
                payBandSlug;

            await updateEmployeeRepo(
                slug,
                employeeData,
                tx,
            );

            const hasBankFields = [
                "bankName",
                "bankAccountNumber",
                "ifscCode",
                "panNumber",
                "uanNumber",
                "aadharNumber",
            ].some(
                (field) =>
                    payload[field] !==
                    undefined,
            );

            if (hasBankFields) {
                await upsertEmployeeBankDetailRepo(
                    slug,
                    {
                        slug: generateSlug(),
                        schoolSlug,

                        ...(payload.bankName !== undefined && {
                            bankName:
                                normalizeOptionalValue(
                                    payload.bankName,
                                ),
                        }),

                        ...(payload.bankAccountNumber !== undefined && {
                            bankAccountNumber:
                                normalizeOptionalValue(
                                    payload.bankAccountNumber,
                                ),
                        }),

                        ...(payload.ifscCode !== undefined && {
                            ifscCode:
                                normalizeOptionalValue(
                                    payload.ifscCode,
                                ),
                        }),

                        ...(payload.panNumber !== undefined && {
                            panNumber:
                                normalizeOptionalValue(
                                    payload.panNumber,
                                ),
                        }),

                        ...(payload.uanNumber !== undefined && {
                            uanNumber:
                                normalizeOptionalValue(
                                    payload.uanNumber,
                                ),
                        }),

                        ...(payload.aadharNumber !== undefined && {
                            aadharNumber:
                                normalizeOptionalValue(
                                    payload.aadharNumber,
                                ),
                        }),
                    },
                    tx,
                );
            }

            if (
                existingEmployee.userSlug &&
                payload.fullName
            ) {
                await updateEmployeeUserRepo(
                    existingEmployee.userSlug,
                    {
                        name: payload.fullName,
                    },
                    tx,
                );
            }
        },
    );

    return getEmployeeBySlugService({
        schoolSlug,
        slug,
    });
};

export const deleteEmployeeService = async ({
    schoolSlug,
    slug,
}) => {
    const employee =
        await getEmployeeBySlugRepo(
            schoolSlug,
            slug,
        );

    if (!employee) {
        throw new Error(
            "Employee not found",
        );
    }

    if (!employee.isActive) {
        throw new Error(
            "Employee is already inactive",
        );
    }

    await runEmployeeTransactionRepo(
        async (tx) => {
            await updateEmployeeRepo(
                slug,
                {
                    status: "inactive",
                    isActive: false,
                    deletedAt: new Date(),
                },
                tx,
            );

            if (employee.userSlug) {
                await disableEmployeeUserRepo(
                    employee.userSlug,
                    tx,
                );
            }
        },
    );

    return true;
};

export const restoreEmployeeService = async ({
    schoolSlug,
    slug,
}) => {
    const employee =
        await getEmployeeBySlugRepo(
            schoolSlug,
            slug,
        );

    if (!employee) {
        throw new Error(
            "Employee not found",
        );
    }

    if (
        employee.isTransferred
    ) {
        throw new Error(
            "Transferred employee record cannot be restored",
        );
    }

    if (employee.isActive) {
        throw new Error(
            "Employee is already active",
        );
    }

    await updateEmployeeRepo(
        slug,
        {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
    );

    return true;
};

export const updateEmployeeLoginSettingService =
    async ({
        schoolSlug,
        slug,
        payload,
    }) => {
        const employee =
            await getEmployeeBySlugRepo(
                schoolSlug,
                slug,
            );

        if (!employee) {
            throw new Error(
                "Employee not found",
            );
        }

        if (!employee.isActive) {
            throw new Error(
                "Inactive employee cannot be updated",
            );
        }

        await upsertEmployeeLoginSettingRepo(
            slug,
            {
                schoolSlug,
                slug: generateSlug(),

                loginStatus:
                    payload.loginStatus,

                inBufferMinutes:
                    payload.loginStatus ===
                        "FLEXIBLE"
                        ? payload.inBufferMinutes
                        : null,

                outBufferMinutes:
                    payload.loginStatus ===
                        "FLEXIBLE"
                        ? payload.outBufferMinutes
                        : null,
            },
        );

        return getEmployeeBySlugService({
            schoolSlug,
            slug,
        });
    };

export const createEmployeeLoginService =
    async ({
        schoolSlug,
        schoolCode,
        slug,
        payload,
    }) => {
        const employee =
            await getEmployeeBySlugRepo(
                schoolSlug,
                slug,
            );

        if (!employee) {
            throw new Error(
                "Employee not found",
            );
        }

        if (!employee.isActive) {
            throw new Error(
                "Inactive employee cannot receive login access",
            );
        }

        if (employee.userSlug) {
            throw new Error(
                "Employee already has a login account",
            );
        }

        const existingUser =
            await findUserByEmailRepo(
                schoolSlug,
                payload.email,
            );

        if (existingUser) {
            throw new Error(
                "Login account with this email already exists",
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                payload.password,
                10,
            );

        await runEmployeeTransactionRepo(
            async (tx) => {
                const user =
                    await createEmployeeUserRepo(
                        {
                            slug: generateSlug(),

                            name:
                                employee.fullName,

                            email:
                                payload.email,

                            password:
                                hashedPassword,

                            role:
                                payload.role,

                            schoolSlug,

                            schoolCode:
                                schoolCode || null,

                            isActive: true,
                        },
                        tx,
                    );

                await updateEmployeeRepo(
                    slug,
                    {
                        userSlug: user.slug,
                    },
                    tx,
                );
            },
        );

        return getEmployeeBySlugService({
            schoolSlug,
            slug,
        });
    };

export const updateEmployeeLoginAccessService =
    async ({
        schoolSlug,
        slug,
        isActive,
    }) => {
        const employee =
            await getEmployeeBySlugRepo(
                schoolSlug,
                slug,
            );

        if (!employee) {
            throw new Error(
                "Employee not found",
            );
        }

        if (!employee.userSlug) {
            throw new Error(
                "Employee does not have a login account",
            );
        }

        if (
            isActive &&
            !employee.isActive
        ) {
            throw new Error(
                "Inactive employee login cannot be enabled",
            );
        }

        if (isActive) {
            await enableEmployeeUserRepo(
                employee.userSlug,
            );
        } else {
            await disableEmployeeUserRepo(
                employee.userSlug,
            );
        }

        return getEmployeeBySlugService({
            schoolSlug,
            slug,
        });
    };

export const transferEmployeeService = async ({
    schoolSlug,
    slug,
    payload,
}) => {
    const existingEmployee =
        await getEmployeeBySlugRepo(
            schoolSlug,
            slug,
        );

    if (!existingEmployee) {
        throw new Error(
            "Employee not found",
        );
    }

    if (!existingEmployee.isActive) {
        throw new Error(
            "Only active employee can be transferred",
        );
    }

    if (existingEmployee.isTransferred) {
        throw new Error(
            "Employee is already transferred",
        );
    }

    const department =
        await findEmployeeDepartmentByNameRepo(
            schoolSlug,
            payload.department,
        );

    if (!department) {
        throw new Error(
            "Department not found",
        );
    }

    const designation =
        await findEmployeeDesignationByNameRepo(
            schoolSlug,
            department.slug,
            payload.designation,
        );

    if (!designation) {
        throw new Error(
            "Designation not found for selected department",
        );
    }

    const payBand =
        await findEmployeePayBandByNameRepo(
            schoolSlug,
            payload.payBand,
        );

    if (!payBand) {
        throw new Error(
            "Pay band not found",
        );
    }

    const sameDepartment =
        existingEmployee.departmentSlug ===
        department.slug;

    const sameDesignation =
        existingEmployee.designationSlug ===
        designation.slug;

    const samePayBand =
        existingEmployee.payBandSlug ===
        payBand.slug;

    if (
        sameDepartment &&
        sameDesignation &&
        samePayBand
    ) {
        throw new Error(
            "Please select a different department, designation or pay band",
        );
    }

    const newEmployeeSlug =
        generateSlug();

    await runEmployeeTransactionRepo(
        async (tx) => {
            // User relation unique hai, isliye old row se pehle detach karna hai.
            if (existingEmployee.userSlug) {
                await updateEmployeeRepo(
                    existingEmployee.slug,
                    {
                        userSlug: null,
                    },
                    tx,
                );
            }

            await createTransferredEmployeeRepo(
                {
                    slug: newEmployeeSlug,

                    schoolSlug:
                        existingEmployee.schoolSlug,

                    userSlug:
                        existingEmployee.userSlug ||
                        null,

                    employeeId:
                        existingEmployee.employeeId,

                    employeeSerial:
                        existingEmployee.employeeSerial,

                    employeeCode:
                        existingEmployee.employeeCode,

                    fullName:
                        existingEmployee.fullName,

                    nickName:
                        existingEmployee.nickName,

                    phoneNumber:
                        existingEmployee.phoneNumber,

                    email:
                        existingEmployee.email,

                    dateOfBirth:
                        existingEmployee.dateOfBirth,

                    state:
                        existingEmployee.state,

                    city:
                        existingEmployee.city,

                    district:
                        existingEmployee.district,

                    pincode:
                        existingEmployee.pincode,

                    address:
                        existingEmployee.address,

                    qualification:
                        existingEmployee.qualification,

                    departmentSlug:
                        department.slug,

                    designationSlug:
                        designation.slug,

                    natureOfAppointment:
                        existingEmployee.natureOfAppointment,

                    payBandSlug:
                        payBand.slug,

                    joiningDate:
                        existingEmployee.joiningDate,

                    jobRoleDescription:
                        existingEmployee.jobRoleDescription,

                    isDrfApplicable:
                        existingEmployee.isDrfApplicable,

                    employmentStatus:
                        existingEmployee.employmentStatus,

                    transferGroupSlug:
                        existingEmployee.transferGroupSlug ||
                        existingEmployee.slug,

                    transferSequence:
                        (existingEmployee.transferSequence || 1) +
                        1,

                    previousEmployeeSlug:
                        existingEmployee.slug,

                    isTransferred: false,

                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
                tx,
            );

            // Existing bank record new employee record me move hoga.
            await moveEmployeeBankDetailRepo(
                existingEmployee.slug,
                newEmployeeSlug,
                tx,
            );

            // Existing attendance login setting bhi move hogi.
            await moveEmployeeLoginSettingRepo(
                existingEmployee.slug,
                newEmployeeSlug,
                tx,
            );

            // Purana employee record history ke liye inactive hoga.
            await markEmployeeTransferredRepo(
                existingEmployee.slug,
                {
                    userSlug: null,

                    isTransferred: true,

                    transferredAt:
                        new Date(),

                    status: "inactive",

                    isActive: false,

                    // Transfer delete nahi hai.
                    deletedAt: null,
                },
                tx,
            );
        },
    );

    return getEmployeeBySlugService({
        schoolSlug,
        slug: newEmployeeSlug,
    });
};