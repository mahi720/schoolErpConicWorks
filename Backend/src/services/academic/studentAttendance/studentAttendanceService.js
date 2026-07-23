import crypto from "crypto";

import {
    createAttendanceDayRepo,
    createAttendanceLogRepo,
    createMonthlyAttendanceRepo,
    findAcademicMappingBySlugRepo,
    findAcademicMappingsForAttendanceRepo,
    findAttendanceDayByAttendanceAndDateRepo,
    findAttendanceDayBySlugRepo,
    findAttendanceDaysByMappingsRepo,
    findMonthlyAttendanceRepo,
    getAttendanceLogsRepo,
    getMonthlyAttendanceByMappingRepo,
    runAttendanceTransactionRepo,
    updateAttendanceDayRepo,
    updateMonthlyAttendanceRepo,
    createMissingMonthlyAttendancesRepo,
    getActiveAcademicMappingsForCronRepo,
} from "../../../repositories/academic/studentAttendance/studentAttendanceRepository.js";

import {
    calculateAttendanceSummary,
    createServiceError,
    getAttendanceDateParts,
} from "../../../utils/attendance/attendanceUtils.js";

const createAttendanceLogData = ({
    attendance,
    mapping,
    attendanceDate,
    year,
    month,
    day,
    action,
    previousStatus,
    currentStatus,
    previousData,
    currentData,
    performedBySlug,
    remarks,
    ipAddress,
    userAgent,
}) => {
    return {
        slug: crypto.randomUUID(),

        schoolSlug: attendance.schoolSlug,
        attendanceSlug: attendance.slug,

        studentSlug: mapping.studentSlug,
        sessionSlug: mapping.sessionSlug,
        boardSlug: mapping.boardSlug,
        classSlug: mapping.classSlug,
        sectionSlug: mapping.sectionSlug || null,
        streamSlug: mapping.streamSlug || null,

        academicMappingSlug: mapping.slug,

        attendanceDate,
        year,
        month,
        day,

        action,

        previousStatus: previousStatus || null,
        currentStatus: currentStatus || null,

        previousData: previousData || null,
        currentData: currentData || null,

        performedBySlug,

        remarks: remarks || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
    };
};

const updateMonthlyJsonAttendance = ({
    currentAttendance,
    dayKey,
    attendanceStatus,
}) => {
    return {
        ...(currentAttendance || {}),
        [dayKey]: attendanceStatus,
    };
};

const removeMonthlyJsonAttendance = ({
    currentAttendance,
    dayKey,
}) => {
    const updatedAttendance = {
        ...(currentAttendance || {}),
    };

    delete updatedAttendance[dayKey];

    return updatedAttendance;
};

export const getAttendanceStudentsService = async ({
    filters,
    user,
}) => {
    const {
        session,
        board,
        classTitle,
        sectionSlug,
        streamSlug,
        attendanceDate,
    } = filters;

    const { attendanceDate: parsedAttendanceDate } =
        getAttendanceDateParts(attendanceDate);

    const mappings = await findAcademicMappingsForAttendanceRepo({
        schoolSlug: user.schoolSlug,
        session,
        board,
        classTitle,
        sectionSlug,
        streamSlug,
    });

    if (!mappings.length) {
        return [];
    }

    const academicMappingSlugs = mappings.map((mapping) => mapping.slug);

    const attendanceDays = await findAttendanceDaysByMappingsRepo({
        schoolSlug: user.schoolSlug,
        academicMappingSlugs,
        attendanceDate: parsedAttendanceDate,
    });

    const attendanceDayMap = new Map(
        attendanceDays.map((attendanceDay) => [
            attendanceDay.academicMappingSlug,
            attendanceDay,
        ]),
    );

    return mappings.map((mapping) => {
        const attendanceDay = attendanceDayMap.get(mapping.slug) || null;

        return {
            academicMappingSlug: mapping.slug,

            rollNumberPrefix: mapping.rollNumberPrefix,
            rollNumber: mapping.rollNumber,

            student: mapping.student,
            session: mapping.session,
            board: mapping.board,
            class: mapping.class,
            section: mapping.section,
            stream: mapping.stream,

            attendance: attendanceDay
                ? {
                    daySlug: attendanceDay.slug,
                    attendanceStatus: attendanceDay.attendanceStatus,
                    attendanceDate: attendanceDay.attendanceDate,
                    isLocked: attendanceDay.isLocked,
                    markedAt: attendanceDay.markedAt,
                    markedBy: attendanceDay.markedBy,
                    lockedBy: attendanceDay.lockedBy,
                    status: attendanceDay.status,
                    isActive: attendanceDay.isActive,
                    deletedAt: attendanceDay.deletedAt,
                }
                : null,
        };
    });
};

export const markStudentAttendanceService = async ({
    payload,
    user,
    requestMeta,
}) => {
    const {
        attendanceDate,
        students,
        remarks,
    } = payload;

    const {
        attendanceDate: parsedAttendanceDate,
        year,
        month,
        day,
        dayKey,
    } = getAttendanceDateParts(attendanceDate);

    const duplicateMappings = students.filter(
        (student, index, array) =>
            array.findIndex(
                (item) =>
                    item.academicMappingSlug === student.academicMappingSlug,
            ) !== index,
    );

    if (duplicateMappings.length) {
        throw createServiceError(
            "Duplicate academic mapping found in attendance payload",
            400,
        );
    }

    return runAttendanceTransactionRepo(async (tx) => {
        const savedAttendances = [];

        for (const studentAttendance of students) {
            const mapping = await findAcademicMappingBySlugRepo({
                tx,
                schoolSlug: user.schoolSlug,
                academicMappingSlug: studentAttendance.academicMappingSlug,
            });

            if (!mapping) {
                throw createServiceError(
                    `Academic mapping not found: ${studentAttendance.academicMappingSlug}`,
                    404,
                );
            }

            let monthlyAttendance = await findMonthlyAttendanceRepo({
                tx,
                schoolSlug: user.schoolSlug,
                studentSlug: mapping.studentSlug,
                sessionSlug: mapping.sessionSlug,
                year,
                month,
            });

            if (!monthlyAttendance) {
                const attendanceJson = {
                    [dayKey]: studentAttendance.attendanceStatus,
                };

                const summary = calculateAttendanceSummary(attendanceJson);

                monthlyAttendance = await createMonthlyAttendanceRepo({
                    tx,

                    data: {
                        slug: crypto.randomUUID(),

                        schoolSlug: mapping.schoolSlug,
                        studentSlug: mapping.studentSlug,
                        sessionSlug: mapping.sessionSlug,
                        boardSlug: mapping.boardSlug,
                        classSlug: mapping.classSlug,
                        sectionSlug: mapping.sectionSlug || null,
                        streamSlug: mapping.streamSlug || null,
                        academicMappingSlug: mapping.slug,

                        year,
                        month,

                        attendance: attendanceJson,

                        ...summary,
                    },
                });
            }

            const existingDay =
                await findAttendanceDayByAttendanceAndDateRepo({
                    tx,
                    attendanceSlug: monthlyAttendance.slug,
                    attendanceDate: parsedAttendanceDate,
                });

            if (existingDay?.isLocked) {
                throw createServiceError(
                    `${mapping.student.studentName} attendance is locked`,
                    409,
                );
            }

            if (existingDay && !existingDay.isActive) {
                throw createServiceError(
                    `${mapping.student.studentName} attendance is deleted. Restore it first`,
                    409,
                );
            }

            const previousAttendanceJson = {
                ...(monthlyAttendance.attendance || {}),
            };

            const updatedAttendanceJson = updateMonthlyJsonAttendance({
                currentAttendance: monthlyAttendance.attendance,
                dayKey,
                attendanceStatus: studentAttendance.attendanceStatus,
            });

            const summary = calculateAttendanceSummary(
                updatedAttendanceJson,
            );

            monthlyAttendance = await updateMonthlyAttendanceRepo({
                tx,
                slug: monthlyAttendance.slug,

                data: {
                    attendance: updatedAttendanceJson,

                    sectionSlug: mapping.sectionSlug || null,
                    streamSlug: mapping.streamSlug || null,
                    academicMappingSlug: mapping.slug,

                    ...summary,

                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
            });

            let savedAttendanceDay;

            if (!existingDay) {
                savedAttendanceDay = await createAttendanceDayRepo({
                    tx,

                    data: {
                        slug: crypto.randomUUID(),

                        schoolSlug: mapping.schoolSlug,
                        attendanceSlug: monthlyAttendance.slug,

                        studentSlug: mapping.studentSlug,
                        sessionSlug: mapping.sessionSlug,
                        boardSlug: mapping.boardSlug,
                        classSlug: mapping.classSlug,
                        sectionSlug: mapping.sectionSlug || null,
                        streamSlug: mapping.streamSlug || null,
                        academicMappingSlug: mapping.slug,

                        attendanceDate: parsedAttendanceDate,

                        year,
                        month,
                        day,

                        attendanceStatus: studentAttendance.attendanceStatus,

                        markedBySlug: user.slug,
                        markedAt: new Date(),

                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                });

                await createAttendanceLogRepo({
                    tx,

                    data: createAttendanceLogData({
                        attendance: monthlyAttendance,
                        mapping,
                        attendanceDate: parsedAttendanceDate,
                        year,
                        month,
                        day,
                        action: "CREATE",
                        previousStatus: null,
                        currentStatus: studentAttendance.attendanceStatus,
                        previousData: null,
                        currentData: {
                            attendance: updatedAttendanceJson,
                        },
                        performedBySlug: user.slug,
                        remarks,
                        ipAddress: requestMeta.ipAddress,
                        userAgent: requestMeta.userAgent,
                    }),
                });
            } else {
                const previousStatus = existingDay.attendanceStatus;

                savedAttendanceDay = await updateAttendanceDayRepo({
                    tx,
                    slug: existingDay.slug,

                    data: {
                        attendanceStatus:
                            studentAttendance.attendanceStatus,

                        markedBySlug: user.slug,
                        markedAt: new Date(),

                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                });

                await createAttendanceLogRepo({
                    tx,

                    data: createAttendanceLogData({
                        attendance: monthlyAttendance,
                        mapping,
                        attendanceDate: parsedAttendanceDate,
                        year,
                        month,
                        day,
                        action: "UPDATE",
                        previousStatus,
                        currentStatus: studentAttendance.attendanceStatus,
                        previousData: {
                            attendance: previousAttendanceJson,
                        },
                        currentData: {
                            attendance: updatedAttendanceJson,
                        },
                        performedBySlug: user.slug,
                        remarks,
                        ipAddress: requestMeta.ipAddress,
                        userAgent: requestMeta.userAgent,
                    }),
                });
            }

            savedAttendances.push({
                academicMappingSlug: mapping.slug,
                student: mapping.student,
                attendance: savedAttendanceDay,
                monthlyAttendance,
            });
        }

        return savedAttendances;
    });
};

export const updateStudentAttendanceService = async ({
    daySlug,
    payload,
    user,
    requestMeta,
}) => {
    return runAttendanceTransactionRepo(async (tx) => {
        const attendanceDay = await findAttendanceDayBySlugRepo({
            tx,
            schoolSlug: user.schoolSlug,
            daySlug,
        });

        if (!attendanceDay) {
            throw createServiceError("Attendance record not found", 404);
        }

        if (!attendanceDay.isActive) {
            throw createServiceError(
                "Deleted attendance cannot be updated. Restore it first",
                409,
            );
        }

        if (attendanceDay.isLocked) {
            throw createServiceError(
                "Locked attendance cannot be updated",
                409,
            );
        }

        const mapping = attendanceDay.academicMapping;

        if (!mapping) {
            throw createServiceError(
                "Academic mapping not found for attendance",
                404,
            );
        }

        const previousStatus = attendanceDay.attendanceStatus;

        const previousAttendanceJson = {
            ...(attendanceDay.attendance.attendance || {}),
        };

        const dayKey = String(attendanceDay.day).padStart(2, "0");

        const updatedAttendanceJson = updateMonthlyJsonAttendance({
            currentAttendance: attendanceDay.attendance.attendance,
            dayKey,
            attendanceStatus: payload.attendanceStatus,
        });

        const summary = calculateAttendanceSummary(
            updatedAttendanceJson,
        );

        const monthlyAttendance = await updateMonthlyAttendanceRepo({
            tx,
            slug: attendanceDay.attendanceSlug,

            data: {
                attendance: updatedAttendanceJson,
                ...summary,
            },
        });

        const updatedDay = await updateAttendanceDayRepo({
            tx,
            slug: daySlug,

            data: {
                attendanceStatus: payload.attendanceStatus,
                markedBySlug: user.slug,
                markedAt: new Date(),
            },
        });

        await createAttendanceLogRepo({
            tx,

            data: createAttendanceLogData({
                attendance: monthlyAttendance,
                mapping,
                attendanceDate: attendanceDay.attendanceDate,
                year: attendanceDay.year,
                month: attendanceDay.month,
                day: attendanceDay.day,
                action: "UPDATE",
                previousStatus,
                currentStatus: payload.attendanceStatus,
                previousData: {
                    attendance: previousAttendanceJson,
                },
                currentData: {
                    attendance: updatedAttendanceJson,
                },
                performedBySlug: user.slug,
                remarks: payload.remarks,
                ipAddress: requestMeta.ipAddress,
                userAgent: requestMeta.userAgent,
            }),
        });

        return updatedDay;
    });
};

export const deleteStudentAttendanceService = async ({
    daySlug,
    payload,
    user,
    requestMeta,
}) => {
    return runAttendanceTransactionRepo(async (tx) => {
        const attendanceDay = await findAttendanceDayBySlugRepo({
            tx,
            schoolSlug: user.schoolSlug,
            daySlug,
        });

        if (!attendanceDay) {
            throw createServiceError("Attendance record not found", 404);
        }

        if (!attendanceDay.isActive) {
            throw createServiceError(
                "Attendance is already deleted",
                409,
            );
        }

        if (attendanceDay.isLocked) {
            throw createServiceError(
                "Locked attendance cannot be deleted",
                409,
            );
        }

        const mapping = attendanceDay.academicMapping;

        if (!mapping) {
            throw createServiceError(
                "Academic mapping not found for attendance",
                404,
            );
        }

        const previousAttendanceJson = {
            ...(attendanceDay.attendance.attendance || {}),
        };

        const dayKey = String(attendanceDay.day).padStart(2, "0");

        const updatedAttendanceJson = removeMonthlyJsonAttendance({
            currentAttendance: attendanceDay.attendance.attendance,
            dayKey,
        });

        const summary = calculateAttendanceSummary(
            updatedAttendanceJson,
        );

        const monthlyAttendance = await updateMonthlyAttendanceRepo({
            tx,
            slug: attendanceDay.attendanceSlug,

            data: {
                attendance: updatedAttendanceJson,
                ...summary,
            },
        });

        const deletedDay = await updateAttendanceDayRepo({
            tx,
            slug: daySlug,

            data: {
                status: "inactive",
                isActive: false,
                deletedAt: new Date(),
            },
        });

        await createAttendanceLogRepo({
            tx,

            data: createAttendanceLogData({
                attendance: monthlyAttendance,
                mapping,
                attendanceDate: attendanceDay.attendanceDate,
                year: attendanceDay.year,
                month: attendanceDay.month,
                day: attendanceDay.day,
                action: "DELETE",
                previousStatus: attendanceDay.attendanceStatus,
                currentStatus: null,
                previousData: {
                    attendance: previousAttendanceJson,
                },
                currentData: {
                    attendance: updatedAttendanceJson,
                },
                performedBySlug: user.slug,
                remarks: payload?.remarks,
                ipAddress: requestMeta.ipAddress,
                userAgent: requestMeta.userAgent,
            }),
        });

        return deletedDay;
    });
};

export const restoreStudentAttendanceService = async ({
    daySlug,
    payload,
    user,
    requestMeta,
}) => {
    return runAttendanceTransactionRepo(async (tx) => {
        const attendanceDay = await findAttendanceDayBySlugRepo({
            tx,
            schoolSlug: user.schoolSlug,
            daySlug,
        });

        if (!attendanceDay) {
            throw createServiceError("Attendance record not found", 404);
        }

        if (attendanceDay.isActive) {
            throw createServiceError(
                "Attendance is already active",
                409,
            );
        }

        const mapping = attendanceDay.academicMapping;

        if (!mapping) {
            throw createServiceError(
                "Academic mapping not found for attendance",
                404,
            );
        }

        const previousAttendanceJson = {
            ...(attendanceDay.attendance.attendance || {}),
        };

        const dayKey = String(attendanceDay.day).padStart(2, "0");

        const updatedAttendanceJson = updateMonthlyJsonAttendance({
            currentAttendance: attendanceDay.attendance.attendance,
            dayKey,
            attendanceStatus: attendanceDay.attendanceStatus,
        });

        const summary = calculateAttendanceSummary(
            updatedAttendanceJson,
        );

        const monthlyAttendance = await updateMonthlyAttendanceRepo({
            tx,
            slug: attendanceDay.attendanceSlug,

            data: {
                attendance: updatedAttendanceJson,
                ...summary,
            },
        });

        const restoredDay = await updateAttendanceDayRepo({
            tx,
            slug: daySlug,

            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
        });

        await createAttendanceLogRepo({
            tx,

            data: createAttendanceLogData({
                attendance: monthlyAttendance,
                mapping,
                attendanceDate: attendanceDay.attendanceDate,
                year: attendanceDay.year,
                month: attendanceDay.month,
                day: attendanceDay.day,
                action: "RESTORE",
                previousStatus: null,
                currentStatus: attendanceDay.attendanceStatus,
                previousData: {
                    attendance: previousAttendanceJson,
                },
                currentData: {
                    attendance: updatedAttendanceJson,
                },
                performedBySlug: user.slug,
                remarks: payload?.remarks,
                ipAddress: requestMeta.ipAddress,
                userAgent: requestMeta.userAgent,
            }),
        });

        return restoredDay;
    });
};

export const lockStudentAttendanceService = async ({
    daySlug,
    payload,
    user,
    requestMeta,
}) => {
    return runAttendanceTransactionRepo(async (tx) => {
        const attendanceDay = await findAttendanceDayBySlugRepo({
            tx,
            schoolSlug: user.schoolSlug,
            daySlug,
        });

        if (!attendanceDay) {
            throw createServiceError("Attendance record not found", 404);
        }

        if (!attendanceDay.isActive) {
            throw createServiceError(
                "Deleted attendance cannot be locked",
                409,
            );
        }

        if (attendanceDay.isLocked) {
            throw createServiceError(
                "Attendance is already locked",
                409,
            );
        }

        const mapping = attendanceDay.academicMapping;

        if (!mapping) {
            throw createServiceError(
                "Academic mapping not found for attendance",
                404,
            );
        }

        const updatedDay = await updateAttendanceDayRepo({
            tx,
            slug: daySlug,

            data: {
                isLocked: true,
                lockedBySlug: user.slug,
                lockedAt: new Date(),
                unlockedBySlug: null,
                unlockedAt: null,
            },
        });

        await createAttendanceLogRepo({
            tx,

            data: createAttendanceLogData({
                attendance: attendanceDay.attendance,
                mapping,
                attendanceDate: attendanceDay.attendanceDate,
                year: attendanceDay.year,
                month: attendanceDay.month,
                day: attendanceDay.day,
                action: "LOCK",
                previousStatus: attendanceDay.attendanceStatus,
                currentStatus: attendanceDay.attendanceStatus,
                previousData: {
                    isLocked: false,
                },
                currentData: {
                    isLocked: true,
                },
                performedBySlug: user.slug,
                remarks: payload?.remarks,
                ipAddress: requestMeta.ipAddress,
                userAgent: requestMeta.userAgent,
            }),
        });

        return updatedDay;
    });
};

export const unlockStudentAttendanceService = async ({
    daySlug,
    payload,
    user,
    requestMeta,
}) => {
    return runAttendanceTransactionRepo(async (tx) => {
        const attendanceDay = await findAttendanceDayBySlugRepo({
            tx,
            schoolSlug: user.schoolSlug,
            daySlug,
        });

        if (!attendanceDay) {
            throw createServiceError("Attendance record not found", 404);
        }

        if (!attendanceDay.isLocked) {
            throw createServiceError(
                "Attendance is already unlocked",
                409,
            );
        }

        const mapping = attendanceDay.academicMapping;

        if (!mapping) {
            throw createServiceError(
                "Academic mapping not found for attendance",
                404,
            );
        }

        const updatedDay = await updateAttendanceDayRepo({
            tx,
            slug: daySlug,

            data: {
                isLocked: false,
                unlockedBySlug: user.slug,
                unlockedAt: new Date(),
            },
        });

        await createAttendanceLogRepo({
            tx,

            data: createAttendanceLogData({
                attendance: attendanceDay.attendance,
                mapping,
                attendanceDate: attendanceDay.attendanceDate,
                year: attendanceDay.year,
                month: attendanceDay.month,
                day: attendanceDay.day,
                action: "UNLOCK",
                previousStatus: attendanceDay.attendanceStatus,
                currentStatus: attendanceDay.attendanceStatus,
                previousData: {
                    isLocked: true,
                },
                currentData: {
                    isLocked: false,
                },
                performedBySlug: user.slug,
                remarks: payload?.remarks,
                ipAddress: requestMeta.ipAddress,
                userAgent: requestMeta.userAgent,
            }),
        });

        return updatedDay;
    });
};

export const getMonthlyAttendanceService = async ({
    query,
    user,
}) => {
    const attendance = await getMonthlyAttendanceByMappingRepo({
        schoolSlug: user.schoolSlug,
        academicMappingSlug: query.academicMappingSlug,
        year: query.year,
        month: query.month,
    });

    if (!attendance) {
        return {
            attendance: {},
            totalWorkingDays: 0,
            totalPresent: 0,
            totalAbsent: 0,
            totalLeave: 0,
            totalHalfDay: 0,
            totalHoliday: 0,
            attendancePercentage: 0,
            attendanceDays: [],
        };
    }

    return attendance;
};

export const getAttendanceLogsService = async ({
    attendanceSlug,
    query,
    user,
}) => {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const result = await getAttendanceLogsRepo({
        schoolSlug: user.schoolSlug,
        attendanceSlug,
        skip,
        take: limit,
    });

    return {
        data: result.logs,

        pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
        },
    };
};

export const ensureMonthlyAttendanceRowsForCronService = async ({ year, month }) => {
    const parsedYear = Number(year);
    const parsedMonth = Number(month);

    if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
        throw createServiceError("Invalid attendance year", 400);
    }

    if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
        throw createServiceError("Invalid attendance month", 400);
    }

    return runAttendanceTransactionRepo(async (tx) => {
        const mappings = await getActiveAcademicMappingsForCronRepo({
            tx,
        });

        if (!mappings.length) {
            return {
                year: parsedYear,
                month: parsedMonth,
                mappingCount: 0,
                createdCount: 0,
            };
        }

        const attendanceRows = mappings.map((mapping) => ({
            slug: crypto.randomUUID(),
            schoolSlug: mapping.schoolSlug,
            studentSlug: mapping.studentSlug,
            sessionSlug: mapping.sessionSlug,
            boardSlug: mapping.boardSlug,
            classSlug: mapping.classSlug,
            sectionSlug: mapping.sectionSlug || null,
            streamSlug: mapping.streamSlug || null,
            academicMappingSlug: mapping.slug,
            year: parsedYear,
            month: parsedMonth,
            attendance: {},
            totalWorkingDays: 0,
            totalPresent: 0,
            totalAbsent: 0,
            totalLeave: 0,
            totalHalfDay: 0,
            totalHoliday: 0,
            attendancePercentage: 0,
            status: "active",
            isActive: true,
            deletedAt: null,
        }));

        const result = await createMissingMonthlyAttendancesRepo({
            tx,
            data: attendanceRows,
        });

        return {
            year: parsedYear,
            month: parsedMonth,
            mappingCount: mappings.length,
            createdCount: result.count,
            skippedCount: mappings.length - result.count,
        };
    });
};