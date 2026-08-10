import { z } from "zod";

const timeRegex =
    /^([01]\d|2[0-3]):([0-5]\d)$/;

export const eventCalendarSchema =
    z
        .object({
            title: z
                .string()
                .trim()
                .min(
                    1,
                    "Title is required",
                )
                .max(
                    150,
                    "Title is too long",
                ),

            description: z
                .string()
                .trim()
                .min(
                    1,
                    "Description is required",
                ),

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

            startTime: z
                .string()
                .trim()
                .regex(
                    timeRegex,
                    "Start time must be in HH:mm format",
                ),

            endTime: z
                .string()
                .trim()
                .regex(
                    timeRegex,
                    "End time must be in HH:mm format",
                ),
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
                    data.startDate ===
                    data.endDate &&
                    data.endTime <=
                    data.startTime
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "endTime",
                        ],

                        message:
                            "End time must be greater than start time",
                    });
                }
            },
        );

export const eventCalendarUpdateSchema =
    z
        .object({
            title: z
                .string()
                .trim()
                .min(
                    1,
                    "Title is required",
                )
                .max(
                    150,
                    "Title is too long",
                ),

            description: z
                .string()
                .trim()
                .min(
                    1,
                    "Description is required",
                ),

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

            startTime: z
                .string()
                .trim()
                .regex(
                    timeRegex,
                    "Start time must be in HH:mm format",
                ),

            endTime: z
                .string()
                .trim()
                .regex(
                    timeRegex,
                    "End time must be in HH:mm format",
                ),
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
                    data.startDate ===
                    data.endDate &&
                    data.endTime <=
                    data.startTime
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "endTime",
                        ],

                        message:
                            "End time must be greater than start time",
                    });
                }
            },
        );

export const eventCalendarInitialValues =
{
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
};

export const buildEventCalendarPayload =
    (form) => {
        return {
            title:
                form.title?.trim() ||
                "",

            description:
                form.description?.trim() ||
                "",

            startDate:
                form.startDate ||
                "",

            endDate:
                form.endDate ||
                "",

            startTime:
                form.startTime ||
                "",

            endTime:
                form.endTime ||
                "",
        };
    };