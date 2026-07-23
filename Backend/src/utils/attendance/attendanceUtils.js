export const ATTENDANCE_STATUS = {
    PRESENT: "P",
    ABSENT: "A",
    LEAVE: "L",
    HALF_DAY: "HD",
    HOLIDAY: "H",
};

export const getAttendanceDateParts = (dateValue) => {
    const date = new Date(`${dateValue}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid attendance date");
    }

    return {
        attendanceDate: date,
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        dayKey: String(date.getUTCDate()).padStart(2, "0"),
    };
};

export const calculateAttendanceSummary = (attendance = {}) => {
    const statuses = Object.values(attendance);

    const totalPresent = statuses.filter(
        (status) => status === ATTENDANCE_STATUS.PRESENT,
    ).length;

    const totalAbsent = statuses.filter(
        (status) => status === ATTENDANCE_STATUS.ABSENT,
    ).length;

    const totalLeave = statuses.filter(
        (status) => status === ATTENDANCE_STATUS.LEAVE,
    ).length;

    const totalHalfDay = statuses.filter(
        (status) => status === ATTENDANCE_STATUS.HALF_DAY,
    ).length;

    const totalHoliday = statuses.filter(
        (status) => status === ATTENDANCE_STATUS.HOLIDAY,
    ).length;

    const totalWorkingDays =
        totalPresent + totalAbsent + totalLeave + totalHalfDay;

    const effectivePresent = totalPresent + totalHalfDay * 0.5;

    const attendancePercentage =
        totalWorkingDays > 0
            ? Number(((effectivePresent / totalWorkingDays) * 100).toFixed(2))
            : 0;

    return {
        totalWorkingDays,
        totalPresent,
        totalAbsent,
        totalLeave,
        totalHalfDay,
        totalHoliday,
        attendancePercentage,
    };
};

export const getDatePartsInTimezone = (date = new Date(), timezone = "Asia/Kolkata") => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const parts = formatter.formatToParts(date);

    const year = Number(parts.find((item) => item.type === "year")?.value);
    const month = Number(parts.find((item) => item.type === "month")?.value);
    const day = Number(parts.find((item) => item.type === "day")?.value);

    return {
        year,
        month,
        day,
    };
};

export const isLastDayOfMonth = (date = new Date(), timezone = "Asia/Kolkata") => {
    const { year, month, day } = getDatePartsInTimezone(date, timezone);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

    return day === lastDay;
};

export const getNextMonthData = (date = new Date(), timezone = "Asia/Kolkata") => {
    const { year, month } = getDatePartsInTimezone(date, timezone);

    if (month === 12) {
        return {
            year: year + 1,
            month: 1,
        };
    }

    return {
        year,
        month: month + 1,
    };
};

export const createServiceError = (message, statusCode = 400) => {
    const error = new Error(message);

    error.statusCode = statusCode;

    return error;
};