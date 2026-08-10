import React, { useEffect, useState } from "react";

import { Loader2, X } from "lucide-react";

import toast from "react-hot-toast";

import {
  buildEventCalendarPayload,
  eventCalendarInitialValues,
  eventCalendarSchema,
  eventCalendarUpdateSchema,
} from "../../../validations/hrm/eventCalendar/eventCalendarValidation";

export default function EventModal({
  open,
  close,
  save,
  editData = null,
  loading = false,
}) {
  const [form, setForm] = useState({
    ...eventCalendarInitialValues,
  });

  const isEdit = Boolean(editData?.slug);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editData) {
      setForm({
        title: editData.title || "",

        description: editData.description || "",

        startDate: editData.startDate || "",

        endDate: editData.endDate || "",

        startTime: editData.startTime || "",

        endTime: editData.endTime || "",
      });

      return;
    }

    setForm({
      ...eventCalendarInitialValues,
    });
  }, [open, editData]);

  if (!open) {
    return null;
  }

  const inputClass =
    "col-span-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500";

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = buildEventCalendarPayload(form);

    const schema = isEdit ? eventCalendarUpdateSchema : eventCalendarSchema;

    const validation = schema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid event details",
      );

      return;
    }

    await save(validation.data);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-[650px] max-h-[92vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {isEdit ? "Edit Event" : "Create Event"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {isEdit ? "Update event details" : "Create a new calendar event"}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-gray-300">
              Title
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter Event Title"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 items-start gap-5">
            <label className="text-gray-300 pt-3">
              Description
              <span className="text-red-500"> *</span>
            </label>

            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter Event Description"
              className={`${inputClass} min-h-[100px] resize-none`}
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-gray-300">
              Start Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-gray-300">
              End Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              min={form.startDate || undefined}
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-gray-300">
              Start Time
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="time"
              value={form.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-5">
            <label className="text-gray-300">
              End Time
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="time"
              value={form.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-800 px-5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}

            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update"
                : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
