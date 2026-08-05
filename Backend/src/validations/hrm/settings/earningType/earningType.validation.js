import { z } from "zod";

export const createEarningTypeSchema = z.object({
  earningType: z.string().trim().min(1).max(100),
  valueType: z.enum(["FIXED", "PERCENT"]),
  value: z.coerce.number().nonnegative(),
});

export const updateEarningTypeSchema = createEarningTypeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
