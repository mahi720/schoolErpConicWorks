import { z } from "zod";

export const createEmployeeLetterTypeSchema = z.object({
  letterTypeName: z.string().trim().min(2).max(150),
  letterContent: z.string().trim().min(1),
});

export const updateEmployeeLetterTypeSchema = createEmployeeLetterTypeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
