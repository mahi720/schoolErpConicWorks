import { z } from "zod";

export const feeTypeSchema = z.object({
    board: z
        .string()
        .trim()
        .min(1, "Board is required"),

    feeType: z
        .string()
        .trim()
        .min(1, "Fee type is required")
        .max(100, "Fee type is too long"),

    description: z
        .string()
        .trim()
        .max(500, "Description is too long")
        .optional(),
});