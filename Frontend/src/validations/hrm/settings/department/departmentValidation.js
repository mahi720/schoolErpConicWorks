import { z } from "zod";

export const departmentSchema = z.object({
    departmentName: z
        .string()
        .trim()
        .min(2, "Department name is required")
        .max(
            100,
            "Department name cannot exceed 100 characters",
        ),
});

export const departmentInitialValues = {
    departmentName: "",
};