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
    .nullable();

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

export const weeklyPlanSchema = z
    .object({
        session: requiredString("Session is required"),

        board: requiredString("Board is required"),

        classSlug: requiredString("Class is required"),

        classTitle: requiredString("Class is required"),

        sectionSlug: requiredString(
            "Section is required",
        ),

        section: requiredString("Section is required"),

        classSubjectSlug: requiredString(
            "Subject is required",
        ),

        subject: requiredString("Subject is required"),

        teacherSlug: optionalString,

        fromDate: requiredString(
            "From date is required",
        ).refine(
            (value) =>
                !Number.isNaN(
                    new Date(value).getTime(),
                ),
            "Invalid from date",
        ),

        toDate: requiredString(
            "To date is required",
        ).refine(
            (value) =>
                !Number.isNaN(
                    new Date(value).getTime(),
                ),
            "Invalid to date",
        ),

        topic: requiredString("Topic is required"),

        subTopic: optionalString,

        introductionAids: optionalString,

        introductionActivity: optionalString,

        learningObjective: optionalString,

        numberOfPeriods: z.coerce
            .number({
                required_error:
                    "Number of periods is required",
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
            .array(weeklyPlanLessonSchema)
            .min(
                1,
                "At least one lesson is required",
            ),
    })
    .superRefine((data, context) => {
        const fromDate = new Date(data.fromDate);
        const toDate = new Date(data.toDate);

        if (toDate < fromDate) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["toDate"],
                message:
                    "To date cannot be before from date",
            });
        }

        if (
            data.lessons.length >
            data.numberOfPeriods
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["lessons"],
                message:
                    "Lessons cannot be greater than number of periods",
            });
        }

        const lessonOrders = data.lessons.map(
            (lesson) => lesson.lessonOrder,
        );

        const uniqueLessonOrders = new Set(
            lessonOrders,
        );

        if (
            lessonOrders.length !==
            uniqueLessonOrders.size
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["lessons"],
                message:
                    "Lesson order must be unique",
            });
        }
    });

export const weeklyPlanDefaultValues = {
    session: "",
    board: "",

    classSlug: "",
    classTitle: "",

    sectionSlug: "",
    section: "",

    classSubjectSlug: "",
    subject: "",

    teacherSlug: "",

    fromDate: "",
    toDate: "",

    topic: "",
    subTopic: "",

    introductionAids: "",
    introductionActivity: "",
    learningObjective: "",

    numberOfPeriods: "",

    lessons: [
        {
            lessonOrder: 1,
            day: "",
            teachingMethodology: "",
            studentActivities: "",
            assessment: "",
        },
    ],
};

export const weekDayOptions = [
    {
        label: "Monday",
        value: "Monday",
    },
    {
        label: "Tuesday",
        value: "Tuesday",
    },
    {
        label: "Wednesday",
        value: "Wednesday",
    },
    {
        label: "Thursday",
        value: "Thursday",
    },
    {
        label: "Friday",
        value: "Friday",
    },
    {
        label: "Saturday",
        value: "Saturday",
    },
    {
        label: "Sunday",
        value: "Sunday",
    },
];