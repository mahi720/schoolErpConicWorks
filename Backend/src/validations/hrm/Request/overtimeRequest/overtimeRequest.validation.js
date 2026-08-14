import { z } from "zod";

const dateRegex =
    /^\d{4}-\d{2}-\d{2}$/;

export const createOvertimeRequestSchema =
    z.object({
        description: z
            .string()
            .trim()
            .min(
                1,
                "Description is required",
            )
            .max(
                500,
                "Description cannot exceed 500 characters",
            ),

        appointedBy: z
            .string()
            .trim()
            .min(
                1,
                "Appointed by is required",
            ),

        date: z
            .string()
            .trim()
            .regex(
                dateRegex,
                "Valid overtime date is required",
            ),

        hoursSpent: z.coerce
            .number()
            .positive(
                "Hours spent must be greater than 0",
            )
            .max(
                24,
                "Hours spent cannot exceed 24 hours",
            ),
    });

export const approveOvertimeRequestSchema = z.object({
    remark: z
        .string()
        .trim()
        .min(
            1,
            "Remark is required",
        )
        .max(
            500,
            "Remark cannot exceed 500 characters",
        ),
});

export const rejectOvertimeRequestSchema =
    z.object({
        remark: z
            .string()
            .trim()
            .min(
                1,
                "Remark is required",
            )
            .max(
                500,
                "Remark cannot exceed 500 characters",
            ),
    });