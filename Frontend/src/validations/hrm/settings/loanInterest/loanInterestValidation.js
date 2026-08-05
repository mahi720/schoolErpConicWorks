import { z } from "zod";


export const loanInterestSchema = z.object({
  durationMonths: z.coerce.number().int("Duration must be an integer").positive("Duration is required"),
  annualInterest: z.coerce.number().nonnegative("Annual interest cannot be negative").max(100, "Annual interest cannot exceed 100"),
});

export const loanInterestInitialValues = {
  durationMonths: "",
  annualInterest: "",
};
