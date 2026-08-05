import { z } from "zod";

export const createPayBandSchema = z.object({
  payBandName: z.string().trim().min(1).max(100),
});

export const updatePayBandSchema = createPayBandSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);
