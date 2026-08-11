import { randomUUID } from "crypto";
import XLSX from "xlsx";

import {
    runEmployeeAttendanceTransactionRepo,
    getAttendanceEmployeesRepo,
    findAttendanceEmployeeBySlugRepo,
    findEmployeeAttendanceRepo,
    findEmployeeAttendanceBySlugRepo,
    getEmployeeAttendancesForDateRepo,
    findEmployeeBasicSettingRepo,
    findSpecificSaturdayBasicSettingRepo,
    findNormalSaturdayBasicSettingRepo,
    findEmployeeHolidayRepo,
    upsertEmployeeAttendanceRepo,
    createEmployeeAttendanceLogRepo,
    getEmployeeAttendanceLogsRepo,
    // getYearlyEmployeeAttendanceRepo,
    findAttendanceEmployeeByEmployeeIdRepo,

    findAttendanceSessionBySlugRepo,
    getAcademicYearReportEmployeesRepo,
    getAcademicYearHolidaysRepo,
    getAcademicYearBasicSettingsRepo,
} from "../../../repositories/HRM/attendance/employeeAttendance.repository.js";

// const MS_PER_DAY =
//     1000 *
//     60 *
//     60 *
//     24;

const toDateKey = (
    value,
) => {
    if (!value) {
        return null;
    }

    return new Date(
        value,
    )
        .toISOString()
        .slice(0, 10);
};

const getInclusiveDates = (
    startDate,
    endDate,
) => {
    const dates = [];

    const current =
        new Date(
            Date.UTC(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth(),
                startDate.getUTCDate(),
            ),
        );

    const end =
        new Date(
            Date.UTC(
                endDate.getUTCFullYear(),
                endDate.getUTCMonth(),
                endDate.getUTCDate(),
            ),
        );

    while (
        current <= end
    ) {
        dates.push(
            new Date(
                current,
            ),
        );

        current.setUTCDate(
            current.getUTCDate() +
            1,
        );
    }

    return dates;
};

const getSundayDateSet = (
    dates,
) => {
    return new Set(
        dates
            .filter(
                (date) =>
                    date.getUTCDay() ===
                    0,
            )
            .map(
                (date) =>
                    toDateKey(
                        date,
                    ),
            ),
    );
};

const getBasicSettingDayKey =
    (date) => {
        const day =
            date.getUTCDay();

        const dayMap = {
            0: "SUNDAY",
            1: "MONDAY",
            2: "TUESDAY",
            3: "WEDNESDAY",
            4: "THURSDAY",
            5: "FRIDAY",
            6: "SATURDAY",
        };

        return dayMap[
            day
        ];
    };

const isBasicSettingHoliday =
    ({
        date,
        departmentSlug,
        basicSettings,
    }) => {
        const normalDay =
            getBasicSettingDayKey(
                date,
            );

        if (
            normalDay !==
            "SATURDAY"
        ) {
            const setting =
                basicSettings.find(
                    (item) =>
                        item.departmentSlug ===
                        departmentSlug &&
                        item.weekDay ===
                        normalDay &&
                        item.isActive ===
                        true,
                );

            return (
                setting
                    ?.dayType ===
                "HOLIDAY"
            );
        }

        const occurrence =
            getSaturdayOccurrence(
                date,
            );

        let specialDay =
            null;

        if (
            occurrence ===
            2
        ) {
            specialDay =
                "SECOND_SATURDAY";
        }

        if (
            occurrence ===
            4
        ) {
            specialDay =
                "FOURTH_SATURDAY";
        }

        if (
            specialDay
        ) {
            const specialSetting =
                basicSettings.find(
                    (item) =>
                        item.departmentSlug ===
                        departmentSlug &&
                        item.weekDay ===
                        specialDay &&
                        item.isActive ===
                        true,
                );

            if (
                specialSetting
            ) {
                return (
                    specialSetting.dayType ===
                    "HOLIDAY"
                );
            }
        }

        const normalSaturday =
            basicSettings.find(
                (item) =>
                    item.departmentSlug ===
                    departmentSlug &&
                    item.weekDay ===
                    "SATURDAY" &&
                    item.isActive ===
                    true,
            );

        return (
            normalSaturday
                ?.dayType ===
            "HOLIDAY"
        );
    };


const normalizeExcelHeader = (
    value,
) => {
    return String(
        value || "",
    )
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9]/g,
            "",
        );
};

const getExcelField = (
    row,
    possibleNames,
) => {
    const normalizedRow =
        {};

    for (
        const [
            key,
            value,
        ] of Object.entries(
            row,
        )
    ) {
        normalizedRow[
            normalizeExcelHeader(
                key,
            )
        ] = value;
    }

    for (
        const name of possibleNames
    ) {
        const key =
            normalizeExcelHeader(
                name,
            );

        if (
            normalizedRow[
            key
            ] !==
            undefined
        ) {
            return normalizedRow[
                key
            ];
        }
    }

    return null;
};

const normalizeExcelDate = (
    value,
) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    // Excel serial date
    if (
        typeof value ===
        "number"
    ) {
        const parsed =
            XLSX.SSF.parse_date_code(
                value,
            );

        if (!parsed) {
            return null;
        }

        return `${parsed.y}-${pad2(
            parsed.m,
        )}-${pad2(
            parsed.d,
        )}`;
    }

    const raw =
        String(
            value,
        ).trim();

    // YYYY-MM-DD
    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            raw,
        )
    ) {
        return raw;
    }

    // DD-MM-YYYY / DD/MM/YYYY
    const match =
        raw.match(
            /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/,
        );

    if (match) {
        const [
            ,
            day,
            month,
            year,
        ] = match;

        return `${year}-${pad2(
            month,
        )}-${pad2(
            day,
        )}`;
    }

    const date =
        new Date(
            raw,
        );

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return null;
    }

    return `${date.getFullYear()}-${pad2(
        date.getMonth() +
        1,
    )}-${pad2(
        date.getDate(),
    )}`;
};

const normalizeExcelTime = (
    value,
) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    // Excel time serial
    if (
        typeof value ===
        "number"
    ) {
        const totalMinutes =
            Math.round(
                value *
                24 *
                60,
            );

        const hours =
            Math.floor(
                totalMinutes /
                60,
            ) % 24;

        const minutes =
            totalMinutes %
            60;

        return `${pad2(
            hours,
        )}:${pad2(
            minutes,
        )}`;
    }

    const raw =
        String(
            value,
        )
            .trim()
            .toUpperCase();

    // HH:mm / HH:mm:ss
    if (
        /^\d{1,2}:\d{2}(:\d{2})?$/.test(
            raw,
        )
    ) {
        const [
            hours,
            minutes,
        ] = raw
            .split(":")
            .map(Number);

        return `${pad2(
            hours,
        )}:${pad2(
            minutes,
        )}`;
    }

    // 07:30 AM
    const match =
        raw.match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/,
        );

    if (match) {
        let hour =
            Number(
                match[1],
            );

        const minute =
            Number(
                match[2],
            );

        const period =
            match[3];

        if (
            period ===
            "PM" &&
            hour !== 12
        ) {
            hour += 12;
        }

        if (
            period ===
            "AM" &&
            hour === 12
        ) {
            hour = 0;
        }

        return `${pad2(
            hour,
        )}:${pad2(
            minute,
        )}`;
    }

    return null;
};

const parseDate = (
    value,
) => {
    if (!value) {
        throw new Error(
            "Attendance date is required",
        );
    }

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
            "Invalid attendance date",
        );
    }

    return date;
};

const formatDate = (
    value,
) => {
    if (!value) {
        return null;
    }

    return new Date(
        value,
    )
        .toISOString()
        .slice(0, 10);
};

const pad2 = (
    value,
) =>
    String(
        value,
    ).padStart(
        2,
        "0",
    );

const timeToMinutes = (
    value,
) => {
    if (!value) {
        return null;
    }

    const [
        hours,
        minutes,
    ] =
        String(value)
            .slice(0, 5)
            .split(":")
            .map(Number);

    if (
        Number.isNaN(
            hours,
        ) ||
        Number.isNaN(
            minutes,
        )
    ) {
        return null;
    }

    return (
        hours * 60 +
        minutes
    );
};

const prismaTimeToHHMM = (
    value,
) => {
    if (!value) {
        return null;
    }

    if (
        typeof value ===
        "string" &&
        /^\d{2}:\d{2}/.test(
            value,
        )
    ) {
        return value.slice(
            0,
            5,
        );
    }

    const date =
        new Date(
            value,
        );

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return null;
    }

    return `${pad2(
        date.getUTCHours(),
    )}:${pad2(
        date.getUTCMinutes(),
    )}`;
};

const getDayName = (
    date,
) => {
    const day =
        date.getUTCDay();

    const map = {
        0: "SUNDAY",
        1: "MONDAY",
        2: "TUESDAY",
        3: "WEDNESDAY",
        4: "THURSDAY",
        5: "FRIDAY",
        6: "SATURDAY",
    };

    return map[day];
};

const getSaturdayOccurrence =
    (date) => {
        if (
            date.getUTCDay() !==
            6
        ) {
            return null;
        }

        return Math.ceil(
            date.getUTCDate() /
            7,
        );
    };

const resolveEmployeeBasicSetting =
    async ({
        schoolSlug,
        departmentSlug,
        attendanceDate,
        db,
    }) => {
        const dayName =
            getDayName(
                attendanceDate,
            );

        if (
            dayName !==
            "SATURDAY"
        ) {
            return findEmployeeBasicSettingRepo({
                schoolSlug,
                departmentSlug,

                weekDays: [
                    dayName,
                ],

                db,
            });
        }

        const occurrence =
            getSaturdayOccurrence(
                attendanceDate,
            );

        let specificWeekDay =
            null;

        if (
            occurrence ===
            2
        ) {
            specificWeekDay =
                "SECOND_SATURDAY";
        }

        if (
            occurrence ===
            4
        ) {
            specificWeekDay =
                "FOURTH_SATURDAY";
        }

        if (
            specificWeekDay
        ) {
            const specificSetting =
                await findSpecificSaturdayBasicSettingRepo({
                    schoolSlug,
                    departmentSlug,
                    specificWeekDay,
                    db,
                });

            if (
                specificSetting
            ) {
                return specificSetting;
            }
        }

        return findNormalSaturdayBasicSettingRepo({
            schoolSlug,
            departmentSlug,
            db,
        });
    };

const resolveApprovedEmployeeLeave =
    async ({
        schoolSlug,
        employeeSlug,
        attendanceDate,
    }) => {
        // Leave module abhi implement nahi hua hai.
        // Future me isi helper ke andar approved leave query add hogi.
        // Attendance ke baaki service ko change nahi karna padega.

        void schoolSlug;
        void employeeSlug;
        void attendanceDate;

        return null;
    };

const resolveAttendanceContext =
    async ({
        schoolSlug,
        employee,
        attendanceDate,
        db,
    }) => {
        const holiday =
            await findEmployeeHolidayRepo({
                schoolSlug,

                employeeId:
                    employee.id,

                departmentId:
                    employee
                        .department
                        ?.id,

                attendanceDate,

                db,
            });

        if (holiday) {
            return {
                type:
                    "HOLIDAY",

                source:
                    "HRM_HOLIDAY",

                holiday,

                holidayName:
                    holiday.title ||
                    holiday
                        .holidayGroup
                        ?.title ||
                    "Holiday",

                basicSetting:
                    null,

                shift:
                    null,

                leave:
                    null,
            };
        }

        const basicSetting =
            await resolveEmployeeBasicSetting({
                schoolSlug,

                departmentSlug:
                    employee.departmentSlug,

                attendanceDate,

                db,
            });

        if (
            basicSetting
                ?.dayType ===
            "HOLIDAY"
        ) {
            return {
                type:
                    "HOLIDAY",

                source:
                    "BASIC_SETTING_HOLIDAY",

                holiday:
                    null,

                holidayName:
                    "Holiday",

                basicSetting,

                shift:
                    null,

                leave:
                    null,
            };
        }

        const leave =
            await resolveApprovedEmployeeLeave({
                schoolSlug,

                employeeSlug:
                    employee.slug,

                attendanceDate,
            });

        if (leave) {
            return {
                type:
                    "LEAVE",

                source:
                    "LEAVE",

                holiday:
                    null,

                holidayName:
                    null,

                basicSetting,

                shift:
                    basicSetting
                        ?.shift ||
                    null,

                leave,
            };
        }

        return {
            type:
                "WORKING",

            source:
                null,

            holiday:
                null,

            holidayName:
                null,

            basicSetting,

            shift:
                basicSetting
                    ?.shift ||
                null,

            leave:
                null,
        };
    };

const calculateShiftAttendance =
    ({
        shift,
        inTime,
        outTime,
    }) => {
        if (!shift) {
            return {
                shiftSlug:
                    null,

                expectedInTime:
                    null,

                expectedOutTime:
                    null,

                loginBufferMinutes:
                    null,

                logoutBufferMinutes:
                    null,

                isLate:
                    false,

                isEarly:
                    false,

                lateMinutes:
                    null,

                earlyMinutes:
                    null,
            };
        }

        const expectedInTime =
            prismaTimeToHHMM(
                shift.loginTime,
            );

        const expectedOutTime =
            prismaTimeToHHMM(
                shift.logoutTime,
            );

        const expectedInMinutes =
            timeToMinutes(
                expectedInTime,
            );

        const expectedOutMinutes =
            timeToMinutes(
                expectedOutTime,
            );

        const actualInMinutes =
            timeToMinutes(
                inTime,
            );

        const actualOutMinutes =
            timeToMinutes(
                outTime,
            );

        const loginBufferMinutes =
            Number(
                shift.loginBufferMinutes ||
                0,
            );

        const logoutBufferMinutes =
            Number(
                shift.logoutBufferMinutes ||
                0,
            );

        const allowedLoginMinutes =
            expectedInMinutes +
            loginBufferMinutes;

        const allowedEarlyLogoutMinutes =
            expectedOutMinutes -
            logoutBufferMinutes;

        const lateMinutes =
            actualInMinutes >
                allowedLoginMinutes
                ? actualInMinutes -
                allowedLoginMinutes
                : 0;

        const earlyMinutes =
            actualOutMinutes <
                allowedEarlyLogoutMinutes
                ? allowedEarlyLogoutMinutes -
                actualOutMinutes
                : 0;

        return {
            shiftSlug:
                shift.slug,

            expectedInTime,

            expectedOutTime,

            loginBufferMinutes,

            logoutBufferMinutes,

            isLate:
                lateMinutes >
                0,

            isEarly:
                earlyMinutes >
                0,

            lateMinutes,

            earlyMinutes,
        };
    };

const buildActorSnapshot =
    (user) => {
        return {
            actorSlug:
                user?.slug ||
                null,

            actorName:
                user?.name ||
                null,

            actorRole:
                user?.role ||
                null,
        };
    };

const buildAttendanceLog =
    ({
        schoolSlug,
        attendance,
        previous,
        action,
        user,
        metadata,
        remarks,
    }) => {
        const actor =
            buildActorSnapshot(
                user,
            );

        return {
            slug:
                randomUUID(),

            schoolSlug,

            attendanceSlug:
                attendance.slug,

            employeeSlug:
                attendance.employeeSlug,

            attendanceDate:
                attendance.attendanceDate,

            action,

            previousStatus:
                previous?.attendanceStatus ||
                null,

            newStatus:
                attendance.attendanceStatus,

            previousInTime:
                previous?.inTime ||
                null,

            newInTime:
                attendance.inTime ||
                null,

            previousOutTime:
                previous?.outTime ||
                null,

            newOutTime:
                attendance.outTime ||
                null,

            previousIsLate:
                previous?.isLate ??
                null,

            newIsLate:
                attendance.isLate,

            previousIsEarly:
                previous?.isEarly ??
                null,

            newIsEarly:
                attendance.isEarly,

            previousLocked:
                previous?.isLocked ??
                null,

            newLocked:
                attendance.isLocked,

            ...actor,

            ipAddress:
                metadata?.ipAddress ||
                null,

            userAgent:
                metadata?.userAgent ||
                null,

            remarks:
                remarks ||
                null,
        };
    };

const formatAttendanceRow =
    ({
        employee,
        attendance,
        context,
    }) => {
        const resolvedStatus =
            attendance
                ?.attendanceStatus ||
            (context.type ===
                "HOLIDAY"
                ? "HOLIDAY"
                : context.type ===
                    "LEAVE"
                    ? "LEAVE"
                    : "NOT_MARKED");

        let leaveHoliday =
            null;

        if (
            resolvedStatus ===
            "HOLIDAY"
        ) {
            leaveHoliday =
                attendance
                    ?.leaveTypeName ||
                context.holidayName ||
                "Holiday";
        }

        if (
            resolvedStatus ===
            "LEAVE"
        ) {
            leaveHoliday =
                attendance
                    ?.leaveTypeName ||
                context.leave
                    ?.leaveTypeName ||
                "Leave";
        }

        const shift =
            attendance?.shift ||
            context.shift ||
            null;

        return {
            attendanceSlug:
                attendance?.slug ||
                null,

            employeeSlug:
                employee.slug,

            employeeId:
                employee.employeeId,

            employeeSerial:
                employee.employeeSerial,

            employeeCode:
                employee.employeeCode,

            fullName:
                employee.fullName,

            department: {
                slug:
                    employee.department
                        ?.slug ||
                    null,

                name:
                    employee.department
                        ?.departmentName ||
                    "-",
            },

            designation: {
                slug:
                    employee.designation
                        ?.slug ||
                    null,

                name:
                    employee.designation
                        ?.designationName ||
                    "-",
            },

            attendanceStatus:
                resolvedStatus,

            source:
                attendance?.source ||
                context.source ||
                null,

            inTime:
                attendance?.inTime ||
                null,

            outTime:
                attendance?.outTime ||
                null,

            isLate:
                attendance?.isLate ||
                false,

            isEarly:
                attendance?.isEarly ||
                false,

            lateMinutes:
                attendance
                    ?.lateMinutes ??
                null,

            earlyMinutes:
                attendance
                    ?.earlyMinutes ??
                null,

            leaveHoliday,

            isLocked:
                attendance?.isLocked ||
                false,

            shift: shift
                ? {
                    slug:
                        shift.slug,

                    shiftName:
                        shift.shiftName,

                    shiftCode:
                        shift.shiftCode,

                    loginTime:
                        prismaTimeToHHMM(
                            shift.loginTime,
                        ),

                    logoutTime:
                        prismaTimeToHHMM(
                            shift.logoutTime,
                        ),

                    loginBufferMinutes:
                        shift.loginBufferMinutes,

                    logoutBufferMinutes:
                        shift.logoutBufferMinutes,
                }
                : null,
        };
    };

const buildSummary =
    (rows) => {
        return rows.reduce(
            (
                summary,
                row,
            ) => {
                summary.total +=
                    1;

                switch (
                row.attendanceStatus
                ) {
                    case "PRESENT":
                        summary.present +=
                            1;
                        break;

                    case "ABSENT":
                        summary.absent +=
                            1;
                        break;

                    case "LEAVE":
                        summary.leave +=
                            1;
                        break;

                    case "HOLIDAY":
                        summary.holiday +=
                            1;
                        break;

                    default:
                        summary.notMarked +=
                            1;
                        break;
                }

                return summary;
            },
            {
                total: 0,
                present: 0,
                absent: 0,
                leave: 0,
                holiday: 0,
                notMarked: 0,
            },
        );
    };

const getAttendanceRowsForDate =
    async ({
        schoolSlug,
        attendanceDate,
    }) => {
        const employees =
            await getAttendanceEmployeesRepo({
                schoolSlug,
                attendanceDate,
            });

        const rows = [];

        for (
            const employee of employees
        ) {
            const attendance =
                await findEmployeeAttendanceRepo({
                    schoolSlug,

                    employeeSlug:
                        employee.slug,

                    attendanceDate,
                });

            const context =
                await resolveAttendanceContext({
                    schoolSlug,
                    employee,
                    attendanceDate,
                });

            rows.push(
                formatAttendanceRow({
                    employee,
                    attendance,
                    context,
                }),
            );
        }

        return rows;
    };

export const getEmployeeAttendancesService =
    async ({
        schoolSlug,
        date,
    }) => {
        const attendanceDate =
            parseDate(
                date,
            );

        const rows =
            await getAttendanceRowsForDate({
                schoolSlug,
                attendanceDate,
            });

        const summary =
            buildSummary(
                rows,
            );

        const locked =
            rows.length >
            0 &&
            rows.every(
                (item) =>
                    item.isLocked,
            );

        return {
            attendanceDate:
                formatDate(
                    attendanceDate,
                ),

            dayName:
                getDayName(
                    attendanceDate,
                ),

            locked,

            summary,

            employees:
                rows,
        };
    };

export const getAttendanceDashboardService =
    async ({
        schoolSlug,
        date,
    }) => {
        const selectedDate =
            parseDate(
                date,
            );

        const yesterday =
            new Date(
                selectedDate,
            );

        yesterday.setUTCDate(
            yesterday.getUTCDate() -
            1,
        );

        const rows =
            await getAttendanceRowsForDate({
                schoolSlug,
                attendanceDate:
                    yesterday,
            });

        return {
            date:
                formatDate(
                    yesterday,
                ),

            summary:
                buildSummary(
                    rows,
                ),
        };
    };

export const markEmployeePresentService =
    async ({
        schoolSlug,
        employeeSlug,
        payload,
        user,
        metadata,
    }) => {
        const attendanceDate =
            parseDate(
                payload.attendanceDate,
            );

        const employee =
            await findAttendanceEmployeeBySlugRepo({
                schoolSlug,
                employeeSlug,
            });

        if (!employee) {
            throw new Error(
                "Active employee not found",
            );
        }

        const previous =
            await findEmployeeAttendanceRepo({
                schoolSlug,
                employeeSlug,
                attendanceDate,
            });

        if (
            previous?.isLocked
        ) {
            throw new Error(
                "Attendance is locked",
            );
        }

        const context =
            await resolveAttendanceContext({
                schoolSlug,
                employee,
                attendanceDate,
            });

        if (
            context.type ===
            "HOLIDAY"
        ) {
            throw new Error(
                "Cannot mark attendance on holiday",
            );
        }

        if (
            context.type ===
            "LEAVE"
        ) {
            throw new Error(
                "Employee is on approved leave",
            );
        }

        if (
            !context.shift
        ) {
            throw new Error(
                "Shift is not configured for employee department and selected day",
            );
        }

        const calculation =
            calculateShiftAttendance({
                shift:
                    context.shift,

                inTime:
                    payload.inTime,

                outTime:
                    payload.outTime,
            });

        const attendance =
            await runEmployeeAttendanceTransactionRepo(
                async (tx) => {
                    const saved =
                        await upsertEmployeeAttendanceRepo(
                            {
                                schoolSlug,
                                employeeSlug,
                                attendanceDate,

                                createData:
                                {
                                    slug:
                                        randomUUID(),

                                    schoolSlug,

                                    employeeSlug,

                                    attendanceDate,

                                    attendanceStatus:
                                        "PRESENT",

                                    source:
                                        "MANUAL",

                                    inTime:
                                        payload.inTime,

                                    outTime:
                                        payload.outTime,

                                    ...calculation,

                                    basicSettingSlug:
                                        context
                                            .basicSetting
                                            ?.slug ||
                                        null,

                                    holidaySlug:
                                        null,

                                    leaveApplicationSlug:
                                        null,

                                    leaveTypeSlug:
                                        null,

                                    leaveTypeName:
                                        null,

                                    remarks:
                                        payload.remarks ||
                                        null,

                                    markedBySlug:
                                        user?.slug ||
                                        null,

                                    markedAt:
                                        new Date(),

                                    isLocked:
                                        false,

                                    status:
                                        "active",

                                    isActive:
                                        true,

                                    deletedAt:
                                        null,
                                },

                                updateData:
                                {
                                    attendanceStatus:
                                        "PRESENT",

                                    source:
                                        "MANUAL",

                                    inTime:
                                        payload.inTime,

                                    outTime:
                                        payload.outTime,

                                    ...calculation,

                                    basicSettingSlug:
                                        context
                                            .basicSetting
                                            ?.slug ||
                                        null,

                                    holidaySlug:
                                        null,

                                    leaveApplicationSlug:
                                        null,

                                    leaveTypeSlug:
                                        null,

                                    leaveTypeName:
                                        null,

                                    remarks:
                                        payload.remarks ||
                                        null,

                                    markedBySlug:
                                        user?.slug ||
                                        null,

                                    markedAt:
                                        new Date(),
                                },

                                db:
                                    tx,
                            },
                        );

                    await createEmployeeAttendanceLogRepo(
                        buildAttendanceLog({
                            schoolSlug,

                            attendance:
                                saved,

                            previous,

                            action:
                                previous
                                    ? "UPDATE"
                                    : "MARK_PRESENT",

                            user,

                            metadata,

                            remarks:
                                payload.remarks,
                        }),

                        tx,
                    );

                    return saved;
                },
            );

        return attendance;
    };

export const markEmployeeAbsentService =
    async ({
        schoolSlug,
        employeeSlug,
        payload,
        user,
        metadata,
    }) => {
        const attendanceDate =
            parseDate(
                payload.attendanceDate,
            );

        const employee =
            await findAttendanceEmployeeBySlugRepo({
                schoolSlug,
                employeeSlug,
            });

        if (!employee) {
            throw new Error(
                "Active employee not found",
            );
        }

        const previous =
            await findEmployeeAttendanceRepo({
                schoolSlug,
                employeeSlug,
                attendanceDate,
            });

        if (
            previous?.isLocked
        ) {
            throw new Error(
                "Attendance is locked",
            );
        }

        const context =
            await resolveAttendanceContext({
                schoolSlug,
                employee,
                attendanceDate,
            });

        if (
            context.type ===
            "HOLIDAY"
        ) {
            throw new Error(
                "Cannot mark absent on holiday",
            );
        }

        if (
            context.type ===
            "LEAVE"
        ) {
            throw new Error(
                "Employee is on approved leave",
            );
        }

        const attendance =
            await runEmployeeAttendanceTransactionRepo(
                async (tx) => {
                    const saved =
                        await upsertEmployeeAttendanceRepo(
                            {
                                schoolSlug,
                                employeeSlug,
                                attendanceDate,

                                createData:
                                {
                                    slug:
                                        randomUUID(),

                                    schoolSlug,

                                    employeeSlug,

                                    attendanceDate,

                                    attendanceStatus:
                                        "ABSENT",

                                    source:
                                        "MANUAL",

                                    inTime:
                                        null,

                                    outTime:
                                        null,

                                    isLate:
                                        false,

                                    isEarly:
                                        false,

                                    lateMinutes:
                                        null,

                                    earlyMinutes:
                                        null,

                                    shiftSlug:
                                        context
                                            .shift
                                            ?.slug ||
                                        null,

                                    expectedInTime:
                                        context.shift
                                            ? prismaTimeToHHMM(
                                                context
                                                    .shift
                                                    .loginTime,
                                            )
                                            : null,

                                    expectedOutTime:
                                        context.shift
                                            ? prismaTimeToHHMM(
                                                context
                                                    .shift
                                                    .logoutTime,
                                            )
                                            : null,

                                    loginBufferMinutes:
                                        context
                                            .shift
                                            ?.loginBufferMinutes ??
                                        null,

                                    logoutBufferMinutes:
                                        context
                                            .shift
                                            ?.logoutBufferMinutes ??
                                        null,

                                    basicSettingSlug:
                                        context
                                            .basicSetting
                                            ?.slug ||
                                        null,

                                    holidaySlug:
                                        null,

                                    remarks:
                                        payload.remarks ||
                                        null,

                                    markedBySlug:
                                        user?.slug ||
                                        null,

                                    markedAt:
                                        new Date(),

                                    isLocked:
                                        false,

                                    status:
                                        "active",

                                    isActive:
                                        true,

                                    deletedAt:
                                        null,
                                },

                                updateData:
                                {
                                    attendanceStatus:
                                        "ABSENT",

                                    source:
                                        "MANUAL",

                                    inTime:
                                        null,

                                    outTime:
                                        null,

                                    isLate:
                                        false,

                                    isEarly:
                                        false,

                                    lateMinutes:
                                        null,

                                    earlyMinutes:
                                        null,

                                    shiftSlug:
                                        context
                                            .shift
                                            ?.slug ||
                                        null,

                                    basicSettingSlug:
                                        context
                                            .basicSetting
                                            ?.slug ||
                                        null,

                                    holidaySlug:
                                        null,

                                    leaveApplicationSlug:
                                        null,

                                    leaveTypeSlug:
                                        null,

                                    leaveTypeName:
                                        null,

                                    remarks:
                                        payload.remarks ||
                                        null,

                                    markedBySlug:
                                        user?.slug ||
                                        null,

                                    markedAt:
                                        new Date(),
                                },

                                db:
                                    tx,
                            },
                        );

                    await createEmployeeAttendanceLogRepo(
                        buildAttendanceLog({
                            schoolSlug,
                            attendance:
                                saved,
                            previous,
                            action:
                                "MARK_ABSENT",
                            user,
                            metadata,
                            remarks:
                                payload.remarks,
                        }),
                        tx,
                    );

                    return saved;
                },
            );

        return attendance;
    };

export const updateEmployeeAttendanceService =
    async ({
        schoolSlug,
        attendanceSlug,
        payload,
        user,
        metadata,
    }) => {
        const attendance =
            await findEmployeeAttendanceBySlugRepo({
                schoolSlug,
                attendanceSlug,
            });

        if (!attendance) {
            throw new Error(
                "Attendance not found",
            );
        }

        if (
            attendance.isLocked
        ) {
            throw new Error(
                "Attendance is locked",
            );
        }

        if (
            attendance.attendanceStatus !==
            "PRESENT"
        ) {
            throw new Error(
                "Only present attendance can be edited",
            );
        }

        const context =
            await resolveAttendanceContext({
                schoolSlug,

                employee:
                    attendance.employee,

                attendanceDate:
                    attendance.attendanceDate,
            });

        if (
            !context.shift
        ) {
            throw new Error(
                "Shift configuration not found",
            );
        }

        const calculation =
            calculateShiftAttendance({
                shift:
                    context.shift,

                inTime:
                    payload.inTime,

                outTime:
                    payload.outTime,
            });

        return runEmployeeAttendanceTransactionRepo(
            async (tx) => {
                const updated =
                    await tx.hrmEmployeeAttendance.update({
                        where: {
                            slug:
                                attendance.slug,
                        },

                        data: {
                            inTime:
                                payload.inTime,

                            outTime:
                                payload.outTime,

                            ...calculation,

                            remarks:
                                payload.remarks ??
                                attendance.remarks,

                            markedBySlug:
                                user?.slug ||
                                null,

                            markedAt:
                                new Date(),
                        },
                    });

                await createEmployeeAttendanceLogRepo(
                    buildAttendanceLog({
                        schoolSlug,

                        attendance:
                            updated,

                        previous:
                            attendance,

                        action:
                            "UPDATE",

                        user,

                        metadata,

                        remarks:
                            payload.remarks,
                    }),

                    tx,
                );

                return updated;
            },
        );
    };

export const lockEmployeeAttendanceService =
    async ({
        schoolSlug,
        payload,
        user,
        metadata,
    }) => {
        const attendanceDate =
            parseDate(
                payload.attendanceDate,
            );

        const employees =
            await getAttendanceEmployeesRepo({
                schoolSlug,
                attendanceDate,
            });

        if (
            !employees.length
        ) {
            throw new Error(
                "No active employees found",
            );
        }

        const resolvedRows =
            [];

        const pendingEmployees =
            [];

        for (
            const employee of employees
        ) {
            const attendance =
                await findEmployeeAttendanceRepo({
                    schoolSlug,

                    employeeSlug:
                        employee.slug,

                    attendanceDate,
                });

            if (
                attendance
            ) {
                resolvedRows.push({
                    employee,
                    attendance,
                    autoData:
                        null,
                });

                continue;
            }

            const context =
                await resolveAttendanceContext({
                    schoolSlug,
                    employee,
                    attendanceDate,
                });

            if (
                context.type ===
                "HOLIDAY"
            ) {
                resolvedRows.push({
                    employee,

                    attendance:
                        null,

                    autoData: {
                        attendanceStatus:
                            "HOLIDAY",

                        source:
                            context.source,

                        holidaySlug:
                            context
                                .holiday
                                ?.slug ||
                            null,

                        basicSettingSlug:
                            context
                                .basicSetting
                                ?.slug ||
                            null,

                        leaveTypeName:
                            context.holidayName ||
                            "Holiday",

                        action:
                            "AUTO_HOLIDAY",
                    },
                });

                continue;
            }

            if (
                context.type ===
                "LEAVE"
            ) {
                resolvedRows.push({
                    employee,

                    attendance:
                        null,

                    autoData: {
                        attendanceStatus:
                            "LEAVE",

                        source:
                            "LEAVE",

                        holidaySlug:
                            null,

                        basicSettingSlug:
                            context
                                .basicSetting
                                ?.slug ||
                            null,

                        leaveApplicationSlug:
                            context.leave
                                ?.slug ||
                            null,

                        leaveTypeSlug:
                            context.leave
                                ?.leaveTypeSlug ||
                            null,

                        leaveTypeName:
                            context.leave
                                ?.leaveTypeName ||
                            "Leave",

                        action:
                            "AUTO_LEAVE",
                    },
                });

                continue;
            }

            // pendingEmployees.push({
            //     employeeSlug:
            //         employee.slug,

            //     employeeId:
            //         employee.employeeId,

            //     fullName:
            //         employee.fullName,
            // });

            resolvedRows.push({
                employee,

                attendance:
                    null,

                autoData: {
                    attendanceStatus:
                        "NOT_MARKED",

                    source:
                        "MANUAL",

                    holidaySlug:
                        null,

                    basicSettingSlug:
                        context
                            .basicSetting
                            ?.slug ||
                        null,

                    leaveApplicationSlug:
                        null,

                    leaveTypeSlug:
                        null,

                    leaveTypeName:
                        null,

                    shiftSlug:
                        context.shift
                            ?.slug ||
                        null,

                    expectedInTime:
                        context.shift
                            ? prismaTimeToHHMM(
                                context.shift.loginTime,
                            )
                            : null,

                    expectedOutTime:
                        context.shift
                            ? prismaTimeToHHMM(
                                context.shift.logoutTime,
                            )
                            : null,

                    loginBufferMinutes:
                        context.shift
                            ?.loginBufferMinutes ??
                        null,

                    logoutBufferMinutes:
                        context.shift
                            ?.logoutBufferMinutes ??
                        null,

                    action:
                        null,
                },
            });
        }

        // if (
        //     pendingEmployees.length
        // ) {
        //     const error =
        //         new Error(
        //             `${pendingEmployees.length} employee attendance records are not marked`,
        //         );

        //     error.details = {
        //         pendingEmployees,
        //     };

        //     throw error;
        // }

        return runEmployeeAttendanceTransactionRepo(
            async (tx) => {
                const lockedRecords =
                    [];

                for (
                    const item of resolvedRows
                ) {
                    let attendance =
                        item.attendance;

                    // if (
                    //     !attendance &&
                    //     item.autoData
                    // ) {
                    //     const {
                    //         action,
                    //         ...autoData
                    //     } =
                    //         item.autoData;

                    //     attendance =
                    //         await tx.hrmEmployeeAttendance.create({
                    //             data: {
                    //                 slug:
                    //                     randomUUID(),

                    //                 schoolSlug,

                    //                 employeeSlug:
                    //                     item
                    //                         .employee
                    //                         .slug,

                    //                 attendanceDate,

                    //                 ...autoData,

                    //                 inTime:
                    //                     null,

                    //                 outTime:
                    //                     null,

                    //                 isLate:
                    //                     false,

                    //                 isEarly:
                    //                     false,

                    //                 markedAt:
                    //                     new Date(),

                    //                 markedBySlug:
                    //                     user?.slug ||
                    //                     null,

                    //                 status:
                    //                     "active",

                    //                 isActive:
                    //                     true,
                    //             },
                    //         });

                    //     await createEmployeeAttendanceLogRepo(
                    //         buildAttendanceLog({
                    //             schoolSlug,

                    //             attendance,

                    //             previous:
                    //                 null,

                    //             action,

                    //             user,

                    //             metadata,
                    //         }),

                    //         tx,
                    //     );
                    // }

                    if (
                        !attendance &&
                        item.autoData
                    ) {
                        const {
                            action,
                            ...autoData
                        } = item.autoData;

                        attendance =
                            await tx.hrmEmployeeAttendance.create({
                                data: {
                                    slug:
                                        randomUUID(),

                                    schoolSlug,

                                    employeeSlug:
                                        item.employee.slug,

                                    attendanceDate,

                                    ...autoData,

                                    inTime:
                                        null,

                                    outTime:
                                        null,

                                    isLate:
                                        false,

                                    isEarly:
                                        false,

                                    lateMinutes:
                                        null,

                                    earlyMinutes:
                                        null,

                                    markedAt:
                                        action
                                            ? new Date()
                                            : null,

                                    markedBySlug:
                                        action
                                            ? user?.slug ||
                                            null
                                            : null,

                                    status:
                                        "active",

                                    isActive:
                                        true,

                                    deletedAt:
                                        null,
                                },
                            });

                        if (action) {
                            await createEmployeeAttendanceLogRepo(
                                buildAttendanceLog({
                                    schoolSlug,

                                    attendance,

                                    previous:
                                        null,

                                    action,

                                    user,

                                    metadata,
                                }),

                                tx,
                            );
                        }
                    }

                    const previous =
                    {
                        ...attendance,
                    };

                    const locked =
                        await tx.hrmEmployeeAttendance.update({
                            where: {
                                slug:
                                    attendance.slug,
                            },

                            data: {
                                isLocked:
                                    true,

                                lockedAt:
                                    new Date(),

                                lockedBySlug:
                                    user?.slug ||
                                    null,
                            },
                        });

                    await createEmployeeAttendanceLogRepo(
                        buildAttendanceLog({
                            schoolSlug,

                            attendance:
                                locked,

                            previous,

                            action:
                                "LOCK",

                            user,

                            metadata,
                        }),

                        tx,
                    );

                    lockedRecords.push(
                        locked,
                    );
                }

                return {
                    attendanceDate:
                        formatDate(
                            attendanceDate,
                        ),

                    lockedCount:
                        lockedRecords.length,
                };
            },
        );
    };

export const unlockEmployeeAttendanceService =
    async ({
        schoolSlug,
        payload,
        user,
        metadata,
    }) => {
        const attendanceDate =
            parseDate(
                payload.attendanceDate,
            );

        const attendances =
            await getEmployeeAttendancesForDateRepo({
                schoolSlug,
                attendanceDate,
            });

        if (
            !attendances.length
        ) {
            throw new Error(
                "Attendance records not found",
            );
        }

        return runEmployeeAttendanceTransactionRepo(
            async (tx) => {
                let unlockedCount =
                    0;

                for (
                    const attendance of attendances
                ) {
                    if (
                        !attendance.isLocked
                    ) {
                        continue;
                    }

                    const previous =
                    {
                        ...attendance,
                    };

                    const updated =
                        await tx.hrmEmployeeAttendance.update({
                            where: {
                                slug:
                                    attendance.slug,
                            },

                            data: {
                                isLocked:
                                    false,

                                lockedAt:
                                    null,

                                lockedBySlug:
                                    null,
                            },
                        });

                    await createEmployeeAttendanceLogRepo(
                        buildAttendanceLog({
                            schoolSlug,

                            attendance:
                                updated,

                            previous,

                            action:
                                "UNLOCK",

                            user,

                            metadata,
                        }),

                        tx,
                    );

                    unlockedCount +=
                        1;
                }

                return {
                    attendanceDate:
                        formatDate(
                            attendanceDate,
                        ),

                    unlockedCount,
                };
            },
        );
    };

export const getEmployeeAttendanceLogsService =
    async ({
        schoolSlug,
        employeeSlug,
        date,
    }) => {
        const attendanceDate =
            date
                ? parseDate(
                    date,
                )
                : null;

        return getEmployeeAttendanceLogsRepo({
            schoolSlug,
            employeeSlug:
                employeeSlug ||
                null,
            attendanceDate,
        });
    };

export const getYearlyAttendanceReportService =
    async ({
        schoolSlug,
        sessionSlug,
    }) => {
        if (!sessionSlug) {
            throw new Error(
                "Academic year is required",
            );
        }

        const session =
            await findAttendanceSessionBySlugRepo({
                schoolSlug,
                sessionSlug,
            });

        if (!session) {
            throw new Error(
                "Academic year not found",
            );
        }

        const academicStartDate =
            new Date(
                session.startDate,
            );

        const academicEndDate =
            new Date(
                session.endDate,
            );

        if (
            Number.isNaN(
                academicStartDate.getTime(),
            ) ||
            Number.isNaN(
                academicEndDate.getTime(),
            )
        ) {
            throw new Error(
                "Invalid academic year date range",
            );
        }

        if (
            academicEndDate <
            academicStartDate
        ) {
            throw new Error(
                "Academic year end date cannot be before start date",
            );
        }

        const [
            employees,
            holidays,
            basicSettings,
        ] =
            await Promise.all([
                getAcademicYearReportEmployeesRepo({
                    schoolSlug,

                    startDate:
                        academicStartDate,

                    endDate:
                        academicEndDate,
                }),

                getAcademicYearHolidaysRepo({
                    schoolSlug,

                    startDate:
                        academicStartDate,

                    endDate:
                        academicEndDate,
                }),

                getAcademicYearBasicSettingsRepo({
                    schoolSlug,
                }),
            ]);

        const academicDates =
            getInclusiveDates(
                academicStartDate,
                academicEndDate,
            );

        const totalCalendarDays =
            academicDates.length;

        const sundayDateSet =
            getSundayDateSet(
                academicDates,
            );

        const totalSundayDays =
            sundayDateSet.size;

        const reportRows =
            [];

        for (
            let index = 0;
            index <
            employees.length;
            index += 1
        ) {
            const employee =
                employees[
                index
                ];

            const holidayDateSet =
                getEmployeeSpecificHolidayDateSet({
                    employee,

                    dates:
                        academicDates,

                    holidays,

                    basicSettings,

                    sundayDateSet,
                });

            const totalHolidayDays =
                holidayDateSet.size;

            const totalWorkingDays =
                Math.max(
                    0,

                    totalCalendarDays -
                    totalSundayDays -
                    totalHolidayDays,
                );

            const leaves =
                await getApprovedEmployeeLeaveDates({
                    schoolSlug,

                    employeeSlug:
                        employee.slug,

                    startDate:
                        academicStartDate,

                    endDate:
                        academicEndDate,
                });

            const leaveDateSet =
                getEmployeeLeaveDateSet({
                    leaves,

                    academicStartDate,

                    academicEndDate,

                    sundayDateSet,

                    holidayDateSet,
                });

            const totalLeaveDays =
                leaveDateSet.size;

            const attendanceApplicableDays =
                Math.max(
                    0,

                    totalWorkingDays -
                    totalLeaveDays,
                );

            const presentDateSet =
                new Set(
                    employee.hrmEmployeeAttendances
                        .filter(
                            (attendance) =>
                                attendance.attendanceStatus ===
                                "PRESENT",
                        )
                        .map(
                            (attendance) =>
                                toDateKey(
                                    attendance.attendanceDate,
                                ),
                        )
                        .filter(
                            (dateKey) =>
                                !sundayDateSet.has(
                                    dateKey,
                                ) &&
                                !holidayDateSet.has(
                                    dateKey,
                                ) &&
                                !leaveDateSet.has(
                                    dateKey,
                                ),
                        ),
                );

            const presentDays =
                presentDateSet.size;

            const absentDays =
                employee.hrmEmployeeAttendances.filter(
                    (attendance) =>
                        attendance.attendanceStatus ===
                        "ABSENT" &&
                        !sundayDateSet.has(
                            toDateKey(
                                attendance.attendanceDate,
                            ),
                        ) &&
                        !holidayDateSet.has(
                            toDateKey(
                                attendance.attendanceDate,
                            ),
                        ) &&
                        !leaveDateSet.has(
                            toDateKey(
                                attendance.attendanceDate,
                            ),
                        ),
                ).length;

            const notMarkedDays =
                Math.max(
                    0,

                    attendanceApplicableDays -
                    presentDays -
                    absentDays,
                );

            const average =
                attendanceApplicableDays >
                    0
                    ? Number(
                        (
                            (
                                presentDays /
                                attendanceApplicableDays
                            ) *
                            100
                        ).toFixed(
                            2,
                        ),
                    )
                    : 0;

            reportRows.push({
                sno:
                    index +
                    1,

                employeeSlug:
                    employee.slug,

                employeeId:
                    employee.employeeId,

                employeeCode:
                    employee.employeeCode,

                employeeName:
                    employee.fullName,

                department:
                    employee
                        .department
                        ?.departmentName ||
                    "-",

                designation:
                    employee
                        .designation
                        ?.designationName ||
                    "-",

                totalCalendarDays,

                totalSundayDays,

                totalHolidayDays,

                totalWorkingDays,

                totalLeaveDays,

                attendanceApplicableDays,

                presentDays,

                absentDays,

                notMarkedDays,

                average,
            });
        }

        return {
            academicYear: {
                slug:
                    session.slug,

                name:
                    session.name,

                startDate:
                    formatDate(
                        academicStartDate,
                    ),

                endDate:
                    formatDate(
                        academicEndDate,
                    ),
            },

            totalCalendarDays,

            totalSundayDays,

            employees:
                reportRows,
        };
    };

export const bulkSaveEmployeeAttendanceService =
    async ({
        schoolSlug,
        payload,
        user,
        metadata,
    }) => {
        const attendanceDate =
            parseDate(
                payload.attendanceDate,
            );

        return runEmployeeAttendanceTransactionRepo(
            async (tx) => {
                const savedRows = [];

                for (
                    const row of payload.employees
                ) {
                    const employee =
                        await findAttendanceEmployeeBySlugRepo({
                            schoolSlug,

                            employeeSlug:
                                row.employeeSlug,

                            db: tx,
                        });

                    if (!employee) {
                        throw new Error(
                            `Employee not found: ${row.employeeSlug}`,
                        );
                    }

                    const previous =
                        await findEmployeeAttendanceRepo({
                            schoolSlug,

                            employeeSlug:
                                employee.slug,

                            attendanceDate,

                            db: tx,
                        });

                    if (
                        previous?.isLocked
                    ) {
                        throw new Error(
                            `${employee.fullName} attendance is locked`,
                        );
                    }

                    const context =
                        await resolveAttendanceContext({
                            schoolSlug,
                            employee,
                            attendanceDate,
                            db: tx,
                        });

                    // Holiday / Leave ko bulk manual save me touch nahi karna
                    if (
                        context.type ===
                        "HOLIDAY" ||
                        context.type ===
                        "LEAVE"
                    ) {
                        continue;
                    }

                    if (
                        row.attendanceStatus ===
                        "PRESENT"
                    ) {
                        if (
                            !context.shift
                        ) {
                            throw new Error(
                                `Shift is not configured for ${employee.fullName}`,
                            );
                        }

                        const calculation =
                            calculateShiftAttendance({
                                shift:
                                    context.shift,

                                inTime:
                                    row.inTime,

                                outTime:
                                    row.outTime,
                            });

                        const saved =
                            await upsertEmployeeAttendanceRepo({
                                schoolSlug,

                                employeeSlug:
                                    employee.slug,

                                attendanceDate,

                                createData: {
                                    slug:
                                        randomUUID(),

                                    schoolSlug,

                                    employeeSlug:
                                        employee.slug,

                                    attendanceDate,

                                    attendanceStatus:
                                        "PRESENT",

                                    source:
                                        "MANUAL",

                                    inTime:
                                        row.inTime,

                                    outTime:
                                        row.outTime,

                                    ...calculation,

                                    basicSettingSlug:
                                        context
                                            .basicSetting
                                            ?.slug ||
                                        null,

                                    holidaySlug:
                                        null,

                                    leaveApplicationSlug:
                                        null,

                                    leaveTypeSlug:
                                        null,

                                    leaveTypeName:
                                        null,

                                    remarks:
                                        row.remarks ||
                                        null,

                                    markedBySlug:
                                        user?.slug ||
                                        null,

                                    markedAt:
                                        new Date(),

                                    isLocked:
                                        false,

                                    status:
                                        "active",

                                    isActive:
                                        true,

                                    deletedAt:
                                        null,
                                },

                                updateData: {
                                    attendanceStatus:
                                        "PRESENT",

                                    source:
                                        "MANUAL",

                                    inTime:
                                        row.inTime,

                                    outTime:
                                        row.outTime,

                                    ...calculation,

                                    basicSettingSlug:
                                        context
                                            .basicSetting
                                            ?.slug ||
                                        null,

                                    holidaySlug:
                                        null,

                                    leaveApplicationSlug:
                                        null,

                                    leaveTypeSlug:
                                        null,

                                    leaveTypeName:
                                        null,

                                    remarks:
                                        row.remarks ||
                                        null,

                                    markedBySlug:
                                        user?.slug ||
                                        null,

                                    markedAt:
                                        new Date(),
                                },

                                db: tx,
                            });

                        await createEmployeeAttendanceLogRepo(
                            buildAttendanceLog({
                                schoolSlug,

                                attendance:
                                    saved,

                                previous,

                                action:
                                    previous
                                        ? "UPDATE"
                                        : "MARK_PRESENT",

                                user,

                                metadata,

                                remarks:
                                    row.remarks,
                            }),

                            tx,
                        );

                        savedRows.push(
                            saved,
                        );

                        continue;
                    }

                    // Default A = ABSENT
                    const saved =
                        await upsertEmployeeAttendanceRepo({
                            schoolSlug,

                            employeeSlug:
                                employee.slug,

                            attendanceDate,

                            createData: {
                                slug:
                                    randomUUID(),

                                schoolSlug,

                                employeeSlug:
                                    employee.slug,

                                attendanceDate,

                                attendanceStatus:
                                    "ABSENT",

                                source:
                                    "MANUAL",

                                inTime:
                                    null,

                                outTime:
                                    null,

                                isLate:
                                    false,

                                isEarly:
                                    false,

                                lateMinutes:
                                    null,

                                earlyMinutes:
                                    null,

                                shiftSlug:
                                    context
                                        .shift
                                        ?.slug ||
                                    null,

                                expectedInTime:
                                    context.shift
                                        ? prismaTimeToHHMM(
                                            context
                                                .shift
                                                .loginTime,
                                        )
                                        : null,

                                expectedOutTime:
                                    context.shift
                                        ? prismaTimeToHHMM(
                                            context
                                                .shift
                                                .logoutTime,
                                        )
                                        : null,

                                loginBufferMinutes:
                                    context
                                        .shift
                                        ?.loginBufferMinutes ??
                                    null,

                                logoutBufferMinutes:
                                    context
                                        .shift
                                        ?.logoutBufferMinutes ??
                                    null,

                                basicSettingSlug:
                                    context
                                        .basicSetting
                                        ?.slug ||
                                    null,

                                holidaySlug:
                                    null,

                                leaveApplicationSlug:
                                    null,

                                leaveTypeSlug:
                                    null,

                                leaveTypeName:
                                    null,

                                remarks:
                                    row.remarks ||
                                    null,

                                markedBySlug:
                                    user?.slug ||
                                    null,

                                markedAt:
                                    new Date(),

                                isLocked:
                                    false,

                                status:
                                    "active",

                                isActive:
                                    true,

                                deletedAt:
                                    null,
                            },

                            updateData: {
                                attendanceStatus:
                                    "ABSENT",

                                source:
                                    "MANUAL",

                                inTime:
                                    null,

                                outTime:
                                    null,

                                isLate:
                                    false,

                                isEarly:
                                    false,

                                lateMinutes:
                                    null,

                                earlyMinutes:
                                    null,

                                shiftSlug:
                                    context
                                        .shift
                                        ?.slug ||
                                    null,

                                basicSettingSlug:
                                    context
                                        .basicSetting
                                        ?.slug ||
                                    null,

                                holidaySlug:
                                    null,

                                leaveApplicationSlug:
                                    null,

                                leaveTypeSlug:
                                    null,

                                leaveTypeName:
                                    null,

                                remarks:
                                    row.remarks ||
                                    null,

                                markedBySlug:
                                    user?.slug ||
                                    null,

                                markedAt:
                                    new Date(),
                            },

                            db: tx,
                        });

                    await createEmployeeAttendanceLogRepo(
                        buildAttendanceLog({
                            schoolSlug,

                            attendance:
                                saved,

                            previous,

                            action:
                                "MARK_ABSENT",

                            user,

                            metadata,

                            remarks:
                                row.remarks,
                        }),

                        tx,
                    );

                    savedRows.push(
                        saved,
                    );
                }

                return {
                    attendanceDate:
                        formatDate(
                            attendanceDate,
                        ),

                    savedCount:
                        savedRows.length,
                };
            },
        );
    };

export const importEmployeeAttendanceService =
    async ({
        schoolSlug,
        fileBuffer,
        user,
        metadata,
    }) => {
        if (!fileBuffer) {
            throw new Error(
                "Excel file is required",
            );
        }

        const workbook =
            XLSX.read(
                fileBuffer,
                {
                    type:
                        "buffer",
                    cellDates:
                        false,
                },
            );

        const firstSheetName =
            workbook.SheetNames[
            0
            ];

        if (!firstSheetName) {
            throw new Error(
                "Excel sheet not found",
            );
        }

        const worksheet =
            workbook.Sheets[
            firstSheetName
            ];

        const excelRows =
            XLSX.utils.sheet_to_json(
                worksheet,
                {
                    defval:
                        null,
                    raw:
                        true,
                },
            );

        if (
            !excelRows.length
        ) {
            throw new Error(
                "Excel sheet is empty",
            );
        }

        const groupedPunches =
            new Map();

        const invalidRows =
            [];

        excelRows.forEach(
            (
                row,
                index,
            ) => {
                const excelRow =
                    index + 2;

                const employeeId =
                    getExcelField(
                        row,
                        [
                            "Employee ID",
                            "Employee Id",
                            "Emp ID",
                            "Emp Id",
                            "Employee Code",
                        ],
                    );

                const punchDateValue =
                    getExcelField(
                        row,
                        [
                            "Punch Date",
                            "Date",
                            "Attendance Date",
                        ],
                    );

                const punchTimeValue =
                    getExcelField(
                        row,
                        [
                            "Punch Time",
                            "Time",
                            "Attendance Time",
                        ],
                    );

                if (
                    employeeId ===
                    null ||
                    employeeId ===
                    undefined ||
                    employeeId ===
                    ""
                ) {
                    invalidRows.push({
                        row:
                            excelRow,

                        message:
                            "Employee ID is required",
                    });

                    return;
                }

                const punchDate =
                    normalizeExcelDate(
                        punchDateValue,
                    );

                const punchTime =
                    normalizeExcelTime(
                        punchTimeValue,
                    );

                if (
                    !punchDate
                ) {
                    invalidRows.push({
                        row:
                            excelRow,

                        employeeId:
                            String(
                                employeeId,
                            ),

                        message:
                            "Invalid punch date",
                    });

                    return;
                }

                if (
                    !punchTime
                ) {
                    invalidRows.push({
                        row:
                            excelRow,

                        employeeId:
                            String(
                                employeeId,
                            ),

                        message:
                            "Invalid punch time",
                    });

                    return;
                }

                const normalizedEmployeeId =
                    String(
                        employeeId,
                    ).trim();

                const key =
                    `${normalizedEmployeeId}__${punchDate}`;

                if (
                    !groupedPunches.has(
                        key,
                    )
                ) {
                    groupedPunches.set(
                        key,
                        {
                            employeeId:
                                normalizedEmployeeId,

                            attendanceDate:
                                punchDate,

                            punches:
                                [],
                        },
                    );
                }

                groupedPunches
                    .get(key)
                    .punches.push({
                        time:
                            punchTime,

                        excelRow,
                    });
            },
        );

        const results =
            [];

        let successCount =
            0;

        let failedCount =
            invalidRows.length;

        let singlePunchCount =
            0;

        for (
            const group of groupedPunches.values()
        ) {
            try {
                const employee =
                    await findAttendanceEmployeeByEmployeeIdRepo({
                        schoolSlug,

                        employeeId:
                            group.employeeId,
                    });

                if (!employee) {
                    throw new Error(
                        "Active employee not found",
                    );
                }

                const attendanceDate =
                    parseDate(
                        group.attendanceDate,
                    );

                const existingAttendance =
                    await findEmployeeAttendanceRepo({
                        schoolSlug,

                        employeeSlug:
                            employee.slug,

                        attendanceDate,
                    });

                if (
                    existingAttendance
                        ?.isLocked
                ) {
                    throw new Error(
                        "Attendance is locked for selected date",
                    );
                }

                const context =
                    await resolveAttendanceContext({
                        schoolSlug,

                        employee,

                        attendanceDate,
                    });

                if (
                    context.type ===
                    "HOLIDAY"
                ) {
                    throw new Error(
                        "Selected date is holiday",
                    );
                }

                if (
                    context.type ===
                    "LEAVE"
                ) {
                    throw new Error(
                        "Employee is on approved leave",
                    );
                }

                if (
                    !context.shift
                ) {
                    throw new Error(
                        "Shift is not configured",
                    );
                }

                const punches =
                    group.punches
                        .map(
                            (
                                item,
                            ) =>
                                item.time,
                        )
                        .sort(
                            (
                                a,
                                b,
                            ) =>
                                timeToMinutes(
                                    a,
                                ) -
                                timeToMinutes(
                                    b,
                                ),
                        );

                const inTime =
                    punches[0];

                const outTime =
                    punches.length >
                        1
                        ? punches[
                        punches.length -
                        1
                        ]
                        : null;

                let calculation =
                {
                    shiftSlug:
                        context
                            .shift
                            .slug,

                    expectedInTime:
                        prismaTimeToHHMM(
                            context
                                .shift
                                .loginTime,
                        ),

                    expectedOutTime:
                        prismaTimeToHHMM(
                            context
                                .shift
                                .logoutTime,
                        ),

                    loginBufferMinutes:
                        Number(
                            context
                                .shift
                                .loginBufferMinutes ||
                            0,
                        ),

                    logoutBufferMinutes:
                        Number(
                            context
                                .shift
                                .logoutBufferMinutes ||
                            0,
                        ),

                    isLate:
                        false,

                    isEarly:
                        false,

                    lateMinutes:
                        0,

                    earlyMinutes:
                        null,
                };

                if (outTime) {
                    calculation =
                        calculateShiftAttendance({
                            shift:
                                context.shift,

                            inTime,

                            outTime,
                        });
                } else {
                    const expectedIn =
                        timeToMinutes(
                            prismaTimeToHHMM(
                                context
                                    .shift
                                    .loginTime,
                            ),
                        );

                    const actualIn =
                        timeToMinutes(
                            inTime,
                        );

                    const buffer =
                        Number(
                            context
                                .shift
                                .loginBufferMinutes ||
                            0,
                        );

                    const lateMinutes =
                        Math.max(
                            0,
                            actualIn -
                            (
                                expectedIn +
                                buffer
                            ),
                        );

                    calculation.isLate =
                        lateMinutes >
                        0;

                    calculation.lateMinutes =
                        lateMinutes;

                    singlePunchCount +=
                        1;
                }

                const remarks =
                    outTime
                        ? `Imported from Excel (${punches.length} punches)`
                        : "Imported from Excel - single punch found";

                const saved =
                    await runEmployeeAttendanceTransactionRepo(
                        async (
                            tx,
                        ) => {
                            const attendance =
                                await upsertEmployeeAttendanceRepo({
                                    schoolSlug,

                                    employeeSlug:
                                        employee.slug,

                                    attendanceDate,

                                    createData:
                                    {
                                        slug:
                                            randomUUID(),

                                        schoolSlug,

                                        employeeSlug:
                                            employee.slug,

                                        attendanceDate,

                                        attendanceStatus:
                                            "PRESENT",

                                        source:
                                            "IMPORT",

                                        inTime,

                                        outTime,

                                        ...calculation,

                                        basicSettingSlug:
                                            context
                                                .basicSetting
                                                ?.slug ||
                                            null,

                                        holidaySlug:
                                            null,

                                        leaveApplicationSlug:
                                            null,

                                        leaveTypeSlug:
                                            null,

                                        leaveTypeName:
                                            null,

                                        remarks,

                                        markedBySlug:
                                            user?.slug ||
                                            null,

                                        markedAt:
                                            new Date(),

                                        isLocked:
                                            false,

                                        status:
                                            "active",

                                        isActive:
                                            true,

                                        deletedAt:
                                            null,
                                    },

                                    updateData:
                                    {
                                        attendanceStatus:
                                            "PRESENT",

                                        source:
                                            "IMPORT",

                                        inTime,

                                        outTime,

                                        ...calculation,

                                        basicSettingSlug:
                                            context
                                                .basicSetting
                                                ?.slug ||
                                            null,

                                        holidaySlug:
                                            null,

                                        leaveApplicationSlug:
                                            null,

                                        leaveTypeSlug:
                                            null,

                                        leaveTypeName:
                                            null,

                                        remarks,

                                        markedBySlug:
                                            user?.slug ||
                                            null,

                                        markedAt:
                                            new Date(),
                                    },

                                    db:
                                        tx,
                                });

                            await createEmployeeAttendanceLogRepo(
                                buildAttendanceLog({
                                    schoolSlug,

                                    attendance,

                                    previous:
                                        existingAttendance,

                                    action:
                                        "IMPORT",

                                    user,

                                    metadata,

                                    remarks,
                                }),

                                tx,
                            );

                            return attendance;
                        },
                    );

                results.push({
                    success:
                        true,

                    employeeId:
                        group.employeeId,

                    employeeSlug:
                        employee.slug,

                    fullName:
                        employee.fullName,

                    attendanceDate:
                        group.attendanceDate,

                    punchCount:
                        punches.length,

                    inTime,

                    outTime,

                    attendanceSlug:
                        saved.slug,

                    message:
                        outTime
                            ? "Attendance imported successfully"
                            : "Attendance imported with single punch",
                });

                successCount +=
                    1;
            } catch (error) {
                results.push({
                    success:
                        false,

                    employeeId:
                        group.employeeId,

                    attendanceDate:
                        group.attendanceDate,

                    punchCount:
                        group.punches
                            .length,

                    message:
                        error.message,
                });

                failedCount +=
                    1;
            }
        }

        return {
            totalExcelRows:
                excelRows.length,

            groupedAttendanceCount:
                groupedPunches.size,

            successCount,

            failedCount,

            singlePunchCount,

            invalidRows,

            results,
        };
    };

const getEmployeeSpecificHolidayDateSet =
    ({
        employee,
        dates,
        holidays,
        basicSettings,
        sundayDateSet,
    }) => {
        const holidayDateSet =
            new Set();

        for (
            const date of dates
        ) {
            const dateKey =
                toDateKey(
                    date,
                );

            // Sunday already separately count ho raha hai.
            if (
                sundayDateSet.has(
                    dateKey,
                )
            ) {
                continue;
            }

            const basicHoliday =
                isBasicSettingHoliday({
                    date,

                    departmentSlug:
                        employee.departmentSlug,

                    basicSettings,
                });

            if (
                basicHoliday
            ) {
                holidayDateSet.add(
                    dateKey,
                );

                continue;
            }

            const specificHoliday =
                holidays.find(
                    (holiday) => {
                        if (
                            toDateKey(
                                holiday.holidayDate,
                            ) !==
                            dateKey
                        ) {
                            return false;
                        }

                        const employeeMatch =
                            holiday.hrmEmployeeId ===
                            employee.id;

                        const departmentMatch =
                            holiday.hrmDepartmentId ===
                            employee.department
                                ?.id;

                        return (
                            employeeMatch ||
                            departmentMatch
                        );
                    },
                );

            if (
                specificHoliday
            ) {
                holidayDateSet.add(
                    dateKey,
                );
            }
        }

        return holidayDateSet;
    };


const getApprovedEmployeeLeaveDates =
    async ({
        schoolSlug,
        employeeSlug,
        startDate,
        endDate,
    }) => {
        // Future Leave Application module:
        //
        // Yahin query lagegi:
        //
        // approvalStatus = APPROVED
        // employeeSlug = selected employee
        // leave date range overlaps academic year
        //
        // Return format:
        //
        // [
        //   {
        //     leaveApplicationSlug: "...",
        //     leaveTypeSlug: "...",
        //     leaveTypeName: "Casual Leave",
        //     startDate: Date,
        //     endDate: Date,
        //   },
        // ]
        //
        // Abhi leave module nahi hai isliye empty array.

        void schoolSlug;
        void employeeSlug;
        void startDate;
        void endDate;

        return [];
    };

const getEmployeeLeaveDateSet =
    ({
        leaves,
        academicStartDate,
        academicEndDate,
        sundayDateSet,
        holidayDateSet,
    }) => {
        const leaveDateSet =
            new Set();

        for (
            const leave of leaves
        ) {
            const leaveStartDate =
                new Date(
                    leave.startDate,
                );

            const leaveEndDate =
                new Date(
                    leave.endDate,
                );

            const startDate =
                leaveStartDate <
                    academicStartDate
                    ? academicStartDate
                    : leaveStartDate;

            const endDate =
                leaveEndDate >
                    academicEndDate
                    ? academicEndDate
                    : leaveEndDate;

            if (
                endDate <
                startDate
            ) {
                continue;
            }

            const leaveDates =
                getInclusiveDates(
                    startDate,
                    endDate,
                );

            for (
                const date of leaveDates
            ) {
                const dateKey =
                    toDateKey(
                        date,
                    );

                // Sunday ko leave me count nahi karenge
                if (
                    sundayDateSet.has(
                        dateKey,
                    )
                ) {
                    continue;
                }

                // Holiday ke din leave count nahi hoga
                if (
                    holidayDateSet.has(
                        dateKey,
                    )
                ) {
                    continue;
                }

                leaveDateSet.add(
                    dateKey,
                );
            }
        }

        return leaveDateSet;
    };