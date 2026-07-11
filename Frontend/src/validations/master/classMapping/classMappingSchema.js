import { z } from "zod";

export const createClassMappingSchema = z.object({
    session: z.string().min(1, "Session is required"),
    board: z.string().min(1, "Board is required"),
    classTitle: z.string().min(1, "Class is required"),

    sections: z.array(z.string()).optional(),
    streams: z.array(z.string()).optional(),
    classTeachers: z.array(z.string()).optional(),

    startTime: z.string().optional(),
    endTime: z.string().optional(),
    status: z.string().optional(),
});