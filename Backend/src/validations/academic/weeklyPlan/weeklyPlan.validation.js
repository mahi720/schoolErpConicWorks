import { z } from "zod";

const optionalTextSchema = z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => value || null);

const optionalSlugSchema = z
    .string()
    .trim()
    .min(1)
    .max(50)
    .nullable()
    .optional()
    .transform((value) => value || null);

const weeklyPlanLessonSchema = z.object({
    lessonOrder: z.coerce
        .number()
        .int()
        .positive()
        .optional(),

    day: z
        .string()
        .trim()
        .min(1, "Lesson day is required"),

    teachingMethodology: z
        .string()
        .trim()
        .min(1, "Teaching methodology is required"),

    studentActivities: z
        .string()
        .trim()
        .min(1, "Student activities are required"),

    assessment: z
        .string()
        .trim()
        .min(1, "Assessment is required"),
});

export const createWeeklyPlanSchema = z
    .object({
        session: z
            .string()
            .trim()
            .min(1, "Session is required"),

        board: z
            .string()
            .trim()
            .min(1, "Board is required"),

        classTitle: z
            .string()
            .trim()
            .min(1, "Class is required"),

        // sectionTitle: z
        //     .string()
        //     .trim()
        //     .min(1, "Section is required"),

        // classSubjectSlug: z
        //     .string()
        //     .trim()
        //     .min(1, "Class subject is required")
        //     .max(50),

        teacherSlug: optionalSlugSchema,

        fromDate: z.coerce.date({
            required_error: "From date is required",
        }),

        toDate: z.coerce.date({
            required_error: "To date is required",
        }),

        topic: z
            .string()
            .trim()
            .min(1, "Topic is required"),

        subTopic: optionalTextSchema,

        introductionAids: optionalTextSchema,

        introductionActivity: optionalTextSchema,

        learningObjective: optionalTextSchema,

        numberOfPeriods: z.coerce
            .number()
            .int()
            .positive("Number of periods must be greater than zero"),

        lessons: z
            .array(weeklyPlanLessonSchema)
            .min(1, "At least one lesson is required"),
    })
    .superRefine((data, ctx) => {
        if (data.fromDate > data.toDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["toDate"],
                message: "To date must be greater than or equal to from date",
            });
        }

        if (data.numberOfPeriods !== data.lessons.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["numberOfPeriods"],
                message: "Number of periods must match total lessons",
            });
        }

        const lessonOrders = data.lessons
            .map((lesson) => lesson.lessonOrder)
            .filter(Boolean);

        if (
            lessonOrders.length !==
            new Set(lessonOrders).size
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["lessons"],
                message: "Lesson order must be unique",
            });
        }
    });

export const updateWeeklyPlanSchema =
    createWeeklyPlanSchema;