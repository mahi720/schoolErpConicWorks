import { z } from "zod";

export const loanSettingSchema = z.object({
  forecloseInterest: z.coerce
    .number()
    .nonnegative("Foreclose interest cannot be negative")
    .max(100, "Foreclose interest cannot exceed 100"),
});

export const loanSettingInitialValues = {
  forecloseInterest: "",
};
