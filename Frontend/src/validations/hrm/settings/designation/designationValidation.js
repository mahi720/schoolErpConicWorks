import { z } from "zod";

export const designationSchema = z.object({
    departmentSlug: z
        .string()
        .trim()
        .min(1, "Department is required"),

    designationName: z
        .string()
        .trim()
        .min(1, "Designation name is required")
        .max(
            100,
            "Designation name cannot exceed 100 characters",
        ),

    designationLevel: z.coerce
        .number({
            invalid_type_error:
                "Designation level must be a number",
        })
        .int("Designation level must be an integer")
        .positive("Designation level must be greater than zero"),
});

export const designationInitialValues = {
    departmentSlug: "",
    designationName: "",
    designationLevel: "",
};