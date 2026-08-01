import { z } from "zod";

export const termExamMarkStatusSchema =
    z.enum([
        "PRESENT",
        "ABSENT",
        "EXEMPTED",
        "WITHHELD",
    ]);

export const termExamMarkFilterSchema =
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

export const termExamComponentMarkSchema =
    z
        .object({
            componentKey: z
                .string()
                .trim()
                .min(
                    1,
                    "Component key is required",
                ),

            subjectMarksConfigSlug: z
                .string()
                .trim()
                .optional()
                .nullable(),

            termExamTimeTableSlug: z
                .string()
                .trim()
                .optional()
                .nullable(),

            sourceType: z.enum([
                "SUBJECT_MARKS_CONFIG",
                "TERM_EXAM",
            ]),

            obtainedMarks: z
                .union([
                    z.coerce
                        .number({
                            invalid_type_error:
                                "Marks must be a number",
                        })
                        .min(
                            0,
                            "Marks cannot be negative",
                        ),

                    z.literal(null),
                ])
                .optional()
                .nullable(),

            markStatus:
                termExamMarkStatusSchema.default(
                    "PRESENT",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    255,
                    "Remarks cannot exceed 255 characters",
                )
                .optional()
                .nullable(),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.sourceType ===
                    "SUBJECT_MARKS_CONFIG" &&
                    !data.subjectMarksConfigSlug
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "subjectMarksConfigSlug",
                        ],

                        message:
                            "Subject marks configuration is required",
                    });
                }

                if (
                    data.sourceType ===
                    "TERM_EXAM" &&
                    !data.termExamTimeTableSlug
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "termExamTimeTableSlug",
                        ],

                        message:
                            "Term exam timetable is required",
                    });
                }

                if (
                    data.markStatus ===
                    "PRESENT" &&
                    (data.obtainedMarks ===
                        null ||
                        data.obtainedMarks ===
                        undefined)
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "obtainedMarks",
                        ],

                        message:
                            "Marks are required for present component",
                    });
                }

                if (
                    data.markStatus !==
                    "PRESENT" &&
                    data.obtainedMarks !==
                    null &&
                    data.obtainedMarks !==
                    undefined
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "obtainedMarks",
                        ],

                        message:
                            "Marks must be empty when component is not present",
                    });
                }
            },
        );

export const termExamStudentMarkSchema =
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

            markStatus:
                termExamMarkStatusSchema.default(
                    "PRESENT",
                ),

            remarks: z
                .string()
                .trim()
                .max(
                    500,
                    "Remarks cannot exceed 500 characters",
                )
                .optional()
                .nullable(),

            components: z
                .array(
                    termExamComponentMarkSchema,
                )
                .min(
                    1,
                    "At least one marks component is required",
                ),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.markStatus ===
                    "PRESENT"
                ) {
                    return;
                }

                data.components.forEach(
                    (
                        component,
                        index,
                    ) => {
                        if (
                            component.obtainedMarks !==
                            null &&
                            component.obtainedMarks !==
                            undefined
                        ) {
                            ctx.addIssue({
                                code:
                                    z
                                        .ZodIssueCode
                                        .custom,

                                path: [
                                    "components",
                                    index,
                                    "obtainedMarks",
                                ],

                                message:
                                    "Component marks must be empty when student is not present",
                            });
                        }
                    },
                );
            },
        );

export const saveTermExamMarksSchema =
    termExamMarkFilterSchema.extend({
        students: z
            .array(
                termExamStudentMarkSchema,
            )
            .min(
                1,
                "At least one student mark is required",
            ),
    });

export const bulkUpdateTermExamComponentSchema =
    z.object({
        componentMarkSlug: z
            .string()
            .trim()
            .min(
                1,
                "Component mark slug is required",
            ),

        obtainedMarks: z
            .union([
                z.coerce
                    .number({
                        invalid_type_error:
                            "Marks must be a number",
                    })
                    .min(
                        0,
                        "Marks cannot be negative",
                    ),

                z.literal(null),
            ])
            .optional()
            .nullable(),

        markStatus:
            termExamMarkStatusSchema.default(
                "PRESENT",
            ),

        remarks: z
            .string()
            .trim()
            .max(
                255,
                "Remarks cannot exceed 255 characters",
            )
            .optional()
            .nullable(),
    });

export const bulkUpdateTermExamMarksSchema =
    z.object({
        students: z
            .array(
                z.object({
                    studentMarkSlug: z
                        .string()
                        .trim()
                        .min(
                            1,
                            "Student mark slug is required",
                        ),

                    markStatus:
                        termExamMarkStatusSchema.default(
                            "PRESENT",
                        ),

                    remarks: z
                        .string()
                        .trim()
                        .max(
                            500,
                            "Remarks cannot exceed 500 characters",
                        )
                        .optional()
                        .nullable(),

                    components: z
                        .array(
                            bulkUpdateTermExamComponentSchema,
                        )
                        .min(
                            1,
                            "At least one component mark is required",
                        ),
                }),
            )
            .min(
                1,
                "At least one student mark is required",
            ),
    });

export const unlockTermExamMarksSchema =
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

export const termExamAuditLogFilterSchema =
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
                "SAVE_MARKS",
                "UPDATE_MARKS",
                "BULK_UPDATE_MARKS",
                "SAVE_COMPONENT_MARK",
                "UPDATE_COMPONENT_MARK",
                "MARK_PRESENT",
                "MARK_ABSENT",
                "MARK_EXEMPTED",
                "MARK_WITHHELD",
                "LOCK_MARKS",
                "UNLOCK_MARKS",
                "DELETE_MARKS",
                "RESTORE_MARKS",
                "VIEW_MARKS",
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

const getFirstZodMessage = (
    error,
) => {
    return (
        error?.issues?.[0]?.message ||
        "Validation failed"
    );
};

export const validateTermExamMarkFilters =
    (filters) => {
        const result =
            termExamMarkFilterSchema.safeParse(
                filters,
            );

        if (!result.success) {
            return {
                success: false,
                message:
                    getFirstZodMessage(
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

export const validateSaveTermExamMarks =
    (payload) => {
        const result =
            saveTermExamMarksSchema.safeParse(
                payload,
            );

        if (!result.success) {
            return {
                success: false,
                message:
                    getFirstZodMessage(
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

export const validateBulkUpdateTermExamMarks =
    (payload) => {
        const result =
            bulkUpdateTermExamMarksSchema.safeParse(
                payload,
            );

        if (!result.success) {
            return {
                success: false,
                message:
                    getFirstZodMessage(
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

export const validateUnlockTermExamMarks =
    (payload) => {
        const result =
            unlockTermExamMarksSchema.safeParse(
                payload,
            );

        if (!result.success) {
            return {
                success: false,
                message:
                    getFirstZodMessage(
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