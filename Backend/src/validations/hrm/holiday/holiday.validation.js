import { z } from "zod";

const holidayScopeTypeEnum = z.enum([
    "DEPARTMENT",
    "EMPLOYEE",
]);

export const createHolidaySchema = z
    .object({
        startDate: z
            .string()
            .trim()
            .min(1, "Start date is required"),

        endDate: z
            .string()
            .trim()
            .min(1, "End date is required"),

        title: z
            .string()
            .trim()
            .min(1, "Holiday title is required")
            .max(150),

        type: holidayScopeTypeEnum,

        departmentSlugs: z
            .array(z.string().trim().min(1))
            .optional()
            .default([]),

        employeeSlugs: z
            .array(z.string().trim().min(1))
            .optional()
            .default([]),
    })
    .superRefine((data, ctx) => {
        const startDate = new Date(`${data.startDate}T00:00:00.000Z`);
        const endDate = new Date(`${data.endDate}T00:00:00.000Z`);

        if (
            !Number.isNaN(startDate.getTime()) &&
            !Number.isNaN(endDate.getTime()) &&
            endDate < startDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message: "End date cannot be before start date",
            });
        }

        if (data.type === "DEPARTMENT") {
            if (!data.departmentSlugs.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["departmentSlugs"],
                    message: "Select at least one department",
                });
            }

            if (data.employeeSlugs.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["employeeSlugs"],
                    message: "Employee cannot be selected for department holiday",
                });
            }
        }

        if (data.type === "EMPLOYEE") {
            if (!data.employeeSlugs.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["employeeSlugs"],
                    message: "Select at least one employee",
                });
            }

            if (data.departmentSlugs.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["departmentSlugs"],
                    message: "Department cannot be selected for employee holiday",
                });
            }
        }
    });

export const updateHolidaySchema = z.object({
    date: z
        .string()
        .trim()
        .min(1, "Holiday date is required"),

    title: z
        .string()
        .trim()
        .min(1, "Holiday title is required")
        .max(150),
});