import { z } from "zod";

const termExamMarkStatusSchema = z.enum([
    "PRESENT",
    "ABSENT",
    "EXEMPTED",
    "WITHHELD",
]);

const termExamComponentMarkSchema = z
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
                    .number()
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
                "Component remarks cannot exceed 255 characters",
            )
            .optional()
            .nullable(),
    })
    .superRefine((data, ctx) => {
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
                    "Subject marks configuration slug is required",
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
                    "Term exam timetable slug is required",
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
                    "Obtained marks are required for present component",
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
                    "Obtained marks must be empty when component is not present",
            });
        }
    });

const termExamStudentMarkSchema = z
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
                "Student remarks cannot exceed 500 characters",
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
    .superRefine((data, ctx) => {
        if (
            data.markStatus ===
            "PRESENT"
        ) {
            return;
        }

        data.components.forEach(
            (component, index) => {
                if (
                    component.obtainedMarks !==
                    null &&
                    component.obtainedMarks !==
                    undefined
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
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
    });

export const saveTermExamMarksSchema =
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
                "Class subject slug is required",
            ),

        subjectTitle: z
            .string()
            .trim()
            .min(
                1,
                "Subject is required",
            ),

        studyMode: z.enum([
            "THEORY",
            "PRACTICAL",
            "BOTH",
        ]),

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

        students: z
            .array(
                termExamStudentMarkSchema,
            )
            .min(
                1,
                "At least one student mark is required",
            ),
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
                        .max(500)
                        .optional()
                        .nullable(),

                    components: z
                        .array(
                            z.object({
                                componentMarkSlug:
                                    z
                                        .string()
                                        .trim()
                                        .min(
                                            1,
                                            "Component mark slug is required",
                                        ),

                                obtainedMarks:
                                    z
                                        .union(
                                            [
                                                z.coerce
                                                    .number()
                                                    .min(
                                                        0,
                                                        "Marks cannot be negative",
                                                    ),

                                                z.literal(
                                                    null,
                                                ),
                                            ],
                                        )
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
                                    )
                                    .optional()
                                    .nullable(),
                            }),
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