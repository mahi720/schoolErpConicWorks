import { z } from "zod";

export const createLeaveTypeSchema = z.object({
  leaveType: z.string().trim().min(1).max(100),
  daysPerYear: z.coerce.number().nonnegative(),
  uptoYear: z.coerce.number().int().nonnegative(),
  daysPerYearAfterYear: z.coerce.number().nonnegative(),
  carryForward: z.boolean(),
  maximumValue: z.coerce.number().nonnegative(),
  leaveValue: z.coerce.number().nonnegative(),
});

export const updateLeaveTypeSchema = createLeaveTypeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
