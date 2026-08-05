import { z } from "zod";

export const createAuthorizedPersonSchema = z.object({
  personName: z.string().trim().min(2).max(150),
  designationSlug: z.string().trim().min(1).max(50),
});

export const updateAuthorizedPersonSchema = createAuthorizedPersonSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
