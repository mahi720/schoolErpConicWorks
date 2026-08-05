import { z } from "zod";

export const createIdentityDocumentTypeSchema = z.object({
  documentName: z.string().trim().min(2).max(150),
});

export const updateIdentityDocumentTypeSchema = createIdentityDocumentTypeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
