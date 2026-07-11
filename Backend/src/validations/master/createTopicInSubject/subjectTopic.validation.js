import { z } from "zod";

export const createSubjectTopicSchema = z.object({
    addedSubjectToClassSlug: z
        .string()
        .trim()
        .min(1, "Mapped class subject is required"),

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

    status: z.enum(["active", "inactive"]).optional(),
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

    status: z.enum(["active", "inactive"]).optional(),
});

export const getSubjectTopicsQuerySchema = z.object({
    addedSubjectToClassSlug: z
        .string()
        .trim()
        .min(1, "Mapped class subject is required"),

    status: z.enum(["active", "inactive", "all"]).optional(),
});