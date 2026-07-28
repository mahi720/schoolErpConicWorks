import { z } from "zod";

const optionalTextSchema = z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => value || null);

const optionalDecimalSchema = z
    .union([
        z.coerce.number().nonnegative(),
        z.literal(""),
        z.null(),
    ])
    .optional()
    .transform((value) => {
        if (value === "" || value === undefined || value === null) {
            return null;
        }

        return value;
    });

const optionalYearSchema = z
    .union([
        z.coerce.number().int().min(1900).max(2100),
        z.literal(""),
        z.null(),
    ])
    .optional()
    .transform((value) => {
        if (value === "" || value === undefined || value === null) {
            return null;
        }

        return value;
    });

const optionalAadhaarSchema = z
    .union([
        z
            .string()
            .trim()
            .regex(/^\d{12}$/, "Aadhaar number must contain exactly 12 digits"),
        z.literal(""),
        z.null(),
    ])
    .optional()
    .transform((value) => value || null);

export const createStudentHealthAssessmentSchema = z.object({
    studentSlug: z.string().trim().min(1, "Student is required"),
    academicYear: z.string().trim().min(1, "Academic year is required"),

    vision: optionalTextSchema,
    ears: optionalTextSchema,
    teethOcclusion: optionalTextSchema,

    height: optionalDecimalSchema,
    weight: optionalDecimalSchema,

    hip: optionalTextSchema,
    waist: optionalTextSchema,

    pulse: optionalTextSchema,
    bloodPressure: optionalTextSchema,

    postureEvaluation: optionalTextSchema,

    strand1: optionalTextSchema,
    strand2: optionalTextSchema,
    strand3: optionalTextSchema,

    bodyComposition: optionalTextSchema,
    muscularStrength: optionalTextSchema,
    upperBody: optionalTextSchema,
    flexibility: optionalTextSchema,
    endurance: optionalTextSchema,
    agility: optionalTextSchema,
    speed: optionalTextSchema,
    power: optionalTextSchema,

    remarks: optionalTextSchema,
});

export const updateStudentHealthAssessmentSchema =
    createStudentHealthAssessmentSchema
        .omit({
            studentSlug: true,
            academicYear: true,
        })
        .partial();

export const createStudentOtherInformationSchema = z.object({
    studentSlug: z.string().trim().min(1, "Student is required"),

    studentBloodGroup: optionalTextSchema,

    motherYearOfBirth: optionalYearSchema,
    motherWeight: optionalDecimalSchema,
    motherHeight: optionalDecimalSchema,
    motherBloodGroup: optionalTextSchema,
    motherAadhaarNumber: optionalAadhaarSchema,

    fatherYearOfBirth: optionalYearSchema,
    fatherWeight: optionalDecimalSchema,
    fatherHeight: optionalDecimalSchema,
    fatherBloodGroup: optionalTextSchema,
    fatherAadhaarNumber: optionalAadhaarSchema,

    familyMonthlyIncome: optionalDecimalSchema,

    cwsnDetails: optionalTextSchema,
});

export const updateStudentOtherInformationSchema =
    createStudentOtherInformationSchema
        .omit({
            studentSlug: true,
        })
        .partial();