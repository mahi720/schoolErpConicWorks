import { z } from "zod";

export const createStreamSchema = z.object({
    streamTitle: z.string().min(1, "Stream title is required"),
    board: z.string().min(1, "Board is required"),
    status: z.string().optional(),
});

export const updateStreamSchema = z.object({
    streamTitle: z.string().min(1).optional(),
    board: z.string().min(1).optional(),
    status: z.string().optional(),
});