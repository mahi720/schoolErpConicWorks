import { z } from "zod";

export const holidayTypeEnum = z.enum([
    "DEPARTMENT",
    "EMPLOYEE",
]);

export const holidaySchema = z
    .object({
        startDate: z
            .string()
            .trim()
            .min(
                1,
                "Start date is required",
            ),

        endDate: z
            .string()
            .trim()
            .min(
                1,
                "End date is required",
            ),

        title: z
            .string()
            .trim()
            .min(
                1,
                "Holiday title is required",
            )
            .max(
                150,
                "Holiday title is too long",
            ),

        type: holidayTypeEnum,

        departmentSlugs: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1),
            )
            .default([]),

        employeeSlugs: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1),
            )
            .default([]),
    })
    .superRefine(
        (data, ctx) => {
            const startDate =
                new Date(
                    `${data.startDate}T00:00:00`,
                );

            const endDate =
                new Date(
                    `${data.endDate}T00:00:00`,
                );

            if (
                Number.isNaN(
                    startDate.getTime(),
                )
            ) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode
                            .custom,

                    path: [
                        "startDate",
                    ],

                    message:
                        "Invalid start date",
                });
            }

            if (
                Number.isNaN(
                    endDate.getTime(),
                )
            ) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode
                            .custom,

                    path: [
                        "endDate",
                    ],

                    message:
                        "Invalid end date",
                });
            }

            if (
                !Number.isNaN(
                    startDate.getTime(),
                ) &&
                !Number.isNaN(
                    endDate.getTime(),
                ) &&
                endDate <
                startDate
            ) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode
                            .custom,

                    path: [
                        "endDate",
                    ],

                    message:
                        "End date cannot be before start date",
                });
            }

            if (
                data.type ===
                "DEPARTMENT"
            ) {
                if (
                    data
                        .departmentSlugs
                        .length === 0
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "departmentSlugs",
                        ],

                        message:
                            "Select at least one department",
                    });
                }

                if (
                    data
                        .employeeSlugs
                        .length > 0
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "employeeSlugs",
                        ],

                        message:
                            "Employees cannot be selected for department holiday",
                    });
                }
            }

            if (
                data.type ===
                "EMPLOYEE"
            ) {
                if (
                    data
                        .employeeSlugs
                        .length === 0
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "employeeSlugs",
                        ],

                        message:
                            "Select at least one employee",
                    });
                }

                if (
                    data
                        .departmentSlugs
                        .length > 0
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "departmentSlugs",
                        ],

                        message:
                            "Departments cannot be selected for employee holiday",
                    });
                }
            }
        },
    );

export const holidayUpdateSchema =
    z.object({
        date: z
            .string()
            .trim()
            .min(
                1,
                "Holiday date is required",
            ),

        title: z
            .string()
            .trim()
            .min(
                1,
                "Holiday title is required",
            )
            .max(
                150,
                "Holiday title is too long",
            ),
    });

export const holidayInitialValues =
{
    startDate: "",
    endDate: "",
    title: "",
    type: "",
    departmentSlugs: [],
    employeeSlugs: [],
};

export const holidayEditInitialValues =
{
    date: "",
    title: "",
};

export const buildHolidayPayload =
    (form) => {
        return {
            startDate:
                form.startDate ||
                "",

            endDate:
                form.endDate ||
                "",

            title:
                form.title?.trim() ||
                "",

            type:
                form.type ||
                "",

            departmentSlugs:
                form.type ===
                    "DEPARTMENT"
                    ? [
                        ...new Set(
                            form.departmentSlugs ||
                            [],
                        ),
                    ]
                    : [],

            employeeSlugs:
                form.type ===
                    "EMPLOYEE"
                    ? [
                        ...new Set(
                            form.employeeSlugs ||
                            [],
                        ),
                    ]
                    : [],
        };
    };

export const buildHolidayUpdatePayload =
    (form) => {
        return {
            date:
                form.date ||
                "",

            title:
                form.title?.trim() ||
                "",
        };
    };