import { z } from "zod";


export const leaveTypeSchema = z.object({
  leaveType: z.string().trim().min(1, "Leave type is required").max(100),
  daysPerYear: z.coerce.number().nonnegative("Days per year cannot be negative"),
  uptoYear: z.coerce.number().int().nonnegative("Upto year cannot be negative"),
  daysPerYearAfterYear: z.coerce.number().nonnegative("Days per year after year cannot be negative"),
  carryForward: z.boolean(),
  maximumValue: z.coerce.number().nonnegative("Maximum value cannot be negative"),
  leaveValue: z.coerce.number().positive("Leave value must be greater than zero"),
});

export const leaveTypeInitialValues = {
  leaveType: "",
  daysPerYear: "",
  uptoYear: "",
  daysPerYearAfterYear: "",
  carryForward: false,
  maximumValue: "",
  leaveValue: 1,
};
