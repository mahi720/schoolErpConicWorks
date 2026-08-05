import { z } from "zod";

export const createDeductionTypeSchema = z.object({
  deductionType: z.string().trim().min(1).max(100),
  valueType: z.enum(["FIXED", "PERCENT"]),
  value: z.coerce.number().nonnegative(),
  maximumValue: z.coerce.number().nonnegative().nullable().optional(),
});

export const updateDeductionTypeSchema = createDeductionTypeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
