import React, { useEffect, useMemo, useState } from "react";

import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";

import toast from "react-hot-toast";

import {
  holidayInitialValues,
  holidayEditInitialValues,
  holidaySchema,
  holidayUpdateSchema,
  buildHolidayPayload,
  buildHolidayUpdatePayload,
} from "../../../validations/hrm/holiday/holidayValidation";

function MultiSelect({
  label,
  required = false,
  placeholder,
  options = [],
  selected = [],
  onChange,
  loading = false,
}) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return options;
    }

    return options.filter((item) =>
      item.label?.toLowerCase().includes(keyword),
    );
  }, [options, search]);

  const selectedOptions = useMemo(() => {
    return options.filter((item) => selected.includes(item.value));
  }, [options, selected]);

  const toggleValue = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));

      return;
    }

    onChange([...selected, value]);
  };

  return (
    <div className="relative">
      <label className="text-gray-300 block mb-2">
        {label}

        {required && <span className="text-red-500"> *</span>}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full min-h-[50px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-left text-white flex items-center justify-between gap-3 cursor-pointer hover:border-gray-600"
      >
        <div className="flex-1 min-w-0">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((item) => (
                <span
                  key={item.value}
                  className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 rounded-lg px-2.5 py-1 text-xs"
                >
                  {item.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-[80] mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="max-h-56 overflow-auto custom-scrollbar">
            {loading ? (
              <div className="p-5 flex items-center justify-center gap-2 text-gray-400">
                <Loader2 size={17} className="animate-spin" />
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-5 text-center text-gray-500 text-sm">
                No options found
              </div>
            ) : (
              filteredOptions.map((item) => {
                const checked = selected.includes(item.value);

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleValue(item.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 text-left cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        checked
                          ? "bg-indigo-600 border-indigo-600"
                          : "border-gray-600"
                      }`}
                    >
                      {checked && <Check size={14} className="text-white" />}
                    </div>

                    <span className="text-gray-300 text-sm">{item.label}</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-gray-800 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {selected.length} selected
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-indigo-400 hover:text-indigo-300 text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HolidayModal({
  open,
  close,
  save,
  editData,
  departments = [],
  employees = [],
  departmentLoading = false,
  employeeLoading = false,
  modalLoading = false,
}) {
  const [form, setForm] = useState(holidayInitialValues);

  const isEdit = Boolean(editData);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editData) {
      setForm({
        ...holidayEditInitialValues,

        date: editData.date || "",

        title: editData.title || "",
      });

      return;
    }

    setForm({
      ...holidayInitialValues,
    });
  }, [open, editData]);

  const departmentOptions = useMemo(() => {
    return departments
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        value: item.slug,

        label: item.departmentName || item.name || item.department || "-",
      }));
  }, [departments]);

  const employeeOptions = useMemo(() => {
    return employees
      .filter((item) => item.isActive !== false)
      .map((item) => {
        const name = item.fullName || item.name || "-";

        const code = item.employeeCode || item.employeeId || "";

        return {
          value: item.slug,

          label: code ? `${name} (${code})` : name,
        };
      });
  }, [employees]);

  if (!open) {
    return null;
  }

  const inputClass =
    "bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full outline-none focus:border-indigo-500";

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,

      type,

      departmentSlugs: type === "DEPARTMENT" ? prev.departmentSlugs || [] : [],

      employeeSlugs: type === "EMPLOYEE" ? prev.employeeSlugs || [] : [],
    }));
  };

  const handleSubmit = async () => {
    if (isEdit) {
      const payload = {
        date: form.date || "",
        title: form.title?.trim() || "",
      };

      const validation = holidayUpdateSchema.safeParse(payload);

      if (!validation.success) {
        toast.error(
          validation.error.issues?.[0]?.message ||
            "Please enter valid holiday details",
        );

        return;
      }

      await save(validation.data);

      return;
    }

    const payload = buildHolidayPayload(form);

    const validation = holidaySchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid holiday details",
      );

      return;
    }

    await save(validation.data);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl text-white font-semibold">
              {isEdit ? "Edit Holiday" : "Add Holiday"}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {isEdit
                ? "Update holiday date and title"
                : "Create holiday for selected dates"}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={modalLoading}
            className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <div className="p-6 overflow-auto custom-scrollbar space-y-5">
          {isEdit ? (
            <>
              <div>
                <label className="text-gray-300 block mb-2">
                  Date
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="date"
                  value={form.date || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,

                      date: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-2">
                  Title
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  placeholder="Enter Holiday Title"
                  value={form.title || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,

                      title: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              {editData?.type && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Holiday For</p>

                  <p className="text-gray-300 mt-1">
                    {editData.type === "DEPARTMENT" ? "Department" : "Employee"}

                    {editData.targetName ? ` - ${editData.targetName}` : ""}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-gray-300 block mb-2">
                    Start Date
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,

                        startDate: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-2">
                    End Date
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="date"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,

                        endDate: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-2">
                  Title
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  placeholder="Enter Holiday Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,

                      title: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-2">
                  Type
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">Select Type</option>

                  <option value="DEPARTMENT">Department</option>

                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>

              {form.type === "DEPARTMENT" && (
                <MultiSelect
                  label="Departments"
                  required
                  placeholder="Select Departments"
                  options={departmentOptions}
                  selected={form.departmentSlugs || []}
                  loading={departmentLoading}
                  onChange={(values) =>
                    setForm((prev) => ({
                      ...prev,

                      departmentSlugs: values,

                      employeeSlugs: [],
                    }))
                  }
                />
              )}

              {form.type === "EMPLOYEE" && (
                <MultiSelect
                  label="Employees"
                  required
                  placeholder="Select Employees"
                  options={employeeOptions}
                  selected={form.employeeSlugs || []}
                  loading={employeeLoading}
                  onChange={(values) =>
                    setForm((prev) => ({
                      ...prev,

                      employeeSlugs: values,

                      departmentSlugs: [],
                    }))
                  }
                />
              )}
            </>
          )}
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={modalLoading}
            className="bg-gray-700 hover:bg-gray-800 px-5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={modalLoading}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {modalLoading && <Loader2 size={17} className="animate-spin" />}

            {modalLoading
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
