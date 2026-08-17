import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Ban,
  Banknote,
  Check,
  Eye,
  IndianRupee,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
  CircleDollarSign,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useEmployeeAdvanceStore } from "../../../../../store/hrm/request/employeeAdvance/employeeAdvanceStore";
import GuideDownloadButton from "../../../../../components/common/GuideDownloadButton";

import {
  buildForeclosureFormFromAdvance,
  buildForecloseEmployeeAdvancePayload,
  employeeAdvanceForeclosureInitialValues,
  forecloseEmployeeAdvanceSchema,
  approveEmployeeAdvanceSchema,
  buildApprovalFormFromAdvance,
  buildApproveEmployeeAdvancePayload,
  buildCancelEmployeeAdvancePayload,
  buildDisbursementFormFromAdvance,
  buildDisburseEmployeeAdvancePayload,
  buildEmployeeAdvancePayload,
  buildRejectEmployeeAdvancePayload,
  cancelEmployeeAdvanceSchema,
  createEmployeeAdvanceSchema,
  disburseEmployeeAdvanceSchema,
  employeeAdvanceApprovalInitialValues,
  employeeAdvanceDisbursementInitialValues,
  employeeAdvanceInitialValues,
  rejectEmployeeAdvanceSchema,
} from "../../../../../validations/hrm/request/employeeAdvance/employeeAdvanceValidation";

const ADVANCE_ADMIN_ROLES = ["SUPER_ADMIN", "SCHOOL_ADMIN", "HR"];

const AdvanceRequests = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [requestStatusFilter, setRequestStatusFilter] = useState("all");

  const [openModal, setOpenModal] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const [cancelRequest, setCancelRequest] = useState(null);

  const [cancelRemark, setCancelRemark] = useState("");

  const [approveModalOpen, setApproveModalOpen] = useState(false);

  const [approveRequest, setApproveRequest] = useState(null);

  const [approveForm, setApproveForm] = useState({
    ...employeeAdvanceApprovalInitialValues,
  });

  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [rejectRequest, setRejectRequest] = useState(null);

  const [rejectRemark, setRejectRemark] = useState("");

  const [disburseModalOpen, setDisburseModalOpen] = useState(false);

  const [disburseRequest, setDisburseRequest] = useState(null);
  const [foreclosureModalOpen, setForeclosureModalOpen] = useState(false);

  const [foreclosureRequest, setForeclosureRequest] = useState(null);

  const [foreclosureForm, setForeclosureForm] = useState({
    ...employeeAdvanceForeclosureInitialValues,
  });

  const [disburseForm, setDisburseForm] = useState({
    ...employeeAdvanceDisbursementInitialValues,
  });

  const [form, setForm] = useState({
    ...employeeAdvanceInitialValues,
  });

  const {
    currentUser,
    userLoading,

    eligibility,
    myAdvances,
    employeeAdvances,
    selectedAdvance,

    loading,
    eligibilityLoading,
    submitLoading,
    actionLoading,

    fetchCurrentUser,
    fetchEligibility,
    fetchMyAdvances,
    fetchEmployeeAdvances,
    fetchAdvanceBySlug,

    createAdvance,
    approveAdvance,
    rejectAdvance,
    cancelAdvance,
    disburseAdvance,

    deleteAdvance,
    restoreAdvance,

    clearSelectedAdvance,

    forecloseAdvance,
  } = useEmployeeAdvanceStore();

  const role = currentUser?.role || "";

  const isAdvanceAdmin = ADVANCE_ADMIN_ROLES.includes(role);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (isAdvanceAdmin) {
      fetchEmployeeAdvances({
        status: "all",
      });

      return;
    }

    Promise.all([
      fetchEligibility(),

      fetchMyAdvances({
        status: "all",
      }),
    ]);
  }, [
    currentUser,
    isAdvanceAdmin,
    fetchEligibility,
    fetchMyAdvances,
    fetchEmployeeAdvances,
  ]);

  const rows = useMemo(() => {
    if (isAdvanceAdmin) {
      return Array.isArray(employeeAdvances) ? employeeAdvances : [];
    }

    return Array.isArray(myAdvances) ? myAdvances : [];
  }, [isAdvanceAdmin, employeeAdvances, myAdvances]);

  const handleOpenForeclosure = (item) => {
    if (item.disbursementStatus !== "DISBURSED") {
      toast.error("Advance must be disbursed before full settlement");

      return;
    }

    if (item.recoveryStatus === "COMPLETED") {
      toast.error("Advance recovery is already completed");

      return;
    }

    const outstanding = Number(item.outstandingAmount || 0);

    if (outstanding <= 0) {
      toast.error("No outstanding amount is available");

      return;
    }

    setForeclosureRequest(item);

    setForeclosureForm(buildForeclosureFormFromAdvance(item));

    setForeclosureModalOpen(true);
  };

  const handleCloseForeclosure = () => {
    if (actionLoading) {
      return;
    }

    setForeclosureModalOpen(false);

    setForeclosureRequest(null);

    setForeclosureForm({
      ...employeeAdvanceForeclosureInitialValues,
    });
  };

  const handleForeclosureChange = (field, value) => {
    setForeclosureForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  const handleForeclosureSubmit = async () => {
    if (!foreclosureRequest?.slug) {
      return;
    }

    const payload = buildForecloseEmployeeAdvancePayload(foreclosureForm);

    const validation = forecloseEmployeeAdvanceSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid settlement details",
      );

      return;
    }

    const outstandingAmount = Number(foreclosureRequest.outstandingAmount || 0);

    if (Number(validation.data.amount) !== outstandingAmount) {
      toast.error(
        `Full settlement amount must be ${formatMoney(outstandingAmount)}`,
      );

      return;
    }

    const success = await forecloseAdvance(
      foreclosureRequest.slug,
      validation.data,
    );

    if (!success) {
      return;
    }

    handleCloseForeclosure();

    await refreshCurrentView();
  };

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rows.filter((item) => {
      if (
        requestStatusFilter !== "all" &&
        item.requestStatus !== requestStatusFilter
      ) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const values = [
        item.slug,

        item.reason,

        item.requestStatus,

        item.disbursementStatus,

        item.recoveryStatus,

        item.requestedAmount,

        item.approvedAmount,

        item.policy?.policyName,

        item.employee?.fullName,

        item.employee?.employeeId,

        item.employee?.employeeCode,

        item.employee?.department?.name,

        item.employee?.designation?.name,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(keyword),
      );
    });
  }, [rows, search, requestStatusFilter]);

  const refreshCurrentView = async () => {
    if (isAdvanceAdmin) {
      await fetchEmployeeAdvances({
        status: "all",
      });

      return;
    }

    await Promise.all([
      fetchEligibility(),

      fetchMyAdvances({
        status: "all",
      }),
    ]);
  };

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  // Employee Create

  const handleOpenModal = () => {
    if (isAdvanceAdmin) {
      return;
    }

    if (eligibilityLoading) {
      return;
    }

    if (!eligibility) {
      toast.error("Advance eligibility is not available");

      return;
    }

    if (eligibility.canApply === false) {
      toast.error("You already have an active advance");

      return;
    }

    setForm({
      ...employeeAdvanceInitialValues,

      requestedInstallments: "1",
    });

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (submitLoading) {
      return;
    }

    setOpenModal(false);

    setForm({
      ...employeeAdvanceInitialValues,
    });
  };

  const handleSubmit = async () => {
    const payload = buildEmployeeAdvancePayload(form);

    const validation = createEmployeeAdvanceSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid advance details",
      );

      return;
    }

    const requestedAmount = Number(validation.data.requestedAmount);

    const requestedInstallments = Number(validation.data.requestedInstallments);

    if (
      eligibility?.eligibleAmount &&
      requestedAmount > Number(eligibility.eligibleAmount)
    ) {
      toast.error(
        `Requested amount cannot exceed ${formatMoney(
          eligibility.eligibleAmount,
        )}`,
      );

      return;
    }

    if (
      eligibility?.policy?.minimumAmount &&
      requestedAmount < Number(eligibility.policy.minimumAmount)
    ) {
      toast.error(
        `Minimum advance amount is ${formatMoney(
          eligibility.policy.minimumAmount,
        )}`,
      );

      return;
    }

    if (
      eligibility?.policy?.maximumInstallments &&
      requestedInstallments > Number(eligibility.policy.maximumInstallments)
    ) {
      toast.error(
        `Maximum ${eligibility.policy.maximumInstallments} installments are allowed`,
      );

      return;
    }

    const success = await createAdvance(validation.data);

    if (!success) {
      return;
    }

    setOpenModal(false);

    setForm({
      ...employeeAdvanceInitialValues,
    });

    await refreshCurrentView();
  };

  // View

  const handleView = async (item) => {
    const success = await fetchAdvanceBySlug(item.slug);

    if (!success) {
      return;
    }

    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    if (actionLoading) {
      return;
    }

    setDetailModalOpen(false);

    clearSelectedAdvance();
  };

  // Employee Cancel

  const handleOpenCancel = (item) => {
    if (item.requestStatus !== "PENDING") {
      toast.error("Only pending advance request can be cancelled");

      return;
    }

    setCancelRequest(item);

    setCancelRemark("");

    setCancelModalOpen(true);
  };

  const handleCloseCancel = () => {
    if (actionLoading) {
      return;
    }

    setCancelModalOpen(false);

    setCancelRequest(null);

    setCancelRemark("");
  };

  const handleCancelSubmit = async () => {
    if (!cancelRequest?.slug) {
      return;
    }

    const payload = buildCancelEmployeeAdvancePayload(cancelRemark);

    const validation = cancelEmployeeAdvanceSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Cancellation remark is required",
      );

      return;
    }

    const success = await cancelAdvance(cancelRequest.slug, validation.data);

    if (!success) {
      return;
    }

    handleCloseCancel();

    await refreshCurrentView();
  };

  // Admin Approve

  const handleOpenApprove = (item) => {
    if (item.requestStatus !== "PENDING") {
      toast.error("Only pending advance can be approved");

      return;
    }

    setApproveRequest(item);

    setApproveForm(buildApprovalFormFromAdvance(item));

    setApproveModalOpen(true);
  };

  const handleCloseApprove = () => {
    if (actionLoading) {
      return;
    }

    setApproveModalOpen(false);

    setApproveRequest(null);

    setApproveForm({
      ...employeeAdvanceApprovalInitialValues,
    });
  };

  const handleApproveChange = (field, value) => {
    setApproveForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  const handleApproveSubmit = async () => {
    if (!approveRequest?.slug) {
      return;
    }

    const payload = buildApproveEmployeeAdvancePayload(approveForm);

    const validation = approveEmployeeAdvanceSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid approval details",
      );

      return;
    }

    if (
      Number(validation.data.approvedAmount) >
      Number(approveRequest.requestedAmount)
    ) {
      toast.error("Approved amount cannot exceed requested amount");

      return;
    }

    if (
      Number(validation.data.approvedAmount) >
      Number(approveRequest.eligibleAmount)
    ) {
      toast.error("Approved amount cannot exceed eligible amount");

      return;
    }

    const maxInstallments = Number(
      approveRequest.maximumInstallmentsSnapshot ||
        approveRequest.policy?.maximumInstallments ||
        0,
    );

    if (
      maxInstallments > 0 &&
      Number(validation.data.approvedInstallments) > maxInstallments
    ) {
      toast.error(`Maximum ${maxInstallments} installments are allowed`);

      return;
    }

    const success = await approveAdvance(approveRequest.slug, validation.data);

    if (!success) {
      return;
    }

    handleCloseApprove();

    await refreshCurrentView();
  };

  // Admin Reject

  const handleOpenReject = (item) => {
    if (item.requestStatus !== "PENDING") {
      toast.error("Only pending advance can be rejected");

      return;
    }

    setRejectRequest(item);

    setRejectRemark("");

    setRejectModalOpen(true);
  };

  const handleCloseReject = () => {
    if (actionLoading) {
      return;
    }

    setRejectModalOpen(false);

    setRejectRequest(null);

    setRejectRemark("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectRequest?.slug) {
      return;
    }

    const payload = buildRejectEmployeeAdvancePayload(rejectRemark);

    const validation = rejectEmployeeAdvanceSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Rejection remark is required",
      );

      return;
    }

    const success = await rejectAdvance(rejectRequest.slug, validation.data);

    if (!success) {
      return;
    }

    handleCloseReject();

    await refreshCurrentView();
  };

  // Admin Disburse

  const handleOpenDisburse = (item) => {
    if (item.requestStatus !== "APPROVED") {
      toast.error("Only approved advance can be disbursed");

      return;
    }

    if (item.disbursementStatus === "DISBURSED") {
      toast.error("Advance is already disbursed");

      return;
    }

    setDisburseRequest(item);

    setDisburseForm(buildDisbursementFormFromAdvance(item));

    setDisburseModalOpen(true);
  };

  const handleCloseDisburse = () => {
    if (actionLoading) {
      return;
    }

    setDisburseModalOpen(false);

    setDisburseRequest(null);

    setDisburseForm({
      ...employeeAdvanceDisbursementInitialValues,
    });
  };

  const handleDisburseChange = (field, value) => {
    setDisburseForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  const handleDisburseSubmit = async () => {
    if (!disburseRequest?.slug) {
      return;
    }

    const payload = buildDisburseEmployeeAdvancePayload(disburseForm);

    const validation = disburseEmployeeAdvanceSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid disbursement details",
      );

      return;
    }

    if (
      Number(validation.data.disbursedAmount) !==
      Number(disburseRequest.approvedAmount)
    ) {
      toast.error(
        `Disbursed amount must be ${formatMoney(
          disburseRequest.approvedAmount,
        )}`,
      );

      return;
    }

    const success = await disburseAdvance(
      disburseRequest.slug,
      validation.data,
    );

    if (!success) {
      return;
    }

    handleCloseDisburse();

    await refreshCurrentView();
  };

  // Delete Restore

  const handleDelete = async (item) => {
    if (!["PENDING", "REJECTED", "CANCELLED"].includes(item.requestStatus)) {
      toast.error("Approved or disbursed advance cannot be deleted");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this advance request?",
    );

    if (!confirmed) {
      return;
    }

    const success = await deleteAdvance(item.slug);

    if (success) {
      await refreshCurrentView();
    }
  };

  const handleRestore = async (item) => {
    const success = await restoreAdvance(item.slug);

    if (success) {
      await refreshCurrentView();
    }
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  if (userLoading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl py-20">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 size={30} className="animate-spin text-indigo-500" />

          <p className="text-gray-500 text-sm">Loading advance management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-11 h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-white cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-white">
                {isAdvanceAdmin
                  ? "Employee Advance Management"
                  : "Advance Requests"}
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                {isAdvanceAdmin
                  ? "Review, approve, reject and disburse employee advance requests"
                  : "Manage and track your employee advance requests"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <GuideDownloadButton
              file={
                isAdvanceAdmin
                  ? "/hrmAdvanceInstruction/Employee_Advance_Approver_Admin_Guide.pdf"
                  : "/hrmAdvanceInstruction/Employee_Advance_Employee_User_Guide.pdf"
              }
              label="Download Guide"
            />

            {!isAdvanceAdmin && (
              <button
                type="button"
                onClick={handleOpenModal}
                disabled={eligibilityLoading || eligibility?.canApply === false}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <Plus size={17} />
                Request for Advance
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Employee Eligibility */}

      {!isAdvanceAdmin && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          {eligibilityLoading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 size={25} className="animate-spin text-indigo-500" />
            </div>
          ) : eligibility ? (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-white font-semibold">
                    Advance Eligibility
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Eligibility based on your current advance policy and salary
                    structure
                  </p>
                </div>

                <span
                  className={`inline-flex self-start lg:self-auto rounded-lg border px-3 py-1.5 text-xs font-medium ${
                    eligibility.canApply
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {eligibility.canApply
                    ? "Eligible to Apply"
                    : "Active Advance Exists"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mt-5">
                <SummaryBox
                  label="Eligible Amount"
                  value={formatMoney(eligibility.eligibleAmount)}
                />

                <SummaryBox
                  label="Basic Salary"
                  value={formatMoney(eligibility.basicSalary)}
                />

                <SummaryBox
                  label="Gross Salary"
                  value={formatMoney(eligibility.grossSalary)}
                />

                <SummaryBox
                  label="Max Installments"
                  value={eligibility.policy?.maximumInstallments ?? "-"}
                />

                <SummaryBox
                  label="Service Completed"
                  value={`${eligibility.completedServiceMonths || 0} Months`}
                />
              </div>

              <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <InfoRow
                    label="Policy"
                    value={eligibility.policy?.policyName || "-"}
                  />

                  <InfoRow
                    label="Calculation Basis"
                    value={formatStatus(eligibility.policy?.calculationBasis)}
                  />

                  <InfoRow
                    label="Minimum Amount"
                    value={
                      eligibility.policy?.minimumAmount
                        ? formatMoney(eligibility.policy.minimumAmount)
                        : "-"
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center py-6">
              Advance eligibility information is not available.
            </p>
          )}
        </div>
      )}

      {/* Admin Summary */}

      {isAdvanceAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryBox label="Total Requests" value={rows.length} />

          <SummaryBox
            label="Pending"
            value={
              rows.filter((item) => item.requestStatus === "PENDING").length
            }
          />

          <SummaryBox
            label="Approved"
            value={
              rows.filter((item) => item.requestStatus === "APPROVED").length
            }
          />

          <SummaryBox
            label="Disbursed"
            value={
              rows.filter((item) => item.disbursementStatus === "DISBURSED")
                .length
            }
          />
        </div>
      )}

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">
                {isAdvanceAdmin
                  ? "Employee Advance Requests"
                  : "Advance Request List"}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Total Requests: {filteredData.length}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={requestStatusFilter}
                onChange={(event) => setRequestStatusFilter(event.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="all">All Status</option>

                <option value="PENDING">Pending</option>

                <option value="APPROVED">Approved</option>

                <option value="REJECTED">Rejected</option>

                <option value="CANCELLED">Cancelled</option>
              </select>

              <div className="relative w-full sm:w-80">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    isAdvanceAdmin
                      ? "Search employee or request..."
                      : "Search advance request..."
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          <table
            className={`w-full ${
              isAdvanceAdmin ? "min-w-[1500px]" : "min-w-[1150px]"
            }`}
          >
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-16">
                  #
                </th>

                {isAdvanceAdmin && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Employee
                  </th>
                )}

                {isAdvanceAdmin && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    Department
                  </th>
                )}

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Request Date
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                  Requested
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                  Eligible
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Installments
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Status
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Disbursement
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Recovery
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Record
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={isAdvanceAdmin ? 12 : 10} className="py-16">
                    <div className="flex justify-center">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdvanceAdmin ? 12 : 10}
                    className="py-14 text-center text-gray-500"
                  >
                    No advance requests found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.slug}
                    className={`transition-colors ${
                      item.isActive === false
                        ? "bg-red-500/5 opacity-70"
                        : "hover:bg-gray-800/40"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}
                    </td>

                    {isAdvanceAdmin && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-gray-200 text-sm font-medium">
                          {formatEmployee(item.employee)}
                        </p>

                        {item.employee?.designation?.name && (
                          <p className="text-gray-500 text-xs mt-1">
                            {item.employee.designation.name}
                          </p>
                        )}
                      </td>
                    )}

                    {isAdvanceAdmin && (
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {item.employee?.department?.name || "-"}
                      </td>
                    )}

                    <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                      {formatDate(item.requestDate)}
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-emerald-400 font-medium whitespace-nowrap">
                      {formatMoney(item.requestedAmount)}
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-gray-300 whitespace-nowrap">
                      {formatMoney(item.eligibleAmount)}
                    </td>

                    <td className="px-4 py-3 text-center text-sm text-gray-300">
                      {item.requestedInstallments}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={item.requestStatus} />
                    </td>

                    <td className="px-4 py-3 text-center text-xs text-gray-300">
                      {formatStatus(item.disbursementStatus)}
                    </td>

                    <td className="px-4 py-3 text-center text-xs text-gray-300">
                      {formatStatus(item.recoveryStatus)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs ${
                          item.isActive
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Deleted"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(item)}
                          disabled={actionLoading}
                          className="w-8 h-8 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white flex items-center justify-center cursor-pointer disabled:opacity-50"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        {isAdvanceAdmin &&
                          item.isActive &&
                          item.disbursementStatus === "DISBURSED" &&
                          item.recoveryStatus !== "COMPLETED" &&
                          Number(item.outstandingAmount || 0) > 0 && (
                            <button
                              type="button"
                              onClick={() => handleOpenForeclosure(item)}
                              disabled={actionLoading}
                              className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                              title="Full Settlement"
                            >
                              <CircleDollarSign size={16} />
                            </button>
                          )}

                        {isAdvanceAdmin &&
                          item.isActive &&
                          item.requestStatus === "PENDING" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenApprove(item)}
                                disabled={actionLoading}
                                className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center cursor-pointer"
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenReject(item)}
                                disabled={actionLoading}
                                className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center cursor-pointer"
                                title="Reject"
                              >
                                <Ban size={16} />
                              </button>
                            </>
                          )}

                        {isAdvanceAdmin &&
                          item.isActive &&
                          item.requestStatus === "APPROVED" &&
                          item.disbursementStatus !== "DISBURSED" && (
                            <button
                              type="button"
                              onClick={() => handleOpenDisburse(item)}
                              disabled={actionLoading}
                              className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 flex items-center justify-center cursor-pointer"
                              title="Disburse"
                            >
                              <Banknote size={16} />
                            </button>
                          )}

                        {!isAdvanceAdmin &&
                          item.isActive &&
                          item.requestStatus === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => handleOpenCancel(item)}
                              disabled={actionLoading}
                              className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 flex items-center justify-center cursor-pointer"
                              title="Cancel Request"
                            >
                              <Ban size={16} />
                            </button>
                          )}

                        {!isAdvanceAdmin &&
                          (item.isActive ? (
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={
                                actionLoading ||
                                !["PENDING", "REJECTED", "CANCELLED"].includes(
                                  item.requestStatus,
                                )
                              }
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/40 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRestore(item)}
                              disabled={actionLoading}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 cursor-pointer"
                              title="Restore"
                            >
                              <RefreshCcw size={16} />
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Create Modal */}

      {!isAdvanceAdmin && openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <ModalHeader
              title="Request For Advance"
              subtitle="Submit a new employee advance request"
              close={handleCloseModal}
              loading={submitLoading}
            />

            <div className="p-5 space-y-5">
              {eligibility && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <MiniBox
                    label="Eligible"
                    value={formatMoney(eligibility.eligibleAmount)}
                  />

                  <MiniBox
                    label="Minimum"
                    value={
                      eligibility.policy?.minimumAmount
                        ? formatMoney(eligibility.policy.minimumAmount)
                        : "-"
                    }
                  />

                  <MiniBox
                    label="Max Installments"
                    value={eligibility.policy?.maximumInstallments ?? "-"}
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Reason
                  <span className="text-red-500"> *</span>
                </label>

                <textarea
                  value={form.reason}
                  onChange={(event) =>
                    handleChange("reason", event.target.value)
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Write reason..."
                  disabled={submitLoading}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AmountInput
                  label="Advance Amount"
                  value={form.requestedAmount}
                  onChange={(value) => handleChange("requestedAmount", value)}
                  disabled={submitLoading}
                />

                <InputField
                  label="Installments"
                  type="number"
                  value={form.requestedInstallments}
                  onChange={(value) =>
                    handleChange("requestedInstallments", value)
                  }
                  disabled={submitLoading}
                />
              </div>
            </div>

            <ModalFooter
              close={handleCloseModal}
              submit={handleSubmit}
              loading={submitLoading}
              submitText="Apply"
              loadingText="Applying..."
            />
          </div>
        </div>
      )}

      {/* Employee Cancel Modal */}

      {!isAdvanceAdmin && cancelModalOpen && cancelRequest && (
        <RemarkModal
          title="Cancel Advance Request"
          subtitle={formatMoney(cancelRequest.requestedAmount)}
          label="Cancellation Remark"
          value={cancelRemark}
          setValue={setCancelRemark}
          close={handleCloseCancel}
          submit={handleCancelSubmit}
          loading={actionLoading}
          submitText="Cancel Request"
          loadingText="Cancelling..."
          danger
        />
      )}

      {/* Admin Approve Modal */}

      {isAdvanceAdmin && approveModalOpen && approveRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <ModalHeader
              title="Approve Advance Request"
              subtitle={formatEmployee(approveRequest.employee)}
              close={handleCloseApprove}
              loading={actionLoading}
            />

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniBox
                  label="Requested"
                  value={formatMoney(approveRequest.requestedAmount)}
                />

                <MiniBox
                  label="Eligible"
                  value={formatMoney(approveRequest.eligibleAmount)}
                />

                <MiniBox
                  label="Requested Installments"
                  value={approveRequest.requestedInstallments}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AmountInput
                  label="Approved Amount"
                  value={approveForm.approvedAmount}
                  onChange={(value) =>
                    handleApproveChange("approvedAmount", value)
                  }
                  disabled={actionLoading}
                />

                <InputField
                  label="Approved Installments"
                  type="number"
                  value={approveForm.approvedInstallments}
                  onChange={(value) =>
                    handleApproveChange("approvedInstallments", value)
                  }
                  disabled={actionLoading}
                />
              </div>

              <RemarkField
                label="Approval Remark"
                value={approveForm.remark}
                setValue={(value) => handleApproveChange("remark", value)}
                disabled={actionLoading}
              />
            </div>

            <ModalFooter
              close={handleCloseApprove}
              submit={handleApproveSubmit}
              loading={actionLoading}
              submitText="Approve"
              loadingText="Approving..."
              success
            />
          </div>
        </div>
      )}

      {/* Admin Reject */}

      {isAdvanceAdmin && rejectModalOpen && rejectRequest && (
        <RemarkModal
          title="Reject Advance Request"
          subtitle={formatEmployee(rejectRequest.employee)}
          label="Rejection Remark"
          value={rejectRemark}
          setValue={setRejectRemark}
          close={handleCloseReject}
          submit={handleRejectSubmit}
          loading={actionLoading}
          submitText="Reject"
          loadingText="Rejecting..."
          danger
        />
      )}

      {/* Admin Disburse */}

      {isAdvanceAdmin && disburseModalOpen && disburseRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <ModalHeader
              title="Disburse Advance"
              subtitle={formatEmployee(disburseRequest.employee)}
              close={handleCloseDisburse}
              loading={actionLoading}
            />

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniBox
                  label="Approved"
                  value={formatMoney(disburseRequest.approvedAmount)}
                />

                <MiniBox
                  label="Interest"
                  value={formatMoney(disburseRequest.interestAmount)}
                />

                <MiniBox
                  label="Recoverable"
                  value={formatMoney(disburseRequest.totalRecoverableAmount)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AmountInput
                  label="Disbursed Amount"
                  value={disburseForm.disbursedAmount}
                  onChange={(value) =>
                    handleDisburseChange("disbursedAmount", value)
                  }
                  disabled={actionLoading}
                />

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Payment Mode
                    <span className="text-red-500"> *</span>
                  </label>

                  <select
                    value={disburseForm.paymentMode}
                    onChange={(event) =>
                      handleDisburseChange("paymentMode", event.target.value)
                    }
                    disabled={actionLoading}
                    className={inputClass}
                  >
                    <option value="">Select Payment Mode</option>

                    <option value="CASH">Cash</option>

                    <option value="BANK_TRANSFER">Bank Transfer</option>

                    <option value="UPI">UPI</option>

                    <option value="CHEQUE">Cheque</option>

                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <InputField
                label="Payment Reference"
                value={disburseForm.paymentReference}
                onChange={(value) =>
                  handleDisburseChange("paymentReference", value)
                }
                required={false}
                disabled={actionLoading}
              />

              <RemarkField
                label="Disbursement Remark"
                value={disburseForm.remark}
                setValue={(value) => handleDisburseChange("remark", value)}
                required={false}
                disabled={actionLoading}
              />
            </div>

            <ModalFooter
              close={handleCloseDisburse}
              submit={handleDisburseSubmit}
              loading={actionLoading}
              submitText="Disburse"
              loadingText="Disbursing..."
              success
            />
          </div>
        </div>
      )}

      {isAdvanceAdmin && foreclosureModalOpen && foreclosureRequest && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <ModalHeader
              title="Full Advance Settlement"
              subtitle={formatEmployee(foreclosureRequest.employee)}
              close={handleCloseForeclosure}
              loading={actionLoading}
            />

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniBox
                  label="Total Recoverable"
                  value={formatMoney(foreclosureRequest.totalRecoverableAmount)}
                />

                <MiniBox
                  label="Recovered"
                  value={formatMoney(foreclosureRequest.totalRecoveredAmount)}
                />

                <MiniBox
                  label="Outstanding"
                  value={formatMoney(foreclosureRequest.outstandingAmount)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Settlement Amount
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">
                  <IndianRupee
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="number"
                    value={foreclosureForm.amount}
                    readOnly
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-300 cursor-not-allowed"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Full settlement must equal the current outstanding amount.
                </p>
              </div>

              <RemarkField
                label="Settlement Remark"
                value={foreclosureForm.remark}
                setValue={(value) => handleForeclosureChange("remark", value)}
                disabled={actionLoading}
              />

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-300 text-sm font-medium">
                  Full Settlement
                </p>

                <p className="text-gray-400 text-xs leading-relaxed mt-2">
                  This will recover the entire outstanding advance amount and
                  close all remaining installments.
                </p>
              </div>
            </div>

            <ModalFooter
              close={handleCloseForeclosure}
              submit={handleForeclosureSubmit}
              loading={actionLoading}
              submitText="Settle Advance"
              loadingText="Settling..."
              success
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}

      {detailModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl max-h-[90vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <ModalHeader
              title="Advance Request Details"
              subtitle="Complete request, approval and recovery details"
              close={handleCloseDetail}
              loading={actionLoading}
            />

            {actionLoading ? (
              <div className="py-16 flex justify-center">
                <Loader2 size={28} className="animate-spin text-indigo-500" />
              </div>
            ) : selectedAdvance ? (
              <div className="p-5 overflow-x-auto overflow-y-auto custom-scrollbar space-y-5">
                {selectedAdvance.employee && (
                  <>
                    <SectionTitle>Employee</SectionTitle>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <DetailBox
                        label="Employee"
                        value={formatEmployee(selectedAdvance.employee)}
                      />

                      <DetailBox
                        label="Department"
                        value={
                          selectedAdvance.employee?.department?.name || "-"
                        }
                      />

                      <DetailBox
                        label="Designation"
                        value={
                          selectedAdvance.employee?.designation?.name || "-"
                        }
                      />

                      <DetailBox
                        label="Joining Date"
                        value={formatDate(
                          selectedAdvance.employee?.joiningDate,
                        )}
                      />
                    </div>
                  </>
                )}

                <SectionTitle>Request</SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DetailBox
                    label="Request Date"
                    value={formatDate(selectedAdvance.requestDate)}
                  />

                  <DetailBox
                    label="Requested Amount"
                    value={formatMoney(selectedAdvance.requestedAmount)}
                  />

                  <DetailBox
                    label="Eligible Amount"
                    value={formatMoney(selectedAdvance.eligibleAmount)}
                  />

                  <DetailBox
                    label="Requested Installments"
                    value={selectedAdvance.requestedInstallments}
                  />

                  <DetailBox
                    label="Status"
                    value={formatStatus(selectedAdvance.requestStatus)}
                  />

                  <DetailBox
                    label="Policy"
                    value={selectedAdvance.policy?.policyName || "-"}
                  />

                  <DetailBox
                    label="Calculation Basis"
                    value={formatStatus(
                      selectedAdvance.calculationBasisSnapshot,
                    )}
                  />

                  <DetailBox
                    label="Salary Basis"
                    value={formatMoney(selectedAdvance.salaryBasisAmount)}
                  />
                </div>

                <TextBox label="Reason" value={selectedAdvance.reason} />

                {selectedAdvance.requestStatus === "APPROVED" && (
                  <>
                    <SectionTitle>Approval</SectionTitle>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <DetailBox
                        label="Approved Amount"
                        value={formatMoney(selectedAdvance.approvedAmount)}
                      />

                      <DetailBox
                        label="Approved Installments"
                        value={selectedAdvance.approvedInstallments || "-"}
                      />

                      <DetailBox
                        label="Approved By"
                        value={selectedAdvance.approvedBy?.name || "-"}
                      />

                      <DetailBox
                        label="Approved At"
                        value={formatDateTime(selectedAdvance.approvedAt)}
                      />
                    </div>
                  </>
                )}

                {selectedAdvance.requestStatus === "REJECTED" && (
                  <>
                    <SectionTitle>Rejection</SectionTitle>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailBox
                        label="Rejected By"
                        value={selectedAdvance.rejectedBy?.name || "-"}
                      />

                      <DetailBox
                        label="Rejected At"
                        value={formatDateTime(selectedAdvance.rejectedAt)}
                      />
                    </div>
                  </>
                )}

                {selectedAdvance.approvalRemark && (
                  <TextBox
                    label={
                      selectedAdvance.requestStatus === "CANCELLED"
                        ? "Cancellation Remark"
                        : "Approval / Rejection Remark"
                    }
                    value={selectedAdvance.approvalRemark}
                  />
                )}

                {selectedAdvance.requestStatus === "APPROVED" && (
                  <>
                    <SectionTitle>Financial Details</SectionTitle>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <DetailBox
                        label="Interest Type"
                        value={formatStatus(
                          selectedAdvance.interestTypeSnapshot,
                        )}
                      />

                      <DetailBox
                        label="Interest"
                        value={formatMoney(selectedAdvance.interestAmount)}
                      />

                      <DetailBox
                        label="Total Recoverable"
                        value={formatMoney(
                          selectedAdvance.totalRecoverableAmount,
                        )}
                      />

                      <DetailBox
                        label="Outstanding"
                        value={formatMoney(selectedAdvance.outstandingAmount)}
                      />

                      <DetailBox
                        label="Recovered"
                        value={formatMoney(
                          selectedAdvance.totalRecoveredAmount,
                        )}
                      />

                      <DetailBox
                        label="Recovery Status"
                        value={formatStatus(selectedAdvance.recoveryStatus)}
                      />

                      <DetailBox
                        label="Disbursement"
                        value={formatStatus(selectedAdvance.disbursementStatus)}
                      />

                      <DetailBox
                        label="Disbursed Amount"
                        value={formatMoney(selectedAdvance.disbursedAmount)}
                      />
                    </div>
                  </>
                )}

                {selectedAdvance.isForeclosed && (
                  <>
                    <SectionTitle>Full Settlement</SectionTitle>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <DetailBox label="Settlement Status" value="Foreclosed" />

                      <DetailBox
                        label="Settlement Amount"
                        value={formatMoney(selectedAdvance.foreclosureAmount)}
                      />

                      <DetailBox
                        label="Settled At"
                        value={formatDateTime(selectedAdvance.foreclosedAt)}
                      />

                      <DetailBox
                        label="Settled By"
                        value={selectedAdvance.foreclosedBy?.name || "-"}
                      />
                    </div>

                    {selectedAdvance.foreclosureRemark && (
                      <TextBox
                        label="Settlement Remark"
                        value={selectedAdvance.foreclosureRemark}
                      />
                    )}
                  </>
                )}

                {selectedAdvance.disbursementStatus === "DISBURSED" && (
                  <>
                    <SectionTitle>Disbursement</SectionTitle>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <DetailBox
                        label="Payment Mode"
                        value={formatStatus(selectedAdvance.paymentMode)}
                      />

                      <DetailBox
                        label="Payment Reference"
                        value={selectedAdvance.paymentReference || "-"}
                      />

                      <DetailBox
                        label="Disbursed At"
                        value={formatDateTime(selectedAdvance.disbursedAt)}
                      />

                      <DetailBox
                        label="Recovery Status"
                        value={formatStatus(selectedAdvance.recoveryStatus)}
                      />
                    </div>

                    {selectedAdvance.disbursementRemark && (
                      <TextBox
                        label="Disbursement Remark"
                        value={selectedAdvance.disbursementRemark}
                      />
                    )}
                  </>
                )}

                {Array.isArray(selectedAdvance.installments) &&
                  selectedAdvance.installments.length > 0 && (
                    <>
                      <SectionTitle>Installments</SectionTitle>

                      <div className="border border-gray-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto overflow-y-auto max-h-[300px] custom-scrollbar">
                          <table className="w-full min-w-[750px]">
                            <thead className="bg-gray-800 sticky top-0">
                              <tr>
                                <th className="p-3 text-left text-xs text-gray-400">
                                  #
                                </th>

                                <th className="p-3 text-left text-xs text-gray-400">
                                  Due Month
                                </th>

                                <th className="p-3 text-right text-xs text-gray-400">
                                  Due
                                </th>

                                <th className="p-3 text-right text-xs text-gray-400">
                                  Recovered
                                </th>

                                <th className="p-3 text-center text-xs text-gray-400">
                                  Status
                                </th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-800">
                              {selectedAdvance.installments.map(
                                (installment) => (
                                  <tr key={installment.slug}>
                                    <td className="p-3 text-sm text-gray-300">
                                      {installment.installmentNo}
                                    </td>

                                    <td className="p-3 text-sm text-gray-300">
                                      {formatMonth(installment.dueMonth)}
                                    </td>

                                    <td className="p-3 text-right text-sm text-gray-300">
                                      {formatMoney(installment.dueAmount)}
                                    </td>

                                    <td className="p-3 text-right text-sm text-emerald-400">
                                      {formatMoney(installment.recoveredAmount)}
                                    </td>

                                    <td className="p-3 text-center text-xs text-gray-300">
                                      {formatStatus(installment.status)}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            ) : (
              <div className="py-14 text-center text-gray-500">
                Advance request not found
              </div>
            )}

            <div className="px-5 py-4 border-t border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={handleCloseDetail}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ModalHeader = ({ title, subtitle, close, loading }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
    <div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>

    <button
      type="button"
      onClick={close}
      disabled={loading}
      className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
    >
      <X size={20} />
    </button>
  </div>
);

const ModalFooter = ({
  close,
  submit,
  loading,
  submitText,
  loadingText,
  success = false,
}) => (
  <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
    <button
      type="button"
      onClick={close}
      disabled={loading}
      className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
    >
      Close
    </button>

    <button
      type="button"
      onClick={submit}
      disabled={loading}
      className={`px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
        success
          ? "bg-emerald-600 hover:bg-emerald-700"
          : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}

      {loading ? loadingText : submitText}
    </button>
  </div>
);

const RemarkModal = ({
  title,
  subtitle,
  label,
  value,
  setValue,
  close,
  submit,
  loading,
  submitText,
  loadingText,
  danger = false,
}) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
      <ModalHeader
        title={title}
        subtitle={subtitle}
        close={close}
        loading={loading}
      />

      <div className="p-5">
        <RemarkField
          label={label}
          value={value}
          setValue={setValue}
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
        <button
          type="button"
          onClick={close}
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
        >
          Close
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className={`px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
            danger
              ? "bg-red-500 hover:bg-red-600"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}

          {loading ? loadingText : submitText}
        </button>
      </div>
    </div>
  </div>
);

const AmountInput = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-gray-300 text-sm mb-2">
      {label}
      <span className="text-red-500"> *</span>
    </label>

    <div className="relative">
      <IndianRupee
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-50"
      />
    </div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  disabled,
}) => (
  <div>
    <label className="block text-gray-300 text-sm mb-2">
      {label}

      {required && <span className="text-red-500"> *</span>}
    </label>

    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-50"
    />
  </div>
);

const RemarkField = ({ label, value, setValue, required = true, disabled }) => (
  <div>
    <label className="block text-gray-300 text-sm mb-2">
      {label}

      {required && <span className="text-red-500"> *</span>}
    </label>

    <textarea
      value={value}
      onChange={(event) => setValue(event.target.value)}
      rows={4}
      maxLength={500}
      disabled={disabled}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white resize-none outline-none focus:border-indigo-500 disabled:opacity-50"
    />

    <p className="text-right text-xs text-gray-500 mt-1">
      {value?.length || 0}
      /500
    </p>
  </div>
);

const SummaryBox = ({ label, value }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
    <p className="text-gray-500 text-xs uppercase">{label}</p>

    <p className="text-white text-lg font-semibold mt-2">{value}</p>
  </div>
);

const MiniBox = ({ label, value }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3">
    <p className="text-gray-500 text-xs">{label}</p>

    <p className="text-gray-200 text-sm font-medium mt-1">{value}</p>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>

    <p className="text-gray-300 mt-1">{value}</p>
  </div>
);

const DetailBox = ({ label, value }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
    <p className="text-gray-500 text-xs uppercase">{label}</p>

    <p className="text-gray-200 text-sm mt-2">{value ?? "-"}</p>
  </div>
);

const TextBox = ({ label, value }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
    <p className="text-gray-500 text-xs uppercase">{label}</p>

    <p className="text-gray-200 text-sm mt-2 whitespace-pre-wrap">
      {value || "-"}
    </p>
  </div>
);

const SectionTitle = ({ children }) => (
  <div className="border-b border-gray-800 pb-2">
    <h3 className="text-white font-semibold">{children}</h3>
  </div>
);

const StatusBadge = ({ status }) => {
  const value = String(status || "").toUpperCase();

  let style = "bg-amber-500/10 border-amber-500/20 text-amber-400";

  if (value === "APPROVED") {
    style = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  }

  if (value === "REJECTED" || value === "CANCELLED") {
    style = "bg-red-500/10 border-red-500/20 text-red-400";
  }

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {formatStatus(status)}
    </span>
  );
};

const formatEmployee = (employee) => {
  if (!employee) {
    return "-";
  }

  const name = employee.fullName || "-";

  const employeeId = employee.employeeId || employee.employeeCode || "";

  return employeeId ? `${name} (${employeeId})` : name;
};

const formatMoney = (value) => {
  const amount = Number(value);

  if (value === null || value === undefined || !Number.isFinite(amount)) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatStatus = (value) => {
  if (!value) {
    return "-";
  }

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",

    hour: "2-digit",
    minute: "2-digit",

    hour12: true,
  });
};

const formatMonth = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default AdvanceRequests;
