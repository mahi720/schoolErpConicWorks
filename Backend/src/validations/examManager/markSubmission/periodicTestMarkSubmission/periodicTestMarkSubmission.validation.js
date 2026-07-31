import { z } from "zod";

const markStatusSchema = z.enum([
    "PRESENT",
    "ABSENT",
    "EXEMPTED",
    "WITHHELD",
]);

const studentMarkSchema = z
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
            markStatusSchema.default(
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
    .superRefine((data, ctx) => {
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
                    "Obtained marks are required for present student",
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
                    "Obtained marks must be empty when student is not present",
            });
        }
    });

export const periodicTestMarkFilterSchema =
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

        periodicTestTitle: z
            .string()
            .trim()
            .min(
                1,
                "Periodic test is required",
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
            .uuid(
                "Invalid class subject slug",
            ),

        subjectTitle: z
            .string()
            .trim()
            .min(
                1,
                "Subject is required",
            ),

        studyMode: z
            .enum([
                "THEORY",
                "PRACTICAL",
                "BOTH",
            ])
            .optional(),

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

export const savePeriodicTestMarksSchema =
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

        periodicTestTitle: z
            .string()
            .trim()
            .min(
                1,
                "Periodic test is required",
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
            .uuid(
                "Invalid class subject slug",
            ),

        subjectTitle: z
            .string()
            .trim()
            .min(
                1,
                "Subject is required",
            ),

        studyMode: z
            .enum([
                "THEORY",
                "PRACTICAL",
                "BOTH",
            ])
            .optional(),

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
                studentMarkSchema,
            )
            .min(
                1,
                "At least one student mark is required",
            ),
    });

export const bulkUpdatePeriodicTestMarksSchema =
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

                    obtainedMarks: z
                        .union([
                            z.coerce
                                .number()
                                .min(
                                    0,
                                    "Marks cannot be negative",
                                ),
                            z.literal(
                                null,
                            ),
                        ])
                        .optional()
                        .nullable(),

                    markStatus:
                        markStatusSchema.default(
                            "PRESENT",
                        ),

                    remarks: z
                        .string()
                        .trim()
                        .max(255)
                        .optional()
                        .nullable(),
                }),
            )
            .min(
                1,
                "At least one student mark is required",
            ),
    });

export const unlockPeriodicTestMarksSchema =
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

export const markAuditLogFilterSchema =
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
                "MARK_PRESENT",
                "MARK_ABSENT",
                "LOCK_MARKS",
                "UNLOCK_MARKS",
                "DELETE_MARKS",
                "RESTORE_MARKS",
                "GENERATE_PDF",
                "VIEW_MARKS",
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