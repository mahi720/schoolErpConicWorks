import { z } from "zod";

export const createAddSubjectToClassSchema = z.object({
    session: z.string().trim().min(1, "Session is required"),
    board: z.string().trim().min(1, "Board is required"),
    classTitle: z.string().trim().min(1, "Class is required"),

    stream: z.string().trim().optional().nullable(),

    subjectSlugs: z
        .array(z.string().trim().min(1))
        .min(1, "At least one subject is required"),

    studyType: z.enum(["THEORY", "PRACTICAL", "BOTH"]),

    status: z.string().trim().optional(),
});

export const updateAddSubjectToClassSchema = z.object({
    stream: z.string().trim().optional().nullable(),
    studyType: z.enum(["THEORY", "PRACTICAL", "BOTH"]).optional(),
    status: z.string().trim().optional(),
});

export const getClassSubjectsQuerySchema = z.object({
    session: z.string().trim().min(1, "Session is required"),
    board: z.string().trim().min(1, "Board is required"),
    classTitle: z.string().trim().min(1, "Class is required"),
    stream: z.string().trim().optional(),
});