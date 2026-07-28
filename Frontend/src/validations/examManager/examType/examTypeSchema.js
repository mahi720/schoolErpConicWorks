import { z } from "zod";

export const examTypeSchema = z.object({
    examType: z
        .string()
        .trim()
        .min(2, "Exam type must be at least 2 characters")
        .max(100, "Exam type must not exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
});