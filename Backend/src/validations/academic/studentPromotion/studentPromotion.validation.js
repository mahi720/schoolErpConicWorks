import { z } from "zod";

const optionalSlugSchema = z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(50, "Slug must not exceed 50 characters")
    .nullable()
    .optional();

const optionalReadableValueSchema = z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional();

const promotionStudentSchema = z.object({
    studentSlug: z
        .string()
        .trim()
        .min(1, "Student slug is required")
        .max(50, "Student slug must not exceed 50 characters"),

    newSectionSlug: optionalSlugSchema,

    newStreamSlug: optionalSlugSchema,

    newRollNumberPrefix: z
        .string()
        .trim()
        .max(20, "Roll number prefix must not exceed 20 characters")
        .nullable()
        .optional(),

    newRollNumber: z.coerce
        .number()
        .int("Roll number must be an integer")
        .positive("Roll number must be greater than zero")
        .nullable()
        .optional(),
});

export const createStudentPromotionSchema = z.object({
    previousSession: z
        .string()
        .trim()
        .min(1, "Previous session is required"),

    previousBoard: z
        .string()
        .trim()
        .min(1, "Previous board is required"),

    previousClass: z
        .string()
        .trim()
        .min(1, "Previous class is required"),

    previousSectionSlug: optionalSlugSchema,

    previousStreamSlug: optionalSlugSchema,

    newSession: z
        .string()
        .trim()
        .min(1, "New session is required"),

    newBoard: z
        .string()
        .trim()
        .min(1, "New board is required"),

    newClass: z
        .string()
        .trim()
        .min(1, "New class is required"),

    newSectionSlug: z
        .string()
        .max(50)
        .nullable()
        .optional(),

    newStreamSlug: z
        .string()
        .max(50)
        .nullable()
        .optional(),

    promotionType: z
        .enum(["PROMOTED", "DETAINED", "REPEATED"])
        .default("PROMOTED"),

    remarks: z
        .string()
        .trim()
        .max(2000, "Remarks must not exceed 2000 characters")
        .nullable()
        .optional(),

    students: z
        .array(promotionStudentSchema)
        .min(1, "At least one student must be selected"),
});

export const rollbackPromotionBatchSchema = z.object({
    rollbackRemarks: z
        .string()
        .trim()
        .min(1, "Rollback remarks are required")
        .max(2000, "Rollback remarks must not exceed 2000 characters"),
});

export const updatePromotionRemarksSchema = z.object({
    remarks: optionalReadableValueSchema,
});