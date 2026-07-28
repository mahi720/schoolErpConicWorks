import { z } from "zod";

export const createExamTypeSchema = z.object({
    examType: z
        .string({
            required_error: "Exam type is required",
        })
        .trim()
        .min(2, "Exam type must be at least 2 characters")
        .max(100, "Exam type must not exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional()
        .nullable(),
});

export const updateExamTypeSchema = z
    .object({
        examType: z
            .string()
            .trim()
            .min(2, "Exam type must be at least 2 characters")
            .max(100, "Exam type must not exceed 100 characters")
            .optional(),

        description: z
            .string()
            .trim()
            .max(500, "Description must not exceed 500 characters")
            .optional()
            .nullable(),
    })
    .refine(
        (data) =>
            data.examType !== undefined ||
            data.description !== undefined,
        {
            message: "At least one field is required",
        },
    );