import { z } from "zod";

export const createRemarkSchema = z.object({
    remarksTitle: z
        .string()
        .trim()
        .min(1, "Remark is required")
        .max(500, "Remark is too long"),

    status: z
        .enum(["active", "inactive"])
        .optional(),
});

export const updateRemarkSchema = z.object({
    remarksTitle: z
        .string()
        .trim()
        .min(1, "Remark is required")
        .max(500, "Remark is too long")
        .optional(),

    status: z
        .enum(["active", "inactive"])
        .optional(),
});

export const getRemarksQuerySchema = z.object({
    status: z
        .enum(["active", "inactive", "all"])
        .optional(),
});