import { z } from "zod";

const optionalText = z
    .string()
    .trim()
    .optional()
    .or(z.literal(""));

export const employeeNatureOptions = [
    {
        label: "Permanent",
        value: "PERMANENT",
    },
    {
        label: "Contractual",
        value: "CONTRACTUAL",
    },
    {
        label: "Adhoc",
        value: "ADHOC",
    },
    {
        label: "Temporary",
        value: "TEMPORARY",
    },
    {
        label: "Part Time",
        value: "PART_TIME",
    },
    {
        label: "Probation",
        value: "PROBATION",
    },
    {
        label: "Guest Faculty",
        value: "GUEST_FACULTY",
    },
    {
        label: "Daily Wages",
        value: "DAILY_WAGES",
    },
];

export const employeeRoleOptions = [
    {
        label: "School Admin",
        value: "SCHOOL_ADMIN",
    },
    {
        label: "Teacher",
        value: "TEACHER",
    },
    {
        label: "Accountant",
        value: "ACCOUNTANT",
    },
    {
        label: "Librarian",
        value: "LIBRARIAN",
    },
    {
        label: "HR",
        value: "HR",
    },
];

export const employeeLoginStatusOptions = [
    {
        label: "Default (D)",
        value: "DEFAULT",
    },
    {
        label: "Flexible (F)",
        value: "FLEXIBLE",
    },
    {
        label: "No Boundation (B)",
        value: "NO_BOUNDATION",
    },
];

export const employeeSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(
                1,
                "Full name is required",
            ),

        nickName: optionalText,

        employeeCode: optionalText,

        phoneNumber: z
            .string()
            .trim()
            .min(
                1,
                "Phone number is required",
            )
            .regex(
                /^[0-9]{6,15}$/,
                "Enter a valid phone number",
            ),

        email: z
            .string()
            .trim()
            .min(
                1,
                "Email is required",
            )
            .email(
                "Enter a valid email",
            ),

        dateOfBirth: z
            .string()
            .trim()
            .min(
                1,
                "Date of birth is required",
            ),

        state: optionalText,

        city: optionalText,

        district: optionalText,

        pincode: optionalText.refine(
            (value) =>
                !value ||
                /^[0-9]{6}$/.test(value),
            {
                message:
                    "Pincode must be 6 digits",
            },
        ),

        address: optionalText,

        qualification: z
            .string()
            .trim()
            .min(
                1,
                "Qualification is required",
            ),

        department: z
            .string()
            .trim()
            .min(
                1,
                "Department is required",
            ),

        designation: z
            .string()
            .trim()
            .min(
                1,
                "Designation is required",
            ),

        natureOfAppointment: z
            .enum([
                "PERMANENT",
                "CONTRACTUAL",
                "ADHOC",
                "TEMPORARY",
                "PART_TIME",
                "PROBATION",
                "GUEST_FACULTY",
                "DAILY_WAGES",
            ])
            .or(z.literal(""))
            .refine(
                (value) =>
                    value !== "",
                {
                    message:
                        "Nature of appointment is required",
                },
            ),

        joiningDate: z
            .string()
            .trim()
            .min(
                1,
                "Joining date is required",
            ),

        payBand: z
            .string()
            .trim()
            .min(
                1,
                "Pay band is required",
            ),

        bankName: optionalText,

        bankAccountNumber:
            optionalText.refine(
                (value) =>
                    !value ||
                    /^[0-9]{6,30}$/.test(
                        value,
                    ),
                {
                    message:
                        "Enter a valid bank account number",
                },
            ),

        ifscCode: optionalText.refine(
            (value) =>
                !value ||
                /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(
                    value,
                ),
            {
                message:
                    "Enter a valid IFSC code",
            },
        ),

        panNumber: optionalText.refine(
            (value) =>
                !value ||
                /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(
                    value,
                ),
            {
                message:
                    "Enter a valid PAN number",
            },
        ),

        uanNumber: optionalText.refine(
            (value) =>
                !value ||
                /^[0-9]{12}$/.test(value),
            {
                message:
                    "UAN number must be 12 digits",
            },
        ),

        aadharNumber:
            optionalText.refine(
                (value) =>
                    !value ||
                    /^[0-9]{12}$/.test(
                        value,
                    ),
                {
                    message:
                        "Aadhar number must be 12 digits",
                },
            ),

        jobRoleDescription: z
            .string()
            .trim()
            .min(
                1,
                "Job role description is required",
            ),

        isDrfApplicable:
            z.boolean().optional(),

        createLogin:
            z.boolean().optional(),

        loginEmail: optionalText,

        loginRole: z
            .enum([
                "SCHOOL_ADMIN",
                "TEACHER",
                "ACCOUNTANT",
                "LIBRARIAN",
                "HR",
            ])
            .or(z.literal(""))
            .optional(),

        password: optionalText,

        confirmPassword: optionalText,
    })
    .superRefine(
        (data, ctx) => {
            if (!data.createLogin) {
                return;
            }

            const loginEmail =
                data.loginEmail ||
                data.email;

            const emailCheck =
                z
                    .string()
                    .email()
                    .safeParse(
                        loginEmail,
                    );

            if (!emailCheck.success) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode.custom,

                    path: [
                        "loginEmail",
                    ],

                    message:
                        "Valid login email is required",
                });
            }

            if (!data.loginRole) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode.custom,

                    path: [
                        "loginRole",
                    ],

                    message:
                        "Login role is required",
                });
            }

            if (
                !data.password ||
                data.password.length < 6
            ) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode.custom,

                    path: [
                        "password",
                    ],

                    message:
                        "Password must be at least 6 characters",
                });
            }

            if (
                data.password !==
                data.confirmPassword
            ) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode.custom,

                    path: [
                        "confirmPassword",
                    ],

                    message:
                        "Passwords do not match",
                });
            }
        },
    );

export const buildEmployeePayload = (
    form,
) => {
    return {
        fullName:
            form.fullName.trim(),

        nickName:
            form.nickName?.trim() ||
            null,

        employeeCode:
            form.employeeCode?.trim() ||
            null,

        phoneNumber:
            form.phoneNumber.trim(),

        email:
            form.email.trim(),

        dateOfBirth:
            form.dateOfBirth,

        state:
            form.state?.trim() ||
            null,

        city:
            form.city?.trim() ||
            null,

        district:
            form.district?.trim() ||
            null,

        pincode:
            form.pincode?.trim() ||
            null,

        address:
            form.address?.trim() ||
            null,

        qualification:
            form.qualification?.trim() ||
            null,

        department:
            form.department,

        designation:
            form.designation,

        natureOfAppointment:
            form.natureOfAppointment,

        joiningDate:
            form.joiningDate,

        payBand:
            form.payBand,

        bankName:
            form.bankName?.trim() ||
            null,

        bankAccountNumber:
            form.bankAccountNumber?.trim() ||
            null,

        ifscCode:
            form.ifscCode
                ?.trim()
                .toUpperCase() ||
            null,

        panNumber:
            form.panNumber
                ?.trim()
                .toUpperCase() ||
            null,

        uanNumber:
            form.uanNumber?.trim() ||
            null,

        aadharNumber:
            form.aadharNumber?.trim() ||
            null,

        jobRoleDescription:
            form.jobRoleDescription?.trim() ||
            null,

        isDrfApplicable:
            Boolean(
                form.isDrfApplicable,
            ),

        createLogin:
            Boolean(
                form.createLogin,
            ),

        ...(form.createLogin && {
            loginEmail:
                form.loginEmail?.trim() ||
                form.email.trim(),

            loginRole:
                form.loginRole,

            password:
                form.password,
        }),
    };
};

export const employeeLoginSettingSchema =
    z
        .object({
            loginStatus: z.enum([
                "DEFAULT",
                "FLEXIBLE",
                "NO_BOUNDATION",
            ]),

            inBufferMinutes: z
                .union([
                    z.string(),
                    z.number(),
                ])
                .optional(),

            outBufferMinutes: z
                .union([
                    z.string(),
                    z.number(),
                ])
                .optional(),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.loginStatus !==
                    "FLEXIBLE"
                ) {
                    return;
                }

                const inBuffer =
                    Number(
                        data.inBufferMinutes,
                    );

                const outBuffer =
                    Number(
                        data.outBufferMinutes,
                    );

                if (
                    data.inBufferMinutes ===
                    "" ||
                    data.inBufferMinutes ===
                    undefined ||
                    data.inBufferMinutes ===
                    null ||
                    Number.isNaN(
                        inBuffer,
                    ) ||
                    inBuffer < 0
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode.custom,

                        path: [
                            "inBufferMinutes",
                        ],

                        message:
                            "In buffer is required",
                    });
                }

                if (
                    data.outBufferMinutes ===
                    "" ||
                    data.outBufferMinutes ===
                    undefined ||
                    data.outBufferMinutes ===
                    null ||
                    Number.isNaN(
                        outBuffer,
                    ) ||
                    outBuffer < 0
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode.custom,

                        path: [
                            "outBufferMinutes",
                        ],

                        message:
                            "Out buffer is required",
                    });
                }
            },
        );

export const employeeLoginAccountSchema =
    z
        .object({
            email: z
                .string()
                .trim()
                .min(
                    1,
                    "Login email is required",
                )
                .email(
                    "Enter a valid email",
                ),

            role: z
                .enum([
                    "SCHOOL_ADMIN",
                    "TEACHER",
                    "ACCOUNTANT",
                    "LIBRARIAN",
                    "HR",
                ])
                .or(z.literal(""))
                .refine(
                    (value) =>
                        value !== "",
                    {
                        message:
                            "Role is required",
                    },
                ),

            password: z
                .string()
                .min(
                    6,
                    "Password must be at least 6 characters",
                ),

            confirmPassword:
                z
                    .string()
                    .min(
                        1,
                        "Confirm password is required",
                    ),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.password !==
                    data.confirmPassword
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode.custom,

                        path: [
                            "confirmPassword",
                        ],

                        message:
                            "Passwords do not match",
                    });
                }
            },
        );

export const employeeDrfSchema =
    z.object({
        isDrfApplicable:
            z.boolean(),
    });

export const employeeTransferSchema =
    z.object({
        department: z
            .string()
            .trim()
            .min(
                1,
                "Department is required",
            ),

        designation: z
            .string()
            .trim()
            .min(
                1,
                "Designation is required",
            ),

        payBand: z
            .string()
            .trim()
            .min(
                1,
                "Pay band is required",
            ),
    });