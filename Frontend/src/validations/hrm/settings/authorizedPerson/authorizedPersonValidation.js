import { z } from "zod";


export const authorizedPersonSchema = z.object({
  personName: z.string().trim().min(2, "Person name is required").max(150),
  designationSlug: z.string().trim().min(1, "Designation is required"),
});

export const authorizedPersonInitialValues = {
  personName: "",
  designationSlug: "",
};
