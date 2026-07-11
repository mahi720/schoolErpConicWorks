import { z } from "zod";

export const classSchema = z.object({
    classTitle: z.string().min(1, "Class title is required"),

    type: z.string().min(1, "Class type is required"),
});