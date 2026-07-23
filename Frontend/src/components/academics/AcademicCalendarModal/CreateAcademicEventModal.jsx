import React, { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  academicCalendarSchema,
  calendarCategoryOptions,
} from "../../../validations/academic/academicCalender/academicCalendarValidation";

const defaultValues = {
  session: "",
  title: "",
  description: "",
  category: "",
  startDate: "",
  endDate: "",
  isHoliday: false,
  color: "#10b981",
};

const formatDateForInput = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
};

export default function CreateAcademicEventModal({
  isOpen,
  onClose,
  eventData = null,
  sessions = [],
  onCreate,
  onUpdate,
  loading = false,
}) {
  const isEditMode = Boolean(eventData?.slug);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(academicCalendarSchema),
    defaultValues,
  });

  const selectedCategory = watch("category");
  const selectedColor = watch("color");

  useEffect(() => {
    if (!isOpen) return;

    if (eventData) {
      reset({
        session: eventData.session || "",
        title: eventData.title || "",
        description: eventData.description || "",
        category: eventData.category || "",
        startDate: formatDateForInput(eventData.startDate),
        endDate: formatDateForInput(eventData.endDate),
        isHoliday: eventData.isHoliday || false,
        color: eventData.color || "#10b981",
      });

      return;
    }

    reset(defaultValues);
  }, [isOpen, eventData, reset]);

  useEffect(() => {
    if (selectedCategory === "HOLIDAY") {
      setValue("isHoliday", true);
    }
  }, [selectedCategory, setValue]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;

    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (formData) => {
    const payload = {
      session: formData.session,
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      category: formData.category,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isHoliday: formData.category === "HOLIDAY" ? true : formData.isHoliday,
      color: formData.color || null,
    };

    let success = false;

    if (isEditMode) {
      success = await onUpdate(eventData.slug, payload);
    } else {
      success = await onCreate(payload);
    }

    if (success) {
      reset(defaultValues);
      onClose();
    }
  };

  const inputClassName = (error) =>
    `w-full rounded-xl border bg-gray-800 p-3 text-white outline-none transition ${
      error
        ? "border-red-500 focus:border-red-500"
        : "border-gray-700 focus:border-emerald-500"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-800 p-6">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {isEditMode ? "Edit Academic Event" : "Create New Academic Event"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="cursor-pointer rounded-lg p-1 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="custom-scrollbar space-y-5 overflow-x-auto overflow-y-auto p-6">
            <div>
              <label className="mb-2 block text-gray-300">
                Select Academic Year
                <span className="text-red-500"> *</span>
              </label>

              <select
                {...register("session")}
                className={inputClassName(errors.session)}
              >
                <option value="">Select Academic Year</option>

                {sessions.map((session) => (
                  <option
                    key={session.slug || session.name}
                    value={session.name}
                  >
                    {session.name}
                  </option>
                ))}
              </select>

              {errors.session && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.session.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-gray-300">
                Title of event
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                {...register("title")}
                placeholder="Event title"
                className={inputClassName(errors.title)}
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-gray-300">
                Event description
              </label>

              <textarea
                rows={3}
                {...register("description")}
                placeholder="Event description"
                className={`${inputClassName(errors.description)} resize-none`}
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-gray-300">
                Event category
                <span className="text-red-500"> *</span>
              </label>

              <select
                {...register("category")}
                className={inputClassName(errors.category)}
              >
                <option value="">Select Event Category</option>

                {calendarCategoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-gray-300">
                  Start From
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="date"
                  {...register("startDate")}
                  className={inputClassName(errors.startDate)}
                />

                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-gray-300">
                  Till Date
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="date"
                  {...register("endDate")}
                  className={inputClassName(errors.endDate)}
                />

                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-gray-300">Event Color</label>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    {...register("color")}
                    className="h-12 w-16 cursor-pointer rounded-xl border border-gray-700 bg-gray-800 p-1"
                  />

                  <input
                    type="text"
                    value={selectedColor || ""}
                    onChange={(event) =>
                      setValue("color", event.target.value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="#10b981"
                    className={inputClassName(errors.color)}
                  />
                </div>

                {errors.color && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.color.message}
                  </p>
                )}
              </div>

              <div className="flex items-end">
                <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-700 bg-gray-800 p-3 text-gray-300">
                  <input
                    type="checkbox"
                    {...register("isHoliday")}
                    disabled={selectedCategory === "HOLIDAY"}
                    className="h-5 w-5 cursor-pointer accent-emerald-500 disabled:cursor-not-allowed"
                  />
                  Mark as Holiday
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-800 p-6">
            <button
              type="submit"
              disabled={loading}
              className="flex min-w-28 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}

              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update"
                  : "Create"}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="cursor-pointer rounded-xl bg-red-500 px-5 py-3 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
