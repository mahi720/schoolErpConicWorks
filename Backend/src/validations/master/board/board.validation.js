import { z } from "zod";

export const createBoardSchema = z.object({
    title: z.string().min(2, "Board title is required"),
    description: z.string().optional(),
    status: z.string().optional(),
});

export const updateBoardSchema = z.object({
    title: z.string().min(2, "Board title is required").optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    isActive: z.boolean().optional(),
});