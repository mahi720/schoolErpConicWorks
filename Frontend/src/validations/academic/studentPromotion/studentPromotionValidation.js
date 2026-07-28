import { z } from "zod";

const optionalSlugSchema = z
    .string()
    .trim()
    .max(50, "Invalid value")
    .nullable()
    .optional();

const promotionStudentSchema = z.object({
    studentSlug: z
        .string()
        .trim()
        .min(1, "Student slug is required"),

    newSectionSlug: z
        .string()
        .optional()
        .nullable()
        .transform((value) => value || null),

    newStreamSlug: z
        .string()
        .optional()
        .nullable()
        .transform((value) => value || null),

    newRollNumberPrefix: z
        .string()
        .trim()
        .max(
            20,
            "Roll number prefix must not exceed 20 characters",
        )
        .nullable()
        .optional(),

    newRollNumber: z
        .number()
        .int("Roll number must be an integer")
        .positive("Roll number must be greater than zero")
        .nullable()
        .optional(),
});

export const promoteStudentSchema = z
    .object({
        previousSession: z
            .string()
            .trim()
            .min(1, "Source academic year is required"),

        previousBoard: z
            .string()
            .trim()
            .min(1, "Source board is required"),

        previousClass: z
            .string()
            .trim()
            .min(1, "Source class is required"),

        previousSectionSlug: optionalSlugSchema,

        previousStreamSlug: optionalSlugSchema,

        newSession: z
            .string()
            .trim()
            .min(1, "Target academic year is required"),

        newBoard: z
            .string()
            .trim()
            .min(1, "Target board is required"),

        newClass: z
            .string()
            .trim()
            .min(1, "Target class is required"),

        newSectionSlug: optionalSlugSchema,

        newStreamSlug: optionalSlugSchema,

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
    })
    .superRefine((data, context) => {
        if (data.previousSession === data.newSession) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["newSession"],
                message:
                    "Target academic year must be different from source academic year",
            });
        }

        if (data.previousBoard !== data.newBoard) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["newBoard"],
                message:
                    "Target board must be the same as source board",
            });
        }
    });

export const rollbackPromotionSchema = z.object({
    rollbackRemarks: z
        .string()
        .trim()
        .min(1, "Rollback reason is required")
        .max(
            2000,
            "Rollback reason must not exceed 2000 characters",
        ),
});