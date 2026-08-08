import { z } from "zod";

const structureItemSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .max(50)
      .nullable()
      .optional(),

    componentType: z.enum([
      "EARNING",
      "DEDUCTION",
    ]),

    isBasicPay: z
      .boolean()
      .default(false),

    earningTypeSlug: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .nullable()
      .optional(),

    deductionTypeSlug: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .nullable()
      .optional(),

    calculationType: z.enum([
      "FIXED",
      "PERCENT",
    ]),

    value: z.coerce
      .number()
      .nonnegative(),

    calculationBase: z
      .enum([
        "BASIC_PAY",
        "GROSS_EARNING",
      ])
      .default("BASIC_PAY"),

    displayOrder: z.coerce
      .number()
      .int()
      .nonnegative(),
  })
  .superRefine((data, ctx) => {
    if (data.isBasicPay) {
      if (
        data.componentType !==
        "EARNING"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["componentType"],
          message:
            "Basic Pay must be an earning component",
        });
      }

      if (data.earningTypeSlug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["earningTypeSlug"],
          message:
            "Basic Pay does not require earning type",
        });
      }

      if (data.deductionTypeSlug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["deductionTypeSlug"],
          message:
            "Basic Pay cannot have deduction type",
        });
      }

      if (
        data.calculationType !==
        "FIXED"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["calculationType"],
          message:
            "Basic Pay must use FIXED calculation type",
        });
      }

      return;
    }

    if (
      data.componentType ===
      "EARNING" &&
      !data.earningTypeSlug
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["earningTypeSlug"],
        message:
          "Earning type is required",
      });
    }

    if (
      data.componentType ===
      "DEDUCTION" &&
      !data.deductionTypeSlug
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deductionTypeSlug"],
        message:
          "Deduction type is required",
      });
    }

    if (
      data.componentType ===
      "EARNING" &&
      data.deductionTypeSlug
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deductionTypeSlug"],
        message:
          "Earning component cannot have deduction type",
      });
    }

    if (
      data.componentType ===
      "DEDUCTION" &&
      data.earningTypeSlug
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["earningTypeSlug"],
        message:
          "Deduction component cannot have earning type",
      });
    }
  });

export const savePayBandStructureSchema =
  z
    .object({
      structures: z
        .array(structureItemSchema)
        .min(
          1,
          "At least one component is required",
        ),
    })
    .superRefine((data, ctx) => {
      const basicPayItems =
        data.structures.filter(
          (item) =>
            item.isBasicPay,
        );

      if (
        basicPayItems.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["structures"],
          message:
            "Basic Pay is required",
        });
      }

      if (
        basicPayItems.length > 1
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["structures"],
          message:
            "Only one Basic Pay component is allowed",
        });
      }
    });