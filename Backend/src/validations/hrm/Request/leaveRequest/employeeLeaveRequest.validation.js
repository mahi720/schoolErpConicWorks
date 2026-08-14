import { z } from "zod";

const dateRegex =
    /^\d{4}-\d{2}-\d{2}$/;

const optionalText = (
    maxLength,
) =>
    z
        .string()
        .trim()
        .max(
            maxLength,
        )
        .optional()
        .nullable();

export const createEmployeeLeaveRequestSchema =
    z
        .object({
            employee: z
                .string()
                .trim()
                .min(
                    1,
                    "Employee is required",
                ),

            subject: z
                .string()
                .trim()
                .min(
                    1,
                    "Subject is required",
                )
                .max(
                    150,
                    "Subject cannot exceed 150 characters",
                ),

            leaveCategory:
                z.enum([
                    "FULL_DAY",
                    "HALF_DAY",
                    "MULTI_DAY",
                ]),

            leaveType: z
                .string()
                .trim()
                .min(
                    1,
                    "Leave type is required",
                ),

            description:
                z
                    .string()
                    .trim()
                    .min(
                        1,
                        "Description is required",
                    )
                    .max(
                        500,
                        "Description cannot exceed 500 characters",
                    ),

            fromDate: z
                .string()
                .regex(
                    dateRegex,
                    "Invalid from date",
                ),

            toDate: z
                .string()
                .regex(
                    dateRegex,
                    "Invalid to date",
                )
                .nullable()
                .optional(),

            document:
                optionalText(
                    500,
                ),

            documentName:
                optionalText(
                    255,
                ),
        })
        .superRefine(
            (
                data,
                context,
            ) => {
                if (
                    data.leaveCategory ===
                    "MULTI_DAY" &&
                    !data.toDate
                ) {
                    context.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "toDate",
                        ],

                        message:
                            "To date is required for multi day leave",
                    });

                    return;
                }

                if (
                    data.toDate &&
                    new Date(
                        `${data.toDate}T00:00:00.000Z`,
                    ) <
                    new Date(
                        `${data.fromDate}T00:00:00.000Z`,
                    )
                ) {
                    context.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "toDate",
                        ],

                        message:
                            "To date cannot be before from date",
                    });
                }
            },
        );

export const bulkCreateEmployeeLeaveRequestSchema =
    z.object({
        employeeSlugs: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1),
            )
            .min(
                1,
                "At least one employee is required",
            ),

        subject: z
            .string()
            .trim()
            .min(
                1,
                "Subject is required",
            )
            .max(150),

        leaveCategory:
            z.enum([
                "FULL_DAY",
                "HALF_DAY",
                "MULTI_DAY",
            ]),

        leaveType: z
            .string()
            .trim()
            .min(
                1,
                "Leave type is required",
            ),

        description:
            z
                .string()
                .trim()
                .min(
                    1,
                    "Description is required",
                )
                .max(500),

        fromDate: z
            .string()
            .regex(
                dateRegex,
                "Invalid from date",
            ),

        toDate: z
            .string()
            .regex(
                dateRegex,
                "Invalid to date",
            )
            .nullable()
            .optional(),

        document:
            optionalText(
                500,
            ),

        documentName:
            optionalText(
                255,
            ),
    });

export const approveEmployeeLeaveRequestSchema =
    z
        .object({
            leaveType: z
                .string()
                .trim()
                .min(
                    1,
                    "Leave type is required",
                ),

            reply: z
                .string()
                .trim()
                .max(
                    500,
                    "Reply cannot exceed 500 characters",
                )
                .optional()
                .default(
                    "",
                ),

            payType:
                z.enum([
                    "PAID",
                    "UNPAID",
                ]),

            numberOfDaysPaid:
                z.coerce
                    .number()
                    .nonnegative()
                    .optional()
                    .default(
                        0,
                    ),
        })
        .superRefine(
            (
                data,
                context,
            ) => {
                if (
                    data.payType ===
                    "PAID" &&
                    Number(
                        data.numberOfDaysPaid,
                    ) <= 0
                ) {
                    context.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "numberOfDaysPaid",
                        ],

                        message:
                            "Number of paid days is required",
                    });
                }
            },
        );

export const bulkApproveEmployeeLeaveRequestSchema =
    z.object({
        leaveSlugs: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1),
            )
            .min(
                1,
                "At least one leave request is required",
            ),

        reply: z
            .string()
            .trim()
            .min(
                1,
                "Reply is required",
            )
            .max(500),

        payType:
            z.enum([
                "PAID",
                "UNPAID",
            ]),
    });

export const rejectEmployeeLeaveRequestSchema =
    z.object({
        reply: z
            .string()
            .trim()
            .min(
                1,
                "Reply is required",
            )
            .max(
                500,
                "Reply cannot exceed 500 characters",
            ),
    });