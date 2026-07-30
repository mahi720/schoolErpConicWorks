import { z } from "zod";

const requiredText = (message) =>
    z
        .string()
        .trim()
        .min(1, message);

const optionalText = z
    .string()
    .trim()
    .optional()
    .nullable();

export const createTermExamSchema = z
    .object({
        session: requiredText(
            "Academic session is required",
        ),

        board: requiredText(
            "Board is required",
        ),

        examType: requiredText(
            "Exam type is required",
        ),

        examTitle: requiredText(
            "Exam title is required",
        ).max(
            150,
            "Exam title cannot exceed 150 characters",
        ),

        startDate: requiredText(
            "Start date is required",
        ),

        endDate: requiredText(
            "End date is required",
        ),
    })
    .superRefine((data, context) => {
        if (
            data.startDate &&
            data.endDate &&
            new Date(data.endDate) <=
            new Date(data.startDate)
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message:
                    "End date must be after start date",
            });
        }
    });

export const updateTermExamSchema = z
    .object({
        session: requiredText(
            "Academic session is required",
        ),

        board: requiredText(
            "Board is required",
        ),

        examType: requiredText(
            "Exam type is required",
        ),

        examTitle: requiredText(
            "Exam title is required",
        ).max(
            150,
            "Exam title cannot exceed 150 characters",
        ),

        startDate: requiredText(
            "Start date is required",
        ),

        endDate: requiredText(
            "End date is required",
        ),
    })
    .superRefine((data, context) => {
        if (
            data.startDate &&
            data.endDate &&
            new Date(data.endDate) <=
            new Date(data.startDate)
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message:
                    "End date must be after start date",
            });
        }
    });

export const termExamFilterSchema = z.object({
    session: optionalText,
    board: optionalText,
    examType: optionalText,
    status: z
        .enum([
            "active",
            "inactive",
        ])
        .optional()
        .nullable(),
});

export const termExamTimeTableFilterSchema =
    z.object({
        termExamSlug: requiredText(
            "Term exam is required",
        ),

        classSlug: requiredText(
            "Class is required",
        ),
    });

export const termExamTimeTableSubjectSchema =
    z
        .object({
            slug: optionalText,

            classSubjectSlug:
                requiredText(
                    "Class subject is required",
                ),

            subjectSlug:
                optionalText,

            subjectTitle:
                optionalText,

            subjectType:
                optionalText,

            subjectOrder: z.coerce
                .number()
                .optional()
                .nullable(),

            studyType:
                optionalText,

            studyMode:
                optionalText,

            streamSlug:
                optionalText,

            streamTitle:
                optionalText,

            maxMarks: z.coerce
                .number({
                    invalid_type_error:
                        "Maximum marks must be a number",
                })
                .positive(
                    "Maximum marks must be greater than zero",
                ),

            minMarks: z.coerce
                .number({
                    invalid_type_error:
                        "Minimum marks must be a number",
                })
                .min(
                    0,
                    "Minimum marks cannot be negative",
                ),

            examDate:
                requiredText(
                    "Exam date is required",
                ),

            examTime:
                requiredText(
                    "Exam time is required",
                ),

            duration: z.coerce
                .number({
                    invalid_type_error:
                        "Duration must be a number",
                })
                .int(
                    "Duration must be a whole number",
                )
                .positive(
                    "Duration must be greater than zero",
                ),

            questionPaper:
                optionalText,
        })
        .superRefine(
            (data, context) => {
                if (
                    Number(
                        data.minMarks,
                    ) >
                    Number(
                        data.maxMarks,
                    )
                ) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [
                            "minMarks",
                        ],
                        message:
                            "Minimum marks cannot exceed maximum marks",
                    });
                }
            },
        );

export const saveTermExamTimeTableSchema =
    z.object({
        termExamSlug:
            requiredText(
                "Term exam is required",
            ),

        classSlug:
            requiredText(
                "Class is required",
            ),

        publishResult:
            z.boolean(),

        subjects: z
            .array(
                z.object({
                    classSubjectSlug:
                        z.string().min(1),

                    streamSlug:
                        z.string().nullable().optional(),

                    maxMarks:
                        z.coerce
                            .number()
                            .positive(),

                    minMarks:
                        z.coerce
                            .number()
                            .min(0),

                    examDate:
                        z.string().min(1),

                    examTime:
                        z.string().min(1),

                    duration:
                        z.coerce
                            .number()
                            .positive(),

                    questionPaper:
                        z.any().nullable().optional(),
                }),
            )
            .min(
                1,
                "At least one subject is required",
            ),
    });