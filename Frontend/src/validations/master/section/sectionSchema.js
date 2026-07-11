import { z } from "zod";

export const classSchema = z.object({
    sectionTitle: z.string().min(1, "Section is required"),
});