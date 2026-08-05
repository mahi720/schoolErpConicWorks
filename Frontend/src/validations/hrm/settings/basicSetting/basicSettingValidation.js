import { z } from "zod";

export const basicSettingCreateSchema = z
    .object({
        departmentSlug: z
            .string()
            .trim()
            .min(1, "Department is required"),

        weekDays: z
            .array(z.string().trim().min(1))
            .min(1, "At least one week day is required"),

        dayType: z.enum(["WORKING", "HOLIDAY"], {
            required_error: "Day type is required",
        }),

        shiftSlug: z
            .string()
            .trim()
            .nullable()
            .optional(),
    })
    .superRefine((data, context) => {
        if (
            data.dayType === "WORKING" &&
            !data.shiftSlug
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["shiftSlug"],
                message: "Shift is required for working day",
            });
        }
    });

export const basicSettingUpdateSchema = z
    .object({
        dayType: z
            .enum(["WORKING", "HOLIDAY"])
            .optional(),

        shiftSlug: z
            .string()
            .trim()
            .nullable()
            .optional(),
    })
    .superRefine((data, context) => {
        if (
            data.dayType === "WORKING" &&
            !data.shiftSlug
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["shiftSlug"],
                message: "Shift is required for working day",
            });
        }
    });

export const basicSettingInitialValues = {
    departmentSlug: "",
    weekDays: [],
    dayType: "",
    shiftSlug: "",
};