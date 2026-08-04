import { z } from "zod";

export const coScholasticGradeSchema =
    z.enum([
        "A_PLUS",
        "A",
        "B_PLUS",
        "B",
        "C_PLUS",
        "C",
        "D_PLUS",
        "D",
        "E",
        "NEEDS_IMPROVEMENT",
        "NOT_ASSESSED",
    ]);

export const coScholasticAssessmentStatusSchema =
    z.enum([
        "ASSESSED",
        "ABSENT",
        "EXEMPTED",
        "NOT_ASSESSED",
    ]);

export const coScholasticStudentResultSchema =
    z.enum([
        "PASS",
        "FAIL",
        "PROMOTED",
        "DETAINED",
        "NOT_DECLARED",
    ]);

export const coScholasticGradeFilterSchema =
    z.object({
        academicYear: z
            .string()
            .trim()
            .min(
                1,
                "Academic year is required",
            ),

        board: z
            .string()
            .trim()
            .min(
                1,
                "Board is required",
            ),

        termExamSlug: z
            .string()
            .trim()
            .min(
                1,
                "Term exam is required",
            ),

        classTitle: z
            .string()
            .trim()
            .min(
                1,
                "Class is required",
            ),

        section: z
            .string()
            .trim()
            .optional()
            .nullable(),

        stream: z
            .string()
            .trim()
            .optional()
            .nullable(),
    });

export const coScholasticSubjectGradeSchema =
    z
        .object({
            classSubjectSlug: z
                .string()
                .trim()
                .min(
                    1,
                    "Class subject slug is required",
                ),

            grade:
                coScholasticGradeSchema
                    .optional()
                    .nullable(),

            assessmentStatus:
                coScholasticAssessmentStatusSchema.default(
                    "ASSESSED",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    500,
                    "Subject remarks cannot exceed 500 characters",
                )
                .optional()
                .nullable(),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.assessmentStatus ===
                    "ASSESSED" &&
                    !data.grade
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "grade",
                        ],

                        message:
                            "Grade is required for assessed subject",
                    });
                }

                if (
                    data.assessmentStatus !==
                    "ASSESSED" &&
                    data.grade !== null &&
                    data.grade !==
                    undefined
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "grade",
                        ],

                        message:
                            "Grade must be empty when subject is not assessed",
                    });
                }
            },
        );

export const coScholasticStudentGradeSchema =
    z
        .object({
            studentSlug: z
                .string()
                .trim()
                .min(
                    1,
                    "Student slug is required",
                ),

            academicMappingSlug: z
                .string()
                .trim()
                .min(
                    1,
                    "Academic mapping slug is required",
                ),

            overallStatus:
                coScholasticAssessmentStatusSchema.default(
                    "ASSESSED",
                ),

            remarkType: z
                .string()
                .trim()
                .max(
                    100,
                    "Remark type cannot exceed 100 characters",
                )
                .optional()
                .nullable(),

            remark: z
                .string()
                .trim()
                .max(
                    1000,
                    "Remark cannot exceed 1000 characters",
                )
                .optional()
                .nullable(),

            presentDays: z
                .union([
                    z.coerce
                        .number()
                        .int()
                        .min(
                            0,
                            "Present days cannot be negative",
                        ),

                    z.literal(null),
                ])
                .optional()
                .nullable(),

            totalDays: z
                .union([
                    z.coerce
                        .number()
                        .int()
                        .min(
                            0,
                            "Total days cannot be negative",
                        ),

                    z.literal(null),
                ])
                .optional()
                .nullable(),

            result:
                coScholasticStudentResultSchema.default(
                    "NOT_DECLARED",
                ),

            subjectGrades: z
                .array(
                    coScholasticSubjectGradeSchema,
                )
                .min(
                    1,
                    "At least one subject grade is required",
                ),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.presentDays !==
                    null &&
                    data.presentDays !==
                    undefined &&
                    data.totalDays !==
                    null &&
                    data.totalDays !==
                    undefined &&
                    data.presentDays >
                    data.totalDays
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "presentDays",
                        ],

                        message:
                            "Present days cannot exceed total days",
                    });
                }

                if (
                    data.overallStatus ===
                    "ASSESSED"
                ) {
                    return;
                }

                data.subjectGrades.forEach(
                    (
                        subject,
                        index,
                    ) => {
                        if (
                            subject.grade !==
                            null &&
                            subject.grade !==
                            undefined
                        ) {
                            ctx.addIssue({
                                code:
                                    z
                                        .ZodIssueCode
                                        .custom,

                                path: [
                                    "subjectGrades",
                                    index,
                                    "grade",
                                ],

                                message:
                                    "Subject grade must be empty when student is not assessed",
                            });
                        }
                    },
                );
            },
        );

export const saveCoScholasticGradesSchema =
    coScholasticGradeFilterSchema.extend({
        students: z
            .array(
                coScholasticStudentGradeSchema,
            )
            .min(
                1,
                "At least one student grade is required",
            ),
    });

export const bulkUpdateCoScholasticSubjectGradeSchema =
    z
        .object({
            studentSubjectGradeSlug: z
                .string()
                .trim()
                .min(
                    1,
                    "Student subject grade slug is required",
                ),

            grade:
                coScholasticGradeSchema
                    .optional()
                    .nullable(),

            assessmentStatus:
                coScholasticAssessmentStatusSchema.default(
                    "ASSESSED",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    500,
                    "Subject remarks cannot exceed 500 characters",
                )
                .optional()
                .nullable(),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.assessmentStatus ===
                    "ASSESSED" &&
                    !data.grade
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "grade",
                        ],

                        message:
                            "Grade is required for assessed subject",
                    });
                }

                if (
                    data.assessmentStatus !==
                    "ASSESSED" &&
                    data.grade !== null &&
                    data.grade !==
                    undefined
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "grade",
                        ],

                        message:
                            "Grade must be empty when subject is not assessed",
                    });
                }
            },
        );

export const bulkUpdateCoScholasticGradesSchema =
    z.object({
        students: z
            .array(
                z
                    .object({
                        studentGradeSlug: z
                            .string()
                            .trim()
                            .min(
                                1,
                                "Student grade slug is required",
                            ),

                        overallStatus:
                            coScholasticAssessmentStatusSchema.default(
                                "ASSESSED",
                            ),

                        remarkType: z
                            .string()
                            .trim()
                            .max(
                                100,
                                "Remark type cannot exceed 100 characters",
                            )
                            .optional()
                            .nullable(),

                        remark: z
                            .string()
                            .trim()
                            .max(
                                1000,
                                "Remark cannot exceed 1000 characters",
                            )
                            .optional()
                            .nullable(),

                        presentDays: z
                            .union([
                                z.coerce
                                    .number()
                                    .int()
                                    .min(0),

                                z.literal(
                                    null,
                                ),
                            ])
                            .optional()
                            .nullable(),

                        totalDays: z
                            .union([
                                z.coerce
                                    .number()
                                    .int()
                                    .min(0),

                                z.literal(
                                    null,
                                ),
                            ])
                            .optional()
                            .nullable(),

                        result:
                            coScholasticStudentResultSchema.default(
                                "NOT_DECLARED",
                            ),

                        subjectGrades: z
                            .array(
                                bulkUpdateCoScholasticSubjectGradeSchema,
                            )
                            .min(
                                1,
                                "At least one subject grade is required",
                            ),
                    })
                    .superRefine(
                        (
                            data,
                            ctx,
                        ) => {
                            if (
                                data.presentDays !==
                                null &&
                                data.presentDays !==
                                undefined &&
                                data.totalDays !==
                                null &&
                                data.totalDays !==
                                undefined &&
                                data.presentDays >
                                data.totalDays
                            ) {
                                ctx.addIssue(
                                    {
                                        code:
                                            z
                                                .ZodIssueCode
                                                .custom,

                                        path: [
                                            "presentDays",
                                        ],

                                        message:
                                            "Present days cannot exceed total days",
                                    },
                                );
                            }
                        },
                    ),
            )
            .min(
                1,
                "At least one student grade is required",
            ),
    });

export const unlockCoScholasticGradesSchema =
    z.object({
        remarks: z
            .string()
            .trim()
            .min(
                1,
                "Unlock remarks are required",
            )
            .max(
                500,
                "Remarks cannot exceed 500 characters",
            ),
    });

export const coScholasticAuditFilterSchema =
    z.object({
        submissionSlug: z
            .string()
            .trim()
            .optional(),

        studentSlug: z
            .string()
            .trim()
            .optional(),

        action: z
            .enum([
                "CREATE_SUBMISSION",
                "SAVE_GRADES",
                "UPDATE_GRADES",
                "BULK_UPDATE_GRADES",
                "SAVE_SUBJECT_GRADE",
                "UPDATE_SUBJECT_GRADE",
                "SAVE_REMARK",
                "UPDATE_REMARK",
                "UPDATE_ATTENDANCE_SUMMARY",
                "UPDATE_RESULT",
                "MARK_ASSESSED",
                "MARK_ABSENT",
                "MARK_EXEMPTED",
                "MARK_NOT_ASSESSED",
                "LOCK_GRADES",
                "UNLOCK_GRADES",
                "DELETE_GRADES",
                "RESTORE_GRADES",
                "VIEW_GRADES",
                "GENERATE_PDF",
            ])
            .optional(),

        result: z
            .enum([
                "SUCCESS",
                "FAILED",
            ])
            .optional(),

        page: z.coerce
            .number()
            .int()
            .positive()
            .default(1),

        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(20),
    });

const getFirstValidationMessage = (
    error,
) => {
    return (
        error?.issues?.[0]
            ?.message ||
        "Validation failed"
    );
};

export const validateCoScholasticFilters =
    (filters) => {
        const result =
            coScholasticGradeFilterSchema.safeParse(
                filters,
            );

        if (!result.success) {
            return {
                success: false,

                message:
                    getFirstValidationMessage(
                        result.error,
                    ),

                errors:
                    result.error.flatten(),
            };
        }

        return {
            success: true,
            data: result.data,
            errors: null,
        };
    };

export const validateSaveCoScholasticGrades =
    (payload) => {
        const result =
            saveCoScholasticGradesSchema.safeParse(
                payload,
            );

        if (!result.success) {
            return {
                success: false,

                message:
                    getFirstValidationMessage(
                        result.error,
                    ),

                errors:
                    result.error.flatten(),
            };
        }

        return {
            success: true,
            data: result.data,
            errors: null,
        };
    };

export const validateBulkUpdateCoScholasticGrades =
    (payload) => {
        const result =
            bulkUpdateCoScholasticGradesSchema.safeParse(
                payload,
            );

        if (!result.success) {
            return {
                success: false,

                message:
                    getFirstValidationMessage(
                        result.error,
                    ),

                errors:
                    result.error.flatten(),
            };
        }

        return {
            success: true,
            data: result.data,
            errors: null,
        };
    };

export const validateUnlockCoScholasticGrades =
    (payload) => {
        const result =
            unlockCoScholasticGradesSchema.safeParse(
                payload,
            );

        if (!result.success) {
            return {
                success: false,

                message:
                    getFirstValidationMessage(
                        result.error,
                    ),

                errors:
                    result.error.flatten(),
            };
        }

        return {
            success: true,
            data: result.data,
            errors: null,
        };
    };