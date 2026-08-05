import { z } from "zod";

export const saveLoanSettingSchema = z.object({
  forecloseInterest: z.coerce.number().nonnegative().max(100),
});
