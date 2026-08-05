import { z } from "zod";

const timeSchema = z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Time must be in HH:mm format",
    });

export const shiftSchema = z.object({
    departmentSlug: z
        .string()
        .trim()
        .min(1, "Department is required"),

    shiftName: z
        .string()
        .trim()
        .min(1, "Shift name is required")
        .max(100, "Shift name cannot exceed 100 characters"),

    shiftCode: z
        .string()
        .trim()
        .min(1, "Shift code is required")
        .max(30, "Shift code cannot exceed 30 characters"),

    loginTime: timeSchema,

    loginBufferMinutes: z.coerce
        .number({
            invalid_type_error:
                "Login buffer must be a number",
        })
        .int("Login buffer must be an integer")
        .min(0, "Login buffer cannot be negative"),

    logoutTime: timeSchema,

    logoutBufferMinutes: z.coerce
        .number({
            invalid_type_error:
                "Logout buffer must be a number",
        })
        .int("Logout buffer must be an integer")
        .min(0, "Logout buffer cannot be negative"),
});

export const shiftInitialValues = {
    departmentSlug: "",
    shiftName: "",
    shiftCode: "",
    loginTime: "",
    loginBufferMinutes: "",
    logoutTime: "",
    logoutBufferMinutes: "",
};