import { z } from "zod";

const optionalNumber = z
    .union([
        z.string(),
        z.number(),
        z.literal(""),
    ])
    .optional()
    .refine(
        (value) =>
            value === "" ||
            value === undefined ||
            !Number.isNaN(Number(value)),
        "Must be a valid number",
    );

export const schoolSchema = z.object({
    schoolName: z
        .string()
        .trim()
        .min(2, "School name is required"),

    schoolCode: z
        .string()
        .trim()
        .min(2, "School code is required"),

    affiliationNumber: z.string().optional(),
    registrationNumber: z.string().optional(),

    contactPersonName: z
        .string()
        .trim()
        .min(2, "Contact person name is required"),

    contactNumber: z
        .string()
        .trim()
        .min(10, "Valid contact number is required"),

    contactEmail: z
        .string()
        .trim()
        .email("Valid email is required"),

    addressLine1: z
        .string()
        .trim()
        .min(2, "Address is required"),

    addressLine2: z.string().optional(),

    city: z.string().trim().min(2, "City is required"),
    district: z
        .string()
        .trim()
        .min(2, "District is required"),
    state: z.string().trim().min(2, "State is required"),

    country: z
        .string()
        .trim()
        .min(2, "Country is required"),

    pinCode: z
        .string()
        .trim()
        .regex(
            /^[1-9][0-9]{5}$/,
            "Enter valid 6 digit PIN code",
        ),

    website: z.string().optional(),

    lectureCount: optionalNumber,
    classrooms: optionalNumber,

    teachingSaturday: z.boolean().default(false),

    plan: z.enum([
        "BASIC",
        "STANDARD",
        "PREMIUM",
        "ENTERPRISE",
    ]),

    planStartDate: z.string().optional(),
    planEndDate: z.string().optional(),

    maxStudents: optionalNumber,
    maxUsers: optionalNumber,

    logo: z.any().optional(),
});