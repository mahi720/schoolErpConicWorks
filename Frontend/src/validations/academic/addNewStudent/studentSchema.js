import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

const studentBaseSchema = z.object({
    admissionNumber: z
        .string()
        .trim()
        .min(1, "Admission Number is required"),

    admissionDate: z
        .string()
        .min(1, "Admission Date is required"),

    admissionSession: z
        .string()
        .min(1, "Admission Session is required"),

    currentSession: z
        .string()
        .min(1, "Current Session is required"),

    board: z
        .string()
        .min(1, "Board is required"),

    admissionClass: z
        .string()
        .min(1, "Admission Class is required"),

    currentClass: z
        .string()
        .min(1, "Current Class is required"),

    sponsorshipType: optionalString,
    sponsorshipRemarks: optionalString,

    studentName: z
        .string()
        .trim()
        .min(1, "Student Name is required"),

    fatherName: z
        .string()
        .trim()
        .min(1, "Father Name is required"),

    motherName: z
        .string()
        .trim()
        .min(1, "Mother Name is required"),

    gender: z
        .string()
        .min(1, "Gender is required"),

    dob: z
        .string()
        .min(1, "Date of Birth is required"),

    placeOfBirth: optionalString,
    aadhaarNumber: optionalString,
    apaarId: optionalString,
    penNumber: optionalString,
    sats: optionalString,
    caste: optionalString,
    category: optionalString,
    religion: optionalString,

    phone: optionalString,
    motherPhone: optionalString,
    email: optionalString,
    state: optionalString,
    district: optionalString,
    city: optionalString,
    address: optionalString,

    motherTongue: optionalString,
    secondLanguage: optionalString,
    bloodGroup: optionalString,
    profileImage: z
        .any()
        .optional()
        .nullable(),

    previousSchool: optionalString,
    schoolAddress: optionalString,
    previousBoard: optionalString,
    previousResult: optionalString,
})
const applyStudentRefinements = (data, ctx) => {
    // Aadhaar validation
    if (
        data.aadhaarNumber &&
        !/^\d{12}$/.test(data.aadhaarNumber)
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["aadhaarNumber"],
            message: "Aadhaar Number must be 12 digits",
        });
    }

    // Student phone validation
    if (
        data.phone &&
        !/^\d{10}$/.test(data.phone)
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["phone"],
            message: "Phone Number must be 10 digits",
        });
    }

    // Mother phone validation
    if (
        data.motherPhone &&
        !/^\d{10}$/.test(data.motherPhone)
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["motherPhone"],
            message: "Mother Phone Number must be 10 digits",
        });
    }

    // Email validation
    if (
        data.email &&
        !z.string().email().safeParse(data.email).success
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["email"],
            message: "Invalid Email Address",
        });
    }

    // Date of birth validation
    if (data.dob) {
        const dob = new Date(data.dob);

        if (
            Number.isNaN(dob.getTime())
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["dob"],
                message: "Invalid Date of Birth",
            });
        } else if (dob > new Date()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["dob"],
                message:
                    "Date of Birth cannot be in future",
            });
        }
    }

    // Admission date validation
    if (data.admissionDate) {
        const admissionDate = new Date(
            data.admissionDate,
        );

        if (
            Number.isNaN(admissionDate.getTime())
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["admissionDate"],
                message: "Invalid Admission Date",
            });

            return;
        }

        if (admissionDate > new Date()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["admissionDate"],
                message:
                    "Admission Date cannot be in future",
            });
        }

        if (data.dob) {
            const dob = new Date(data.dob);

            if (
                !Number.isNaN(dob.getTime()) &&
                admissionDate < dob
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["admissionDate"],
                    message:
                        "Admission Date cannot be before Date of Birth",
                });
            }
        }
    }
};

export const studentSchema =
    studentBaseSchema.superRefine(
        applyStudentRefinements,
    );

export const updateStudentSchema =
    studentBaseSchema
        .partial()
        .superRefine(
            applyStudentRefinements,
        );