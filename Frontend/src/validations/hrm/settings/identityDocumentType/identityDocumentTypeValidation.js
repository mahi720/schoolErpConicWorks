import { z } from "zod";


export const identityDocumentTypeSchema = z.object({
  documentName: z.string().trim().min(2, "Document name is required").max(150),
});

export const identityDocumentTypeInitialValues = {
  documentName: "",
};
