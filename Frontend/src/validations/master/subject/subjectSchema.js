import { z } from "zod";

export const subjectSchema = z.object({
    subjectTitle: z.string().min(1, "Subject title is required"),
    subjectType: z.string().min(1, "Subject type is required"),
    subjectOrder: z.coerce.number().min(1, "Subject order is required"),
});