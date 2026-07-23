import { z } from "zod";

const calendarCategoryEnum = z.enum([
    "HOLIDAY",

    "REOPENING",
    "CLOSING",

    "THEORY_EXAM",
    "PRACTICAL_EXAM",
    "UNIT_TEST",
    "PERIODIC_TEST",
    "MID_TERM",
    "FINAL_EXAM",

    "PTM",

    "EVENT",
    "SPORTS",
    "CULTURAL",
    "COMPETITION",

    "MEETING",
    "TRAINING",

    "OTHER",
]);

export const createAcademicCalendarSchema = z
    .object({
        session: z
            .string({
                required_error: "Session is required",
            })
            .trim()
            .min(1, "Session is required"),

        title: z
            .string({
                required_error: "Title is required",
            })
            .trim()
            .min(2, "Title must be at least 2 characters")
            .max(255, "Title is too long"),

        description: z
            .string()
            .trim()
            .optional()
            .nullable(),

        category: calendarCategoryEnum,

        startDate: z.coerce.date({
            required_error: "Start date is required",
            invalid_type_error: "Invalid start date",
        }),

        endDate: z.coerce.date({
            required_error: "End date is required",
            invalid_type_error: "Invalid end date",
        }),

        isHoliday: z
            .boolean()
            .optional()
            .default(false),

        color: z
            .string()
            .trim()
            .optional()
            .nullable(),

        status: z
            .enum(["active", "inactive"])
            .optional()
            .default("active"),
    })
    .refine(
        (data) =>
            new Date(data.endDate) >=
            new Date(data.startDate),
        {
            message:
                "End date must be greater than or equal to start date",
            path: ["endDate"],
        },
    );

export const updateAcademicCalendarSchema = z
    .object({
        session: z
            .string()
            .trim()
            .min(1, "Session is required")
            .optional(),

        title: z
            .string()
            .trim()
            .min(2, "Title must be at least 2 characters")
            .max(255, "Title is too long")
            .optional(),

        description: z
            .string()
            .trim()
            .optional()
            .nullable(),

        category: calendarCategoryEnum.optional(),

        startDate: z.coerce.date().optional(),

        endDate: z.coerce.date().optional(),

        isHoliday: z.boolean().optional(),

        color: z
            .string()
            .trim()
            .optional()
            .nullable(),

        status: z
            .enum(["active", "inactive"])
            .optional(),
    })
    .refine(
        (data) => {
            if (
                data.startDate &&
                data.endDate
            ) {
                return (
                    new Date(data.endDate) >=
                    new Date(data.startDate)
                );
            }

            return true;
        },
        {
            message:
                "End date must be greater than or equal to start date",
            path: ["endDate"],
        },
    );