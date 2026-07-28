import { z } from "zod";

const optionalTextSchema = z
    .string()
    .trim()
    .max(
        5000,
        "Maximum 5000 characters are allowed",
    )
    .optional()
    .nullable()
    .transform((value) => {
        if (!value) {
            return "";
        }

        return value;
    });

export const weeklyPlanLessonSchema = z.object({
    slug: z
        .string()
        .trim()
        .max(50)
        .optional()
        .nullable(),

    lessonOrder: z.coerce
        .number({
            invalid_type_error:
                "Lesson order must be a number",
        })
        .int(
            "Lesson order must be an integer",
        )
        .positive(
            "Lesson order must be greater than zero",
        ),

    day: z
        .string()
        .trim()
        .min(1, "Day is required")
        .max(
            100,
            "Day cannot exceed 100 characters",
        ),

    teachingMethodology: z
        .string()
        .trim()
        .min(
            1,
            "Teaching methodology is required",
        )
        .max(
            5000,
            "Teaching methodology cannot exceed 5000 characters",
        ),

    studentActivities: z
        .string()
        .trim()
        .min(
            1,
            "Student activities are required",
        )
        .max(
            5000,
            "Student activities cannot exceed 5000 characters",
        ),

    assessment: z
        .string()
        .trim()
        .min(
            1,
            "Assessment is required",
        )
        .max(
            5000,
            "Assessment cannot exceed 5000 characters",
        ),
});

export const weeklyPlanSchema = z
    .object({
        session: z
            .string()
            .trim()
            .min(
                1,
                "Session is required",
            ),

        board: z
            .string()
            .trim()
            .min(
                1,
                "Board is required",
            ),

        classTitle: z
            .string()
            .trim()
            .min(
                1,
                "Class is required",
            ),

        // sectionTitle: z
        //     .string()
        //     .trim()
        //     .min(
        //         1,
        //         "Section is required",
        //     ),

        fromDate: z
            .string()
            .trim()
            .min(
                1,
                "From date is required",
            ),

        toDate: z
            .string()
            .trim()
            .min(
                1,
                "To date is required",
            ),

        topic: z
            .string()
            .trim()
            .min(
                1,
                "Topic is required",
            )
            .max(
                5000,
                "Topic cannot exceed 5000 characters",
            ),

        subTopic: optionalTextSchema,

        introductionAids:
            optionalTextSchema,

        introductionActivity:
            optionalTextSchema,

        learningObjective:
            optionalTextSchema,

        numberOfPeriods: z.coerce
            .number({
                invalid_type_error:
                    "Number of periods must be a number",
            })
            .int(
                "Number of periods must be an integer",
            )
            .positive(
                "Number of periods must be greater than zero",
            ),

        lessons: z
            .array(
                weeklyPlanLessonSchema,
            )
            .min(
                1,
                "At least one lesson is required",
            ),
    })
    .superRefine((data, ctx) => {
        const fromDate = new Date(
            `${data.fromDate}T00:00:00`,
        );

        const toDate = new Date(
            `${data.toDate}T00:00:00`,
        );

        if (
            Number.isNaN(
                fromDate.getTime(),
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["fromDate"],
                message:
                    "Invalid from date",
            });
        }

        if (
            Number.isNaN(
                toDate.getTime(),
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["toDate"],
                message:
                    "Invalid to date",
            });
        }

        if (
            !Number.isNaN(
                fromDate.getTime(),
            ) &&
            !Number.isNaN(
                toDate.getTime(),
            ) &&
            fromDate > toDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["toDate"],
                message:
                    "To date must be greater than or equal to from date",
            });
        }

        if (
            Number(data.numberOfPeriods) !==
            data.lessons.length
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [
                    "numberOfPeriods",
                ],
                message:
                    "Number of periods must match total lessons",
            });
        }

        const lessonOrders =
            data.lessons.map(
                (lesson) =>
                    Number(
                        lesson.lessonOrder,
                    ),
            );

        const uniqueLessonOrders =
            new Set(
                lessonOrders,
            );

        if (
            uniqueLessonOrders.size !==
            lessonOrders.length
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["lessons"],
                message:
                    "Lesson order must be unique",
            });
        }
    });

export const weeklyPlanFilterSchema = z
    .object({
        fromDate: z
            .string()
            .optional(),

        toDate: z
            .string()
            .optional(),

        session: z
            .string()
            .optional(),

        board: z
            .string()
            .optional(),

        classTitle: z
            .string()
            .optional(),

        sectionTitle: z
            .string()
            .optional(),

        status: z
            .enum([
                "active",
                "inactive",
            ])
            .optional(),

        search: z
            .string()
            .trim()
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.fromDate &&
            data.toDate
        ) {
            const fromDate =
                new Date(
                    `${data.fromDate}T00:00:00`,
                );

            const toDate =
                new Date(
                    `${data.toDate}T00:00:00`,
                );

            if (fromDate > toDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode
                        .custom,
                    path: ["toDate"],
                    message:
                        "To date must be greater than or equal to from date",
                });
            }
        }
    });