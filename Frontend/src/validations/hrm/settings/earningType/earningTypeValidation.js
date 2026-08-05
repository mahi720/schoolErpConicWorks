import { z } from "zod";


export const earningTypeSchema = z.object({
  earningType: z.string().trim().min(1, "Earning type is required").max(100),
  valueType: z.enum(["FIXED", "PERCENT"]),
  value: z.coerce.number().nonnegative("Value cannot be negative"),
});

export const earningTypeInitialValues = {
  earningType: "",
  valueType: "FIXED",
  value: "",
};
