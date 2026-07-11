import { z } from "zod";

export const subjectTopicSchema = z.object({
    topicTitle: z
        .string()
        .trim()
        .min(1, "Topic title is required")
        .max(200, "Topic title is too long"),

    topicGroup: z
        .string()
        .trim()
        .min(1, "Topic group is required")
        .max(200, "Topic group is too long"),
});

export const updateSubjectTopicSchema = z.object({
    topicTitle: z
        .string()
        .trim()
        .min(1, "Topic title is required")
        .max(200, "Topic title is too long")
        .optional(),

    topicGroup: z
        .string()
        .trim()
        .min(1, "Topic group is required")
        .max(200, "Topic group is too long")
        .optional(),

    status: z
        .enum(["active", "inactive"])
        .optional(),
});