import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Optional Slug Schema
|--------------------------------------------------------------------------
|
| undefined:
| Field request mein nahi aayi, isliye update nahi hogi.
|
| null:
| Field explicitly clear karni hai.
|
| empty string:
| Field ko request se ignore karenge.
|
*/

const optionalSlugSchema = z.preprocess(
    (value) => {
        if (value === undefined) {
            return undefined;
        }

        if (value === "") {
            return undefined;
        }

        if (value === null) {
            return null;
        }

        return value;
    },
    z
        .string()
        .trim()
        .min(1, "Invalid slug")
        .max(
            50,
            "Slug must not exceed 50 characters",
        )
        .nullable()
        .optional(),
);

/*
|--------------------------------------------------------------------------
| Optional Roll Number Prefix Schema
|--------------------------------------------------------------------------
*/

const optionalRollNumberPrefixSchema = z.preprocess(
    (value) => {
        if (value === undefined) {
            return undefined;
        }

        if (value === "") {
            return undefined;
        }

        if (value === null) {
            return null;
        }

        return value;
    },
    z
        .string()
        .trim()
        .max(
            20,
            "Roll number prefix must not exceed 20 characters",
        )
        .nullable()
        .optional(),
);

/*
|--------------------------------------------------------------------------
| Optional Positive Number Schema
|--------------------------------------------------------------------------
|
| Create mapping mein null/empty ko undefined treat karenge.
|
*/

const optionalPositiveNumberSchema = z.preprocess(
    (value) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return undefined;
        }

        return Number(value);
    },
    z
        .number({
            invalid_type_error:
                "Roll number must be a valid number",
        })
        .int(
            "Roll number must be an integer",
        )
        .positive(
            "Roll number must be greater than zero",
        )
        .optional(),
);

/*
|--------------------------------------------------------------------------
| Optional Nullable Positive Number Schema
|--------------------------------------------------------------------------
|
| Update mapping mein:
|
| undefined => field update nahi hogi
| null      => roll number clear hoga
| number    => roll number update hoga
|
*/

const optionalNullablePositiveNumberSchema = z.preprocess(
    (value) => {
        if (
            value === undefined ||
            value === ""
        ) {
            return undefined;
        }

        if (value === null) {
            return null;
        }

        return Number(value);
    },
    z
        .number({
            invalid_type_error:
                "Roll number must be a valid number",
        })
        .int(
            "Roll number must be an integer",
        )
        .positive(
            "Roll number must be greater than zero",
        )
        .nullable()
        .optional(),
);

/*
|--------------------------------------------------------------------------
| Create Mapping Schema
|--------------------------------------------------------------------------
*/

export const createStudentAcademicMappingSchema =
    z
        .object({
            mappingType: z
                .enum([
                    "section",
                    "stream",
                    "rollNumber",
                    "complete",
                ])
                .optional(),

            session: z
                .string()
                .trim()
                .min(
                    1,
                    "Session is required",
                ),

            board: z
                .string()
                .trim()
                .min(
                    1,
                    "Board is required",
                ),

            classTitle: z
                .string()
                .trim()
                .min(
                    1,
                    "Class is required",
                ),

            sectionSlug:
                optionalSlugSchema,

            streamSlug:
                optionalSlugSchema,

            rollNumberPrefix:
                optionalRollNumberPrefixSchema,

            rollNumberStartFrom:
                optionalPositiveNumberSchema,

            students: z
                .array(
                    z.object({
                        studentSlug: z
                            .string()
                            .trim()
                            .min(
                                1,
                                "Student slug is required",
                            )
                            .max(
                                50,
                                "Student slug must not exceed 50 characters",
                            ),

                        rollNumber:
                            optionalPositiveNumberSchema,
                    }),
                )
                .min(
                    1,
                    "At least one student is required",
                ),
        })
        .superRefine(
            (data, context) => {
                /*
                |--------------------------------------------------------------------------
                | Section Mapping Validation
                |--------------------------------------------------------------------------
                */

                if (
                    data.mappingType ===
                    "section" &&
                    !data.sectionSlug
                ) {
                    context.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "sectionSlug",
                        ],

                        message:
                            "Section is required",
                    });
                }

                /*
                |--------------------------------------------------------------------------
                | Stream Mapping Validation
                |--------------------------------------------------------------------------
                */

                if (
                    data.mappingType ===
                    "stream" &&
                    !data.streamSlug
                ) {
                    context.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "streamSlug",
                        ],

                        message:
                            "Stream is required",
                    });
                }

                /*
                |--------------------------------------------------------------------------
                | Roll Number Mapping Validation
                |--------------------------------------------------------------------------
                */

                if (
                    data.mappingType ===
                    "rollNumber"
                ) {
                    const hasStartingRollNumber =
                        data.rollNumberStartFrom !==
                        undefined;

                    const everyStudentHasRollNumber =
                        data.students.every(
                            (student) =>
                                student.rollNumber !==
                                undefined,
                        );

                    if (
                        !hasStartingRollNumber &&
                        !everyStudentHasRollNumber
                    ) {
                        context.addIssue({
                            code:
                                z.ZodIssueCode
                                    .custom,

                            path: [
                                "rollNumberStartFrom",
                            ],

                            message:
                                "Starting roll number or individual roll numbers are required",
                        });
                    }
                }
            },
        );

/*
|--------------------------------------------------------------------------
| Update Mapping Schema
|--------------------------------------------------------------------------
|
| Allowed PATCH payloads:
|
| {
|     sectionSlug
| }
|
| {
|     streamSlug
| }
|
| {
|     rollNumberPrefix,
|     rollNumber
| }
|
| Missing fields undefined rahengi, null nahi banengi.
|
*/

export const updateStudentAcademicMappingSchema =
    z
        .object({
            sectionSlug:
                optionalSlugSchema,

            streamSlug:
                optionalSlugSchema,

            rollNumberPrefix:
                optionalRollNumberPrefixSchema,

            rollNumber:
                optionalNullablePositiveNumberSchema,
        })
        .refine(
            (data) =>
                data.sectionSlug !==
                undefined ||
                data.streamSlug !==
                undefined ||
                data.rollNumberPrefix !==
                undefined ||
                data.rollNumber !==
                undefined,
            {
                message:
                    "At least one field is required for update",
            },
        );