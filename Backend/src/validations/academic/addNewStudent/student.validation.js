import { z } from "zod";

export const createStudentSchema = z.object({

    admissionNumber: z
        .string()
        .trim()
        .min(1, "Admission number is required"),

    admissionDate: z
        .string()
        .min(1, "Admission date is required"),

    admissionSession: z
        .string()
        .trim()
        .min(1, "Admission session is required"),

    currentSession: z
        .string()
        .trim()
        .min(1, "Current session is required"),

    board: z
        .string()
        .trim()
        .min(1, "Board is required"),

    admissionClass: z
        .string()
        .trim()
        .min(1, "Admission class is required"),

    currentClass: z
        .string()
        .trim()
        .min(1, "Current class is required"),

    sponsorshipType: z
        .string()
        .trim()
        .optional()
        .nullable(),

    sponsorshipRemarks: z
        .string()
        .trim()
        .optional()
        .nullable(),

    studentName: z
        .string()
        .trim()
        .min(1, "Student name is required"),

    fatherName: z
        .string()
        .trim()
        .min(1, "Father name is required"),

    motherName: z
        .string()
        .trim()
        .min(1, "Mother name is required"),

    aadhaarNumber: z
        .string()
        .trim()
        .optional()
        .nullable(),

    apaarId: z
        .string()
        .trim()
        .optional()
        .nullable(),

    penNumber: z
        .string()
        .trim()
        .optional()
        .nullable(),

    sats: z
        .string()
        .trim()
        .optional()
        .nullable(),

    dob: z
        .string()
        .optional()
        .nullable(),

    placeOfBirth: z
        .string()
        .trim()
        .optional()
        .nullable(),

    caste: z
        .string()
        .trim()
        .optional()
        .nullable(),

    category: z
        .string()
        .trim()
        .optional()
        .nullable(),

    religion: z
        .string()
        .trim()
        .optional()
        .nullable(),

    gender: z
        .string()
        .trim()
        .min(1, "Gender is required"),

    phone: z
        .string()
        .trim()
        .optional()
        .nullable(),

    motherPhone: z
        .string()
        .trim()
        .optional()
        .nullable(),

    email: z
        .string()
        .trim()
        .email("Invalid email")
        .optional()
        .or(z.literal(""))
        .nullable(),

    state: z
        .string()
        .trim()
        .optional()
        .nullable(),

    district: z
        .string()
        .trim()
        .optional()
        .nullable(),

    city: z
        .string()
        .trim()
        .optional()
        .nullable(),

    address: z
        .string()
        .trim()
        .optional()
        .nullable(),

    motherTongue: z
        .string()
        .trim()
        .optional()
        .nullable(),

    secondLanguage: z
        .string()
        .trim()
        .optional()
        .nullable(),

    bloodGroup: z
        .string()
        .trim()
        .optional()
        .nullable(),

    profileImage: z
        .string()
        .trim()
        .optional()
        .nullable(),

    // Previous School

    previousSchool: z
        .string()
        .trim()
        .optional()
        .nullable(),

    schoolAddress: z
        .string()
        .trim()
        .optional()
        .nullable(),

    previousBoard: z
        .string()
        .trim()
        .optional()
        .nullable(),

    previousResult: z
        .string()
        .trim()
        .optional()
        .nullable(),

    status: z
        .string()
        .trim()
        .optional(),
});

export const updateStudentSchema =
    createStudentSchema.partial();