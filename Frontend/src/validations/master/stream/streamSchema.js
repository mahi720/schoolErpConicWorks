import { z } from "zod";

export const classSchema = z.object({
    streamTitle: z.string().min(1, "Section is required"),
});