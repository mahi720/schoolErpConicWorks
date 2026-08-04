import { z } from "zod";

export const topicWiseGradeSchema =
    z.enum([
        "A_PLUS",
        "A",
        "B_PLUS",
        "B",
        "C_PLUS",
        "C",
        "D_PLUS",
        "D",
        "E_PLUS",
        "E",
        "NEEDS_IMPROVEMENT",
        "NOT_ASSESSED",
    ]);

export const topicWiseAssessmentStatusSchema =
    z.enum([
        "ASSESSED",
        "ABSENT",
        "EXEMPTED",
        "NOT_ASSESSED",
    ]);

export const topicWiseGradeFilterSchema =
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

        termExamTitle: z
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

        classSubjectSlug: z
            .string()
            .trim()
            .min(
                1,
                "Subject is required",
            ),

        subjectTitle: z
            .string()
            .trim()
            .min(
                1,
                "Subject is required",
            ),

        studyMode: z.enum(
            [
                "THEORY",
                "PRACTICAL",
                "BOTH",
            ],
            {
                required_error:
                    "Study mode is required",
            },
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

export const topicWiseStudentTopicGradeSchema =
    z
        .object({
            subjectTopicSlug: z
                .string()
                .trim()
                .min(
                    1,
                    "Subject topic slug is required",
                ),

            grade: topicWiseGradeSchema
                .optional()
                .nullable(),

            assessmentStatus:
                topicWiseAssessmentStatusSchema.default(
                    "ASSESSED",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    500,
                    "Topic remarks cannot exceed 500 characters",
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
                            "Grade is required for assessed topic",
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
                            "Grade must be empty when topic is not assessed",
                    });
                }
            },
        );

export const topicWiseStudentGradeSchema =
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
                topicWiseAssessmentStatusSchema.default(
                    "ASSESSED",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    500,
                    "Student remarks cannot exceed 500 characters",
                )
                .optional()
                .nullable(),

            topicGrades: z
                .array(
                    topicWiseStudentTopicGradeSchema,
                )
                .min(
                    1,
                    "At least one topic grade is required",
                ),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.overallStatus ===
                    "ASSESSED"
                ) {
                    return;
                }

                data.topicGrades.forEach(
                    (
                        topic,
                        index,
                    ) => {
                        if (
                            topic.grade !==
                            null &&
                            topic.grade !==
                            undefined
                        ) {
                            ctx.addIssue({
                                code:
                                    z
                                        .ZodIssueCode
                                        .custom,

                                path: [
                                    "topicGrades",
                                    index,
                                    "grade",
                                ],

                                message:
                                    "Topic grade must be empty when student is not assessed",
                            });
                        }
                    },
                );
            },
        );

export const saveTopicWiseGradesSchema =
    topicWiseGradeFilterSchema.extend({
        students: z
            .array(
                topicWiseStudentGradeSchema,
            )
            .min(
                1,
                "At least one student grade is required",
            ),
    });

export const bulkUpdateTopicWiseTopicGradeSchema =
    z
        .object({
            studentTopicGradeSlug: z
                .string()
                .trim()
                .min(
                    1,
                    "Student topic grade slug is required",
                ),

            grade: topicWiseGradeSchema
                .optional()
                .nullable(),

            assessmentStatus:
                topicWiseAssessmentStatusSchema.default(
                    "ASSESSED",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    500,
                    "Topic remarks cannot exceed 500 characters",
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
                            "Grade is required for assessed topic",
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
                            "Grade must be empty when topic is not assessed",
                    });
                }
            },
        );

export const bulkUpdateTopicWiseGradesSchema =
    z.object({
        students: z
            .array(
                z.object({
                    studentGradeSlug: z
                        .string()
                        .trim()
                        .min(
                            1,
                            "Student grade slug is required",
                        ),

                    overallStatus:
                        topicWiseAssessmentStatusSchema.default(
                            "ASSESSED",
                        ),

                    remarks: z
                        .string()
                        .trim()
                        .max(
                            500,
                            "Student remarks cannot exceed 500 characters",
                        )
                        .optional()
                        .nullable(),

                    topicGrades: z
                        .array(
                            bulkUpdateTopicWiseTopicGradeSchema,
                        )
                        .min(
                            1,
                            "At least one topic grade is required",
                        ),
                }),
            )
            .min(
                1,
                "At least one student grade is required",
            ),
    });

export const unlockTopicWiseGradesSchema =
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

export const topicWiseGradeAuditFilterSchema =
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
                "SAVE_TOPIC_GRADE",
                "UPDATE_TOPIC_GRADE",
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

export const validateTopicWiseGradeFilters =
    (filters) => {
        const result =
            topicWiseGradeFilterSchema.safeParse(
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

export const validateSaveTopicWiseGrades =
    (payload) => {
        const result =
            saveTopicWiseGradesSchema.safeParse(
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

export const validateBulkUpdateTopicWiseGrades =
    (payload) => {
        const result =
            bulkUpdateTopicWiseGradesSchema.safeParse(
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

export const validateUnlockTopicWiseGrades =
    (payload) => {
        const result =
            unlockTopicWiseGradesSchema.safeParse(
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