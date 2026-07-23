import cron from "node-cron";

import { ensureMonthlyAttendanceRowsForCronService } from "../services/academic/studentAttendance/studentAttendanceService.js";

import { getDatePartsInTimezone, getNextMonthData, isLastDayOfMonth } from "../utils/attendance/attendanceUtils.js";

const CRON_TIMEZONE = "Asia/Kolkata";

const startPrimaryAttendanceCron = () => {
    cron.schedule(
        "55 23 * * *",
        async () => {
            try {
                const currentDate = new Date();

                if (!isLastDayOfMonth(currentDate, CRON_TIMEZONE)) {
                    return;
                }

                const { year, month } = getNextMonthData(currentDate, CRON_TIMEZONE);

                const result = await ensureMonthlyAttendanceRowsForCronService({
                    year,
                    month,
                });

                console.log("Next month attendance cron completed:", result);
            } catch (error) {
                console.error("Next month attendance cron failed:", error);
            }
        },
        {
            timezone: CRON_TIMEZONE,
        },
    );
};

const startFallbackAttendanceCron = () => {
    cron.schedule(
        "10 0 1 * *",
        async () => {
            try {
                const { year, month } = getDatePartsInTimezone(new Date(), CRON_TIMEZONE);

                const result = await ensureMonthlyAttendanceRowsForCronService({
                    year,
                    month,
                });

                console.log("Attendance fallback cron completed:", result);
            } catch (error) {
                console.error("Attendance fallback cron failed:", error);
            }
        },
        {
            timezone: CRON_TIMEZONE,
        },
    );
};

export const startStudentAttendanceCronJobs = () => {
    startPrimaryAttendanceCron();
    startFallbackAttendanceCron();

    console.log("Student attendance cron jobs started");
};