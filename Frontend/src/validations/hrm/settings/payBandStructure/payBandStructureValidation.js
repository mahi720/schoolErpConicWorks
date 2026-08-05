import { z } from "zod";

const structureItemSchema = z
  .object({
    componentType: z.enum(["EARNING", "DEDUCTION"]),
    earningTypeSlug: z.string().trim().nullable().optional(),
    deductionTypeSlug: z.string().trim().nullable().optional(),
    calculationType: z.enum(["FIXED", "PERCENT"]),
    value: z.coerce.number().nonnegative("Value cannot be negative"),
    calculationBase: z
      .enum(["BASIC_PAY", "GROSS_EARNING", "CUSTOM"])
      .default("BASIC_PAY"),
    displayOrder: z.coerce.number().int().nonnegative(),
  })
  .superRefine((data, context) => {
    if (data.componentType === "EARNING" && !data.earningTypeSlug) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["earningTypeSlug"],
        message: "Earning type is required",
      });
    }

    if (data.componentType === "DEDUCTION" && !data.deductionTypeSlug) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deductionTypeSlug"],
        message: "Deduction type is required",
      });
    }
  });

export const payBandStructureSchema = z.object({
  structures: z
    .array(structureItemSchema)
    .min(1, "At least one component is required"),
});

export const payBandStructureInitialValues = {
  structures: [],
};
