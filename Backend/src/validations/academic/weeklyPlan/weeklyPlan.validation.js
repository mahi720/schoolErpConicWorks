import { z } from "zod";

const requiredString = (message) =>
    z
        .string({
            required_error: message,
            invalid_type_error: message,
        })
        .trim()
        .min(1, message);

const optionalString = z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => {
        if (!value) return null;

        return value;
    });

const weeklyPlanLessonSchema = z.object({
    lessonOrder: z.coerce
        .number({
            required_error: "Lesson order is required",
            invalid_type_error: "Lesson order must be a number",
        })
        .int("Lesson order must be an integer")
        .positive("Lesson order must be greater than zero"),

    day: requiredString("Day is required"),

    teachingMethodology: requiredString(
        "Teaching methodology is required",
    ),

    studentActivities: requiredString(
        "Student activities are required",
    ),

    assessment: requiredString("Assessment is required"),
});

const weeklyPlanBaseSchema = z.object({
    session: requiredString("Session is required"),

    board: requiredString("Board is required"),

    classSlug: requiredString("Class slug is required"),

    classTitle: requiredString("Class is required"),

    sectionSlug: requiredString("Section slug is required"),

    section: requiredString("Section is required"),

    classSubjectSlug: requiredString(
        "Class subject slug is required",
    ),

    subject: requiredString("Subject is required"),

    teacherSlug: optionalString,

    fromDate: z.coerce.date({
        required_error: "From date is required",
        invalid_type_error: "Invalid from date",
    }),

    toDate: z.coerce.date({
        required_error: "To date is required",
        invalid_type_error: "Invalid to date",
    }),

    topic: requiredString("Topic is required"),

    subTopic: optionalString,

    introductionAids: optionalString,

    introductionActivity: optionalString,

    learningObjective: optionalString,

    numberOfPeriods: z.coerce
        .number({
            required_error: "Number of periods is required",
            invalid_type_error:
                "Number of periods must be a number",
        })
        .int("Number of periods must be an integer")
        .positive(
            "Number of periods must be greater than zero",
        ),

    lessons: z
        .array(weeklyPlanLessonSchema)
        .min(1, "At least one lesson is required"),
});

const validateWeeklyPlanRelations = (data, context) => {
    if (
        data.fromDate &&
        data.toDate &&
        data.toDate < data.fromDate
    ) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["toDate"],
            message: "To date cannot be before from date",
        });
    }

    if (
        data.lessons &&
        data.numberOfPeriods &&
        data.lessons.length > data.numberOfPeriods
    ) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["lessons"],
            message:
                "Lessons cannot be greater than number of periods",
        });
    }

    if (data.lessons) {
        const lessonOrders = data.lessons.map(
            (lesson) => lesson.lessonOrder,
        );

        const uniqueLessonOrders = new Set(lessonOrders);

        if (
            lessonOrders.length !==
            uniqueLessonOrders.size
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["lessons"],
                message: "Lesson order must be unique",
            });
        }
    }
};

export const createWeeklyPlanSchema =
    weeklyPlanBaseSchema.superRefine(
        validateWeeklyPlanRelations,
    );

export const updateWeeklyPlanSchema = z
    .object({
        session: requiredString(
            "Session is required",
        ).optional(),

        board: requiredString(
            "Board is required",
        ).optional(),

        classSlug: requiredString(
            "Class slug is required",
        ).optional(),

        classTitle: requiredString(
            "Class is required",
        ).optional(),

        sectionSlug: requiredString(
            "Section slug is required",
        ).optional(),

        section: requiredString(
            "Section is required",
        ).optional(),

        classSubjectSlug: requiredString(
            "Class subject slug is required",
        ).optional(),

        subject: requiredString(
            "Subject is required",
        ).optional(),

        teacherSlug: optionalString,

        fromDate: z.coerce.date().optional(),

        toDate: z.coerce.date().optional(),

        topic: requiredString(
            "Topic is required",
        ).optional(),

        subTopic: optionalString,

        introductionAids: optionalString,

        introductionActivity: optionalString,

        learningObjective: optionalString,

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
            )
            .optional(),

        lessons: z
            .array(weeklyPlanLessonSchema)
            .min(
                1,
                "At least one lesson is required",
            )
            .optional(),
    })
    .superRefine(validateWeeklyPlanRelations);