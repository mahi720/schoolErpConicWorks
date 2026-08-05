import { z } from "zod";


const stripHtml = (value = "") =>
  value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

export const employeeLetterTypeSchema = z.object({
  letterTypeName: z.string().trim().min(2, "Letter type name is required").max(150),
  letterContent: z.string().refine((value) => stripHtml(value).length > 0, {
    message: "Letter content is required",
  }),
});

export const employeeLetterTypeInitialValues = {
  letterTypeName: "",
  letterContent: "",
};
