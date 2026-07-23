import {
    getDailyAttendanceReportMappingsRepo,
    getMonthlyStudentReportMappingsRepo,
    getStudentDayWiseReportRepo,
    getMonthlyAttendanceByMappingRepo
} from "../../../repositories/academic/studentAttendance/studentAttendanceRepository.js";

const createServiceError = (message, statusCode = 400) => {
    const error = new Error(message);

    error.statusCode = statusCode;

    return error;
};

const normalizeAttendanceStatus = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toUpperCase();

    const statusMap = {
        P: "PRESENT",
        PRESENT: "PRESENT",

        A: "ABSENT",
        ABSENT: "ABSENT",

        L: "LEAVE",
        LEAVE: "LEAVE",

        HD: "HALF_DAY",
        HALF_DAY: "HALF_DAY",
        HALFDAY: "HALF_DAY",

        H: "HOLIDAY",
        HOLIDAY: "HOLIDAY",

        SUNDAY: "SUNDAY",
    };

    return statusMap[normalizedStatus] || "NOT_MARKED";
};

const getMonthDateRange = ({ year, month }) => {
    const parsedYear = Number(year);
    const parsedMonth = Number(month);

    if (
        !Number.isInteger(parsedYear) ||
        !Number.isInteger(parsedMonth) ||
        parsedMonth < 1 ||
        parsedMonth > 12
    ) {
        throw createServiceError("Valid year and month are required");
    }

    const startDate = new Date(
        Date.UTC(parsedYear, parsedMonth - 1, 1),
    );

    const endDate = new Date(
        Date.UTC(parsedYear, parsedMonth, 0, 23, 59, 59, 999),
    );

    return {
        parsedYear,
        parsedMonth,
        startDate,
        endDate,
    };
};

const calculateAttendanceSummary = (attendanceDays = []) => {
    const summary = {
        totalAttendance: 0,
        totalWorkingDays: 0,

        totalPresent: 0,
        totalAbsent: 0,
        totalLeave: 0,
        totalHalfDay: 0,

        totalHoliday: 0,
        totalSunday: 0,
        totalNotMarked: 0,

        effectivePresent: 0,
        attendancePercentage: 0,
    };

    attendanceDays.forEach((attendanceDay) => {
        const status = normalizeAttendanceStatus(
            attendanceDay.attendanceStatus,
        );

        switch (status) {
            case "PRESENT":
                summary.totalPresent += 1;
                summary.totalWorkingDays += 1;
                break;

            case "ABSENT":
                summary.totalAbsent += 1;
                summary.totalWorkingDays += 1;
                break;

            case "LEAVE":
                summary.totalLeave += 1;
                summary.totalWorkingDays += 1;
                break;

            case "HALF_DAY":
                summary.totalHalfDay += 1;
                summary.totalWorkingDays += 1;
                break;

            case "HOLIDAY":
                summary.totalHoliday += 1;
                break;

            case "SUNDAY":
                summary.totalSunday += 1;
                break;

            default:
                summary.totalNotMarked += 1;
                break;
        }
    });

    summary.totalAttendance = summary.totalWorkingDays;

    summary.effectivePresent =
        summary.totalPresent + summary.totalHalfDay * 0.5;

    summary.attendancePercentage =
        summary.totalWorkingDays > 0
            ? Number(
                (
                    (summary.effectivePresent /
                        summary.totalWorkingDays) *
                    100
                ).toFixed(2),
            )
            : 0;

    return summary;
};

const getDateKey = (date) => {
    return new Date(date).toISOString().slice(0, 10);
};

const getAllDatesOfMonth = ({ year, month }) => {
    const totalDays = new Date(
        Date.UTC(year, month, 0),
    ).getUTCDate();

    return Array.from({ length: totalDays }, (_, index) => {
        const day = index + 1;

        return new Date(Date.UTC(year, month - 1, day));
    });
};

export const getDailyAttendanceReportService = async ({
    query,
    user,
}) => {
    const { session, board, attendanceDate } = query;

    if (!session || !board || !attendanceDate) {
        throw createServiceError(
            "Session, board and attendance date are required",
        );
    }

    const parsedAttendanceDate = new Date(
        `${attendanceDate}T00:00:00.000Z`,
    );

    if (Number.isNaN(parsedAttendanceDate.getTime())) {
        throw createServiceError("Invalid attendance date");
    }

    const mappings =
        await getDailyAttendanceReportMappingsRepo({
            schoolSlug: user.schoolSlug,
            session,
            board,
            attendanceDate: parsedAttendanceDate,
        });

    const groupedRecords = new Map();

    mappings.forEach((mapping) => {
        const classSlug = mapping.class?.slug || "no-class";
        const sectionSlug = mapping.section?.slug || "no-section";
        const streamSlug = mapping.stream?.slug || "no-stream";

        const groupKey = `${classSlug}:${sectionSlug}:${streamSlug}`;

        if (!groupedRecords.has(groupKey)) {
            groupedRecords.set(groupKey, {
                class: mapping.class,
                section: mapping.section,
                stream: mapping.stream,

                enrolled: 0,
                present: 0,
                absent: 0,
                leave: 0,
                halfDay: 0,
                holiday: 0,
                sunday: 0,
                notMarked: 0,
            });
        }

        const group = groupedRecords.get(groupKey);

        group.enrolled += 1;

        const attendanceDay = mapping.attendanceDays?.[0];

        const attendanceStatus = normalizeAttendanceStatus(
            attendanceDay?.attendanceStatus,
        );

        switch (attendanceStatus) {
            case "PRESENT":
                group.present += 1;
                break;

            case "ABSENT":
                group.absent += 1;
                break;

            case "LEAVE":
                group.leave += 1;
                break;

            case "HALF_DAY":
                group.halfDay += 1;
                break;

            case "HOLIDAY":
                group.holiday += 1;
                break;

            case "SUNDAY":
                group.sunday += 1;
                break;

            default:
                group.notMarked += 1;
                break;
        }
    });

    const rows = Array.from(groupedRecords.values());

    const totals = rows.reduce(
        (result, row) => {
            result.enrolled += row.enrolled;
            result.present += row.present;
            result.absent += row.absent;
            result.leave += row.leave;
            result.halfDay += row.halfDay;
            result.holiday += row.holiday;
            result.sunday += row.sunday;
            result.notMarked += row.notMarked;

            return result;
        },
        {
            enrolled: 0,
            present: 0,
            absent: 0,
            leave: 0,
            halfDay: 0,
            holiday: 0,
            sunday: 0,
            notMarked: 0,
        },
    );

    return {
        attendanceDate,
        dayName: parsedAttendanceDate.toLocaleDateString("en-US", {
            weekday: "long",
            timeZone: "UTC",
        }),

        session,
        board,

        rows,
        totals,
    };
};

export const getMonthlyAttendanceReportService = async ({
    query,
    user,
}) => {
    const {
        session,
        board,
        classTitle,
        sectionSlug,
        streamSlug,
        gender,
        year,
        month,
    } = query;

    if (!session || !board || !classTitle) {
        throw createServiceError(
            "Session, board and class are required",
        );
    }

    const {
        parsedYear,
        parsedMonth,
        startDate,
        endDate,
    } = getMonthDateRange({
        year,
        month,
    });

    const mappings =
        await getMonthlyStudentReportMappingsRepo({
            schoolSlug: user.schoolSlug,
            session,
            board,
            classTitle,
            sectionSlug: sectionSlug || undefined,
            streamSlug: streamSlug || undefined,
            gender: gender || undefined,
            year: parsedYear,
            month: parsedMonth,
        });

    const students = mappings.map((mapping) => {
        const monthlyAttendance =
            mapping.studentAttendances?.[0] || null;

        const totalWorkingDays =
            monthlyAttendance?.totalWorkingDays || 0;

        const totalPresent =
            monthlyAttendance?.totalPresent || 0;

        const totalAbsent =
            monthlyAttendance?.totalAbsent || 0;

        const totalLeave =
            monthlyAttendance?.totalLeave || 0;

        const totalHalfDay =
            monthlyAttendance?.totalHalfDay || 0;

        const totalHoliday =
            monthlyAttendance?.totalHoliday || 0;

        const totalAttendance =
            totalPresent +
            totalAbsent +
            totalLeave +
            totalHalfDay;

        const effectivePresent =
            totalPresent + totalHalfDay * 0.5;

        const attendancePercentage =
            monthlyAttendance?.attendancePercentage !== undefined &&
                monthlyAttendance?.attendancePercentage !== null
                ? Number(monthlyAttendance.attendancePercentage)
                : totalAttendance > 0
                    ? Number(
                        (
                            (effectivePresent / totalAttendance) *
                            100
                        ).toFixed(2),
                    )
                    : 0;

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

            attendanceSlug:
                monthlyAttendance?.slug || null,

            attendance:
                monthlyAttendance?.attendance || {},

            totalAttendance,
            totalWorkingDays,
            totalPresent,
            totalAbsent,
            totalLeave,
            totalHalfDay,
            totalHoliday,

            /*
             * Sundays database mein store nahi ho rahe.
             * Isko calendar se calculate karna hoga.
             */
            totalSunday: 0,

            effectivePresent,
            attendancePercentage,
        };
    });

    const classSummary = students.reduce(
        (summary, student) => {
            summary.totalStudents += 1;

            summary.totalAttendance +=
                student.totalAttendance;

            summary.totalWorkingDays +=
                student.totalWorkingDays;

            summary.totalPresent +=
                student.totalPresent;

            summary.totalAbsent +=
                student.totalAbsent;

            summary.totalLeave +=
                student.totalLeave;

            summary.totalHalfDay +=
                student.totalHalfDay;

            summary.totalHoliday +=
                student.totalHoliday;

            summary.effectivePresent +=
                student.effectivePresent;

            return summary;
        },
        {
            totalStudents: 0,
            totalAttendance: 0,
            totalWorkingDays: 0,
            totalPresent: 0,
            totalAbsent: 0,
            totalLeave: 0,
            totalHalfDay: 0,
            totalHoliday: 0,
            totalSunday: 0,
            effectivePresent: 0,
        },
    );

    classSummary.attendancePercentage =
        classSummary.totalAttendance > 0
            ? Number(
                (
                    (classSummary.effectivePresent /
                        classSummary.totalAttendance) *
                    100
                ).toFixed(2),
            )
            : 0;

    const totalEffectivePresent =
        classSummary.totalPresent +
        classSummary.totalHalfDay * 0.5;

    classSummary.attendancePercentage =
        classSummary.totalAttendance > 0
            ? Number(
                (
                    (totalEffectivePresent /
                        classSummary.totalAttendance) *
                    100
                ).toFixed(2),
            )
            : 0;

    return {
        year: parsedYear,
        month: parsedMonth,

        session,
        board,
        classTitle,

        filters: {
            sectionSlug: sectionSlug || null,
            streamSlug: streamSlug || null,
            gender: gender || null,
        },

        classSummary,
        students,
    };
};



export const getStudentDayWiseReportService = async ({
    params,
    query,
    user,
}) => {
    const { academicMappingSlug } = params;
    const { year, month } = query;

    const {
        parsedYear,
        parsedMonth,
        startDate,
        endDate,
    } = getMonthDateRange({
        year,
        month,
    });

    const mapping = await getStudentDayWiseReportRepo({
        schoolSlug: user.schoolSlug,
        academicMappingSlug,
        startDate,
        endDate,
    });

    if (!mapping) {
        throw createServiceError(
            "Student academic mapping not found",
            404,
        );
    }

    const attendanceDayMap = new Map(
        mapping.attendanceDays.map((attendanceDay) => [
            getDateKey(attendanceDay.attendanceDate),
            attendanceDay,
        ]),
    );

    const days = getAllDatesOfMonth({
        year: parsedYear,
        month: parsedMonth,
    }).map((date) => {
        const dateKey = getDateKey(date);

        const savedAttendance = attendanceDayMap.get(dateKey);

        const isSunday = date.getUTCDay() === 0;

        let attendanceStatus = normalizeAttendanceStatus(
            savedAttendance?.attendanceStatus,
        );

        if (!savedAttendance && isSunday) {
            attendanceStatus = "SUNDAY";
        }

        return {
            date: dateKey,

            day: date.toLocaleDateString("en-US", {
                weekday: "long",
                timeZone: "UTC",
            }),

            attendanceStatus,

            daySlug: savedAttendance?.slug || null,
            isLocked: Boolean(savedAttendance?.isLocked),
            markedAt: savedAttendance?.markedAt || null,
            markedBy: savedAttendance?.markedBy || null,
        };
    });

    return {
        year: parsedYear,
        month: parsedMonth,

        academicMappingSlug: mapping.slug,

        rollNumberPrefix: mapping.rollNumberPrefix,
        rollNumber: mapping.rollNumber,

        student: mapping.student,
        class: mapping.class,
        section: mapping.section,
        stream: mapping.stream,

        summary: calculateAttendanceSummary(
            mapping.attendanceDays,
        ),

        days,
    };
};