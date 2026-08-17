import { z } from "zod";

export const loanSettingInitialValues = {
  eligibilityAfterMonths: "6",
  salaryBasis: "GROSS",
  maximumSalaryMultiple: "5",
  minimumLoanAmount: "",
  maximumLoanAmount: "",
  allowMultipleLoan: false,
  approvalRequired: true,
  forecloseInterest: "0",
};

const optionalMoneySchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return value;
}, z.coerce.number().nonnegative("Amount cannot be negative").nullable());

export const loanSettingSchema = z
  .object({
    eligibilityAfterMonths: z.coerce
      .number()
      .int("Eligibility months must be a whole number")
      .nonnegative("Eligibility months cannot be negative")
      .max(600, "Eligibility months is too large"),

    salaryBasis: z.enum(["BASIC", "GROSS"]),

    maximumSalaryMultiple: z.coerce
      .number()
      .positive("Maximum salary multiple must be greater than 0")
      .max(100, "Maximum salary multiple cannot exceed 100"),

    minimumLoanAmount: optionalMoneySchema,

    maximumLoanAmount: optionalMoneySchema,

    allowMultipleLoan: z.boolean(),

    approvalRequired: z.boolean(),

    forecloseInterest: z.coerce
      .number()
      .nonnegative("Foreclose interest cannot be negative")
      .max(100, "Foreclose interest cannot exceed 100%"),
  })
  .superRefine((data, ctx) => {
    if (
      data.minimumLoanAmount !== null &&
      data.maximumLoanAmount !== null &&
      data.minimumLoanAmount > data.maximumLoanAmount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,

        path: ["minimumLoanAmount"],

        message:
          "Minimum loan amount cannot be greater than maximum loan amount",
      });
    }
  });

export const buildLoanSettingPayload = (form) => ({
  eligibilityAfterMonths:
    form?.eligibilityAfterMonths === "" ||
      form?.eligibilityAfterMonths === null ||
      form?.eligibilityAfterMonths === undefined
      ? 0
      : Number(form.eligibilityAfterMonths),

  salaryBasis: form?.salaryBasis || "GROSS",

  maximumSalaryMultiple:
    form?.maximumSalaryMultiple === "" ||
      form?.maximumSalaryMultiple === null ||
      form?.maximumSalaryMultiple === undefined
      ? 0
      : Number(form.maximumSalaryMultiple),

  minimumLoanAmount:
    form?.minimumLoanAmount === "" ||
      form?.minimumLoanAmount === null ||
      form?.minimumLoanAmount === undefined
      ? null
      : Number(form.minimumLoanAmount),

  maximumLoanAmount:
    form?.maximumLoanAmount === "" ||
      form?.maximumLoanAmount === null ||
      form?.maximumLoanAmount === undefined
      ? null
      : Number(form.maximumLoanAmount),

  allowMultipleLoan: Boolean(form?.allowMultipleLoan),

  approvalRequired: form?.approvalRequired !== false,

  forecloseInterest:
    form?.forecloseInterest === "" ||
      form?.forecloseInterest === null ||
      form?.forecloseInterest === undefined
      ? 0
      : Number(form.forecloseInterest),
});

export const buildLoanSettingFormData = (data) => ({
  eligibilityAfterMonths:
    data?.eligibilityAfterMonths !== null &&
      data?.eligibilityAfterMonths !== undefined
      ? String(data.eligibilityAfterMonths)
      : "6",

  salaryBasis: data?.salaryBasis || "GROSS",

  maximumSalaryMultiple:
    data?.maximumSalaryMultiple !== null &&
      data?.maximumSalaryMultiple !== undefined
      ? String(data.maximumSalaryMultiple)
      : "5",

  minimumLoanAmount:
    data?.minimumLoanAmount !== null && data?.minimumLoanAmount !== undefined
      ? String(data.minimumLoanAmount)
      : "",

  maximumLoanAmount:
    data?.maximumLoanAmount !== null && data?.maximumLoanAmount !== undefined
      ? String(data.maximumLoanAmount)
      : "",

  allowMultipleLoan: Boolean(data?.allowMultipleLoan),

  approvalRequired: data?.approvalRequired !== false,

  forecloseInterest:
    data?.forecloseInterest !== null && data?.forecloseInterest !== undefined
      ? String(data.forecloseInterest)
      : "0",
});

export const validateLoanSettingForm = (form) => {
  const payload = buildLoanSettingPayload(form);

  return loanSettingSchema.safeParse(payload);
};
