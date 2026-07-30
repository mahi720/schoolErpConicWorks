import { z } from "zod";

const dateStringSchema = z
    .string({
        required_error:
            "Date is required",
    })
    .min(
        1,
        "Date is required",
    )
    .refine(
        (value) =>
            !Number.isNaN(
                new Date(value).getTime(),
            ),
        {
            message:
                "Invalid date",
        },
    );

export const createPeriodicTestSchema =
    z.object({
        session: z
            .string({
                required_error:
                    "Academic session is required",
            })
            .trim()
            .min(
                1,
                "Academic session is required",
            ),

        board: z
            .string({
                required_error:
                    "Board is required",
            })
            .trim()
            .min(
                1,
                "Board is required",
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
            dateStringSchema,

        endDate:
            dateStringSchema,

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
    z.object({
        session: z
            .string()
            .trim()
            .min(
                1,
                "Academic session is required",
            )
            .optional(),

        board: z
            .string()
            .trim()
            .min(
                1,
                "Board is required",
            )
            .optional(),

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
            dateStringSchema.optional(),

        endDate:
            dateStringSchema.optional(),

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
    z.object({
        classSubjectSlug: z
            .string({
                required_error:
                    "Class subject is required",
            })
            .trim()
            .min(
                1,
                "Class subject is required",
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
            dateStringSchema,

        testTime: z
            .string({
                required_error:
                    "Test time is required",
            })
            .trim()
            .min(
                1,
                "Test time is required",
            )
            .max(
                20,
                "Test time cannot exceed 20 characters",
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
        periodicTestSlug: z
            .string({
                required_error:
                    "Periodic test is required",
            })
            .trim()
            .min(
                1,
                "Periodic test is required",
            ),

        classSlug: z
            .string({
                required_error:
                    "Class is required",
            })
            .trim()
            .min(
                1,
                "Class is required",
            ),

        publishResult: z.coerce
            .boolean(),

        subjects: z
            .array(
                periodicTestSubjectSchema,
            )
            .min(
                1,
                "At least one subject is required",
            ),
    });