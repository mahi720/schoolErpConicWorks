import { z } from "zod";

const gradeSchema = z.enum([
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

const assessmentStatusSchema = z.enum([
    "ASSESSED",
    "ABSENT",
    "EXEMPTED",
    "NOT_ASSESSED",
]);

const topicGradeSchema = z
    .object({
        subjectTopicSlug: z.string().trim().min(1, "Subject topic slug is required"),
        grade: gradeSchema.optional().nullable(),
        assessmentStatus: assessmentStatusSchema.default("ASSESSED"),
        remarks: z.string().trim().max(500).optional().nullable(),
    })
    .superRefine((data, ctx) => {
        if (data.assessmentStatus === "ASSESSED" && !data.grade) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["grade"],
                message: "Grade is required for assessed topic",
            });
        }

        if (
            data.assessmentStatus !== "ASSESSED" &&
            data.grade !== null &&
            data.grade !== undefined
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["grade"],
                message: "Grade must be empty when topic is not assessed",
            });
        }
    });

const studentGradeSchema = z.object({
    studentSlug: z.string().trim().min(1, "Student slug is required"),
    academicMappingSlug: z.string().trim().min(1, "Academic mapping slug is required"),
    overallStatus: assessmentStatusSchema.default("ASSESSED"),
    remarks: z.string().trim().max(500).optional().nullable(),
    topicGrades: z.array(topicGradeSchema).min(1, "At least one topic grade is required"),
});

export const saveTopicWiseGradesSchema = z.object({
    academicYear: z.string().trim().min(1, "Academic year is required"),
    board: z.string().trim().min(1, "Board is required"),
    termExamTitle: z.string().trim().min(1, "Term exam is required"),
    classTitle: z.string().trim().min(1, "Class is required"),
    classSubjectSlug: z.string().trim().min(1, "Class subject slug is required"),
    subjectTitle: z.string().trim().min(1, "Subject is required"),
    studyMode: z.enum(["THEORY", "PRACTICAL", "BOTH"]),
    section: z.string().trim().optional().nullable(),
    stream: z.string().trim().optional().nullable(),
    students: z.array(studentGradeSchema).min(1, "At least one student grade is required"),
});

export const bulkUpdateTopicWiseGradesSchema = z.object({
    students: z.array(
        z.object({
            studentGradeSlug: z.string().trim().min(1, "Student grade slug is required"),
            overallStatus: assessmentStatusSchema.default("ASSESSED"),
            remarks: z.string().trim().max(500).optional().nullable(),
            topicGrades: z.array(
                z.object({
                    studentTopicGradeSlug: z.string().trim().min(1, "Student topic grade slug is required"),
                    grade: gradeSchema.optional().nullable(),
                    assessmentStatus: assessmentStatusSchema.default("ASSESSED"),
                    remarks: z.string().trim().max(500).optional().nullable(),
                }),
            ).min(1, "At least one topic grade is required"),
        }),
    ).min(1, "At least one student grade is required"),
});

export const unlockTopicWiseGradesSchema = z.object({
    remarks: z.string().trim().min(1, "Unlock remarks are required").max(500),
});
