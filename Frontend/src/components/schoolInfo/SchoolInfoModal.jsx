import React, { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Building2, ImagePlus, Loader2, X } from "lucide-react";

import Modal from "../common/Modal";

import { schoolSchema } from "../../validations/master/school/schoolSchema";
import { useSchoolStore } from "../../store/master/school/schoolStore";

const defaultValues = {
  schoolName: "",
  schoolCode: "",
  affiliationNumber: "",
  registrationNumber: "",

  contactPersonName: "",
  contactNumber: "",
  contactEmail: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  pinCode: "",

  website: "",

  lectureCount: "",
  teachingSaturday: false,
  classrooms: "",

  plan: "BASIC",
  planStartDate: "",
  planEndDate: "",

  maxStudents: "",
  maxUsers: "",

  logo: null,
};

const formatDateForInput = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
};

const InputField = ({
  label,
  name,
  register,
  error,
  required = false,
  type = "text",
  placeholder,
  disabled = false,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}

      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <input
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      {...register(name)}
      className={`w-full rounded-xl border bg-white px-3 py-2.5 text-gray-900 outline-none transition dark:bg-gray-800 dark:text-white ${
        error
          ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
          : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    />

    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
  </div>
);

export default function SchoolInfoModal({ isOpen, onClose, schoolData }) {
  const { updateMySchool, submitLoading } = useSchoolStore();

  const [logoPreview, setLogoPreview] = useState(null);

  const [selectedLogo, setSelectedLogo] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schoolSchema),
    defaultValues,
  });

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const existingLogoUrl = useMemo(() => {
    if (!schoolData?.logo) return null;

    if (
      schoolData.logo.startsWith("http://") ||
      schoolData.logo.startsWith("https://")
    ) {
      return schoolData.logo;
    }

    return `${backendUrl}${schoolData.logo}`;
  }, [schoolData?.logo, backendUrl]);

  useEffect(() => {
    if (!schoolData) {
      reset(defaultValues);
      setLogoPreview(null);
      setSelectedLogo(null);
      return;
    }

    reset({
      schoolName: schoolData.schoolName || "",
      schoolCode: schoolData.schoolCode || "",

      affiliationNumber: schoolData.affiliationNumber || "",

      registrationNumber: schoolData.registrationNumber || "",

      contactPersonName: schoolData.contactPersonName || "",

      contactNumber: schoolData.contactNumber || "",

      contactEmail: schoolData.contactEmail || "",

      addressLine1: schoolData.addressLine1 || "",

      addressLine2: schoolData.addressLine2 || "",

      city: schoolData.city || "",
      district: schoolData.district || "",
      state: schoolData.state || "",
      country: schoolData.country || "India",
      pinCode: schoolData.pinCode || "",

      website: schoolData.website || "",

      lectureCount: schoolData.lectureCount ?? "",

      teachingSaturday: schoolData.teachingSaturday ?? false,

      classrooms: schoolData.classrooms ?? "",

      plan: schoolData.plan || "BASIC",

      planStartDate: formatDateForInput(schoolData.planStartDate),

      planEndDate: formatDateForInput(schoolData.planEndDate),

      maxStudents: schoolData.maxStudents ?? "",

      maxUsers: schoolData.maxUsers ?? "",

      logo: null,
    });

    setLogoPreview(existingLogoUrl);
    setSelectedLogo(null);
  }, [schoolData, reset, existingLogoUrl]);

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      return;
    }

    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedLogo(file);
    setLogoPreview(previewUrl);

    setValue("logo", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeSelectedLogo = () => {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setSelectedLogo(null);
    setLogoPreview(existingLogoUrl);

    setValue("logo", null, {
      shouldDirty: true,
    });
  };

  const onSubmit = async (values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "logo") return;

      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (selectedLogo) {
      formData.append("logo", selectedLogo);
    }

    const success = await updateMySchool(formData);

    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    if (submitLoading) return;

    reset(defaultValues);
    setSelectedLogo(null);
    setLogoPreview(null);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit School Information"
      width="max-w-5xl"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="custom-scrollbar max-h-[70vh] overflow-x-auto overflow-y-auto pr-2">
          <div className="min-w-[700px] space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="School Name"
                  name="schoolName"
                  register={register}
                  error={errors.schoolName}
                  required
                  placeholder="Enter school name"
                />

                <InputField
                  label="School Code"
                  name="schoolCode"
                  register={register}
                  error={errors.schoolCode}
                  required
                  placeholder="Enter school code"
                  disabled
                />

                <InputField
                  label="Affiliation Number"
                  name="affiliationNumber"
                  register={register}
                  error={errors.affiliationNumber}
                  placeholder="Enter affiliation number"
                />

                <InputField
                  label="Registration Number"
                  name="registrationNumber"
                  register={register}
                  error={errors.registrationNumber}
                  placeholder="Enter registration number"
                />

                <InputField
                  label="Website"
                  name="website"
                  register={register}
                  error={errors.website}
                  placeholder="https://example.com"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plan
                  </label>

                  <select
                    {...register("plan")}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="BASIC">Basic</option>

                    <option value="STANDARD">Standard</option>

                    <option value="PREMIUM">Premium</option>

                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Contact Person"
                  name="contactPersonName"
                  register={register}
                  error={errors.contactPersonName}
                  required
                  placeholder="Enter contact person name"
                />

                <InputField
                  label="Contact Number"
                  name="contactNumber"
                  register={register}
                  error={errors.contactNumber}
                  required
                  placeholder="Enter contact number"
                />

                <InputField
                  label="Contact Email"
                  name="contactEmail"
                  register={register}
                  error={errors.contactEmail}
                  required
                  type="email"
                  placeholder="Enter contact email"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Address Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Address Line 1"
                  name="addressLine1"
                  register={register}
                  error={errors.addressLine1}
                  required
                  placeholder="Enter primary address"
                />

                <InputField
                  label="Address Line 2"
                  name="addressLine2"
                  register={register}
                  error={errors.addressLine2}
                  placeholder="Enter additional address"
                />

                <InputField
                  label="City"
                  name="city"
                  register={register}
                  error={errors.city}
                  required
                  placeholder="Enter city"
                />

                <InputField
                  label="District"
                  name="district"
                  register={register}
                  error={errors.district}
                  required
                  placeholder="Enter district"
                />

                <InputField
                  label="State"
                  name="state"
                  register={register}
                  error={errors.state}
                  required
                  placeholder="Enter state"
                />

                <InputField
                  label="Country"
                  name="country"
                  register={register}
                  error={errors.country}
                  required
                  placeholder="Enter country"
                />

                <InputField
                  label="PIN Code"
                  name="pinCode"
                  register={register}
                  error={errors.pinCode}
                  required
                  placeholder="Enter PIN code"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Academic Configuration
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Lecture Count"
                  name="lectureCount"
                  register={register}
                  error={errors.lectureCount}
                  type="number"
                  placeholder="Enter daily lecture count"
                />

                <InputField
                  label="Classrooms"
                  name="classrooms"
                  register={register}
                  error={errors.classrooms}
                  type="number"
                  placeholder="Enter classroom count"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teaching Saturday
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800">
                    <input
                      type="checkbox"
                      {...register("teachingSaturday")}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Saturday is a teaching day
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Plan Limits
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Plan Start Date"
                  name="planStartDate"
                  register={register}
                  error={errors.planStartDate}
                  type="date"
                />

                <InputField
                  label="Plan End Date"
                  name="planEndDate"
                  register={register}
                  error={errors.planEndDate}
                  type="date"
                />

                <InputField
                  label="Maximum Students"
                  name="maxStudents"
                  register={register}
                  error={errors.maxStudents}
                  type="number"
                  placeholder="Enter maximum students"
                />

                <InputField
                  label="Maximum Users"
                  name="maxUsers"
                  register={register}
                  error={errors.maxUsers}
                  type="number"
                  placeholder="Enter maximum users"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="mb-4 flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-blue-500" />

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  School Logo
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="School logo preview"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                    <ImagePlus className="h-4 w-4" />
                    Choose Logo
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>

                  {selectedLogo && (
                    <button
                      type="button"
                      onClick={removeSelectedLogo}
                      className="ml-3 inline-flex cursor-pointer items-center gap-1 rounded-xl border border-red-500 px-3 py-2 text-sm text-red-500"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  )}

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or WEBP. Maximum size 5 MB.
                  </p>

                  {selectedLogo && (
                    <p className="mt-1 max-w-sm truncate text-xs text-blue-500">
                      {selectedLogo.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="cursor-pointer rounded-xl border border-gray-300 px-5 py-2.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitLoading}
            className="inline-flex min-w-28 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
