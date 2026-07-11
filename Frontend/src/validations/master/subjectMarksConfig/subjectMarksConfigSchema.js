import { z } from "zod";

export const marksConfigurationRowSchema = z.object({
    id: z.union([z.string(), z.number()]),

    slug: z.string().optional(),

    subject: z
        .string()
        .trim()
        .min(1, "Subject component is required")
        .max(100, "Subject component is too long"),

    totalMarks: z.coerce
        .number({
            invalid_type_error:
                "Total marks must be a number",
        })
        .int("Total marks must be a whole number")
        .min(1, "Total marks must be at least 1"),
});

export const marksConfigurationSchema = z.object({
    rows: z
        .array(marksConfigurationRowSchema)
        .min(
            1,
            "At least one marks configuration is required",
        )
        .superRefine((rows, ctx) => {
            const componentNames = new Set();

            rows.forEach((row, index) => {
                const normalizedName = row.subject
                    .trim()
                    .toLowerCase();

                if (componentNames.has(normalizedName)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [index, "subject"],
                        message:
                            "Duplicate marks component is not allowed",
                    });
                }

                componentNames.add(normalizedName);
            });
        }),
});