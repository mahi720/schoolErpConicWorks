import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
    schoolCode: z.string().min(1, "School code is required"),
    rememberMe: z.boolean().optional(),
});