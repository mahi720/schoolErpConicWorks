import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Common Validation Helpers
|--------------------------------------------------------------------------
*/

const requiredSlugSchema = (
    message,
) =>
    z
        .string()
        .trim()
        .min(
            1,
            message,
        )
        .max(
            50,
            "Slug must not exceed 50 characters",
        );

/*
|--------------------------------------------------------------------------
| Optional Slug Schema
|--------------------------------------------------------------------------
|
| Frontend forms mein empty value ko undefined rakhenge.
| Isse request payload mein unnecessary null nahi jayega.
|
*/

const optionalSlugSchema = z.preprocess(
    (value) => {
        if (
            value === "" ||
            value === undefined
        ) {
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
        .min(
            1,
            "Invalid slug",
        )
        .max(
            50,
            "Slug must not exceed 50 characters",
        )
        .nullable()
        .optional(),
);

/*
|--------------------------------------------------------------------------
| Optional Prefix Schema
|--------------------------------------------------------------------------
|
| undefined => request mein field nahi jayegi
| null      => explicit clear
|
*/

const optionalPrefixSchema = z.preprocess(
    (value) => {
        if (
            value === "" ||
            value === undefined
        ) {
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
| Optional Positive Integer Schema
|--------------------------------------------------------------------------
*/

const optionalPositiveIntegerSchema =
    z.preprocess(
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
                    "Value must be a valid number",
            })
            .int(
                "Value must be an integer",
            )
            .positive(
                "Value must be greater than zero",
            )
            .optional(),
    );

/*
|--------------------------------------------------------------------------
| Optional Nullable Positive Integer Schema
|--------------------------------------------------------------------------
*/

const optionalNullablePositiveIntegerSchema =
    z.preprocess(
        (value) => {
            if (
                value === "" ||
                value === undefined
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
| Academic Filter Schema
|--------------------------------------------------------------------------
*/

export const academicMappingFilterSchema =
    z.object({
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
    });

/*
|--------------------------------------------------------------------------
| Section Assignment Schema
|--------------------------------------------------------------------------
*/

export const assignSectionSchema =
    z.object({
        sectionSlug:
            requiredSlugSchema(
                "Please select a section",
            ),
    });

/*
|--------------------------------------------------------------------------
| Stream Assignment Schema
|--------------------------------------------------------------------------
*/

export const assignStreamSchema =
    z.object({
        streamSlug:
            requiredSlugSchema(
                "Please select a stream",
            ),
    });

/*
|--------------------------------------------------------------------------
| Bulk Roll Number Assignment Schema
|--------------------------------------------------------------------------
*/

export const assignBulkRollNumberSchema =
    z.object({
        rollNumberPrefix: z
            .string()
            .trim()
            .min(
                1,
                "Roll number prefix is required",
            )
            .max(
                20,
                "Prefix must not exceed 20 characters",
            ),

        rollNumberStartFrom: z
            .string()
            .trim()
            .min(
                1,
                "Starting roll number is required",
            )
            .regex(
                /^\d+$/,
                "Starting roll number must contain only digits",
            )
            .refine(
                (value) =>
                    Number(value) >
                    0,
                {
                    message:
                        "Starting roll number must be greater than 0",
                },
            ),
    });

/*
|--------------------------------------------------------------------------
| Edit Single Roll Number Schema
|--------------------------------------------------------------------------
*/

export const editRollNumberSchema =
    z.object({
        rollNumber: z.preprocess(
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
                    required_error:
                        "Roll number is required",

                    invalid_type_error:
                        "Roll number must be valid",
                })
                .int(
                    "Roll number must be an integer",
                )
                .positive(
                    "Roll number must be greater than zero",
                ),
        ),
    });

/*
|--------------------------------------------------------------------------
| Student Mapping Create Schema
|--------------------------------------------------------------------------
*/

export const studentAcademicMappingSchema =
    z
        .object({
            mappingType: z
                .enum([
                    "section",
                    "stream",
                    "rollNumber",
                    "complete",
                ])
                .default(
                    "complete",
                ),

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
                optionalPrefixSchema,

            rollNumberStartFrom:
                optionalPositiveIntegerSchema,

            students: z
                .array(
                    z.object({
                        studentSlug:
                            requiredSlugSchema(
                                "Student is required",
                            ),

                        mappingSlug: z
                            .string()
                            .trim()
                            .optional(),

                        rollNumber:
                            optionalPositiveIntegerSchema,
                    }),
                )
                .min(
                    1,
                    "Select at least one student",
                ),
        })
        .superRefine(
            (data, context) => {
                /*
                |--------------------------------------------------------------------------
                | Section Validation
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
                            "Please select a section",
                    });
                }

                /*
                |--------------------------------------------------------------------------
                | Stream Validation
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
                            "Please select a stream",
                    });
                }

                /*
                |--------------------------------------------------------------------------
                | Complete Mapping Validation
                |--------------------------------------------------------------------------
                */

                if (
                    data.mappingType ===
                    "complete"
                ) {
                    if (
                        !data.sectionSlug
                    ) {
                        context.addIssue({
                            code:
                                z
                                    .ZodIssueCode
                                    .custom,

                            path: [
                                "sectionSlug",
                            ],

                            message:
                                "Please select a section",
                        });
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Roll Number Validation
                |--------------------------------------------------------------------------
                */

                if (
                    data.mappingType ===
                    "rollNumber" ||
                    data.mappingType ===
                    "complete"
                ) {
                    const hasStartRollNumber =
                        data.rollNumberStartFrom !==
                        undefined;

                    const everyStudentHasRollNumber =
                        data.students.every(
                            (student) =>
                                student.rollNumber !==
                                undefined,
                        );

                    if (
                        !hasStartRollNumber &&
                        !everyStudentHasRollNumber
                    ) {
                        context.addIssue({
                            code:
                                z
                                    .ZodIssueCode
                                    .custom,

                            path: [
                                "rollNumberStartFrom",
                            ],

                            message:
                                "Enter starting roll number or provide individual roll numbers",
                        });
                    }

                    const individualRollNumbers =
                        data.students
                            .map(
                                (
                                    student,
                                ) =>
                                    student.rollNumber,
                            )
                            .filter(
                                (
                                    rollNumber,
                                ) =>
                                    rollNumber !==
                                    undefined,
                            );

                    const uniqueRollNumbers =
                        new Set(
                            individualRollNumbers,
                        );

                    if (
                        uniqueRollNumbers.size !==
                        individualRollNumbers.length
                    ) {
                        context.addIssue({
                            code:
                                z
                                    .ZodIssueCode
                                    .custom,

                            path: [
                                "students",
                            ],

                            message:
                                "Duplicate roll numbers are not allowed",
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
| Missing fields undefined rahengi.
| Sirf payload mein bheji hui fields update hongi.
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
                optionalPrefixSchema,

            rollNumber:
                optionalNullablePositiveIntegerSchema,
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
                    "At least one field is required",
            },
        );