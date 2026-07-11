import { z } from "zod";

export const createFeeTypeSchema = z.object({
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
        .optional()
        .nullable(),

    status: z
        .enum(["active", "inactive"])
        .optional(),
});

export const updateFeeTypeSchema = z.object({
    board: z
        .string()
        .trim()
        .min(1, "Board is required")
        .optional(),

    feeType: z
        .string()
        .trim()
        .min(1, "Fee type is required")
        .max(100, "Fee type is too long")
        .optional(),

    description: z
        .string()
        .trim()
        .max(500, "Description is too long")
        .optional()
        .nullable(),

    status: z
        .enum(["active", "inactive"])
        .optional(),
});

export const getFeeTypesQuerySchema = z.object({
    board: z
        .string()
        .trim()
        .min(1, "Board is required"),

    status: z
        .enum(["active", "inactive", "all"])
        .optional(),
});