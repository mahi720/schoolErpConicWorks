import { z } from "zod";

export const remarkSchema = z.object({
    remarksTitle: z
        .string()
        .trim()
        .min(1, "Remark is required")
        .max(500, "Remark is too long"),
});