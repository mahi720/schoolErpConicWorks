import { z } from "zod";

const optionalString = z.preprocess(
    (value) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return String(value).trim();
    },
    z.string().nullable().optional(),
);

const optionalNumber = z.preprocess(
    (value) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return Number(value);
    },
    z
        .number()
        .int("Must be a whole number")
        .nonnegative("Must be zero or greater")
        .nullable()
        .optional(),
);

const optionalDate = z.preprocess(
    (value) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return new Date(value);
    },
    z.date().nullable().optional(),
);

const optionalBoolean = z.preprocess(
    (value) => {
        if (typeof value === "boolean") {
            return value;
        }

        if (value === "true" || value === "1") {
            return true;
        }

        if (
            value === "false" ||
            value === "0" ||
            value === ""
        ) {
            return false;
        }

        return value;
    },
    z.boolean().optional(),
);

export const createSchoolSchema = z
    .object({
        schoolName: z
            .string()
            .trim()
            .min(2, "School name is required"),

        schoolCode: z
            .string()
            .trim()
            .min(2, "School code is required")
            .max(50, "School code is too long"),

        affiliationNumber: optionalString,
        registrationNumber: optionalString,

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

        addressLine2: optionalString,

        city: z
            .string()
            .trim()
            .min(2, "City is required"),

        district: z
            .string()
            .trim()
            .min(2, "District is required"),

        state: z
            .string()
            .trim()
            .min(2, "State is required"),

        country: z
            .string()
            .trim()
            .min(2, "Country is required")
            .default("India"),

        pinCode: z
            .string()
            .trim()
            .regex(
                /^[1-9][0-9]{5}$/,
                "Valid 6 digit PIN code is required",
            ),

        website: optionalString,

        lectureCount: optionalNumber,
        teachingSaturday: optionalBoolean.default(false),
        classrooms: optionalNumber,

        plan: z
            .enum([
                "BASIC",
                "STANDARD",
                "PREMIUM",
                "ENTERPRISE",
            ])
            .default("BASIC"),

        planStartDate: optionalDate,
        planEndDate: optionalDate,

        maxStudents: optionalNumber,
        maxUsers: optionalNumber,
    })
    .superRefine((data, context) => {
        if (
            data.planStartDate &&
            data.planEndDate &&
            data.planStartDate >= data.planEndDate
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["planEndDate"],
                message:
                    "Plan end date must be after plan start date",
            });
        }
    });

export const updateSchoolSchema = z
    .object({
        schoolName: z
            .string()
            .trim()
            .min(2, "School name is required")
            .optional(),

        schoolCode: z
            .string()
            .trim()
            .min(2, "School code is required")
            .max(50, "School code is too long")
            .optional(),

        affiliationNumber: optionalString,
        registrationNumber: optionalString,

        contactPersonName: z
            .string()
            .trim()
            .min(2, "Contact person name is required")
            .optional(),

        contactNumber: z
            .string()
            .trim()
            .min(10, "Valid contact number is required")
            .optional(),

        contactEmail: z
            .string()
            .trim()
            .email("Valid email is required")
            .optional(),

        addressLine1: z
            .string()
            .trim()
            .min(2, "Address is required")
            .optional(),

        addressLine2: optionalString,

        city: z
            .string()
            .trim()
            .min(2, "City is required")
            .optional(),

        district: z
            .string()
            .trim()
            .min(2, "District is required")
            .optional(),

        state: z
            .string()
            .trim()
            .min(2, "State is required")
            .optional(),

        country: z
            .string()
            .trim()
            .min(2, "Country is required")
            .optional(),

        pinCode: z
            .string()
            .trim()
            .regex(
                /^[1-9][0-9]{5}$/,
                "Valid 6 digit PIN code is required",
            )
            .optional(),

        website: optionalString,

        lectureCount: optionalNumber,
        teachingSaturday: optionalBoolean,
        classrooms: optionalNumber,

        plan: z
            .enum([
                "BASIC",
                "STANDARD",
                "PREMIUM",
                "ENTERPRISE",
            ])
            .optional(),

        planStartDate: optionalDate,
        planEndDate: optionalDate,

        maxStudents: optionalNumber,
        maxUsers: optionalNumber,
    })
    .superRefine((data, context) => {
        if (
            data.planStartDate &&
            data.planEndDate &&
            data.planStartDate >= data.planEndDate
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["planEndDate"],
                message:
                    "Plan end date must be after plan start date",
            });
        }
    });