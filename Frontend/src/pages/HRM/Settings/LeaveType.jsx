import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader2, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useLeaveTypeStore } from "../../../store/hrm/settings/leaveType/leaveTypeStore";

import {
  leaveTypeInitialValues,
  leaveTypeSchema,
} from "../../../validations/hrm/settings/leaveType/leaveTypeValidation";

export default function LeaveType() {
  const [formData, setFormData] = useState(leaveTypeInitialValues);

  const [editData, setEditData] = useState(null);

  const {
    leaveTypes,
    loading,
    submitLoading,
    fetchLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
    restoreLeaveType,
  } = useLeaveTypeStore();

  useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  const sortedLeaveTypes = useMemo(() => {
    return [...leaveTypes].sort((first, second) => {
      return (
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime()
      );
    });
  }, [leaveTypes]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCarryForwardChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      carryForward: event.target.value === "true",
    }));
  };

  const resetForm = () => {
    setFormData(leaveTypeInitialValues);
    setEditData(null);
  };

  const handleSave = async () => {
    const validation = leaveTypeSchema.safeParse(formData);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid leave type details",
      );

      return;
    }

    const payload = {
      leaveType: validation.data.leaveType.trim(),
      daysPerYear: validation.data.daysPerYear,
      uptoYear: validation.data.uptoYear,
      daysPerYearAfterYear: validation.data.daysPerYearAfterYear,
      carryForward: validation.data.carryForward,
      maximumValue: validation.data.maximumValue,
      leaveValue: validation.data.leaveValue,
    };

    let success = false;

    if (editData) {
      success = await updateLeaveType(editData.slug, payload);
    } else {
      success = await createLeaveType(payload);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive leave type cannot be edited");

      return;
    }

    setEditData(item);

    setFormData({
      leaveType: item.leaveType || "",
      daysPerYear:
        item.daysPerYear !== null && item.daysPerYear !== undefined
          ? String(item.daysPerYear)
          : "",
      uptoYear:
        item.uptoYear !== null && item.uptoYear !== undefined
          ? String(item.uptoYear)
          : "",
      daysPerYearAfterYear:
        item.daysPerYearAfterYear !== null &&
        item.daysPerYearAfterYear !== undefined
          ? String(item.daysPerYearAfterYear)
          : "",
      carryForward: Boolean(item.carryForward),
      maximumValue:
        item.maximumValue !== null && item.maximumValue !== undefined
          ? String(item.maximumValue)
          : "",
      leaveValue:
        item.leaveValue !== null && item.leaveValue !== undefined
          ? String(item.leaveValue)
          : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.leaveType}" leave type ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteLeaveType(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.leaveType}" leave type ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreLeaveType(item.slug);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Leave Type</h2>

      <hr className="border-gray-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div>
          <label className="text-gray-300 text-sm">
            Leave Type
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="text"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Leave Type"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Days/Year
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            name="daysPerYear"
            value={formData.daysPerYear}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Days/Year"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Upto Year
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            min="0"
            name="uptoYear"
            value={formData.uptoYear}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Upto Year"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Days/Year (After Year)
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            name="daysPerYearAfterYear"
            value={formData.daysPerYearAfterYear}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Days/Year After Year"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Carry Forward
            <span className="text-red-500"> *</span>
          </label>

          <select
            value={String(formData.carryForward)}
            onChange={handleCarryForwardChange}
            disabled={submitLoading}
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer outline-none focus:border-indigo-500 disabled:opacity-50"
          >
            <option value="">Select</option>

            <option value="true">Yes</option>

            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Maximum Value
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            name="maximumValue"
            value={formData.maximumValue}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Maximum Value"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Value
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            name="leaveValue"
            value={formData.leaveValue}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Value"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitLoading}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg min-w-32 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitLoading && <Loader2 size={17} className="animate-spin" />}

            {submitLoading
              ? editData
                ? "Updating..."
                : "Saving..."
              : editData
                ? "Update"
                : "Save"}
          </button>

          {editData && (
            <button
              type="button"
              onClick={resetForm}
              disabled={submitLoading}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">
        <table className="w-full min-w-[1250px]">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-gray-300">SNo.</th>

              <th className="p-3 text-gray-300">Leave Type</th>

              <th className="p-3 text-gray-300">Days/Year</th>

              <th className="p-3 text-gray-300">Upto Year</th>

              <th className="p-3 text-gray-300">Days/Year (After Year)</th>

              <th className="p-3 text-gray-300">Carry Forward</th>

              <th className="p-3 text-gray-300">Maximum Value</th>

              <th className="p-3 text-gray-300">Value</th>

              <th className="p-3 text-gray-300">Status</th>

              <th className="p-3 text-gray-300">Options</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="p-10 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Loading leave types...
                  </div>
                </td>
              </tr>
            ) : sortedLeaveTypes.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-10 text-center text-gray-400">
                  No leave types found
                </td>
              </tr>
            ) : (
              sortedLeaveTypes.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`border-b border-gray-800 text-center ${
                    item.isActive ? "hover:bg-gray-800/50" : "bg-red-500/5"
                  }`}
                >
                  <td className="p-3 text-gray-300">{index + 1}.</td>

                  <td className="p-3 text-gray-300">{item.leaveType}</td>

                  <td className="p-3 text-gray-300">{item.daysPerYear}</td>

                  <td className="p-3 text-gray-300">{item.uptoYear}</td>

                  <td className="p-3 text-gray-300">
                    {item.daysPerYearAfterYear}
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        item.carryForward
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-gray-500/15 text-gray-400"
                      }`}
                    >
                      {item.carryForward ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="p-3 text-gray-300">{item.maximumValue}</td>

                  <td className="p-3 text-gray-300">{item.leaveValue}</td>

                  <td className="p-3">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-500/15 text-green-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        disabled={!item.isActive || submitLoading}
                        title="Edit Leave Type"
                        className={`p-2 rounded-lg text-white ${
                          item.isActive
                            ? "bg-cyan-500 hover:bg-cyan-600 cursor-pointer"
                            : "bg-gray-700 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <Edit size={16} />
                      </button>

                      {item.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={submitLoading}
                          title="Delete Leave Type"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={submitLoading}
                          title="Restore Leave Type"
                          className="bg-green-500 hover:bg-green-600 p-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
