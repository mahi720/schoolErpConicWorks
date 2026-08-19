import { z } from "zod";

export const payrollMonthSchema = z.coerce
    .number()
    .int()
    .min(1, "Please select a valid month")
    .max(12, "Please select a valid month");

export const payrollYearSchema = z.coerce
    .number()
    .int()
    .min(2000, "Please select a valid year")
    .max(2100, "Please select a valid year");

export const payrollPeriodSchema = z.object({
    month: payrollMonthSchema,

    year: payrollYearSchema,
});

export const payrollFilterSchema = z.object({
    month: payrollMonthSchema,

    year: payrollYearSchema,

    departmentSlug: z.string().trim().optional().nullable(),

    designationSlug: z.string().trim().optional().nullable(),

    employeeSlug: z.string().trim().optional().nullable(),
});

export const manualPayrollItemSchema = z.object({
    componentType: z.enum(["EARNING", "DEDUCTION"]),

    componentName: z
        .string()
        .trim()
        .min(1, "Component name is required")
        .max(150, "Component name is too long"),

    amount: z.coerce.number().positive("Amount must be greater than zero"),

    remarks: z
        .string()
        .trim()
        .max(500, "Remarks are too long")
        .optional()
        .nullable(),
});

export const employeePayrollSaveRowSchema = z.object({
    employeeSlug: z.string().trim().min(1, "Employee is required"),

    claimedSalaryDays: z.coerce
        .number()
        .min(0, "Salary days cannot be negative")
        .max(31, "Salary days cannot be more than 31")
        .optional()
        .nullable(),

    salaryDaysRemark: z
        .string()
        .trim()
        .max(500, "Salary days remark is too long")
        .optional()
        .nullable(),

    manualItems: z.array(manualPayrollItemSchema).optional().default([]),
});

export const saveEmployeePayrollSchema = z.object({
    month: payrollMonthSchema,

    year: payrollYearSchema,

    employees: z
        .array(employeePayrollSaveRowSchema)
        .min(1, "Please select at least one employee"),
});

export const payrollBulkActionSchema = z.object({
    payrollSlugs: z
        .array(z.string().trim().min(1, "Invalid salary record"))
        .min(1, "Please select at least one salary record"),
});

export const salaryDaysSchema = z.object({
    claimedSalaryDays: z.coerce
        .number()
        .min(0, "Salary days cannot be negative")
        .max(31, "Salary days cannot be more than 31"),

    salaryDaysRemark: z
        .string()
        .trim()
        .max(500, "Remark is too long")
        .optional()
        .nullable(),
});

export const buildPayrollFilterParams = ({
    month,
    year,
    departmentSlug,
    designationSlug,
    employeeSlug,
}) => {
    const params = {
        month: Number(month),

        year: Number(year),
    };

    if (departmentSlug) {
        params.departmentSlug = departmentSlug;
    }

    if (designationSlug) {
        params.designationSlug = designationSlug;
    }

    if (employeeSlug) {
        params.employeeSlug = employeeSlug;
    }

    return params;
};

export const buildSavePayrollPayload = ({ month, year, employees }) => {
    return {
        month: Number(month),

        year: Number(year),

        employees: employees.map((employee) => ({
            employeeSlug: employee.employeeSlug,

            claimedSalaryDays: employee.claimedSalaryDays ?? null,

            salaryDaysRemark: employee.salaryDaysRemark || null,

            manualItems: employee.manualItems || [],
        })),
    };
};

export const buildPayrollBulkActionPayload = (payrollSlugs = []) => {
    return {
        payrollSlugs,
    };
};
