import { z } from "zod";

const optionalPassingMarks = z.preprocess(
    (value) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return null;
        }

        return Number(value);
    },
    z
        .number({
            invalid_type_error: "Passing marks must be a number",
        })
        .int("Passing marks must be a whole number")
        .min(0, "Passing marks cannot be negative")
        .nullable()
        .optional()
);

export const createSubjectMarksConfigSchema = z
    .object({
        addedSubjectToClassSlug: z
            .string()
            .trim()
            .min(1, "Mapped class subject is required"),

        componentName: z
            .string()
            .trim()
            .min(1, "Component name is required")
            .max(100, "Component name is too long"),

        totalMarks: z.coerce
            .number()
            .int("Total marks must be a whole number")
            .min(1, "Total marks must be at least 1"),

        passingMarks: optionalPassingMarks,

        status: z
            .enum(["active", "inactive"])
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.passingMarks !== undefined &&
            data.passingMarks !== null &&
            data.passingMarks > data.totalMarks
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["passingMarks"],
                message:
                    "Passing marks cannot be greater than total marks",
            });
        }
    });

export const updateSubjectMarksConfigSchema = z
    .object({
        componentName: z
            .string()
            .trim()
            .min(1, "Component name is required")
            .max(100, "Component name is too long")
            .optional(),

        totalMarks: z.coerce
            .number()
            .int("Total marks must be a whole number")
            .min(1, "Total marks must be at least 1")
            .optional(),

        passingMarks: optionalPassingMarks,

        status: z
            .enum(["active", "inactive"])
            .optional(),
    });

export const getSubjectMarksConfigsQuerySchema = z.object({
    addedSubjectToClassSlug: z
        .string()
        .trim()
        .min(1, "Mapped class subject is required"),

    status: z
        .enum(["active", "inactive", "all"])
        .optional(),
});