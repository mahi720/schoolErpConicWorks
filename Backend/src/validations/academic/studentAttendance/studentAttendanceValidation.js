import { z } from "zod";

const attendanceStatusSchema = z.enum(["P", "A", "L", "HD", "H"], {
    errorMap: () => ({
        message: "Attendance status must be P, A, L, HD or H",
    }),
});

const attendanceDateSchema = z
    .string()
    .min(1, "Attendance date is required")
    .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Attendance date must be in YYYY-MM-DD format",
    )
    .refine((value) => {
        const date = new Date(`${value}T00:00:00.000Z`);

        return !Number.isNaN(date.getTime());
    }, "Invalid attendance date");

export const markStudentAttendanceSchema = z.object({
    attendanceDate: attendanceDateSchema,

    students: z
        .array(
            z.object({
                academicMappingSlug: z
                    .string()
                    .min(1, "Academic mapping slug is required")
                    .max(50),

                attendanceStatus: attendanceStatusSchema,
            }),
        )
        .min(1, "At least one student is required"),

    remarks: z.string().max(255).optional().nullable(),
});

export const updateStudentAttendanceSchema = z.object({
    attendanceStatus: attendanceStatusSchema,
    remarks: z.string().max(255).optional().nullable(),
});

export const attendanceActionSchema = z.object({
    remarks: z.string().max(255).optional().nullable(),
});

export const attendanceStudentFilterSchema = z.object({
    session: z.string().min(1, "Session is required"),
    board: z.string().min(1, "Board is required"),
    classTitle: z.string().min(1, "Class is required"),

    sectionSlug: z.string().max(50).optional(),
    streamSlug: z.string().max(50).optional(),

    attendanceDate: attendanceDateSchema,
});

export const monthlyAttendanceQuerySchema = z.object({
    academicMappingSlug: z
        .string()
        .min(1, "Academic mapping slug is required")
        .max(50),

    year: z.coerce
        .number()
        .int()
        .min(2000, "Invalid year")
        .max(2100, "Invalid year"),

    month: z.coerce
        .number()
        .int()
        .min(1, "Month must be between 1 and 12")
        .max(12, "Month must be between 1 and 12"),
});

export const attendanceLogsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});