import { z } from "zod";

const structureItemSchema = z.object({
  componentType: z.enum(["EARNING", "DEDUCTION"]),
  earningTypeSlug: z.string().trim().min(1).max(50).nullable().optional(),
  deductionTypeSlug: z.string().trim().min(1).max(50).nullable().optional(),
  calculationType: z.enum(["FIXED", "PERCENT"]),
  value: z.coerce.number().nonnegative(),
  calculationBase: z.enum(["BASIC_PAY", "GROSS_EARNING"]).default("BASIC_PAY"),
  displayOrder: z.coerce.number().int().nonnegative(),
}).superRefine((data, ctx) => {
  if (data.componentType === "EARNING" && !data.earningTypeSlug) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["earningTypeSlug"], message: "Earning type is required" });
  }

  if (data.componentType === "DEDUCTION" && !data.deductionTypeSlug) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["deductionTypeSlug"], message: "Deduction type is required" });
  }
});

export const savePayBandStructureSchema = z.object({
  structures: z.array(structureItemSchema).min(1),
});
