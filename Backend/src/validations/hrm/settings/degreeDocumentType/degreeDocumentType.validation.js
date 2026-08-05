import { z } from "zod";

export const createDegreeDocumentTypeSchema = z.object({
  documentName: z.string().trim().min(2).max(150),
});

export const updateDegreeDocumentTypeSchema = createDegreeDocumentTypeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
