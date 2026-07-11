import { z } from "zod";

export const boardSchema = z.object({
    title: z.string().min(2, "Board title is required"),
    description: z.string().optional(),
    status: z.string().optional(),
});