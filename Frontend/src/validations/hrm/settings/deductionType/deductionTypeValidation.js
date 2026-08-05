import { z } from "zod";


export const deductionTypeSchema = z
  .object({
    deductionType: z.string().trim().min(1, "Deduction type is required").max(100),
    valueType: z.enum(["FIXED", "PERCENT"]),
    value: z.coerce.number().nonnegative("Value cannot be negative"),
    maximumValue: z.union([
      z.literal(""),
      z.coerce.number().nonnegative("Maximum value cannot be negative"),
      z.null(),
    ]).optional(),
  })
  .transform((data) => ({
    ...data,
    maximumValue:
      data.valueType === "PERCENT" && data.maximumValue !== ""
        ? data.maximumValue
        : null,
  }));

export const deductionTypeInitialValues = {
  deductionType: "",
  valueType: "FIXED",
  value: "",
  maximumValue: "",
};
