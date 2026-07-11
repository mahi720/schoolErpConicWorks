import { z } from "zod";

export const classSubjectSchema = z
    .object({
        session: z.string().min(1, "Session is required"),

        board: z.string().min(1, "Board is required"),

        classTitle: z.string().min(1, "Class is required"),

        classType: z.string().optional(),

        stream: z.string().optional(),

        subjectSlugs: z
            .array(z.string())
            .min(1, "Select at least one subject"),

        studyType: z.enum(["THEORY", "PRACTICAL", "BOTH"], {
            message: "Study type is required",
        }),
    })
    .superRefine((data, ctx) => {
        const isSeniorSecondary =
            data.classType?.toLowerCase() ===
            "senior secondary" ||
            ["11", "11th", "xi", "12", "12th", "xii"].includes(
                data.classTitle
                    ?.toLowerCase()
                    .replace(/\s+/g, "")
                    .replace(/class|grade|standard/g, ""),
            );

        if (isSeniorSecondary && !data.stream?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["stream"],
                message:
                    "Stream is required for 11th and 12th class",
            });
        }
    });

export const updateClassSubjectSchema = z.object({
    stream: z.string().optional(),

    studyType: z
        .enum(["THEORY", "PRACTICAL", "BOTH"])
        .optional(),

    status: z.string().optional(),
});