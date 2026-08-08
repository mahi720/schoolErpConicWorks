import { z } from "zod";

export const structureItemSchema = z
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
      .min(
        1,
        "Earning type is required",
      )
      .nullable()
      .optional(),

    deductionTypeSlug: z
      .string()
      .trim()
      .min(
        1,
        "Deduction type is required",
      )
      .nullable()
      .optional(),

    calculationType: z.enum([
      "FIXED",
      "PERCENT",
    ]),

    value: z.coerce
      .number()
      .nonnegative(
        "Value cannot be negative",
      ),

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
  .superRefine(
    (data, context) => {
      if (data.isBasicPay) {
        if (
          data.componentType !==
          "EARNING"
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "componentType",
            ],
            message:
              "Basic Pay must be an earning component",
          });
        }

        if (
          data.earningTypeSlug
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "earningTypeSlug",
            ],
            message:
              "Basic Pay does not require an earning type",
          });
        }

        if (
          data.deductionTypeSlug
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "deductionTypeSlug",
            ],
            message:
              "Basic Pay cannot have a deduction type",
          });
        }

        if (
          data.calculationType !==
          "FIXED"
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "calculationType",
            ],
            message:
              "Basic Pay calculation type must be fixed",
          });
        }

        return;
      }

      if (
        data.componentType ===
        "EARNING" &&
        !data.earningTypeSlug
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "earningTypeSlug",
          ],
          message:
            "Earning type is required",
        });
      }

      if (
        data.componentType ===
        "DEDUCTION" &&
        !data.deductionTypeSlug
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "deductionTypeSlug",
          ],
          message:
            "Deduction type is required",
        });
      }

      if (
        data.componentType ===
        "EARNING" &&
        data.deductionTypeSlug
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "deductionTypeSlug",
          ],
          message:
            "Earning component cannot have deduction type",
        });
      }

      if (
        data.componentType ===
        "DEDUCTION" &&
        data.earningTypeSlug
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "earningTypeSlug",
          ],
          message:
            "Deduction component cannot have earning type",
        });
      }
    },
  );

export const payBandStructureSchema =
  z
    .object({
      structures: z
        .array(
          structureItemSchema,
        )
        .min(
          1,
          "At least one component is required",
        ),
    })
    .superRefine(
      (data, context) => {
        const basicPayItems =
          data.structures.filter(
            (item) =>
              item.isBasicPay,
          );

        if (
          basicPayItems.length ===
          0
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "structures",
            ],
            message:
              "Basic Pay is required",
          });
        }

        if (
          basicPayItems.length >
          1
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "structures",
            ],
            message:
              "Only one Basic Pay component is allowed",
          });
        }
      },
    );

export const payBandStructureInitialValues =
{
  structures: [],
};