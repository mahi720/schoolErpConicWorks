import { z } from "zod";

export const createDesignationSchema = z.object({
    departmentSlug: z
        .string()
        .trim()
        .min(1, "Department is required"),

    designationName: z
        .string()
        .trim()
        .min(1, "Designation name is required")
        .max(100),

    designationLevel: z.coerce
        .number()
        .int()
        .positive("Designation level must be positive"),
});

export const updateDesignationSchema =
    createDesignationSchema.partial().refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required",
        },
    );