import { z } from "zod";

export const createClassSchema = z.object({
    classTitle: z.string().min(1, "Class title is required"),
    classType: z.string().min(1, "Class type is required"),
    board: z.string().min(1, "Board is required"),
    status: z.string().optional(),
});

export const updateClassSchema = z.object({
    classTitle: z.string().min(1).optional(),
    classType: z.string().min(1).optional(),
    board: z.string().min(1).optional(),
    status: z.string().optional(),
});