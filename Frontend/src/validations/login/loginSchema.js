import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Valid email required"),
    password: z.string().min(1, "Password required"),
    schoolCode: z.string().min(1, "School code required"),
    rememberMe: z.boolean().optional(),
});