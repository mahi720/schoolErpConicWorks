import { randomUUID } from "crypto";

import {
    findCurrentOvertimeEmployeeRepo,
    findOvertimeEmployeeRepo,
    createOvertimeRequestRepo,
    getMyOvertimeRequestsRepo,
    getAllOvertimeRequestsRepo,
    findOvertimeRequestBySlugRepo,
    updateOvertimeRequestRepo,
    getAssignedOvertimeRequestsRepo,
    findOvertimeEmployeesByUserSlugsRepo,
} from "../../../../repositories/HRM/request/overtimeRequest/overtimeRequest.repository.js";

const buildEmployeeDisplay = (employee) => {
    if (!employee) {
        return null;
    }

    return {
        slug: employee.slug || null,

        fullName: employee.fullName || null,

        employeeId: employee.employeeId || employee.employeeCode || null,
    };
};

const canTakeOvertimeAction = ({ overtime, currentEmployee, user }) => {
    if (user?.role === "SUPER_ADMIN") {
        return true;
    }

    if (currentEmployee && overtime.appointedBySlug === currentEmployee.slug) {
        return true;
    }

    return false;
};


const parseDate = (value) => {
    if (!value) {
        throw new Error("Date is required");
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    return date;
};

const formatOvertimeRequest = (item, employeeByUserSlug = new Map()) => {
    if (!item) {
        return null;
    }

    const approvedEmployee = item.approvedBy?.slug
        ? employeeByUserSlug.get(item.approvedBy.slug)
        : null;

    const rejectedEmployee = item.rejectedBy?.slug
        ? employeeByUserSlug.get(item.rejectedBy.slug)
        : null;

    return {
        slug: item.slug,

        employeeSlug: item.employeeSlug,

        description: item.description,

        date: item.overtimeDate,

        overtimeDate: item.overtimeDate,

        requestedHours: Number(item.hoursSpent || 0),

        hoursSpent: Number(item.hoursSpent || 0),

        requestStatus: item.requestStatus,

        status: item.requestStatus,

        remark: item.remark,

        requestedBy: buildEmployeeDisplay(item.employee),

        assignedBy: buildEmployeeDisplay(item.appointedBy),

        approvedBy: item.approvedBy
            ? {
                userSlug: item.approvedBy.slug,

                fullName: approvedEmployee?.fullName || item.approvedBy?.name || null,

                employeeId:
                    approvedEmployee?.employeeId ||
                    approvedEmployee?.employeeCode ||
                    null,
            }
            : null,

        approvedAt: item.approvedAt,

        rejectedBy: item.rejectedBy
            ? {
                userSlug: item.rejectedBy.slug,

                fullName: rejectedEmployee?.fullName || item.rejectedBy?.name || null,

                employeeId:
                    rejectedEmployee?.employeeId ||
                    rejectedEmployee?.employeeCode ||
                    null,
            }
            : null,

        rejectedAt: item.rejectedAt,

        department: item.employee?.department?.departmentName || "-",

        designation: item.employee?.designation?.designationName || "-",

        isActive: item.isActive,

        deletedAt: item.deletedAt,

        createdAt: item.createdAt,

        updatedAt: item.updatedAt,
    };
};

const formatOvertimeRequestRows =
    async ({
        schoolSlug,
        rows = [],
    }) => {
        const userSlugs = [
            ...new Set(
                rows.flatMap(
                    (item) => [
                        item.approvedBy
                            ?.slug,
                        item.rejectedBy
                            ?.slug,
                    ],
                ).filter(Boolean),
            ),
        ];

        const employees =
            await findOvertimeEmployeesByUserSlugsRepo({
                schoolSlug,

                userSlugs,
            });

        const employeeByUserSlug =
            new Map(
                employees.map(
                    (employee) => [
                        employee.userSlug,
                        employee,
                    ],
                ),
            );

        return rows.map(
            (item) =>
                formatOvertimeRequest(
                    item,
                    employeeByUserSlug,
                ),
        );
    };

const resolveActiveStatus = (value) => {
    if (value === "inactive") {
        return false;
    }

    if (value === "all") {
        return undefined;
    }

    return true;
};

export const createOvertimeRequestService = async ({
    schoolSlug,
    userSlug,
    payload,
}) => {
    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    if (!userSlug) {
        throw new Error("User not found");
    }

    const employee = await findCurrentOvertimeEmployeeRepo({
        schoolSlug,

        userSlug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const appointedBy = await findOvertimeEmployeeRepo({
        schoolSlug,

        value: payload.appointedBy,
    });

    if (!appointedBy) {
        throw new Error("Appointed employee not found");
    }

    const overtimeDate = parseDate(payload.date);

    const hoursSpent = Number(payload.hoursSpent);

    if (!Number.isFinite(hoursSpent) || hoursSpent <= 0) {
        throw new Error("Valid hours spent is required");
    }

    if (hoursSpent > 24) {
        throw new Error("Hours spent cannot exceed 24 hours");
    }

    const created = await createOvertimeRequestRepo({
        slug: randomUUID(),

        schoolSlug,

        employeeSlug: employee.slug,

        description: payload.description.trim(),

        appointedBySlug: appointedBy.slug,

        overtimeDate,

        hoursSpent,

        requestStatus: "PENDING",

        remark: null,

        approvedBySlug: null,

        approvedAt: null,

        rejectedBySlug: null,

        rejectedAt: null,

        status: "active",

        isActive: true,

        deletedAt: null,
    });

    return formatOvertimeRequest(created);
};

export const getAssignedOvertimeRequestsService = async ({
    schoolSlug,
    user,
    query = {},
}) => {
    if (user?.role === "SUPER_ADMIN") {
        const rows = await getAllOvertimeRequestsRepo({
            schoolSlug,

            search: query.search?.trim() || undefined,

            requestStatus: query.requestStatus || undefined,

            isActive: resolveActiveStatus(query.status),
        });

        return formatOvertimeRequestRows({
            schoolSlug,
            rows,
        });
    }

    const employee = await findCurrentOvertimeEmployeeRepo({
        schoolSlug,

        userSlug: user?.slug,
    });

    if (!employee) {
        throw new Error("Employee profile not found");
    }

    const rows = await getAssignedOvertimeRequestsRepo({
        schoolSlug,

        appointedBySlug: employee.slug,

        search: query.search?.trim() || undefined,

        requestStatus: query.requestStatus || undefined,

        isActive: resolveActiveStatus(query.status),
    });

    // return rows.map(formatOvertimeRequest);
    return formatOvertimeRequestRows({
        schoolSlug,
        rows,
    });
};

export const getMyOvertimeRequestsService = async ({
    schoolSlug,
    user,
    query = {},
}) => {
    if (user?.role === "SUPER_ADMIN") {
        return [];
    }

    const employee = await findCurrentOvertimeEmployeeRepo({
        schoolSlug,
        userSlug: user?.slug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const rows = await getMyOvertimeRequestsRepo({
        schoolSlug,

        employeeSlug: employee.slug,

        search: query.search?.trim() || undefined,

        requestStatus: query.requestStatus || undefined,

        isActive: resolveActiveStatus(query.status),
    });

    // return rows.map(formatOvertimeRequest);
    return formatOvertimeRequestRows({
        schoolSlug,
        rows,
    });
};

export const getAllOvertimeRequestsService = async ({
    schoolSlug,
    query = {},
}) => {
    const fromDate = query.fromDate ? parseDate(query.fromDate) : undefined;

    const toDate = query.toDate ? parseDate(query.toDate) : undefined;

    if (fromDate && toDate && toDate < fromDate) {
        throw new Error("To date cannot be before from date");
    }

    const rows = await getAllOvertimeRequestsRepo({
        schoolSlug,

        search: query.search?.trim() || undefined,

        employeeSlug: query.employeeSlug || undefined,

        requestStatus: query.requestStatus || undefined,

        isActive: resolveActiveStatus(query.status),

        fromDate,

        toDate,
    });

    // return rows.map(formatOvertimeRequest);
    return formatOvertimeRequestRows({
        schoolSlug,
        rows,
    });
};

export const getOvertimeRequestBySlugService = async ({
    schoolSlug,
    overtimeSlug,
    userSlug,
}) => {
    const overtime = await findOvertimeRequestBySlugRepo({
        schoolSlug,

        overtimeSlug,
    });

    if (!overtime) {
        throw new Error("Overtime request not found");
    }

    // Employee user ko doosre employee ki private request na mile.
    // Admin-side permissions later middleware se handle kar sakte ho.
    if (userSlug) {
        const currentEmployee = await findCurrentOvertimeEmployeeRepo({
            schoolSlug,

            userSlug,
        });

        if (currentEmployee && overtime.employeeSlug !== currentEmployee.slug) {
            // Yahan role/permission check laga sakte ho if required.
        }
    }

    // return formatOvertimeRequest(overtime);
    const formatted =
        await formatOvertimeRequestRows({
            schoolSlug,

            rows: [
                overtime,
            ],
        });

    return formatted[0] || null;
};

export const approveOvertimeRequestService = async ({
    schoolSlug,
    overtimeSlug,
    payload,
    user,
}) => {
    const overtime = await findOvertimeRequestBySlugRepo({
        schoolSlug,
        overtimeSlug,
    });

    if (!overtime) {
        throw new Error("Overtime request not found");
    }

    if (!overtime.isActive) {
        throw new Error("Inactive overtime request cannot be approved");
    }

    if (overtime.requestStatus !== "PENDING") {
        throw new Error("Only pending overtime request can be approved");
    }

    let currentEmployee = null;

    if (user?.role !== "SUPER_ADMIN") {
        currentEmployee = await findCurrentOvertimeEmployeeRepo({
            schoolSlug,

            userSlug: user?.slug,
        });

        if (!currentEmployee) {
            throw new Error("Employee profile not found");
        }
    }

    const allowed = canTakeOvertimeAction({
        overtime,
        currentEmployee,
        user,
    });

    if (!allowed) {
        throw new Error("You are not authorized to approve this overtime request");
    }

    if (!allowed) {
        throw new Error("You are not authorized to approve this overtime request");
    }

    const updated = await updateOvertimeRequestRepo({
        overtimeSlug,

        data: {
            requestStatus: "APPROVED",
            remark: payload.remark.trim(),
            approvedBy: {
                connect: {
                    slug: user.slug,
                },
            },
            approvedAt: new Date(),
            rejectedBy: {
                disconnect: true,
            },

            rejectedAt: null,
        },
    });

    // return formatOvertimeRequest(updated);
    const formatted =
        await formatOvertimeRequestRows({
            schoolSlug,

            rows: [
                updated,
            ],
        });

    return formatted[0] || null;
};

export const rejectOvertimeRequestService = async ({
    schoolSlug,
    overtimeSlug,
    payload,
    user,
}) => {
    const overtime =
        await findOvertimeRequestBySlugRepo({
            schoolSlug,
            overtimeSlug,
        });

    if (!overtime) {
        throw new Error(
            "Overtime request not found",
        );
    }

    if (!overtime.isActive) {
        throw new Error(
            "Inactive overtime request cannot be rejected",
        );
    }

    if (
        overtime.requestStatus !==
        "PENDING"
    ) {
        throw new Error(
            "Only pending overtime request can be rejected",
        );
    }

    let currentEmployee = null;

    if (
        user?.role !==
        "SUPER_ADMIN"
    ) {
        currentEmployee =
            await findCurrentOvertimeEmployeeRepo({
                schoolSlug,

                userSlug:
                    user?.slug,
            });

        if (!currentEmployee) {
            throw new Error(
                "Employee profile not found",
            );
        }
    }

    const allowed =
        canTakeOvertimeAction({
            overtime,
            currentEmployee,
            user,
        });

    if (!allowed) {
        throw new Error(
            "You are not authorized to reject this overtime request",
        );
    }

    const updated =
        await updateOvertimeRequestRepo({
            overtimeSlug,

            data: {
                requestStatus:
                    "REJECTED",

                remark:
                    payload.remark.trim(),

                rejectedBy: {
                    connect: {
                        slug:
                            user.slug,
                    },
                },

                rejectedAt:
                    new Date(),

                approvedBy: {
                    disconnect:
                        true,
                },

                approvedAt:
                    null,
            },
        });

    // const formatted =
    //     await formatOvertimeRequestRows({
    //         schoolSlug,

    //         rows: [
    //             updated,
    //         ],
    //     });

    // return formatted[0] || null;
    return formatOvertimeRequest(updated);
};

export const deleteOvertimeRequestService = async ({
    schoolSlug,
    overtimeSlug,
    userSlug,
}) => {
    const overtime = await findOvertimeRequestBySlugRepo({
        schoolSlug,

        overtimeSlug,
    });

    if (!overtime) {
        throw new Error("Overtime request not found");
    }

    if (!overtime.isActive) {
        throw new Error("Overtime request is already deleted");
    }

    const currentEmployee = await findCurrentOvertimeEmployeeRepo({
        schoolSlug,

        userSlug,
    });

    if (currentEmployee && overtime.employeeSlug !== currentEmployee.slug) {
        throw new Error("You cannot delete another employee's overtime request");
    }

    if (overtime.requestStatus === "APPROVED") {
        throw new Error("Approved overtime request cannot be deleted");
    }

    const updated = await updateOvertimeRequestRepo({
        overtimeSlug,

        data: {
            status: "inactive",

            isActive: false,

            deletedAt: new Date(),
        },
    });

    // return formatOvertimeRequest(updated);
    const formatted =
        await formatOvertimeRequestRows({
            schoolSlug,

            rows: [
                updated,
            ],
        });

    return formatted[0] || null;
};

export const restoreOvertimeRequestService = async ({
    schoolSlug,
    overtimeSlug,
}) => {
    const overtime = await findOvertimeRequestBySlugRepo({
        schoolSlug,

        overtimeSlug,
    });

    if (!overtime) {
        throw new Error("Overtime request not found");
    }

    if (overtime.isActive) {
        throw new Error("Overtime request is already active");
    }

    const updated = await updateOvertimeRequestRepo({
        overtimeSlug,

        data: {
            status: "active",

            isActive: true,

            deletedAt: null,
        },
    });

    // return formatOvertimeRequest(updated);
    const formatted =
        await formatOvertimeRequestRows({
            schoolSlug,

            rows: [
                updated,
            ],
        });

    return formatted[0] || null;
};
