import { z } from "zod";

const timeRegex =
    /^([01]\d|2[0-3]):([0-5]\d)$/;

const dateRegex =
    /^\d{4}-\d{2}-\d{2}$/;

export const markEmployeePresentSchema =
    z
        .object({
            attendanceDate: z
                .string()
                .trim()
                .min(
                    1,
                    "Attendance date is required",
                )
                .regex(
                    dateRegex,
                    "Invalid attendance date",
                ),

            inTime: z
                .string()
                .trim()
                .min(
                    1,
                    "In time is required",
                )
                .regex(
                    timeRegex,
                    "Invalid in time",
                ),

            outTime: z
                .string()
                .trim()
                .min(
                    1,
                    "Out time is required",
                )
                .regex(
                    timeRegex,
                    "Invalid out time",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    255,
                    "Remarks cannot exceed 255 characters",
                )
                .optional()
                .nullable(),
        })
        .superRefine(
            (
                data,
                ctx,
            ) => {
                if (
                    data.outTime <=
                    data.inTime
                ) {
                    ctx.addIssue({
                        code:
                            z
                                .ZodIssueCode
                                .custom,

                        path: [
                            "outTime",
                        ],

                        message:
                            "Out time must be greater than in time",
                    });
                }
            },
        );

export const markEmployeeAbsentSchema =
    z.object({
        attendanceDate: z
            .string()
            .trim()
            .min(
                1,
                "Attendance date is required",
            )
            .regex(
                dateRegex,
                "Invalid attendance date",
            ),

        remarks: z
            .string()
            .trim()
            .max(
                255,
                "Remarks cannot exceed 255 characters",
            )
            .optional()
            .nullable(),
    });

export const updateEmployeeAttendanceSchema =
    z
        .object({
            inTime: z
                .string()
                .trim()
                .min(
                    1,
                    "In time is required",
                )
                .regex(
                    timeRegex,
                    "Invalid in time",
                ),

            outTime: z
                .string()
                .trim()
                .min(
                    1,
                    "Out time is required",
                )
                .regex(
                    timeRegex,
                    "Invalid out time",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    255,
                    "Remarks cannot exceed 255 characters",
                )
                .optional()
                .nullable(),
        })
        .superRefine(
            (
                data,
                ctx,
            ) => {
                if (
                    data.outTime <=
                    data.inTime
                ) {
                    ctx.addIssue({
                        code:
                            z
                                .ZodIssueCode
                                .custom,

                        path: [
                            "outTime",
                        ],

                        message:
                            "Out time must be greater than in time",
                    });
                }
            },
        );

export const attendanceLockSchema =
    z.object({
        attendanceDate: z
            .string()
            .trim()
            .min(
                1,
                "Attendance date is required",
            )
            .regex(
                dateRegex,
                "Invalid attendance date",
            ),
    });

export const attendanceUnlockSchema =
    attendanceLockSchema;

export const attendanceFilterSchema =
    z.object({
        date: z
            .string()
            .trim()
            .min(
                1,
                "Date is required",
            )
            .regex(
                dateRegex,
                "Invalid date",
            ),
    });

export const attendanceLogFilterSchema =
    z.object({
        employeeSlug: z
            .string()
            .trim()
            .optional()
            .nullable(),

        date: z
            .string()
            .trim()
            .regex(
                dateRegex,
                "Invalid date",
            )
            .optional()
            .nullable(),
    });

export const attendanceYearlyReportSchema =
    z.object({
        sessionSlug: z
            .string()
            .trim()
            .min(
                1,
                "Academic year is required",
            ),
    });

export const employeeAttendanceInitialValues =
{
    inTime: "",
    outTime: "",
    remarks: "",
};

export const employeeAttendanceFilterInitialValues =
{
    date: "",
};

export const attendanceLogFilterInitialValues =
{
    employeeSlug: "",
    date: "",
};

export const buildPresentAttendancePayload =
    ({
        attendanceDate,
        form,
    }) => {
        return {
            attendanceDate:
                attendanceDate ||
                "",

            inTime:
                form.inTime ||
                "",

            outTime:
                form.outTime ||
                "",

            remarks:
                form.remarks
                    ?.trim() ||
                null,
        };
    };

export const buildAbsentAttendancePayload =
    ({
        attendanceDate,
        remarks = null,
    }) => {
        return {
            attendanceDate:
                attendanceDate ||
                "",

            remarks:
                remarks
                    ?.trim() ||
                null,
        };
    };

export const buildUpdateAttendancePayload =
    (
        form,
    ) => {
        return {
            inTime:
                form.inTime ||
                "",

            outTime:
                form.outTime ||
                "",

            remarks:
                form.remarks
                    ?.trim() ||
                null,
        };
    };

export const buildAttendanceLockPayload =
    (
        attendanceDate,
    ) => {
        return {
            attendanceDate:
                attendanceDate ||
                "",
        };
    };

export const bulkAttendanceEmployeeSchema =
    z
        .object({
            employeeSlug: z
                .string()
                .trim()
                .min(
                    1,
                    "Employee is required",
                ),

            attendanceStatus:
                z.enum([
                    "PRESENT",
                    "ABSENT",
                ]),

            inTime: z
                .string()
                .trim()
                .optional()
                .nullable(),

            outTime: z
                .string()
                .trim()
                .optional()
                .nullable(),

            remarks: z
                .string()
                .trim()
                .max(255)
                .optional()
                .nullable(),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.attendanceStatus !==
                    "PRESENT"
                ) {
                    return;
                }

                if (
                    !data.inTime
                ) {
                    ctx.addIssue({
                        code:
                            z
                                .ZodIssueCode
                                .custom,

                        path: [
                            "inTime",
                        ],

                        message:
                            "In time is required",
                    });
                }

                if (
                    !data.outTime
                ) {
                    ctx.addIssue({
                        code:
                            z
                                .ZodIssueCode
                                .custom,

                        path: [
                            "outTime",
                        ],

                        message:
                            "Out time is required",
                    });
                }

                if (
                    data.inTime &&
                    data.outTime &&
                    data.outTime <=
                    data.inTime
                ) {
                    ctx.addIssue({
                        code:
                            z
                                .ZodIssueCode
                                .custom,

                        path: [
                            "outTime",
                        ],

                        message:
                            "Out time must be greater than in time",
                    });
                }
            },
        );

export const bulkSaveAttendanceSchema =
    z.object({
        attendanceDate: z
            .string()
            .trim()
            .regex(
                dateRegex,
                "Invalid attendance date",
            ),

        employees: z
            .array(
                bulkAttendanceEmployeeSchema,
            )
            .min(
                1,
                "No attendance found to save",
            ),
    });

