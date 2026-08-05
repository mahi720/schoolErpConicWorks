import { z } from "zod";

export const createLoanInterestSchema = z.object({
  durationMonths: z.coerce.number().int().positive(),
  annualInterest: z.coerce.number().nonnegative().max(100),
});

export const updateLoanInterestSchema = createLoanInterestSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
