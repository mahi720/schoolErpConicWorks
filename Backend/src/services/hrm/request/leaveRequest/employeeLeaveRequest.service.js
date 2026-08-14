import { randomUUID } from "crypto";

import {
    findLeaveEmployeeRepo,
    findLeaveTypeRepo,
    findEmployeeLeaveOverlapRepo,
    createEmployeeLeaveRequestRepo,
    getEmployeeLeaveRequestsRepo,
    findEmployeeLeaveRequestBySlugRepo,
    updateEmployeeLeaveRequestRepo,
    createEmployeeLeaveRequestLogRepo,
    getEmployeeLeaveRequestLogsRepo,
    runEmployeeLeaveTransactionRepo,
} from "../../../../repositories/hrm/request/leaveRequest/employeeLeaveRequest.repository.js";

const parseDate = (
    value,
) => {
    const date =
        new Date(
            `${value}T00:00:00.000Z`,
        );

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        throw new Error(
            "Invalid leave date",
        );
    }

    return date;
};

const calculateTotalDays =
    ({
        leaveCategory,
        fromDate,
        toDate,
    }) => {
        if (
            leaveCategory ===
            "HALF_DAY"
        ) {
            return 0.5;
        }

        if (
            leaveCategory ===
            "FULL_DAY"
        ) {
            return 1;
        }

        const difference =
            toDate.getTime() -
            fromDate.getTime();

        return (
            Math.floor(
                difference /
                (1000 *
                    60 *
                    60 *
                    24),
            ) + 1
        );
    };

const formatLeaveRequest =
    (
        item,
    ) => {
        if (!item) {
            return null;
        }

        return {
            slug:
                item.slug,

            employeeSlug:
                item.employeeSlug,

            name:
                item.employee
                    ?.fullName ||
                "-",

            employeeId:
                item.employee
                    ?.employeeId ||
                item.employee
                    ?.employeeCode ||
                "-",

            department:
                item.employee
                    ?.department
                    ?.departmentName ||
                "-",

            designation:
                item.employee
                    ?.designation
                    ?.designationName ||
                "-",

            subject:
                item.subject,

            description:
                item.description,

            leaveCategory:
                item.leaveCategory,

            leaveTypeSlug:
                item.leaveTypeSlug,

            leaveType:
                item.leaveType
                    ?.leaveType ||
                "-",

            fromDate:
                item.fromDate,

            toDate:
                item.toDate,

            date:
                item.fromDate,

            totalDays:
                Number(
                    item.totalDays ||
                    0,
                ),

            document:
                item.document,

            documentName:
                item.documentName,

            status:
                item.requestStatus,

            requestStatus:
                item.requestStatus,

            payType:
                item.payType,

            numberOfDaysPaid:
                item.numberOfDaysPaid !==
                    null
                    ? Number(
                        item.numberOfDaysPaid,
                    )
                    : null,

            reply:
                item.reply,

            approvedAt:
                item.approvedAt,

            approvedBy:
                item.approvedBy ||
                null,

            rejectedAt:
                item.rejectedAt,

            rejectedBy:
                item.rejectedBy ||
                null,

            isActive:
                item.isActive,

            deletedAt:
                item.deletedAt,

            createdAt:
                item.createdAt,

            updatedAt:
                item.updatedAt,
        };
    };

const buildLeaveLog =
    ({
        schoolSlug,
        leaveRequest,
        previousStatus,
        newStatus,
        action,
        payType,
        numberOfDaysPaid,
        reply,
        user,
        metadata,
    }) => {
        return {
            slug:
                randomUUID(),

            schoolSlug,

            leaveRequestSlug:
                leaveRequest.slug,

            employeeSlug:
                leaveRequest.employeeSlug,

            action,

            previousStatus:
                previousStatus ||
                null,

            newStatus:
                newStatus ||
                null,

            payType:
                payType ||
                null,

            numberOfDaysPaid:
                numberOfDaysPaid ??
                null,

            reply:
                reply ||
                null,

            actorSlug:
                user?.slug ||
                null,

            actorName:
                user?.name ||
                null,

            actorEmail:
                user?.email ||
                null,

            ipAddress:
                metadata?.ipAddress ||
                null,

            userAgent:
                metadata?.userAgent ||
                null,
        };
    };

const resolveCreateData =
    async ({
        schoolSlug,
        payload,
        employeeValue,
        db,
    }) => {
        const employee =
            await findLeaveEmployeeRepo({
                schoolSlug,

                value:
                    employeeValue,

                db,
            });

        if (!employee) {
            throw new Error(
                "Active employee not found",
            );
        }

        const leaveType =
            await findLeaveTypeRepo({
                schoolSlug,

                value:
                    payload.leaveType,

                db,
            });

        if (!leaveType) {
            throw new Error(
                "Active leave type not found",
            );
        }

        const fromDate =
            parseDate(
                payload.fromDate,
            );

        const toDate =
            payload.leaveCategory ===
                "MULTI_DAY"
                ? parseDate(
                    payload.toDate,
                )
                : fromDate;

        if (
            toDate <
            fromDate
        ) {
            throw new Error(
                "To date cannot be before from date",
            );
        }

        const existing =
            await findEmployeeLeaveOverlapRepo({
                schoolSlug,

                employeeSlug:
                    employee.slug,

                fromDate,

                toDate,

                db,
            });

        if (existing) {
            throw new Error(
                `${employee.fullName} already has a pending or approved leave in selected date range`,
            );
        }

        const totalDays =
            calculateTotalDays({
                leaveCategory:
                    payload.leaveCategory,

                fromDate,

                toDate,
            });

        return {
            employee,

            leaveType,

            data: {
                slug:
                    randomUUID(),

                schoolSlug,

                employeeSlug:
                    employee.slug,

                leaveTypeSlug:
                    leaveType.slug,

                subject:
                    payload.subject,

                description:
                    payload.description,

                leaveCategory:
                    payload.leaveCategory,

                fromDate,

                toDate,

                totalDays,

                document:
                    payload.document ||
                    null,

                documentName:
                    payload.documentName ||
                    null,

                requestStatus:
                    "PENDING",

                payType:
                    null,

                numberOfDaysPaid:
                    null,

                reply:
                    null,

                status:
                    "active",

                isActive:
                    true,

                deletedAt:
                    null,
            },
        };
    };

export const createEmployeeLeaveRequestService =
    async ({
        schoolSlug,
        payload,
        user,
        metadata,
    }) => {
        return runEmployeeLeaveTransactionRepo(
            async (
                tx,
            ) => {
                const resolved =
                    await resolveCreateData({
                        schoolSlug,

                        payload,

                        employeeValue:
                            payload.employee,

                        db:
                            tx,
                    });

                const created =
                    await createEmployeeLeaveRequestRepo(
                        resolved.data,

                        tx,
                    );

                await createEmployeeLeaveRequestLogRepo(
                    buildLeaveLog({
                        schoolSlug,

                        leaveRequest:
                            created,

                        previousStatus:
                            null,

                        newStatus:
                            "PENDING",

                        action:
                            "CREATE",

                        user,

                        metadata,
                    }),

                    tx,
                );

                return formatLeaveRequest(
                    created,
                );
            },
        );
    };

export const bulkCreateEmployeeLeaveRequestService =
    async ({
        schoolSlug,
        payload,
        user,
        metadata,
    }) => {
        return runEmployeeLeaveTransactionRepo(
            async (
                tx,
            ) => {
                const results =
                    [];

                for (
                    const employeeSlug of payload.employeeSlugs
                ) {
                    const resolved =
                        await resolveCreateData({
                            schoolSlug,

                            payload,

                            employeeValue:
                                employeeSlug,

                            db:
                                tx,
                        });

                    const created =
                        await createEmployeeLeaveRequestRepo(
                            resolved.data,

                            tx,
                        );

                    await createEmployeeLeaveRequestLogRepo(
                        buildLeaveLog({
                            schoolSlug,

                            leaveRequest:
                                created,

                            previousStatus:
                                null,

                            newStatus:
                                "PENDING",

                            action:
                                "CREATE",

                            user,

                            metadata,
                        }),

                        tx,
                    );

                    results.push(
                        formatLeaveRequest(
                            created,
                        ),
                    );
                }

                return results;
            },
        );
    };

export const getEmployeeLeaveRequestsService =
    async ({
        schoolSlug,
        query,
    }) => {
        const isActive =
            query.status ===
                "inactive"
                ? false
                : query.status ===
                    "all"
                    ? undefined
                    : true;

        const data =
            await getEmployeeLeaveRequestsRepo({
                schoolSlug,

                search:
                    query.search
                        ?.trim() ||
                    undefined,

                requestStatus:
                    query.requestStatus ||
                    undefined,

                employeeSlug:
                    query.employeeSlug ||
                    undefined,

                isActive,
            });

        return data.map(
            formatLeaveRequest,
        );
    };

export const getEmployeeLeaveRequestBySlugService =
    async ({
        schoolSlug,
        leaveSlug,
    }) => {
        const data =
            await findEmployeeLeaveRequestBySlugRepo({
                schoolSlug,

                leaveSlug,
            });

        if (!data) {
            throw new Error(
                "Leave request not found",
            );
        }

        return formatLeaveRequest(
            data,
        );
    };

export const approveEmployeeLeaveRequestService =
    async ({
        schoolSlug,
        leaveSlug,
        payload,
        user,
        metadata,
    }) => {
        return runEmployeeLeaveTransactionRepo(
            async (
                tx,
            ) => {
                const leave =
                    await findEmployeeLeaveRequestBySlugRepo({
                        schoolSlug,

                        leaveSlug,

                        db:
                            tx,
                    });

                if (!leave) {
                    throw new Error(
                        "Leave request not found",
                    );
                }

                if (
                    !leave.isActive
                ) {
                    throw new Error(
                        "Inactive leave request cannot be approved",
                    );
                }

                if (
                    leave.requestStatus !==
                    "PENDING"
                ) {
                    throw new Error(
                        "Only pending leave request can be approved",
                    );
                }

                const leaveType =
                    await findLeaveTypeRepo({
                        schoolSlug,

                        value:
                            payload.leaveType,

                        db:
                            tx,
                    });

                if (!leaveType) {
                    throw new Error(
                        "Active leave type not found",
                    );
                }

                const totalDays =
                    Number(
                        leave.totalDays,
                    );

                const numberOfDaysPaid =
                    payload.payType ===
                        "PAID"
                        ? Number(
                            payload.numberOfDaysPaid,
                        )
                        : 0;

                if (
                    numberOfDaysPaid >
                    totalDays
                ) {
                    throw new Error(
                        "Paid days cannot exceed total leave days",
                    );
                }

                const previousStatus =
                    leave.requestStatus;

                const updated =
                    await updateEmployeeLeaveRequestRepo({
                        leaveSlug,

                        data: {
                            leaveTypeSlug:
                                leaveType.slug,

                            requestStatus:
                                "APPROVED",

                            payType:
                                payload.payType,

                            numberOfDaysPaid,

                            reply:
                                payload.reply ||
                                null,

                            approvedBySlug:
                                user?.slug ||
                                null,

                            approvedAt:
                                new Date(),

                            rejectedBySlug:
                                null,

                            rejectedAt:
                                null,
                        },

                        db:
                            tx,
                    });

                await createEmployeeLeaveRequestLogRepo(
                    buildLeaveLog({
                        schoolSlug,

                        leaveRequest:
                            updated,

                        previousStatus,

                        newStatus:
                            "APPROVED",

                        action:
                            "APPROVE",

                        payType:
                            payload.payType,

                        numberOfDaysPaid,

                        reply:
                            payload.reply,

                        user,

                        metadata,
                    }),

                    tx,
                );

                return formatLeaveRequest(
                    updated,
                );
            },
        );
    };

export const bulkApproveEmployeeLeaveRequestService =
    async ({
        schoolSlug,
        payload,
        user,
        metadata,
    }) => {
        return runEmployeeLeaveTransactionRepo(
            async (
                tx,
            ) => {
                const results =
                    [];

                for (
                    const leaveSlug of payload.leaveSlugs
                ) {
                    const leave =
                        await findEmployeeLeaveRequestBySlugRepo({
                            schoolSlug,

                            leaveSlug,

                            db:
                                tx,
                        });

                    if (!leave) {
                        throw new Error(
                            `Leave request not found: ${leaveSlug}`,
                        );
                    }

                    if (
                        !leave.isActive ||
                        leave.requestStatus !==
                        "PENDING"
                    ) {
                        throw new Error(
                            `${leave.employee?.fullName || "Employee"} leave request is not pending`,
                        );
                    }

                    const totalDays =
                        Number(
                            leave.totalDays,
                        );

                    const numberOfDaysPaid =
                        payload.payType ===
                            "PAID"
                            ? totalDays
                            : 0;

                    const updated =
                        await updateEmployeeLeaveRequestRepo({
                            leaveSlug,

                            data: {
                                requestStatus:
                                    "APPROVED",

                                payType:
                                    payload.payType,

                                numberOfDaysPaid,

                                reply:
                                    payload.reply,

                                approvedBySlug:
                                    user?.slug ||
                                    null,

                                approvedAt:
                                    new Date(),

                                rejectedBySlug:
                                    null,

                                rejectedAt:
                                    null,
                            },

                            db:
                                tx,
                        });

                    await createEmployeeLeaveRequestLogRepo(
                        buildLeaveLog({
                            schoolSlug,

                            leaveRequest:
                                updated,

                            previousStatus:
                                "PENDING",

                            newStatus:
                                "APPROVED",

                            action:
                                "BULK_APPROVE",

                            payType:
                                payload.payType,

                            numberOfDaysPaid,

                            reply:
                                payload.reply,

                            user,

                            metadata,
                        }),

                        tx,
                    );

                    results.push(
                        formatLeaveRequest(
                            updated,
                        ),
                    );
                }

                return results;
            },
        );
    };

export const rejectEmployeeLeaveRequestService =
    async ({
        schoolSlug,
        leaveSlug,
        payload,
        user,
        metadata,
    }) => {
        return runEmployeeLeaveTransactionRepo(
            async (
                tx,
            ) => {
                const leave =
                    await findEmployeeLeaveRequestBySlugRepo({
                        schoolSlug,

                        leaveSlug,

                        db:
                            tx,
                    });

                if (!leave) {
                    throw new Error(
                        "Leave request not found",
                    );
                }

                if (
                    leave.requestStatus !==
                    "PENDING"
                ) {
                    throw new Error(
                        "Only pending leave request can be rejected",
                    );
                }

                const updated =
                    await updateEmployeeLeaveRequestRepo({
                        leaveSlug,

                        data: {
                            requestStatus:
                                "REJECTED",

                            reply:
                                payload.reply,

                            payType:
                                null,

                            numberOfDaysPaid:
                                null,

                            rejectedBySlug:
                                user?.slug ||
                                null,

                            rejectedAt:
                                new Date(),
                        },

                        db:
                            tx,
                    });

                await createEmployeeLeaveRequestLogRepo(
                    buildLeaveLog({
                        schoolSlug,

                        leaveRequest:
                            updated,

                        previousStatus:
                            "PENDING",

                        newStatus:
                            "REJECTED",

                        action:
                            "REJECT",

                        reply:
                            payload.reply,

                        user,

                        metadata,
                    }),

                    tx,
                );

                return formatLeaveRequest(
                    updated,
                );
            },
        );
    };

export const deleteEmployeeLeaveRequestService =
    async ({
        schoolSlug,
        leaveSlug,
        user,
        metadata,
    }) => {
        return runEmployeeLeaveTransactionRepo(
            async (
                tx,
            ) => {
                const leave =
                    await findEmployeeLeaveRequestBySlugRepo({
                        schoolSlug,

                        leaveSlug,

                        db:
                            tx,
                    });

                if (!leave) {
                    throw new Error(
                        "Leave request not found",
                    );
                }

                if (
                    !leave.isActive
                ) {
                    throw new Error(
                        "Leave request is already deleted",
                    );
                }

                const updated =
                    await updateEmployeeLeaveRequestRepo({
                        leaveSlug,

                        data: {
                            status:
                                "inactive",

                            isActive:
                                false,

                            deletedAt:
                                new Date(),
                        },

                        db:
                            tx,
                    });

                await createEmployeeLeaveRequestLogRepo(
                    buildLeaveLog({
                        schoolSlug,

                        leaveRequest:
                            updated,

                        previousStatus:
                            leave.requestStatus,

                        newStatus:
                            leave.requestStatus,

                        action:
                            "DELETE",

                        user,

                        metadata,
                    }),

                    tx,
                );

                return formatLeaveRequest(
                    updated,
                );
            },
        );
    };

export const restoreEmployeeLeaveRequestService =
    async ({
        schoolSlug,
        leaveSlug,
        user,
        metadata,
    }) => {
        return runEmployeeLeaveTransactionRepo(
            async (
                tx,
            ) => {
                const leave =
                    await findEmployeeLeaveRequestBySlugRepo({
                        schoolSlug,

                        leaveSlug,

                        db:
                            tx,
                    });

                if (!leave) {
                    throw new Error(
                        "Leave request not found",
                    );
                }

                if (
                    leave.isActive
                ) {
                    throw new Error(
                        "Leave request is already active",
                    );
                }

                const updated =
                    await updateEmployeeLeaveRequestRepo({
                        leaveSlug,

                        data: {
                            status:
                                "active",

                            isActive:
                                true,

                            deletedAt:
                                null,
                        },

                        db:
                            tx,
                    });

                await createEmployeeLeaveRequestLogRepo(
                    buildLeaveLog({
                        schoolSlug,

                        leaveRequest:
                            updated,

                        previousStatus:
                            leave.requestStatus,

                        newStatus:
                            leave.requestStatus,

                        action:
                            "RESTORE",

                        user,

                        metadata,
                    }),

                    tx,
                );

                return formatLeaveRequest(
                    updated,
                );
            },
        );
    };

export const getEmployeeLeaveRequestLogsService =
    async ({
        schoolSlug,
        leaveSlug,
    }) => {
        const leave =
            await findEmployeeLeaveRequestBySlugRepo({
                schoolSlug,

                leaveSlug,
            });

        if (!leave) {
            throw new Error(
                "Leave request not found",
            );
        }

        return getEmployeeLeaveRequestLogsRepo({
            schoolSlug,

            leaveRequestSlug:
                leaveSlug,
        });
    };