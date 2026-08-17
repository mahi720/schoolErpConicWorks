import React, { useEffect, useMemo, useState } from "react";

import {
  Edit,
  IndianRupee,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import { useDepartmentStore } from "../../../store/hrm/settings/department/departmentStore";

import { useAdvancePolicyStore } from "../../../store/hrm/settings/advancePolicy/advancePolicyStore";

import {
  advancePolicyInitialValues,
  buildAdvancePolicyFormData,
  buildAdvancePolicyPayload,
  createAdvancePolicySchema,
  updateAdvancePolicySchema,
} from "../../../validations/hrm/settings/advancePolicy/advancePolicyValidation";
import GuideDownloadButton from "../../../components/common/GuideDownloadButton";

const AdvancePolicy = () => {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [openModal, setOpenModal] = useState(false);

  const [editData, setEditData] = useState(null);

  const {
    advancePolicies,
    loading,
    actionLoading,
    fetchAdvancePolicies,
    deleteAdvancePolicy,
    restoreAdvancePolicy,
  } = useAdvancePolicyStore();

  useEffect(() => {
    fetchAdvancePolicies({
      status: "all",
    });
  }, [fetchAdvancePolicies]);

  const filteredPolicies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return (advancePolicies || []).filter((item) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);

      if (!matchesStatus) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [
        item.policyName,
        item.department,
        item.calculationBasis,
        item.interestType,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(keyword),
      );
    });
  }, [advancePolicies, search, statusFilter]);

  const handleAdd = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive policy cannot be edited");

      return;
    }

    setEditData(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.policyName}" advance policy?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteAdvancePolicy(item.slug);
  };

  const handleRestore = async (item) => {
    await restoreAdvancePolicy(item.slug);
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  const formatBasis = (value) => {
    if (value === "BASIC") {
      return "Basic Salary";
    }

    if (value === "GROSS") {
      return "Gross Salary";
    }

    if (value === "FIXED") {
      return "Fixed";
    }

    return value || "-";
  };

  const formatInterest = (item) => {
    if (item.interestType === "NONE") {
      return "No Interest";
    }

    if (item.interestType === "FLAT") {
      return `Flat ${formatMoney(item.flatInterestAmount)}`;
    }

    if (item.interestType === "PERCENTAGE") {
      return `${Number(item.interestRate || 0)}%`;
    }

    return "-";
  };

  return (
    <div className="space-y-5">
      {/* Header */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Advance Policy</h2>

            <p className="text-sm text-gray-500 mt-1">
              Configure employee advance eligibility, limits, installments and
              interest rules
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <GuideDownloadButton
              file="/hrmAdvanceInstruction/Employee_Advance_Policy_Settings_Guide.pdf"
              label="Download Guide"
            />

            <button
              type="button"
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={17} />
              Add Advance Policy
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search policy..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Advance Policies</h3>

            <p className="text-gray-500 text-sm mt-1">
              Total:{" "}
              <span className="text-gray-300">{filteredPolicies.length}</span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-340px)] custom-scrollbar">
          <table className="w-full min-w-[1450px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  SNo.
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Policy Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Department
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Eligibility
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Calculation Basis
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Salary Months
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                  Minimum
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                  Maximum
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Max Installments
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Interest
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Multiple
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Approval
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Status
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={14} className="py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />

                      <p className="text-gray-500 text-sm">
                        Loading advance policies...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-16 text-center text-gray-500">
                    No advance policies found
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((item, index) => (
                  <tr
                    key={item.slug}
                    className={`transition-colors ${
                      item.isActive
                        ? "hover:bg-gray-800/40"
                        : "bg-red-500/5 opacity-70"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-200 font-medium">
                        {item.policyName}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md text-xs">
                        {item.department || "ALL"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center text-sm text-gray-300">
                      {item.eligibilityAfterMonths} Month
                      {Number(item.eligibilityAfterMonths) !== 1 ? "s" : ""}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {formatBasis(item.calculationBasis)}
                    </td>

                    <td className="px-4 py-3 text-center text-sm text-gray-300">
                      {item.calculationBasis === "FIXED"
                        ? "-"
                        : (item.maximumSalaryMonths ?? "-")}
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-gray-300 whitespace-nowrap">
                      {formatMoney(item.minimumAmount)}
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-gray-300 whitespace-nowrap">
                      {formatMoney(item.maximumAmount)}
                    </td>

                    <td className="px-4 py-3 text-center text-sm text-gray-300">
                      {item.maximumInstallments}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                      {formatInterest(item)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <BooleanBadge value={item.allowMultipleAdvance} />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <BooleanBadge value={item.approvalRequired} />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs border ${
                          item.isActive
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          disabled={!item.isActive || actionLoading}
                          title="Edit"
                          className="w-8 h-8 bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/30 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Edit size={15} />
                        </button>

                        {item.isActive ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={actionLoading}
                            title="Delete"
                            className="w-8 h-8 bg-red-500/15 text-red-400 hover:bg-red-500/30 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-40"
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestore(item)}
                            disabled={actionLoading}
                            title="Restore"
                            className="w-8 h-8 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-40"
                          >
                            <RefreshCcw size={15} />
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

      <AdvancePolicyModal
        open={openModal}
        close={handleCloseModal}
        editData={editData}
      />
    </div>
  );
};

const AdvancePolicyModal = ({ open, close, editData }) => {
  const [form, setForm] = useState({
    ...advancePolicyInitialValues,
  });

  const isEdit = Boolean(editData?.slug);

  const {
    departments,
    loading: departmentLoading,
    fetchDepartments,
  } = useDepartmentStore();

  const { submitLoading, createAdvancePolicy, updateAdvancePolicy } =
    useAdvancePolicyStore();

  useEffect(() => {
    if (!open) {
      return;
    }

    fetchDepartments({
      status: "active",
    });
  }, [open, fetchDepartments]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editData) {
      setForm(buildAdvancePolicyFormData(editData));

      return;
    }

    setForm({
      ...advancePolicyInitialValues,
    });
  }, [open, editData]);

  const activeDepartments = useMemo(() => {
    return (departments || []).filter((item) => item.isActive !== false);
  }, [departments]);

  if (!open) {
    return null;
  }

  const handleChange = (field, value) => {
    setForm((previous) => {
      if (field === "calculationBasis") {
        return {
          ...previous,

          calculationBasis: value,

          maximumSalaryMonths:
            value === "FIXED" ? "" : previous.maximumSalaryMonths || "2",
        };
      }

      if (field === "interestType") {
        return {
          ...previous,

          interestType: value,

          interestRate:
            value === "PERCENTAGE"
              ? previous.interestRate === "0"
                ? ""
                : previous.interestRate
              : "0",

          flatInterestAmount:
            value === "FLAT" ? previous.flatInterestAmount : "",
        };
      }

      return {
        ...previous,

        [field]: value,
      };
    });
  };

  const handleClose = () => {
    if (submitLoading) {
      return;
    }

    setForm({
      ...advancePolicyInitialValues,
    });

    close();
  };

  const handleSubmit = async () => {
    const payload = buildAdvancePolicyPayload(form);

    const schema = isEdit
      ? updateAdvancePolicySchema
      : createAdvancePolicySchema;

    const validation = schema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid advance policy details",
      );

      return;
    }

    const success = isEdit
      ? await updateAdvancePolicy(editData.slug, validation.data)
      : await createAdvancePolicy(validation.data);

    if (!success) {
      return;
    }

    handleClose();
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl max-h-[92vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}

        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <IndianRupee size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                {isEdit ? "Edit Advance Policy" : "Create Advance Policy"}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Configure advance eligibility and recovery limits
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}

        <div className="p-5 overflow-x-auto overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Policy Name */}

            <Field>
              <Label required>Policy Name</Label>

              <input
                type="text"
                value={form.policyName}
                onChange={(event) =>
                  handleChange("policyName", event.target.value)
                }
                placeholder="Enter policy name"
                maxLength={150}
                disabled={submitLoading}
                className={inputClass}
              />
            </Field>

            {/* Department */}

            <Field>
              <Label required>Department</Label>

              <select
                value={form.department}
                onChange={(event) =>
                  handleChange("department", event.target.value)
                }
                disabled={submitLoading || departmentLoading}
                className={inputClass}
              >
                <option value="ALL">ALL Departments</option>

                {activeDepartments.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.departmentName}
                  </option>
                ))}
              </select>
            </Field>

            {/* Eligibility */}

            <Field>
              <Label required>Eligibility After Months</Label>

              <input
                type="number"
                min="0"
                step="1"
                value={form.eligibilityAfterMonths}
                onChange={(event) =>
                  handleChange("eligibilityAfterMonths", event.target.value)
                }
                placeholder="Example: 6"
                disabled={submitLoading}
                className={inputClass}
              />

              <HelperText>
                Employee must complete this many months of service before
                becoming eligible.
              </HelperText>
            </Field>

            {/* Calculation Basis */}

            <Field>
              <Label required>Calculation Basis</Label>

              <select
                value={form.calculationBasis}
                onChange={(event) =>
                  handleChange("calculationBasis", event.target.value)
                }
                disabled={submitLoading}
                className={inputClass}
              >
                <option value="BASIC">Basic Salary</option>

                <option value="GROSS">Gross Salary</option>

                <option value="FIXED">Fixed Amount</option>
              </select>
            </Field>

            {/* Maximum Salary Months */}

            {form.calculationBasis !== "FIXED" && (
              <Field>
                <Label required>Maximum Salary Months</Label>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.maximumSalaryMonths}
                  onChange={(event) =>
                    handleChange("maximumSalaryMonths", event.target.value)
                  }
                  placeholder="Example: 2"
                  disabled={submitLoading}
                  className={inputClass}
                />

                <HelperText>
                  Example: 2 means up to 2 months of{" "}
                  {form.calculationBasis === "BASIC" ? "basic" : "gross"}{" "}
                  salary.
                </HelperText>
              </Field>
            )}

            {/* Maximum Amount */}

            <Field>
              <Label required={form.calculationBasis === "FIXED"}>
                Maximum Amount
              </Label>

              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.maximumAmount}
                  onChange={(event) =>
                    handleChange("maximumAmount", event.target.value)
                  }
                  placeholder={
                    form.calculationBasis === "FIXED"
                      ? "Required"
                      : "Optional upper cap"
                  }
                  disabled={submitLoading}
                  className={`${inputClass} pl-9`}
                />
              </div>

              {form.calculationBasis !== "FIXED" && (
                <HelperText>
                  Optional final cap after salary-based calculation.
                </HelperText>
              )}
            </Field>

            {/* Minimum Amount */}

            <Field>
              <Label>Minimum Amount</Label>

              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minimumAmount}
                  onChange={(event) =>
                    handleChange("minimumAmount", event.target.value)
                  }
                  placeholder="Example: 1000"
                  disabled={submitLoading}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>

            {/* Max Installments */}

            <Field>
              <Label required>Maximum Installments</Label>

              <input
                type="number"
                min="1"
                max="120"
                step="1"
                value={form.maximumInstallments}
                onChange={(event) =>
                  handleChange("maximumInstallments", event.target.value)
                }
                placeholder="Example: 6"
                disabled={submitLoading}
                className={inputClass}
              />
            </Field>

            {/* Interest Type */}

            <Field>
              <Label required>Interest Type</Label>

              <select
                value={form.interestType}
                onChange={(event) =>
                  handleChange("interestType", event.target.value)
                }
                disabled={submitLoading}
                className={inputClass}
              >
                <option value="NONE">No Interest</option>

                <option value="FLAT">Flat Amount</option>

                <option value="PERCENTAGE">Percentage</option>
              </select>
            </Field>

            {/* Percentage Interest */}

            {form.interestType === "PERCENTAGE" && (
              <Field>
                <Label required>Interest Rate (%)</Label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.interestRate}
                  onChange={(event) =>
                    handleChange("interestRate", event.target.value)
                  }
                  placeholder="Example: 5"
                  disabled={submitLoading}
                  className={inputClass}
                />
              </Field>
            )}

            {/* Flat Interest */}

            {form.interestType === "FLAT" && (
              <Field>
                <Label required>Flat Interest Amount</Label>

                <div className="relative">
                  <IndianRupee
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.flatInterestAmount}
                    onChange={(event) =>
                      handleChange("flatInterestAmount", event.target.value)
                    }
                    placeholder="Enter flat interest"
                    disabled={submitLoading}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </Field>
            )}

            {/* Multiple Advance */}

            <ToggleField
              label="Allow Multiple Advance"
              description="Allow employee to request another advance while an existing advance is still active."
              value={form.allowMultipleAdvance}
              onChange={(value) => handleChange("allowMultipleAdvance", value)}
              disabled={submitLoading}
            />

            {/* Approval Required */}

            <ToggleField
              label="Approval Required"
              description="Advance request must be approved before disbursement."
              value={form.approvalRequired}
              onChange={(value) => handleChange("approvalRequired", value)}
              disabled={submitLoading}
            />
          </div>

          {/* Preview */}

          <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-indigo-300 font-medium text-sm">
              Policy Rule Preview
            </p>

            <p className="text-gray-400 text-xs leading-relaxed mt-2">
              Employees become eligible after{" "}
              <span className="text-white">
                {form.eligibilityAfterMonths || 0} months
              </span>
              . Maximum advance will be calculated using{" "}
              <span className="text-white">
                {form.calculationBasis === "BASIC"
                  ? "Basic Salary"
                  : form.calculationBasis === "GROSS"
                    ? "Gross Salary"
                    : "Fixed Amount"}
              </span>
              {form.calculationBasis !== "FIXED" && (
                <>
                  {" "}
                  up to{" "}
                  <span className="text-white">
                    {form.maximumSalaryMonths} month(s)
                  </span>
                </>
              )}
              .
            </p>
          </div>
        </div>

        {/* Footer */}

        <div className="px-5 py-4 border-t border-gray-800 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading && <Loader2 size={16} className="animate-spin" />}

            {submitLoading
              ? isEdit
                ? "Updating..."
                : "Saving..."
              : isEdit
                ? "Update Policy"
                : "Save Policy"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};

const Label = ({ children, required = false }) => {
  return (
    <label className="block text-gray-300 text-sm">
      {children}

      {required && <span className="text-red-500"> *</span>}
    </label>
  );
};

const HelperText = ({ children }) => {
  return <p className="text-xs text-gray-500 leading-relaxed">{children}</p>;
};

const ToggleField = ({ label, description, value, onChange, disabled }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-sm text-gray-300 font-medium">{label}</p>

          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChange(!value)}
          disabled={disabled}
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
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

const BooleanBadge = ({ value }) => {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-md text-xs border ${
        value
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-gray-500/10 border-gray-500/20 text-gray-400"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  );
};

export default AdvancePolicy;
