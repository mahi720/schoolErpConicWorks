import { z } from "zod";

export const createSectionSchema = z.object({
    sectionTitle: z.string().min(1, "Section title is required"),
    // classType: z.string().min(1, "Class type is required"),
    board: z.string().min(1, "Board is required"),
    // session: z.string().min(1, "Session is required"),
    status: z.string().optional(),
});

export const updateSectionSchema = z.object({
    sectionTitle: z.string().min(1).optional(),
    // classType: z.string().min(1).optional(),
    board: z.string().min(1).optional(),
    // session: z.string().min(1).optional(),
    status: z.string().optional(),
});