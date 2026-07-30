import { z } from "zod";

export const createTermExamSchema =
    z.object({
        session: z
            .string()
            .trim()
            .min(
                1,
                "Academic year is required",
            ),

        board: z
            .string()
            .trim()
            .min(
                1,
                "Board is required",
            ),

        examTitle: z
            .string()
            .trim()
            .min(
                1,
                "Exam title is required",
            )
            .max(
                150,
                "Exam title is too long",
            ),

        startDate: z.coerce
            .date(),

        endDate: z.coerce
            .date(),

        examType: z
            .string()
            .trim()
            .min(
                1,
                "Exam type is required",
            ),
    })
        .refine(
            (data) =>
                data.endDate >
                data.startDate,
            {
                path: [
                    "endDate",
                ],
                message:
                    "End date must be after start date",
            },
        );

export const updateTermExamSchema =
    z.object({
        session: z
            .string()
            .trim()
            .min(1)
            .optional(),

        board: z
            .string()
            .trim()
            .min(1)
            .optional(),

        examTitle: z
            .string()
            .trim()
            .min(1)
            .max(150)
            .optional(),

        startDate: z.coerce
            .date()
            .optional(),

        endDate: z.coerce
            .date()
            .optional(),

        examType: z
            .string()
            .trim()
            .min(1)
            .optional(),
    });

const timetableSubjectSchema =
    z.object({
        classSubjectSlug: z
            .string()
            .trim()
            .min(
                1,
                "Class subject is required",
            )
            .max(50),

        streamSlug: z
            .string()
            .trim()
            .min(1)
            .max(50)
            .nullable()
            .optional(),

        maxMarks: z.coerce
            .number()
            .positive(),

        minMarks: z.coerce
            .number()
            .min(0),

        examDate: z.coerce
            .date(),

        examTime: z
            .string()
            .trim()
            .min(
                1,
                "Exam time is required",
            ),

        duration: z.coerce
            .number()
            .int()
            .positive(),

        questionPaper: z
            .string()
            .trim()
            .nullable()
            .optional(),
    })
        .refine(
            (data) =>
                data.minMarks <=
                data.maxMarks,
            {
                path: [
                    "minMarks",
                ],
                message:
                    "Minimum marks cannot exceed maximum marks",
            },
        );

export const saveTermExamTimeTableSchema =
    z.object({
        termExamSlug: z
            .string()
            .trim()
            .min(1)
            .max(50),

        classSlug: z
            .string()
            .trim()
            .min(1)
            .max(50),

        publishResult:
            z.boolean(),

        subjects: z
            .array(
                timetableSubjectSchema,
            )
            .min(
                1,
                "At least one subject is required",
            ),
    });