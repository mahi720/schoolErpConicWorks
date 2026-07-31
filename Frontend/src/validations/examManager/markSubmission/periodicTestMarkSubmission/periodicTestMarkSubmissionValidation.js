import { z } from "zod";

export const periodicTestMarkStatusOptions = [
    {
        label: "Present",
        value: "PRESENT",
    },
    {
        label: "Absent",
        value: "ABSENT",
    },
    {
        label: "Exempted",
        value: "EXEMPTED",
    },
    {
        label: "Withheld",
        value: "WITHHELD",
    },
];

export const periodicTestMarkFilterSchema = z.object({
    academicYear: z
        .string()
        .trim()
        .min(1, "Academic year is required"),

    board: z
        .string()
        .trim()
        .min(1, "Board is required"),

    periodicTestTitle: z
        .string()
        .trim()
        .min(1, "Periodic test is required"),

    classTitle: z
        .string()
        .trim()
        .min(1, "Class is required"),

    subjectTitle: z
        .string()
        .trim()
        .min(1, "Subject is required"),

    studyMode: z
        .enum(["THEORY", "PRACTICAL", "BOTH"])
        .optional()
        .or(z.literal("")),

    section: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    stream: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),
});

const periodicTestStudentMarkBaseSchema = z.object({
    studentSlug: z
        .string()
        .trim()
        .min(1, "Student slug is required"),

    academicMappingSlug: z
        .string()
        .trim()
        .min(1, "Academic mapping slug is required"),

    studentName: z
        .string()
        .trim()
        .optional(),

    obtainedMarks: z
        .union([
            z.string(),
            z.number(),
            z.null(),
        ])
        .optional()
        .nullable(),

    markStatus: z.enum([
        "PRESENT",
        "ABSENT",
        "EXEMPTED",
        "WITHHELD",
    ]),

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

const validatePeriodicTestStudentMark = (
    data,
    ctx,
) => {
    const studentName =
        data.studentName || "Student";

    if (data.markStatus === "PRESENT") {
        if (
            data.obtainedMarks === "" ||
            data.obtainedMarks === null ||
            data.obtainedMarks === undefined
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["obtainedMarks"],
                message: `${studentName} marks are required`,
            });

            return;
        }

        const marks = Number(
            data.obtainedMarks,
        );

        if (Number.isNaN(marks)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["obtainedMarks"],
                message: `${studentName} marks must be a number`,
            });

            return;
        }

        if (marks < 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["obtainedMarks"],
                message: `${studentName} marks cannot be negative`,
            });
        }
    }

    if (
        data.markStatus !== "PRESENT" &&
        data.obtainedMarks !== "" &&
        data.obtainedMarks !== null &&
        data.obtainedMarks !== undefined
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["obtainedMarks"],
            message: `${studentName} marks must be empty for ${data.markStatus.toLowerCase()} status`,
        });
    }
};

const periodicTestStudentMarkSchema =
    periodicTestStudentMarkBaseSchema.superRefine(
        validatePeriodicTestStudentMark,
    );

const periodicTestStudentMarkUpdateSchema =
    periodicTestStudentMarkBaseSchema
        .extend({
            studentMarkSlug: z
                .string()
                .trim()
                .min(
                    1,
                    "Student mark slug is required",
                ),
        })
        .superRefine(
            validatePeriodicTestStudentMark,
        );

export const createPeriodicTestMarkSubmissionSchema =
    z
        .object({
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
                .min(1, "Board is required"),

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
                .min(1, "Class is required"),

            subjectTitle: z
                .string()
                .trim()
                .min(1, "Subject is required"),

            studyMode: z
                .enum([
                    "THEORY",
                    "PRACTICAL",
                    "BOTH",
                ])
                .optional()
                .or(z.literal("")),

            section: z
                .string()
                .trim()
                .optional()
                .or(z.literal("")),

            stream: z
                .string()
                .trim()
                .optional()
                .or(z.literal("")),

            maxMarks: z.coerce
                .number()
                .positive(
                    "Maximum marks must be greater than zero",
                ),

            students: z
                .array(periodicTestStudentMarkSchema)
                .min(
                    1,
                    "At least one student is required",
                ),
        })
        .superRefine((data, ctx) => {
            data.students.forEach(
                (student, index) => {
                    if (
                        student.markStatus !==
                        "PRESENT"
                    ) {
                        return;
                    }

                    if (
                        student.obtainedMarks ===
                        "" ||
                        student.obtainedMarks ===
                        null ||
                        student.obtainedMarks ===
                        undefined
                    ) {
                        return;
                    }

                    const obtainedMarks = Number(
                        student.obtainedMarks,
                    );

                    if (
                        !Number.isNaN(
                            obtainedMarks,
                        ) &&
                        obtainedMarks >
                        data.maxMarks
                    ) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            path: [
                                "students",
                                index,
                                "obtainedMarks",
                            ],
                            message: `${student.studentName || "Student"} marks cannot exceed ${data.maxMarks}`,
                        });
                    }
                },
            );
        });

export const updatePeriodicTestMarksSchema =
    z
        .object({
            maxMarks: z.coerce
                .number()
                .positive(
                    "Maximum marks must be greater than zero",
                ),

            students: z
                .array(
                    periodicTestStudentMarkUpdateSchema,
                )
                .min(
                    1,
                    "At least one student mark is required",
                ),
        })
        .superRefine((data, ctx) => {
            data.students.forEach(
                (student, index) => {
                    if (
                        student.markStatus !==
                        "PRESENT"
                    ) {
                        return;
                    }

                    if (
                        student.obtainedMarks ===
                        "" ||
                        student.obtainedMarks ===
                        null ||
                        student.obtainedMarks ===
                        undefined
                    ) {
                        return;
                    }

                    const obtainedMarks = Number(
                        student.obtainedMarks,
                    );

                    if (
                        !Number.isNaN(
                            obtainedMarks,
                        ) &&
                        obtainedMarks >
                        data.maxMarks
                    ) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            path: [
                                "students",
                                index,
                                "obtainedMarks",
                            ],
                            message: `${student.studentName || "Student"} marks cannot exceed ${data.maxMarks}`,
                        });
                    }
                },
            );
        });

export const unlockPeriodicTestMarksSchema =
    z.object({
        remarks: z
            .string()
            .trim()
            .min(
                1,
                "Unlock reason is required",
            )
            .max(
                500,
                "Unlock reason cannot exceed 500 characters",
            ),
    });

export const validatePeriodicTestMarkFilters = (
    filters,
) => {
    return periodicTestMarkFilterSchema.safeParse(
        filters,
    );
};

export const validatePeriodicTestMarks = ({
    filters,
    students,
    maxMarks,
}) => {
    return createPeriodicTestMarkSubmissionSchema.safeParse(
        {
            ...filters,
            maxMarks,
            students,
        },
    );
};

export const validatePeriodicTestMarkUpdate = ({
    students,
    maxMarks,
}) => {
    return updatePeriodicTestMarksSchema.safeParse(
        {
            maxMarks,
            students,
        },
    );
};