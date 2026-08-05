import { z } from "zod";

export const createBasicSettingSchema = z.object({
    departmentSlug: z.string().trim().min(1),

    weekDays: z
        .array(z.string().trim().min(1))
        .min(1, "At least one weekday is required"),

    dayType: z.enum(["WORKING", "HOLIDAY"]),

    shiftSlug: z
        .string()
        .trim()
        .min(1)
        .nullable()
        .optional(),
});

export const updateBasicSettingSchema = z
    .object({
        dayType: z
            .enum(["WORKING", "HOLIDAY"])
            .optional(),

        shiftSlug: z
            .string()
            .trim()
            .min(1)
            .nullable()
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required",
    });