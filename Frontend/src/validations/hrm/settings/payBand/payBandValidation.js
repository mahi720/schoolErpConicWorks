import { z } from "zod";

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const payBandSchema = z.object({
  payBandName: z.string().trim().min(1, "Pay band is required").max(100),
  image: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, "Invalid image file")
    .refine(
      (file) => !file || allowedImageTypes.includes(file.type),
      "Only JPG, JPEG, PNG and WEBP images are allowed",
    )
    .refine(
      (file) => !file || file.size <= 1 * 1024 * 1024,
      "Image size cannot exceed 1 MB",
    ),
});

export const payBandInitialValues = {
  payBandName: "",
  image: null,
};

export const createPayBandFormData = (values) => {
  const formData = new FormData();

  formData.append("payBandName", values.payBandName.trim());

  if (values.image instanceof File) {
    formData.append("image", values.image);
  }

  return formData;
};
