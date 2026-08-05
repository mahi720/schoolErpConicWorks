import { z } from "zod";

const timeSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Time must be in HH:mm format",
    });

export const createShiftSchema = z.object({
    departmentSlug: z.string().trim().min(1),

    shiftName: z.string().trim().min(1).max(100),

    shiftCode: z.string().trim().min(1).max(30),

    loginTime: timeSchema,

    loginBufferMinutes: z.coerce
        .number()
        .int()
        .nonnegative(),

    logoutTime: timeSchema,

    logoutBufferMinutes: z.coerce
        .number()
        .int()
        .nonnegative(),
});

export const updateShiftSchema =
    createShiftSchema.partial().refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required",
        },
    );