import { z } from "zod";

const dateRegex =
    /^\d{4}-\d{2}-\d{2}$/;

const nullableSlug = z
    .string()
    .trim()
    .min(
        1,
        "Value is required",
    )
    .nullable()
    .optional();

export const leaveCategoryOptions = [
    {
        label: "Full Day",
        value: "FULL_DAY",
    },
    {
        label: "Half Day",
        value: "HALF_DAY",
    },
    {
        label: "Multi Day",
        value: "MULTI_DAY",
    },
];

export const leavePayTypeOptions = [
    {
        label: "Paid",
        value: "PAID",
    },
    {
        label: "Unpaid",
        value: "UNPAID",
    },
];

export const leaveRequestInitialValues =
{
    employee: "",

    subject: "",

    leaveCategory:
        "FULL_DAY",

    leaveType: "",

    description: "",

    fromDate: "",

    toDate: "",

    document: "",

    documentName: "",
};

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

            description: z
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
                    "From date is required",
                ),

            toDate: z
                .string()
                .nullable()
                .optional(),

            document: z
                .string()
                .trim()
                .optional(),

            documentName: z
                .string()
                .trim()
                .optional(),
        })
        .superRefine(
            (
                data,
                context,
            ) => {
                if (
                    data.leaveCategory ===
                    "MULTI_DAY"
                ) {
                    if (
                        !data.toDate ||
                        !dateRegex.test(
                            data.toDate,
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
                                "To date is required for multi day leave",
                        });

                        return;
                    }

                    const fromDate =
                        new Date(
                            `${data.fromDate}T00:00:00.000Z`,
                        );

                    const toDate =
                        new Date(
                            `${data.toDate}T00:00:00.000Z`,
                        );

                    if (
                        toDate <
                        fromDate
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
                }
            },
        );

export const bulkCreateEmployeeLeaveRequestSchema =
    z
        .object({
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

            description: z
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
                    "From date is required",
                ),

            toDate: z
                .string()
                .optional(),

            document: z
                .string()
                .trim()
                .optional(),

            documentName: z
                .string()
                .trim()
                .optional(),
        })
        .superRefine(
            (
                data,
                context,
            ) => {
                if (
                    data.leaveCategory !==
                    "MULTI_DAY"
                ) {
                    return;
                }

                if (
                    !data.toDate ||
                    !dateRegex.test(
                        data.toDate,
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
                            "To date is required for multi day leave",
                    });

                    return;
                }

                if (
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
                .optional(),

            payType:
                z.enum([
                    "PAID",
                    "UNPAID",
                ]),

            numberOfDaysPaid:
                z.coerce
                    .number()
                    .nonnegative(
                        "Paid days cannot be negative",
                    )
                    .optional(),
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
                        data.numberOfDaysPaid ||
                        0,
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
            .max(
                500,
                "Reply cannot exceed 500 characters",
            ),

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


export const buildCreateLeaveRequestPayload = (form) => ({
    employee: form.employee || "",
    subject: form.subject?.trim() || "",
    leaveCategory: form.leaveCategory || "",
    leaveType: form.leaveType || "",
    description: form.description?.trim() || "",
    fromDate: form.fromDate || "",
    toDate:
        form.leaveCategory === "MULTI_DAY"
            ? form.toDate || ""
            : null,
    document: form.document || undefined,
    documentName: form.documentName || undefined,
});

export const buildApproveLeaveRequestPayload = (form) => ({
    leaveType: form.leaveType || "",
    reply: form.reply?.trim() || "",
    payType: form.payType || "",
    numberOfDaysPaid:
        form.payType === "PAID"
            ? Number(form.numberOfDaysPaid || 0)
            : 0,
});

export const buildBulkApproveLeaveRequestPayload = ({
    selectedSlugs,
    form,
}) => ({
    leaveSlugs: selectedSlugs || [],
    reply: form.reply?.trim() || "",
    payType: form.payType || "",
});

export const buildRejectLeaveRequestPayload = (reply) => ({
    reply: reply?.trim() || "",
});

export const buildBulkCreateLeaveRequestPayload = ({
    form,
    employeeSlugs,
}) => ({
    employeeSlugs: employeeSlugs || [],
    subject: form.subject?.trim() || "",
    leaveCategory: form.leaveCategory || "",
    leaveType: form.leaveType || "",
    description: form.description?.trim() || "",
    fromDate: form.fromDate || "",
    toDate:
        form.leaveCategory === "MULTI_DAY"
            ? form.toDate || ""
            : null,
    document: form.document || undefined,
    documentName: form.documentName || undefined,
});