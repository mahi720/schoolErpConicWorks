import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader2, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useLoanInterestStore } from "../../../store/hrm/settings/loanInterest/loanInterestStore";
import { useLoanSettingStore } from "../../../store/hrm/settings/loanSetting/loanSettingStore";

import {
  loanInterestInitialValues,
  loanInterestSchema,
} from "../../../validations/hrm/settings/loanInterest/loanInterestValidation";

import {
  loanSettingInitialValues,
  loanSettingSchema,
} from "../../../validations/hrm/settings/loanSetting/loanSettingValidation";

const durationOptions = [
  {
    label: "3 Month",
    value: "3",
  },
  {
    label: "6 Month",
    value: "6",
  },
  {
    label: "9 Month",
    value: "9",
  },
  {
    label: "12 Month",
    value: "12",
  },
  {
    label: "15 Month",
    value: "15",
  },
  {
    label: "18 Month",
    value: "18",
  },
  {
    label: "21 Month",
    value: "21",
  },
  {
    label: "24 Month",
    value: "24",
  },
  {
    label: "27 Month",
    value: "27",
  },
  {
    label: "30 Month",
    value: "30",
  },
  {
    label: "33 Month",
    value: "33",
  },
  {
    label: "36 Month",
    value: "36",
  },
  {
    label: "36 Month",
    value: "36",
  },
  {
    label: "39 Month",
    value: "39",
  },
  {
    label: "42 Month",
    value: "42",
  },
  {
    label: "45 Month",
    value: "45",
  },
  {
    label: "48 Month",
    value: "48",
  },
  {
    label: "51 Month",
    value: "51",
  },
  {
    label: "54 Month",
    value: "54",
  },
  {
    label: "57 Month",
    value: "57",
  },
  {
    label: "60 Month",
    value: "60",
  },
];

export default function LoanInterest() {
  const [formData, setFormData] = useState(loanInterestInitialValues);

  const [forecloseForm, setForecloseForm] = useState(loanSettingInitialValues);

  const [editData, setEditData] = useState(null);

  const {
    loanInterests,
    loading,
    submitLoading,
    fetchLoanInterests,
    createLoanInterest,
    updateLoanInterest,
    deleteLoanInterest,
    restoreLoanInterest,
  } = useLoanInterestStore();

  const {
    loanSetting,
    loading: loanSettingLoading,
    submitLoading: loanSettingSubmitLoading,
    fetchLoanSetting,
    updateLoanSetting,
  } = useLoanSettingStore();

  useEffect(() => {
    fetchLoanInterests();
    fetchLoanSetting();
  }, [fetchLoanInterests, fetchLoanSetting]);

  useEffect(() => {
    setForecloseForm({
      forecloseInterest:
        loanSetting?.forecloseInterest !== null &&
        loanSetting?.forecloseInterest !== undefined
          ? String(loanSetting.forecloseInterest)
          : "",
    });
  }, [loanSetting]);

  const sortedLoanInterests = useMemo(() => {
    return [...loanInterests].sort((first, second) => {
      return (
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime()
      );
    });
  }, [loanInterests]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(loanInterestInitialValues);
    setEditData(null);
  };

  const handleSave = async () => {
    const validation = loanInterestSchema.safeParse(formData);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid loan interest details",
      );

      return;
    }

    const payload = {
      durationMonths: validation.data.durationMonths,
      annualInterest: validation.data.annualInterest,
    };

    let success = false;

    if (editData) {
      success = await updateLoanInterest(editData.slug, payload);
    } else {
      success = await createLoanInterest(payload);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive loan interest cannot be edited");

      return;
    }

    setEditData(item);

    setFormData({
      durationMonths:
        item.durationMonths !== null && item.durationMonths !== undefined
          ? String(item.durationMonths)
          : "",
      annualInterest:
        item.annualInterest !== null && item.annualInterest !== undefined
          ? String(item.annualInterest)
          : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Kya aap ${item.durationMonths} months ke loan interest ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteLoanInterest(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap ${item.durationMonths} months ke loan interest ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreLoanInterest(item.slug);
  };

  const handleForecloseChange = (event) => {
    setForecloseForm({
      forecloseInterest: event.target.value,
    });
  };

  const handleForecloseSave = async () => {
    const validation = loanSettingSchema.safeParse(forecloseForm);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid foreclose interest",
      );

      return;
    }

    await updateLoanSetting({
      forecloseInterest: validation.data.forecloseInterest,
    });
  };

  const getDurationLabel = (durationMonths) => {
    const option = durationOptions.find(
      (item) => Number(item.value) === Number(durationMonths),
    );

    return option?.label || `${durationMonths} Month`;
  };

  const formatInterest = (value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    return `${Number(value)}%`;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Loan Interest</h2>

      <hr className="border-gray-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-end">
        <div>
          <label className="text-gray-300 font-normal text-sm">
            Duration (in month)
            <span className="text-red-500"> *</span>
          </label>

          <select
            name="durationMonths"
            value={formData.durationMonths}
            onChange={handleChange}
            disabled={submitLoading}
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer outline-none focus:border-indigo-500 disabled:opacity-50"
          >
            <option value="">Select Duration</option>

            {durationOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm font-normal">
            Loan Interest (annually)
            <span className="text-red-500"> *</span>
          </label>

          <div className="relative mt-2">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              name="annualInterest"
              value={formData.annualInterest}
              onChange={handleChange}
              disabled={submitLoading}
              placeholder="Loan Interest"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitLoading}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 min-w-32 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      <div className="border-t border-gray-800 pt-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-5">
          <div className="w-full md:w-80">
            <label className="text-gray-300 text-sm font-normal">
              Foreclose Interest
              <span className="text-red-500"> *</span>
            </label>

            <div className="relative mt-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={forecloseForm.forecloseInterest}
                onChange={handleForecloseChange}
                disabled={loanSettingLoading || loanSettingSubmitLoading}
                placeholder={
                  loanSettingLoading ? "Loading..." : "Foreclose Interest"
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white w-full outline-none focus:border-green-500 disabled:opacity-50"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                %
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleForecloseSave}
            disabled={loanSettingLoading || loanSettingSubmitLoading}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 min-w-32 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loanSettingSubmitLoading && (
              <Loader2 size={17} className="animate-spin" />
            )}

            {loanSettingSubmitLoading
              ? "Saving..."
              : loanSetting
                ? "Update"
                : "Save"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
        <table className="w-full min-w-[850px]">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-gray-300">S no.</th>

              <th className="p-3 text-gray-300">Duration (in month)</th>

              <th className="p-3 text-gray-300">Loan Interest (annually)</th>

              <th className="p-3 text-gray-300">Status</th>

              <th className="p-3 text-gray-300">Options</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Loading loan interests...
                  </div>
                </td>
              </tr>
            ) : sortedLoanInterests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400">
                  No loan interests found
                </td>
              </tr>
            ) : (
              sortedLoanInterests.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`border-b border-gray-800 text-center ${
                    item.isActive ? "hover:bg-gray-800/50" : "bg-red-500/5"
                  }`}
                >
                  <td className="p-3 text-gray-300">{index + 1}</td>

                  <td className="p-3 text-gray-300">
                    {getDurationLabel(item.durationMonths)}
                  </td>

                  <td className="p-3 text-gray-300">
                    {formatInterest(item.annualInterest)}
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
                        title="Edit Loan Interest"
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
                          title="Delete Loan Interest"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={submitLoading}
                          title="Restore Loan Interest"
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
