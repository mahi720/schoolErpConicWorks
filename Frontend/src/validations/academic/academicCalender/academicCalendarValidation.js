import { z } from "zod";

export const calendarCategoryOptions = [
    {
        label: "Holiday",
        value: "HOLIDAY",
    },
    {
        label: "Reopening",
        value: "REOPENING",
    },
    {
        label: "Closing",
        value: "CLOSING",
    },
    {
        label: "Theory Exam",
        value: "THEORY_EXAM",
    },
    {
        label: "Practical Exam",
        value: "PRACTICAL_EXAM",
    },
    {
        label: "Unit Test",
        value: "UNIT_TEST",
    },
    {
        label: "Periodic Test",
        value: "PERIODIC_TEST",
    },
    {
        label: "Mid Term",
        value: "MID_TERM",
    },
    {
        label: "Final Exam",
        value: "FINAL_EXAM",
    },
    {
        label: "PTM",
        value: "PTM",
    },
    {
        label: "Event",
        value: "EVENT",
    },
    {
        label: "Sports",
        value: "SPORTS",
    },
    {
        label: "Cultural",
        value: "CULTURAL",
    },
    {
        label: "Competition",
        value: "COMPETITION",
    },
    {
        label: "Meeting",
        value: "MEETING",
    },
    {
        label: "Training",
        value: "TRAINING",
    },
    {
        label: "Other",
        value: "OTHER",
    },
];

export const academicCalendarSchema = z
    .object({
        session: z
            .string()
            .trim()
            .min(1, "Academic year is required"),

        title: z
            .string()
            .trim()
            .min(2, "Title must be at least 2 characters")
            .max(255, "Title is too long"),

        description: z
            .string()
            .trim()
            .max(2000, "Description is too long")
            .optional(),

        category: z
            .string()
            .trim()
            .min(1, "Event category is required"),

        startDate: z
            .string()
            .trim()
            .min(1, "Start date is required"),

        endDate: z
            .string()
            .trim()
            .min(1, "Till date is required"),

        isHoliday: z.boolean().default(false),

        color: z
            .string()
            .trim()
            .optional(),
    })
    .refine(
        (data) => {
            if (!data.startDate || !data.endDate) {
                return true;
            }

            return new Date(data.endDate) >= new Date(data.startDate);
        },
        {
            message: "Till date cannot be before start date",
            path: ["endDate"],
        },
    );