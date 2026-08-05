import { z } from "zod";

export const createDepartmentSchema = z.object({
    departmentName: z
        .string()
        .trim()
        .min(2, "Department name is required")
        .max(100, "Department name cannot exceed 100 characters"),
});

export const updateDepartmentSchema = z
    .object({
        departmentName: z
            .string()
            .trim()
            .min(2, "Department name is required")
            .max(100, "Department name cannot exceed 100 characters")
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required",
    });