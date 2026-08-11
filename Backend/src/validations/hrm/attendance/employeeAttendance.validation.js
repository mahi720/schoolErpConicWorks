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
                .regex(
                    dateRegex,
                    "Invalid attendance date",
                ),

            inTime: z
                .string()
                .trim()
                .regex(
                    timeRegex,
                    "Invalid in time",
                ),

            outTime: z
                .string()
                .trim()
                .regex(
                    timeRegex,
                    "Invalid out time",
                ),

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
                    data.outTime <=
                    data.inTime
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
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
            .regex(
                dateRegex,
                "Invalid attendance date",
            ),

        remarks: z
            .string()
            .trim()
            .max(255)
            .optional()
            .nullable(),
    });

export const updateEmployeeAttendanceSchema =
    z
        .object({
            inTime: z
                .string()
                .trim()
                .regex(
                    timeRegex,
                    "Invalid in time",
                ),

            outTime: z
                .string()
                .trim()
                .regex(
                    timeRegex,
                    "Invalid out time",
                ),

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
                    data.outTime <=
                    data.inTime
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
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

export const lockEmployeeAttendanceSchema =
    z.object({
        attendanceDate: z
            .string()
            .trim()
            .regex(
                dateRegex,
                "Invalid attendance date",
            ),
    });

export const unlockEmployeeAttendanceSchema =
    lockEmployeeAttendanceSchema;

const bulkAttendanceRowSchema = z
    .object({
        employeeSlug: z
            .string()
            .trim()
            .min(
                1,
                "Employee is required",
            ),

        attendanceStatus: z.enum([
            "PRESENT",
            "ABSENT",
        ]),

        inTime: z
            .string()
            .trim()
            .regex(
                timeRegex,
                "Invalid in time",
            )
            .optional()
            .nullable(),

        outTime: z
            .string()
            .trim()
            .regex(
                timeRegex,
                "Invalid out time",
            )
            .optional()
            .nullable(),

        remarks: z
            .string()
            .trim()
            .max(255)
            .optional()
            .nullable(),
    })
    .superRefine((data, ctx) => {
        if (
            data.attendanceStatus ===
            "PRESENT"
        ) {
            if (!data.inTime) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode
                            .custom,

                    path: [
                        "inTime",
                    ],

                    message:
                        "In time is required for present employee",
                });
            }

            if (!data.outTime) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode
                            .custom,

                    path: [
                        "outTime",
                    ],

                    message:
                        "Out time is required for present employee",
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
                        z.ZodIssueCode
                            .custom,

                    path: [
                        "outTime",
                    ],

                    message:
                        "Out time must be greater than in time",
                });
            }
        }
    });

export const bulkSaveEmployeeAttendanceSchema =
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
                bulkAttendanceRowSchema,
            )
            .min(
                1,
                "At least one employee is required",
            ),
    });