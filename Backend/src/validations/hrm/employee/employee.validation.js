import { z } from "zod";

const optionalCreateString = z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => {
        if (value === undefined || value === null) {
            return null;
        }

        return value || null;
    });

const optionalUpdateString = z
    .string()
    .trim()
    .nullable()
    .optional();

const optionalUpdateDate = z
    .string()
    .trim()
    .nullable()
    .optional();

const natureOfAppointmentEnum = z.enum([
    "PERMANENT",
    "CONTRACTUAL",
    "ADHOC",
    "TEMPORARY",
    "PART_TIME",
    "PROBATION",
    "GUEST_FACULTY",
    "DAILY_WAGES",
]);

const loginStatusEnum = z.enum([
    "DEFAULT",
    "FLEXIBLE",
    "NO_BOUNDATION",
]);

const employeeRoleEnum = z.enum([
    "SCHOOL_ADMIN",
    "TEACHER",
    "ACCOUNTANT",
    "LIBRARIAN",
    "HR",
]);

const employmentStatusEnum = z.enum([
    "ACTIVE",
    "PROBATION",
    "NOTICE_PERIOD",
    "SUSPENDED",
    "RESIGNED",
    "TERMINATED",
    "RETIRED",
    "DECEASED",
]);

export const createEmployeeSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(1, "Full name is required"),

        nickName: optionalCreateString,

        employeeCode: optionalCreateString,

        phoneNumber: z
            .string()
            .trim()
            .min(1, "Phone number is required")
            .max(20, "Invalid phone number"),

        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Valid email is required"),

        dateOfBirth: z
            .string()
            .trim()
            .min(1, "Date of birth is required"),

        state: optionalCreateString,
        city: optionalCreateString,
        district: optionalCreateString,
        pincode: optionalCreateString,
        address: optionalCreateString,

        qualification: z
            .string()
            .trim()
            .min(1, "Qualification is required"),

        department: z
            .string()
            .trim()
            .min(1, "Department is required"),

        designation: z
            .string()
            .trim()
            .min(1, "Designation is required"),

        natureOfAppointment: natureOfAppointmentEnum,

        joiningDate: z
            .string()
            .trim()
            .min(1, "Joining date is required"),

        payBand: z
            .string()
            .trim()
            .min(1, "Pay band is required"),

        bankName: optionalCreateString,

        bankAccountNumber: optionalCreateString,

        ifscCode: optionalCreateString,

        panNumber: optionalCreateString,

        uanNumber: optionalCreateString,

        aadharNumber: optionalCreateString,

        jobRoleDescription: z
            .string()
            .trim()
            .min(1, "Job role description is required"),

        isDrfApplicable: z
            .boolean()
            .optional()
            .default(false),

        createLogin: z
            .boolean()
            .optional()
            .default(false),

        loginEmail: z
            .string()
            .trim()
            .email("Valid login email is required")
            .optional()
            .nullable(),

        loginRole: employeeRoleEnum
            .optional()
            .nullable(),

        password: z
            .string()
            .min(
                6,
                "Password must be at least 6 characters",
            )
            .optional()
            .nullable(),

        loginStatus: loginStatusEnum
            .optional()
            .default("DEFAULT"),

        inBufferMinutes: z
            .coerce
            .number()
            .int()
            .min(0)
            .optional()
            .nullable(),

        outBufferMinutes: z
            .coerce
            .number()
            .int()
            .min(0)
            .optional()
            .nullable(),
    })
    .superRefine((data, ctx) => {
        if (data.createLogin) {
            if (!data.loginRole) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["loginRole"],
                    message: "Login role is required",
                });
            }

            if (!data.password) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["password"],
                    message: "Password is required",
                });
            }
        }

        if (data.loginStatus === "FLEXIBLE") {
            if (
                data.inBufferMinutes === undefined ||
                data.inBufferMinutes === null
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["inBufferMinutes"],
                    message:
                        "In buffer is required for flexible login",
                });
            }

            if (
                data.outBufferMinutes === undefined ||
                data.outBufferMinutes === null
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["outBufferMinutes"],
                    message:
                        "Out buffer is required for flexible login",
                });
            }
        }
    });

export const updateEmployeeSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .optional(),

    nickName: optionalUpdateString,

    employeeCode: optionalUpdateString,

    phoneNumber: z
        .string()
        .trim()
        .max(20, "Invalid phone number")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Valid email is required")
        .optional(),

    dateOfBirth: optionalUpdateDate,

    state: optionalUpdateString,
    city: optionalUpdateString,
    district: optionalUpdateString,
    pincode: optionalUpdateString,
    address: optionalUpdateString,

    qualification: optionalUpdateString,

    department: optionalUpdateString,

    designation: optionalUpdateString,

    natureOfAppointment:
        natureOfAppointmentEnum.optional(),

    joiningDate: optionalUpdateDate,

    payBand: optionalUpdateString,

    bankName: optionalUpdateString,

    bankAccountNumber: optionalUpdateString,

    ifscCode: optionalUpdateString,

    panNumber: optionalUpdateString,

    uanNumber: optionalUpdateString,

    aadharNumber: optionalUpdateString,

    jobRoleDescription: optionalUpdateString,

    isDrfApplicable: z
        .boolean()
        .optional(),

    employmentStatus:
        employmentStatusEnum.optional(),
});

export const updateEmployeeDrfSchema = z.object({
    isDrfApplicable: z.boolean(),
});

export const updateEmployeeLoginSettingSchema = z
    .object({
        loginStatus: loginStatusEnum,

        inBufferMinutes: z
            .coerce
            .number()
            .int()
            .min(0)
            .optional()
            .nullable(),

        outBufferMinutes: z
            .coerce
            .number()
            .int()
            .min(0)
            .optional()
            .nullable(),
    })
    .superRefine((data, ctx) => {
        if (data.loginStatus !== "FLEXIBLE") {
            return;
        }

        if (
            data.inBufferMinutes === undefined ||
            data.inBufferMinutes === null
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["inBufferMinutes"],
                message: "In buffer is required",
            });
        }

        if (
            data.outBufferMinutes === undefined ||
            data.outBufferMinutes === null
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["outBufferMinutes"],
                message: "Out buffer is required",
            });
        }
    });

export const createEmployeeLoginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Login email is required")
        .email("Enter a valid login email"),

    role: employeeRoleEnum,

    password: z
        .string()
        .min(
            6,
            "Password must be at least 6 characters",
        ),
});

export const updateEmployeeLoginAccessSchema = z.object({
    isActive: z.boolean(),
});

export const transferEmployeeSchema = z.object({
    department: z
        .string()
        .trim()
        .min(1, "Department is required"),

    designation: z
        .string()
        .trim()
        .min(1, "Designation is required"),

    payBand: z
        .string()
        .trim()
        .min(1, "Pay band is required"),
});