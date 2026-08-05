import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader2, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useDeductionTypeStore } from "../../../store/hrm/settings/deductionType/deductionTypeStore";

import {
  deductionTypeInitialValues,
  deductionTypeSchema,
} from "../../../validations/hrm/settings/deductionType/deductionTypeValidation";

export default function DeductionType() {
  const [formData, setFormData] = useState(deductionTypeInitialValues);

  const [editData, setEditData] = useState(null);

  const {
    deductionTypes,
    loading,
    submitLoading,
    fetchDeductionTypes,
    createDeductionType,
    updateDeductionType,
    deleteDeductionType,
    restoreDeductionType,
  } = useDeductionTypeStore();

  useEffect(() => {
    fetchDeductionTypes();
  }, [fetchDeductionTypes]);

  const sortedDeductionTypes = useMemo(() => {
    return [...deductionTypes].sort(
      (first, second) =>
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime(),
    );
  }, [deductionTypes]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleChangeType = (event) => {
    const valueType = event.target.value;

    setFormData((previous) => ({
      ...previous,
      valueType,
      maximumValue: valueType === "PERCENT" ? previous.maximumValue : "",
    }));
  };

  const resetForm = () => {
    setFormData(deductionTypeInitialValues);
    setEditData(null);
  };

  const handleSave = async () => {
    const validation = deductionTypeSchema.safeParse(formData);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid deduction type details",
      );

      return;
    }

    const payload = {
      deductionType: validation.data.deductionType.trim(),
      valueType: validation.data.valueType,
      value: validation.data.value,
      maximumValue:
        validation.data.valueType === "PERCENT"
          ? validation.data.maximumValue
          : null,
    };

    let success = false;

    if (editData) {
      success = await updateDeductionType(editData.slug, payload);
    } else {
      success = await createDeductionType(payload);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive deduction type cannot be edited");

      return;
    }

    setEditData(item);

    setFormData({
      deductionType: item.deductionType || "",
      valueType: item.valueType || "FIXED",
      value:
        item.value !== null && item.value !== undefined
          ? String(item.value)
          : "",
      maximumValue:
        item.maximumValue !== null && item.maximumValue !== undefined
          ? String(item.maximumValue)
          : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.deductionType}" deduction type ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteDeductionType(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.deductionType}" deduction type ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreDeductionType(item.slug);
  };

  const formatValueType = (valueType) => {
    if (valueType === "PERCENT") {
      return "Percent";
    }

    if (valueType === "FIXED") {
      return "Fixed";
    }

    return valueType || "-";
  };

  const formatValue = (item) => {
    if (item.value === null || item.value === undefined) {
      return "-";
    }

    if (item.valueType === "PERCENT") {
      return `${Number(item.value)}%`;
    }

    return Number(item.value);
  };

  const formatMaximumValue = (item) => {
    if (
      item.maximumValue === null ||
      item.maximumValue === undefined ||
      item.maximumValue === ""
    ) {
      return "-";
    }

    return Number(item.maximumValue);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Deduction Type</h2>

      <hr className="border-gray-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div>
          <label className="text-gray-300 text-sm">
            Deduction Type
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="text"
            name="deductionType"
            value={formData.deductionType}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Deduction Type"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Value Type
            <span className="text-red-500"> *</span>
          </label>

          <select
            name="valueType"
            value={formData.valueType}
            onChange={handleChangeType}
            disabled={submitLoading}
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer outline-none focus:border-indigo-500 disabled:opacity-50"
          >
            <option value="">Select Value Type</option>

            <option value="FIXED">Fixed</option>

            <option value="PERCENT">Percent</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Value
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            name="value"
            value={formData.value}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Value"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">
            Maximum Value
            {formData.valueType === "PERCENT" && (
              <span className="text-red-500"> *</span>
            )}
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            name="maximumValue"
            disabled={submitLoading || formData.valueType !== "PERCENT"}
            value={formData.maximumValue}
            onChange={handleChange}
            placeholder={
              formData.valueType === "PERCENT"
                ? "Maximum Value"
                : "Not Required"
            }
            className={`mt-2 border rounded-lg px-4 py-3 text-white w-full outline-none ${
              formData.valueType !== "PERCENT"
                ? "bg-gray-700 cursor-not-allowed border-gray-700 opacity-60"
                : "bg-gray-800 border-gray-700 focus:border-indigo-500"
            }`}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
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

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
        <table className="w-full min-w-[900px]">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border border-gray-800">
              <th className="p-3 text-gray-300">Sno.</th>

              <th className="p-3 text-gray-300">Deduction Type</th>

              <th className="p-3 text-gray-300">Value Type</th>

              <th className="p-3 text-gray-300">Value</th>

              <th className="p-3 text-gray-300">Maximum Value</th>

              <th className="p-3 text-gray-300">Status</th>

              <th className="p-3 text-gray-300">Options</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Loading deduction types...
                  </div>
                </td>
              </tr>
            ) : sortedDeductionTypes.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400">
                  No deduction types found
                </td>
              </tr>
            ) : (
              sortedDeductionTypes.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`border border-gray-800 text-center ${
                    item.isActive ? "hover:bg-gray-800/50" : "bg-red-500/5"
                  }`}
                >
                  <td className="p-3 text-gray-300">{index + 1}</td>

                  <td className="p-3 text-gray-300">{item.deductionType}</td>

                  <td className="p-3">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        item.valueType === "PERCENT"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}
                    >
                      {formatValueType(item.valueType)}
                    </span>
                  </td>

                  <td className="p-3 text-gray-300">{formatValue(item)}</td>

                  <td className="p-3 text-gray-300">
                    {formatMaximumValue(item)}
                  </td>

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
                        title="Edit Deduction Type"
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
                          title="Delete Deduction Type"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={submitLoading}
                          title="Restore Deduction Type"
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
