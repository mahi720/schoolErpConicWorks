import { z } from "zod";

export const createSubjectSchema = z.object({
    board: z.string().min(1, "Board is required"),
    subjectTitle: z.string().min(1, "Subject title is required"),
    subjectType: z.string().min(1, "Subject type is required"),
    subjectOrder: z.coerce.number().min(1, "Subject order is required"),
    status: z.string().optional(),
});

export const updateSubjectSchema = z.object({
    board: z.string().min(1, "Board is required").optional(),
    subjectTitle: z.string().min(1, "Subject title is required").optional(),
    subjectType: z.string().min(1, "Subject type is required").optional(),
    subjectOrder: z.coerce.number().min(1, "Subject order is required").optional(),
    status: z.string().optional(),
});