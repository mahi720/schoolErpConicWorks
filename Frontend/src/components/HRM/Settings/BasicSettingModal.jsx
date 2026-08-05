import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useDepartmentStore } from "../../../store/hrm/settings/department/departmentStore";
import { useShiftStore } from "../../../store/hrm/settings/shift/shiftStore";
import { useBasicSettingStore } from "../../../store/hrm/settings/basicSetting/basicSettingStore";

import {
  basicSettingCreateSchema,
  basicSettingInitialValues,
  basicSettingUpdateSchema,
} from "../../../validations/hrm/settings/basicSetting/basicSettingValidation";

const weekDays = [
  {
    label: "Monday",
    value: "MONDAY",
  },
  {
    label: "Tuesday",
    value: "TUESDAY",
  },
  {
    label: "Wednesday",
    value: "WEDNESDAY",
  },
  {
    label: "Thursday",
    value: "THURSDAY",
  },
  {
    label: "Friday",
    value: "FRIDAY",
  },
  {
    label: "Saturday",
    value: "SATURDAY",
  },
  {
    label: "2nd Saturday",
    value: "2ND_SATURDAY",
  },
  {
    label: "4th Saturday",
    value: "4TH_SATURDAY",
  },
  {
    label: "Sunday",
    value: "SUNDAY",
  },
];

const getWeekDayLabel = (value) => {
  return (
    weekDays.find((item) => item.value === value)?.label ||
    value?.replaceAll("_", " ") ||
    "-"
  );
};

export default function BasicSettingModal({ open, close, editData }) {
  const [form, setForm] = useState(basicSettingInitialValues);

  const [showDays, setShowDays] = useState(false);
  const [search, setSearch] = useState("");

  const isEdit = Boolean(editData);

  const {
    departments,
    loading: departmentLoading,
    fetchDepartments,
  } = useDepartmentStore();

  const { shifts, loading: shiftLoading, fetchShifts } = useShiftStore();

  const { submitLoading, createBasicSettings, updateBasicSetting } =
    useBasicSettingStore();

  const activeDepartments = useMemo(() => {
    return departments.filter((item) => item.isActive);
  }, [departments]);

  const availableShifts = useMemo(() => {
    return shifts.filter(
      (item) => item.isActive && item.departmentSlug === form.departmentSlug,
    );
  }, [shifts, form.departmentSlug]);

  const filteredWeekDays = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return weekDays.filter((item) =>
      item.label.toLowerCase().includes(searchValue),
    );
  }, [search]);

  useEffect(() => {
    if (!open) return;

    fetchDepartments({
      status: "active",
    });
  }, [open, fetchDepartments]);

  useEffect(() => {
    if (!open) return;

    if (editData) {
      setForm({
        departmentSlug:
          editData.departmentSlug || editData.department?.slug || "",
        weekDays: editData.weekDay ? [editData.weekDay] : [],
        dayType: editData.dayType || "",
        shiftSlug: editData.shiftSlug || editData.shift?.slug || "",
      });

      return;
    }

    setForm(basicSettingInitialValues);
  }, [open, editData]);

  useEffect(() => {
    if (!open || !form.departmentSlug) {
      return;
    }

    fetchShifts({
      departmentSlug: form.departmentSlug,
      status: "active",
    });
  }, [open, form.departmentSlug, fetchShifts]);

  useEffect(() => {
    if (form.dayType !== "HOLIDAY") {
      return;
    }

    setForm((previous) => ({
      ...previous,
      shiftSlug: "",
    }));
  }, [form.dayType]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "departmentSlug"
        ? {
            shiftSlug: "",
          }
        : {}),
    }));
  };

  const toggleDay = (day) => {
    setForm((previous) => {
      const alreadySelected = previous.weekDays.includes(day);

      return {
        ...previous,
        weekDays: alreadySelected
          ? previous.weekDays.filter((item) => item !== day)
          : [...previous.weekDays, day],
      };
    });
  };

  const removeDay = (day) => {
    setForm((previous) => ({
      ...previous,
      weekDays: previous.weekDays.filter((item) => item !== day),
    }));
  };

  const resetModal = () => {
    setForm(basicSettingInitialValues);
    setShowDays(false);
    setSearch("");
  };

  const handleClose = () => {
    if (submitLoading) return;

    resetModal();
    close();
  };

  const handleSubmit = async () => {
    const schema = isEdit ? basicSettingUpdateSchema : basicSettingCreateSchema;

    const values = isEdit
      ? {
          dayType: form.dayType,
          shiftSlug: form.dayType === "WORKING" ? form.shiftSlug : null,
        }
      : {
          departmentSlug: form.departmentSlug,
          weekDays: form.weekDays,
          dayType: form.dayType,
          shiftSlug: form.dayType === "WORKING" ? form.shiftSlug : null,
        };

    const validation = schema.safeParse(values);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid basic setting details",
      );

      return;
    }

    const success = isEdit
      ? await updateBasicSetting(editData.slug, validation.data)
      : await createBasicSettings(validation.data);

    if (success) {
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-3xl flex-col rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {isEdit ? "Edit Basic Setting" : "Add Basic Setting"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure department working days and shifts
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 overflow-visible">
          <div
            className={`grid grid-cols-1 gap-5 ${
              isEdit ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-2"
            }`}
          >
            {!isEdit && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Department
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  name="departmentSlug"
                  value={form.departmentSlug}
                  onChange={handleChange}
                  disabled={departmentLoading || submitLoading}
                  className="h-12 w-full cursor-pointer rounded-xl border border-gray-700 bg-gray-800 px-4 text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {departmentLoading
                      ? "Loading Departments..."
                      : "Select Department"}
                  </option>

                  {activeDepartments.map((department) => (
                    <option key={department.slug} value={department.slug}>
                      {department.departmentName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isEdit && (
              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Week Days
                  <span className="text-red-500"> *</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowDays((previous) => !previous)}
                  disabled={submitLoading}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-left outline-none transition hover:border-gray-600 focus:border-indigo-500 disabled:opacity-50"
                >
                  <div className="flex flex-wrap gap-2">
                    {form.weekDays.length === 0 ? (
                      <span className="text-sm text-gray-500">
                        Select one or more days
                      </span>
                    ) : (
                      form.weekDays.map((day) => (
                        <span
                          key={day}
                          className="flex items-center gap-2 rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-medium text-indigo-300"
                        >
                          {getWeekDayLabel(day)}

                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              event.stopPropagation();
                              removeDay(day);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.stopPropagation();
                                removeDay(day);
                              }
                            }}
                            className="cursor-pointer text-indigo-300 hover:text-red-400"
                          >
                            <X size={13} />
                          </span>
                        </span>
                      ))
                    )}
                  </div>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform ${
                      showDays ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDays && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-[100] rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
                    <div className="border-b border-gray-700 p-2">
                      <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search week day..."
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto p-2 custom-scrollbar">
                      {filteredWeekDays.map((day) => {
                        const selected = form.weekDays.includes(day.value);

                        return (
                          <button
                            type="button"
                            key={day.value}
                            onClick={() => toggleDay(day.value)}
                            className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                              selected
                                ? "bg-indigo-600 text-white"
                                : "text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            <span>{day.label}</span>

                            {selected && <Check size={15} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Type
                <span className="text-red-500"> *</span>
              </label>

              <select
                name="dayType"
                value={form.dayType}
                onChange={handleChange}
                disabled={submitLoading}
                className="h-12 w-full cursor-pointer rounded-xl border border-gray-700 bg-gray-800 px-4 text-white outline-none transition focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="">Select Type</option>

                <option value="WORKING">Working</option>

                <option value="HOLIDAY">Holiday</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Shift
                {form.dayType === "WORKING" && (
                  <span className="text-red-500"> *</span>
                )}
              </label>

              <select
                name="shiftSlug"
                value={form.shiftSlug || ""}
                onChange={handleChange}
                disabled={
                  submitLoading ||
                  shiftLoading ||
                  !form.departmentSlug ||
                  form.dayType !== "WORKING"
                }
                className="h-12 w-full cursor-pointer rounded-xl border border-gray-700 bg-gray-800 px-4 text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {form.dayType === "HOLIDAY"
                    ? "Not required for holiday"
                    : !form.departmentSlug
                      ? "Select department first"
                      : shiftLoading
                        ? "Loading Shifts..."
                        : "Select Shift"}
                </option>

                {availableShifts.map((shift) => (
                  <option key={shift.slug} value={shift.slug}>
                    {shift.shiftName} ({shift.shiftCode})
                  </option>
                ))}
              </select>

              {form.dayType === "WORKING" &&
                form.departmentSlug &&
                !shiftLoading &&
                availableShifts.length === 0 && (
                  <p className="mt-2 text-xs text-yellow-400">
                    No active shifts found for this department. Please add a
                    shift first.
                  </p>
                )}
            </div>
          </div>

          {isEdit && (
            <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-gray-800 bg-gray-800/40 p-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Department
                </p>

                <p className="mt-1 font-medium text-gray-200">
                  {editData.department?.departmentName ||
                    editData.departmentName ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Week Day
                </p>

                <p className="mt-1 font-medium text-gray-200">
                  {getWeekDayLabel(editData.weekDay)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-800 bg-gray-900 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading}
            className="flex min-w-32 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitLoading && <Loader2 size={17} className="animate-spin" />}

            {submitLoading
              ? isEdit
                ? "Updating..."
                : "Saving..."
              : isEdit
                ? "Update"
                : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
