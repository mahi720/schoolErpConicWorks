import { z } from "zod";

export const sessionSchema = z
    .object({
        name: z.string().min(1, "Session name is required"),

        startDate: z.string().min(1, "Start date is required"),

        endDate: z.string().min(1, "End date is required"),

        status: z.enum(["active", "closed"]),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
        message: "End date must be greater than start date",
        path: ["endDate"],
    });