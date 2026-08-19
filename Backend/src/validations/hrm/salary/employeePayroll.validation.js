import { z } from "zod";

const payrollYearSchema = z.coerce
    .number()
    .int()
    .min(2000, "Invalid payroll year")
    .max(2100, "Invalid payroll year");

const payrollMonthSchema = z.coerce
    .number()
    .int()
    .min(1, "Invalid payroll month")
    .max(12, "Invalid payroll month");

const manualPayrollItemSchema = z.object({
    componentType: z.enum(["EARNING", "DEDUCTION"]),

    componentName: z
        .string()
        .trim()
        .min(1, "Component name is required")
        .max(150),

    amount: z.coerce.number().positive("Amount must be greater than zero"),

    remarks: z.string().trim().max(500).optional().nullable(),
});

const employeeSalarySaveRowSchema = z.object({
    employeeSlug: z.string().trim().min(1, "Employee is required"),

    claimedSalaryDays: z.coerce.number().min(0).max(31).optional().nullable(),

    salaryDaysRemark: z.string().trim().max(500).optional().nullable(),

    manualItems: z.array(manualPayrollItemSchema).optional().default([]),
});

export const saveEmployeePayrollSchema = z.object({
    year: payrollYearSchema,

    month: payrollMonthSchema,

    employees: z
        .array(employeeSalarySaveRowSchema)
        .min(1, "At least one employee is required"),
});

const payrollBulkActionSchema = z.object({
    payrollSlugs: z
        .array(z.string().trim().min(1))
        .min(1, "At least one salary record is required"),
});

export const lockEmployeePayrollSchema = payrollBulkActionSchema;

export const unlockEmployeePayrollSchema = payrollBulkActionSchema;

export const markEmployeePayrollPaidSchema = payrollBulkActionSchema;
