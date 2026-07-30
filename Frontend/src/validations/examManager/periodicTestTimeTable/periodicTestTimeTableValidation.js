import { z } from "zod";

const requiredText = (
    fieldName,
) =>
    z
        .string({
            required_error:
                `${fieldName} is required`,
        })
        .trim()
        .min(
            1,
            `${fieldName} is required`,
        );

const dateSchema = (
    fieldName,
) =>
    requiredText(
        fieldName,
    ).refine(
        (value) =>
            !Number.isNaN(
                new Date(
                    value,
                ).getTime(),
            ),
        {
            message:
                `${fieldName} is invalid`,
        },
    );

export const createPeriodicTestSchema =
    z
        .object({
            session:
                requiredText(
                    "Academic session",
                ),

            board:
                requiredText(
                    "Board",
                ),

            testTitle: z
                .string({
                    required_error:
                        "Test title is required",
                })
                .trim()
                .min(
                    2,
                    "Test title must contain at least 2 characters",
                )
                .max(
                    150,
                    "Test title cannot exceed 150 characters",
                ),

            startDate:
                dateSchema(
                    "Start date",
                ),

            endDate:
                dateSchema(
                    "End date",
                ),

            testStatus: z
                .string()
                .trim()
                .min(
                    1,
                    "Test status is required",
                )
                .default(
                    "scheduled",
                ),
        })
        .refine(
            (data) =>
                new Date(
                    data.startDate,
                ) <=
                new Date(
                    data.endDate,
                ),
            {
                message:
                    "Start date cannot be after end date",
                path: [
                    "endDate",
                ],
            },
        );

export const updatePeriodicTestSchema =
    z
        .object({
            session:
                requiredText(
                    "Academic session",
                ).optional(),

            board:
                requiredText(
                    "Board",
                ).optional(),

            testTitle: z
                .string()
                .trim()
                .min(
                    2,
                    "Test title must contain at least 2 characters",
                )
                .max(
                    150,
                    "Test title cannot exceed 150 characters",
                )
                .optional(),

            startDate:
                dateSchema(
                    "Start date",
                ).optional(),

            endDate:
                dateSchema(
                    "End date",
                ).optional(),

            testStatus: z
                .string()
                .trim()
                .min(
                    1,
                    "Test status is required",
                )
                .optional(),
        })
        .refine(
            (data) => {
                if (
                    !data.startDate ||
                    !data.endDate
                ) {
                    return true;
                }

                return (
                    new Date(
                        data.startDate,
                    ) <=
                    new Date(
                        data.endDate,
                    )
                );
            },
            {
                message:
                    "Start date cannot be after end date",
                path: [
                    "endDate",
                ],
            },
        );

const periodicTestSubjectSchema =
    z
        .object({
            classSubjectSlug:
                requiredText(
                    "Class subject",
                ),

            streamSlug: z
                .string()
                .trim()
                .nullable()
                .optional(),

            studyMode: z
                .string()
                .trim()
                .nullable()
                .optional(),

            maxMarks: z.coerce
                .number({
                    required_error:
                        "Maximum marks are required",
                    invalid_type_error:
                        "Maximum marks must be a number",
                })
                .positive(
                    "Maximum marks must be greater than zero",
                ),

            minMarks: z.coerce
                .number({
                    required_error:
                        "Minimum marks are required",
                    invalid_type_error:
                        "Minimum marks must be a number",
                })
                .min(
                    0,
                    "Minimum marks cannot be negative",
                ),

            testDate:
                dateSchema(
                    "Test date",
                ),

            testTime:
                requiredText(
                    "Test time",
                ),

            duration: z.coerce
                .number({
                    required_error:
                        "Duration is required",
                    invalid_type_error:
                        "Duration must be a number",
                })
                .int(
                    "Duration must be a whole number",
                )
                .positive(
                    "Duration must be greater than zero",
                ),

            questionPaper: z
                .string()
                .nullable()
                .optional(),
        })
        .refine(
            (data) =>
                data.minMarks <=
                data.maxMarks,
            {
                message:
                    "Minimum marks cannot exceed maximum marks",
                path: [
                    "minMarks",
                ],
            },
        );

export const savePeriodicTestTimeTableSchema =
    z.object({
        periodicTestSlug:
            requiredText(
                "Periodic test",
            ),

        classSlug:
            requiredText(
                "Class",
            ),

        publishResult:
            z.boolean(),

        subjects: z
            .array(
                periodicTestSubjectSchema,
            )
            .min(
                1,
                "Fill timetable details for at least one subject",
            ),
    });