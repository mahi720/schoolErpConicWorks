import React, { useEffect, useMemo, useState } from "react";

import {
  Edit,
  IndianRupee,
  Loader2,
  RotateCcw,
  Settings,
  Trash2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import { useLoanInterestStore } from "../../../store/hrm/settings/loanInterest/loanInterestStore";

import { useLoanSettingStore } from "../../../store/hrm/settings/loanSetting/loanSettingStore";

import {
  loanInterestInitialValues,
  loanInterestSchema,
} from "../../../validations/hrm/settings/loanInterest/loanInterestValidation";

import {
  buildLoanSettingFormData,
  buildLoanSettingPayload,
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

  const [editData, setEditData] = useState(null);

  const [settingModalOpen, setSettingModalOpen] = useState(false);

  const [settingForm, setSettingForm] = useState({
    ...loanSettingInitialValues,
  });

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

  const sortedLoanInterests = useMemo(() => {
    return [...(loanInterests || [])].sort((first, second) => {
      return Number(first.durationMonths) - Number(second.durationMonths);
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
        validation.error.issues?.[0]?.message ||
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
      `Do you want to deactivate the ${item.durationMonths} month loan interest?`,
    );

    if (!confirmed) {
      return;
    }

    const success = await deleteLoanInterest(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Do you want to restore the ${item.durationMonths} month loan interest?`,
    );

    if (!confirmed) {
      return;
    }

    await restoreLoanInterest(item.slug);
  };

  const handleOpenSettings = async () => {
    let currentSetting = loanSetting;

    if (!currentSetting) {
      const success = await fetchLoanSetting();

      if (success) {
        currentSetting = useLoanSettingStore.getState().loanSetting;
      }
    }

    setSettingForm(
      currentSetting
        ? buildLoanSettingFormData(currentSetting)
        : {
            ...loanSettingInitialValues,
          },
    );

    setSettingModalOpen(true);
  };

  const handleCloseSettings = () => {
    if (loanSettingSubmitLoading) {
      return;
    }

    setSettingModalOpen(false);

    setSettingForm({
      ...loanSettingInitialValues,
    });
  };

  const handleSettingChange = (field, value) => {
    setSettingForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  const handleSettingSave = async () => {
    const payload = buildLoanSettingPayload(settingForm);

    const validation = loanSettingSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid loan settings",
      );

      return;
    }

    const success = await updateLoanSetting(validation.data);

    if (!success) {
      return;
    }

    setSettingModalOpen(false);
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

  const inputClass =
    "mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl text-white font-semibold">Loan Interest</h2>

            <p className="text-gray-500 text-sm mt-1">
              Configure duration-wise annual interest rates for employee loans
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenSettings}
            disabled={loanSettingLoading}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loanSettingLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Settings size={17} />
            )}
            Loan Settings
          </button>
        </div>

        <hr className="border-gray-800" />

        {/* Loan Interest Form */}

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
              className={`${inputClass} cursor-pointer`}
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

            <div className="relative">
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
                className={`${inputClass} pr-10`}
              />

              <span className="absolute right-4 top-[calc(50%+4px)] -translate-y-1/2 text-gray-500">
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

        {/* Table */}

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

      {/* Loan Settings Modal */}

      {settingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[92vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}

            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                  <Settings size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Loan Settings
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Configure loan eligibility, limits, approval and foreclosure
                    rules
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseSettings}
                disabled={loanSettingSubmitLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}

            <div className="p-5 overflow-x-auto overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Eligibility */}

                <SettingField
                  label="Eligibility After Months"
                  required
                  help="Employee must complete this many months of service before applying for a loan."
                >
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={settingForm.eligibilityAfterMonths}
                    onChange={(event) =>
                      handleSettingChange(
                        "eligibilityAfterMonths",
                        event.target.value,
                      )
                    }
                    disabled={loanSettingSubmitLoading}
                    placeholder="Example: 6"
                    className={inputClass}
                  />
                </SettingField>

                {/* Salary Basis */}

                <SettingField
                  label="Salary Basis"
                  required
                  help="Salary amount used to calculate maximum loan eligibility."
                >
                  <select
                    value={settingForm.salaryBasis}
                    onChange={(event) =>
                      handleSettingChange("salaryBasis", event.target.value)
                    }
                    disabled={loanSettingSubmitLoading}
                    className={inputClass}
                  >
                    <option value="GROSS">Gross Salary</option>

                    <option value="BASIC">Basic Salary</option>
                  </select>
                </SettingField>

                {/* Multiple */}

                <SettingField
                  label="Maximum Salary Multiple"
                  required
                  help="Example: 5 means employee may be eligible for up to 5 times the selected salary basis."
                >
                  <input
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.01"
                    value={settingForm.maximumSalaryMultiple}
                    onChange={(event) =>
                      handleSettingChange(
                        "maximumSalaryMultiple",
                        event.target.value,
                      )
                    }
                    disabled={loanSettingSubmitLoading}
                    placeholder="Example: 5"
                    className={inputClass}
                  />
                </SettingField>

                {/* Foreclose Interest */}

                <SettingField
                  label="Foreclose Interest"
                  required
                  help="Percentage charge applied according to the loan foreclosure rule."
                >
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={settingForm.forecloseInterest}
                      onChange={(event) =>
                        handleSettingChange(
                          "forecloseInterest",
                          event.target.value,
                        )
                      }
                      disabled={loanSettingSubmitLoading}
                      placeholder="Example: 2"
                      className={`${inputClass} pr-10`}
                    />

                    <span className="absolute right-4 top-[calc(50%+4px)] -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </SettingField>

                {/* Minimum */}

                <SettingField
                  label="Minimum Loan Amount"
                  help="Leave blank if no minimum amount is required."
                >
                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settingForm.minimumLoanAmount}
                      onChange={(event) =>
                        handleSettingChange(
                          "minimumLoanAmount",
                          event.target.value,
                        )
                      }
                      disabled={loanSettingSubmitLoading}
                      placeholder="Example: 10000"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </SettingField>

                {/* Maximum */}

                <SettingField
                  label="Maximum Loan Amount"
                  help="Optional absolute upper cap. Leave blank to use only the salary-based limit."
                >
                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settingForm.maximumLoanAmount}
                      onChange={(event) =>
                        handleSettingChange(
                          "maximumLoanAmount",
                          event.target.value,
                        )
                      }
                      disabled={loanSettingSubmitLoading}
                      placeholder="Example: 300000"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </SettingField>

                {/* Multiple Loan */}

                <SettingToggle
                  label="Allow Multiple Loan"
                  description="Allow an employee to apply for another loan while an existing loan is still active."
                  value={settingForm.allowMultipleLoan}
                  onChange={(value) =>
                    handleSettingChange("allowMultipleLoan", value)
                  }
                  disabled={loanSettingSubmitLoading}
                />

                {/* Approval */}

                <SettingToggle
                  label="Approval Required"
                  description="Loan requests must be approved by an authorized user before disbursement."
                  value={settingForm.approvalRequired}
                  onChange={(value) =>
                    handleSettingChange("approvalRequired", value)
                  }
                  disabled={loanSettingSubmitLoading}
                />
              </div>

              {/* Rule Preview */}

              <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <p className="text-indigo-300 text-sm font-medium">
                  Eligibility Rule Preview
                </p>

                <p className="text-gray-400 text-xs leading-relaxed mt-2">
                  Loan eligibility will be calculated using{" "}
                  <span className="text-white">
                    {settingForm.salaryBasis === "BASIC"
                      ? "Basic Salary"
                      : "Gross Salary"}
                  </span>{" "}
                  multiplied by{" "}
                  <span className="text-white">
                    {settingForm.maximumSalaryMultiple || 0}
                  </span>
                  .
                  {settingForm.maximumLoanAmount && (
                    <>
                      {" "}
                      The final eligibility cannot exceed{" "}
                      <span className="text-white">
                        {formatMoney(settingForm.maximumLoanAmount)}
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Footer */}

            <div className="px-5 py-4 border-t border-gray-800 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCloseSettings}
                disabled={loanSettingSubmitLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSettingSave}
                disabled={loanSettingSubmitLoading}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loanSettingSubmitLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}

                {loanSettingSubmitLoading
                  ? "Saving..."
                  : loanSetting
                    ? "Update Settings"
                    : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const SettingField = ({ label, children, required = false, help }) => {
  return (
    <div>
      <label className="text-gray-300 text-sm font-normal">
        {label}

        {required && <span className="text-red-500"> *</span>}
      </label>

      {children}

      {help && (
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{help}</p>
      )}
    </div>
  );
};

const SettingToggle = ({ label, description, value, onChange, disabled }) => {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-gray-300 text-sm font-medium">{label}</p>

          <p className="text-gray-500 text-xs leading-relaxed mt-1">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChange(!value)}
          disabled={disabled}
          className={`relative w-12 h-6 shrink-0 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            value ? "bg-indigo-600" : "bg-gray-700"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              value ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};
