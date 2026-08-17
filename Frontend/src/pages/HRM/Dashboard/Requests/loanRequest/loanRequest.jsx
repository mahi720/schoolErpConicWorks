import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  IndianRupee,
  List,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  TrendingDown,
  WalletCards,
  X,
  Check,
  CircleDollarSign,
  Banknote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useEmployeeLoanStore } from "../../../../../store/hrm/request/loanRequest/employeeLoanStore";

import {
  employeeLoanInitialValues,
  buildEmployeeLoanPayload,
  validateEmployeeLoanRequest,
} from "../../../../../validations/hrm/request/loanRequest/employeeLoanValidation";

const LoanRequests = () => {
  const navigate = useNavigate();

  const {
    eligibility,
    planPreview,
    myLoans,
    employeeLoans,
    selectedLoan,
    installments,
    foreclosurePreview,

    loading,
    userLoading,
    eligibilityLoading,
    previewLoading,
    submitLoading,
    actionLoading,
    installmentLoading,
    foreclosureLoading,

    fetchEligibility,
    fetchPlanPreview,
    fetchMyLoans,
    fetchLoanBySlug,
    fetchInstallments,

    createLoan,

    approveLoan,
    rejectLoan,
    disburseLoan,
    recoverInstallment,

    fetchForeclosurePreview,
    forecloseLoan,

    deleteLoan,
    restoreLoan,

    currentUser,

    fetchCurrentUser,
    fetchEmployeeLoans,

    clearSelectedLoan,
    clearPlanPreview,
    clearForeclosurePreview,
  } = useEmployeeLoanStore();

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);

  const [openEmiModal, setOpenEmiModal] = useState(false);

  const [openDeductionModal, setOpenDeductionModal] = useState(false);

  const [openPlanDetailModal, setOpenPlanDetailModal] = useState(false);

  const [selectedPlanOption, setSelectedPlanOption] = useState(null);

  const [openApproveModal, setOpenApproveModal] = useState(false);

  const [openRejectModal, setOpenRejectModal] = useState(false);

  const [actionLoan, setActionLoan] = useState(null);

  const [approveForm, setApproveForm] = useState({
    approvedAmount: "",
    loanInterestSlug: "",
    remark: "",
  });

  const [rejectRemark, setRejectRemark] = useState("");

  const [openForeclosureModal, setOpenForeclosureModal] = useState(false);

  const [foreclosureLoan, setForeclosureLoan] = useState(null);

  const [foreclosureRemark, setForeclosureRemark] = useState("");

  const [openDisburseModal, setOpenDisburseModal] = useState(false);

  const [disbursementLoan, setDisbursementLoan] = useState(null);

  const [disbursementForm, setDisbursementForm] = useState({
    disbursedAmount: "",
    paymentMode: "BANK_TRANSFER",
    paymentReference: "",
    remark: "",
  });

  const [form, setForm] = useState({
    ...employeeLoanInitialValues,
  });

  const LOAN_ADMIN_ROLES = ["SUPER_ADMIN", "SCHOOL_ADMIN", "HR"];

  const role = currentUser?.role || "";

  const isLoanAdmin = LOAN_ADMIN_ROLES.includes(role);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (isLoanAdmin) {
      fetchEmployeeLoans({
        status: "all",
      });

      return;
    }

    Promise.all([
      fetchEligibility(),

      fetchMyLoans({
        status: "all",
      }),
    ]);
  }, [
    currentUser,
    isLoanAdmin,
    fetchEligibility,
    fetchMyLoans,
    fetchEmployeeLoans,
  ]);

  const canApproveOrReject = (item) => {
    return (
      isLoanAdmin &&
      item?.isActive !== false &&
      normalizeStatus(item?.requestStatus) === "PENDING"
    );
  };

  const getNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  };

  const formatMoney = (value) => {
    return getNumber(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleOpenApprove = (item) => {
    setActionLoan(item);

    setApproveForm({
      approvedAmount: item?.requestedAmount ?? item?.approvedAmount ?? "",

      loanInterestSlug: item?.loanPlan?.slug || "",

      remark: "",
    });

    setOpenApproveModal(true);
  };

  const handleApproveLoan = async () => {
    if (!actionLoan?.slug) {
      return;
    }

    if (!approveForm.approvedAmount) {
      toast.error("Approved amount is required");
      return;
    }

    if (!approveForm.loanInterestSlug) {
      toast.error("Repayment plan is required");
      return;
    }

    if (!approveForm.remark.trim()) {
      toast.error("Approval remark is required");
      return;
    }

    const success = await approveLoan(actionLoan.slug, {
      approvedAmount: Number(approveForm.approvedAmount),

      loanInterestSlug: approveForm.loanInterestSlug,

      remark: approveForm.remark.trim(),
    });

    if (!success) {
      return;
    }

    setOpenApproveModal(false);
    setActionLoan(null);

    await fetchEmployeeLoans({
      status: "all",
    });
  };

  const handleOpenReject = (item) => {
    setActionLoan(item);
    setRejectRemark("");
    setOpenRejectModal(true);
  };

  const handleRejectLoan = async () => {
    if (!actionLoan?.slug) {
      return;
    }

    if (!rejectRemark.trim()) {
      toast.error("Rejection remark is required");
      return;
    }

    const success = await rejectLoan(actionLoan.slug, {
      remark: rejectRemark.trim(),
    });

    if (!success) {
      return;
    }

    setOpenRejectModal(false);
    setActionLoan(null);
    setRejectRemark("");

    await fetchEmployeeLoans({
      status: "all",
    });
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
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

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const normalizeStatus = (value) => {
    return String(value || "")
      .trim()
      .toUpperCase();
  };

  const getLoanAmount = (loan) => {
    return getNumber(
      loan?.approvedAmount ?? loan?.loanAmount ?? loan?.requestedAmount ?? 0,
    );
  };

  const getLoanDuration = (loan) => {
    return getNumber(
      loan?.approvedDurationMonths ??
        loan?.requestedDurationMonths ??
        loan?.durationMonths ??
        loan?.loanInterest?.durationMonths ??
        loan?.loanPlan?.durationMonths ??
        loan?.duration ??
        0,
    );
  };

  const getInterestRate = (loan) => {
    return getNumber(
      loan?.approvedAnnualInterest ??
        loan?.requestedAnnualInterest ??
        loan?.annualInterest ??
        loan?.interestRate ??
        loan?.loanInterest?.annualInterest ??
        loan?.loanPlan?.annualInterest ??
        0,
    );
  };

  const getMonthlyEmi = (loan) => {
    return getNumber(
      loan?.approvedEmi ??
        loan?.requestedEmi ??
        loan?.emiAmount ??
        loan?.monthlyEmi ??
        loan?.emi ??
        loan?.monthlyDeduction ??
        0,
    );
  };

  const getRequestId = (loan) => {
    return loan?.requestId || loan?.loanNumber || loan?.slug || "-";
  };

  const getInstallmentAmount = (installment) => {
    return getNumber(
      installment?.installmentAmount ??
        installment?.emiAmount ??
        installment?.amount ??
        0,
    );
  };

  const getRecoveredAmount = (installment) => {
    return getNumber(
      installment?.recoveredAmount ??
        installment?.paidAmount ??
        installment?.deductedAmount ??
        0,
    );
  };

  const getPrincipalAmount = (installment) => {
    return getNumber(
      installment?.principalAmount ?? installment?.principal ?? 0,
    );
  };

  const getInterestAmount = (installment) => {
    return getNumber(installment?.interestAmount ?? installment?.interest ?? 0);
  };

  const getOpeningPrincipal = (installment) => {
    return getNumber(
      installment?.openingPrincipal ?? installment?.openingBalance ?? 0,
    );
  };

  const getClosingPrincipal = (installment) => {
    return getNumber(
      installment?.closingPrincipal ?? installment?.closingBalance ?? 0,
    );
  };

  const getInstallmentStatus = (installment) => {
    return normalizeStatus(
      installment?.installmentStatus ?? installment?.status ?? "PENDING",
    );
  };

  const rows = useMemo(() => {
    if (isLoanAdmin) {
      return Array.isArray(employeeLoans) ? employeeLoans : [];
    }

    return Array.isArray(myLoans) ? myLoans : [];
  }, [isLoanAdmin, employeeLoans, myLoans]);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return rows;
    }

    return rows.filter((item) => {
      const requestId = String(getRequestId(item)).toLowerCase();

      const reason = String(item?.reason || "").toLowerCase();

      const status = String(
        item?.requestStatus || item?.loanStatus || item?.status || "",
      ).toLowerCase();

      const employeeName = String(item?.employee?.fullName || "").toLowerCase();

      const employeeId = String(
        item?.employee?.employeeId || item?.employee?.employeeCode || "",
      ).toLowerCase();

      return (
        requestId.includes(keyword) ||
        reason.includes(keyword) ||
        status.includes(keyword) ||
        employeeName.includes(keyword) ||
        employeeId.includes(keyword)
      );
    });
  }, [rows, search]);

  const deductionSummary = useMemo(() => {
    const rows = installments || [];

    const installmentTotal = rows.reduce(
      (total, item) => total + getInstallmentAmount(item),
      0,
    );

    const installmentRecovered = rows.reduce(
      (total, item) => total + getRecoveredAmount(item),
      0,
    );

    const totalRecoverable =
      getNumber(selectedLoan?.totalRecoverableAmount) || installmentTotal;

    const totalRecovered =
      getNumber(selectedLoan?.totalRecoveredAmount) || installmentRecovered;

    const remainingAmount = selectedLoan?.isForeclosed
      ? 0
      : selectedLoan?.outstandingAmount !== null &&
          selectedLoan?.outstandingAmount !== undefined
        ? getNumber(selectedLoan.outstandingAmount)
        : Math.max(0, totalRecoverable - totalRecovered);

    const paidInstallments = rows.filter((item) =>
      ["RECOVERED", "SETTLED"].includes(getInstallmentStatus(item)),
    ).length;

    const partialInstallments = rows.filter(
      (item) => getInstallmentStatus(item) === "PARTIALLY_RECOVERED",
    ).length;

    const pendingInstallments = rows.filter((item) =>
      ["PENDING"].includes(getInstallmentStatus(item)),
    ).length;

    return {
      totalInstallmentAmount: totalRecoverable,

      totalRecovered,

      remainingAmount,

      paidInstallments,

      partialInstallments,

      pendingInstallments,

      totalInstallments: rows.length,
    };
  }, [installments, selectedLoan]);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (field === "loanAmount") {
      setForm((previous) => ({
        ...previous,
        loanAmount: value,
        loanInterestSlug: "",
      }));

      clearPlanPreview();
    }
  };

  const handleOpenModal = () => {
    setForm({
      ...employeeLoanInitialValues,
    });

    clearPlanPreview();

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (submitLoading) {
      return;
    }

    setOpenModal(false);

    setForm({
      ...employeeLoanInitialValues,
    });

    clearPlanPreview();
  };

  const handleCalculatePlans = async () => {
    const amount = Number(form.loanAmount);

    if (!amount || amount <= 0) {
      toast.error("Please enter valid loan amount");

      return;
    }

    await fetchPlanPreview(amount);
  };

  const calculateRepaymentSchedule = (option) => {
    const loanAmount = getNumber(form.loanAmount);

    const annualInterest = getNumber(option?.annualInterest);

    const durationMonths = getNumber(option?.durationMonths);

    const emiAmount = getNumber(option?.emi);

    if (loanAmount <= 0 || durationMonths <= 0 || emiAmount <= 0) {
      return [];
    }

    const monthlyInterestRate = annualInterest / 12 / 100;

    let openingPrincipal = loanAmount;

    const schedule = [];

    for (let month = 1; month <= durationMonths; month += 1) {
      let interestAmount = openingPrincipal * monthlyInterestRate;

      let principalAmount = emiAmount - interestAmount;

      if (month === durationMonths) {
        principalAmount = openingPrincipal;
      }

      principalAmount = Math.min(principalAmount, openingPrincipal);

      const installmentAmount = principalAmount + interestAmount;

      const closingPrincipal = Math.max(0, openingPrincipal - principalAmount);

      schedule.push({
        installmentNo: month,

        openingPrincipal,

        installmentAmount,

        principalAmount,

        interestAmount,

        closingPrincipal,
      });

      openingPrincipal = closingPrincipal;
    }

    return schedule;
  };

  const handleViewPlanDetails = (option) => {
    setSelectedPlanOption(option);

    setOpenPlanDetailModal(true);
  };

  const handleClosePlanDetails = () => {
    setOpenPlanDetailModal(false);

    setSelectedPlanOption(null);
  };

  const handleApplyLoan = async (option) => {
    const nextForm = {
      ...form,

      loanInterestSlug: option?.slug || option?.loanInterestSlug || "",
    };

    const validation = validateEmployeeLoanRequest(nextForm);

    if (!validation.success) {
      toast.error(
        validation.error?.issues?.[0]?.message ||
          "Please enter valid loan details",
      );

      return;
    }

    const payload = buildEmployeeLoanPayload(nextForm);

    const success = await createLoan(payload);

    if (!success) {
      return;
    }

    handleCloseModal();

    await Promise.all([
      fetchEligibility(),

      fetchMyLoans({
        status: "all",
      }),
    ]);
  };

  const handleView = async (item) => {
    clearSelectedLoan();

    setOpenViewModal(true);

    const success = await fetchLoanBySlug(item.slug);

    if (!success) {
      setOpenViewModal(false);
    }
  };

  const handleViewEmi = async (item) => {
    clearSelectedLoan();

    setOpenEmiModal(true);

    const success = await fetchLoanBySlug(item.slug);

    if (!success) {
      setOpenEmiModal(false);

      return;
    }

    await fetchInstallments(item.slug);
  };

  const handleViewDeductions = async (item) => {
    clearSelectedLoan();

    setOpenDeductionModal(true);

    const success = await fetchLoanBySlug(item.slug);

    if (!success) {
      setOpenDeductionModal(false);

      return;
    }

    await fetchInstallments(item.slug);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this loan request?",
    );

    if (!confirmed) {
      return;
    }

    const success = await deleteLoan(item.slug);

    if (success) {
      await fetchMyLoans({
        status: "all",
      });
    }
  };

  const handleRestore = async (item) => {
    const success = await restoreLoan(item.slug);

    if (success) {
      await fetchMyLoans({
        status: "all",
      });
    }
  };

  const handleOpenDisbursement = (item) => {
    if (!item?.slug) {
      return;
    }

    const approvedAmount = getNumber(
      item?.approvedAmount ?? item?.requestedAmount ?? 0,
    );

    if (approvedAmount <= 0) {
      toast.error("Approved loan amount is not available");
      return;
    }

    setDisbursementLoan(item);

    setDisbursementForm({
      disbursedAmount: String(approvedAmount),
      paymentMode: "BANK_TRANSFER",
      paymentReference: "",
      remark: "",
    });

    setOpenDisburseModal(true);
  };

  const handleCloseDisbursement = () => {
    if (actionLoading) {
      return;
    }

    setOpenDisburseModal(false);
    setDisbursementLoan(null);

    setDisbursementForm({
      disbursedAmount: "",
      paymentMode: "BANK_TRANSFER",
      paymentReference: "",
      remark: "",
    });
  };

  const handleDisburseLoan = async () => {
    if (!disbursementLoan?.slug) {
      return;
    }

    const approvedAmount = getNumber(
      disbursementLoan?.approvedAmount ??
        disbursementLoan?.requestedAmount ??
        0,
    );

    const disbursedAmount = getNumber(disbursementForm.disbursedAmount);

    if (approvedAmount <= 0) {
      toast.error("Approved amount is not available");
      return;
    }

    if (disbursedAmount <= 0) {
      toast.error("Disbursed amount is required");
      return;
    }

    if (disbursedAmount !== approvedAmount) {
      toast.error(
        `Disbursed amount must be equal to approved amount ₹ ${formatMoney(
          approvedAmount,
        )}`,
      );
      return;
    }

    if (!disbursementForm.paymentMode) {
      toast.error("Payment mode is required");
      return;
    }

    const success = await disburseLoan(disbursementLoan.slug, {
      disbursedAmount,
      paymentMode: disbursementForm.paymentMode,
      paymentReference: disbursementForm.paymentReference?.trim() || null,
      remark: disbursementForm.remark?.trim() || null,
    });

    if (!success) {
      return;
    }

    handleCloseDisbursement();

    await fetchEmployeeLoans({
      status: "all",
    });
  };

  const getStatusClass = (status) => {
    const value = normalizeStatus(status);

    if (
      value === "APPROVED" ||
      value === "DISBURSED" ||
      value === "COMPLETED"
    ) {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (value === "REJECTED" || value === "CANCELLED") {
      return "bg-red-500/10 border-red-500/20 text-red-400";
    }

    if (value === "FORECLOSED") {
      return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
    }

    return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  };

  const handleOpenForeclosure = async (item) => {
    setForeclosureLoan(item);

    setForeclosureRemark("");

    clearForeclosurePreview?.();

    const success = await fetchForeclosurePreview(item.slug);

    if (!success) {
      setForeclosureLoan(null);

      return;
    }

    setOpenForeclosureModal(true);
  };

  const handleForecloseLoan = async () => {
    if (!foreclosureLoan?.slug) {
      return;
    }

    if (!foreclosurePreview) {
      toast.error("Foreclosure calculation is not available");

      return;
    }

    if (!foreclosureRemark.trim()) {
      toast.error("Foreclosure remark is required");

      return;
    }

    const settlementAmount = Number(foreclosurePreview?.settlementAmount);

    if (!settlementAmount || settlementAmount <= 0) {
      toast.error("Invalid settlement amount");

      return;
    }

    const success = await forecloseLoan(foreclosureLoan.slug, {
      settlementAmount,

      remark: foreclosureRemark.trim(),
    });

    if (!success) {
      return;
    }

    setOpenForeclosureModal(false);

    setForeclosureLoan(null);

    setForeclosureRemark("");

    clearForeclosurePreview?.();

    await fetchEmployeeLoans({
      status: "all",
    });
  };

  const getInstallmentStatusClass = (status) => {
    const value = normalizeStatus(status);

    if (value === "RECOVERED" || value === "SETTLED") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (value === "PARTIALLY_RECOVERED") {
      return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    }

    if (value === "SKIPPED") {
      return "bg-red-500/10 border-red-500/20 text-red-400";
    }

    return "bg-gray-700 border-gray-600 text-gray-300";
  };

  const getDisplayLoanStatus = (loan) => {
    if (loan?.isForeclosed) {
      return "FORECLOSED";
    }

    if (normalizeStatus(loan?.recoveryStatus) === "COMPLETED") {
      return "COMPLETED";
    }

    if (normalizeStatus(loan?.disbursementStatus) === "DISBURSED") {
      return "DISBURSED";
    }

    return loan?.requestStatus || "-";
  };

  const canShowEmi = (item) => {
    const status = normalizeStatus(
      item?.requestStatus || item?.loanStatus || item?.status,
    );

    return [
      "APPROVED",
      "DISBURSED",
      "ACTIVE",
      "COMPLETED",
      "FORECLOSED",
    ].includes(status);
  };

  const canShowDeductions = (item) => {
    if (item?.isForeclosed) {
      return true;
    }

    const disbursementStatus = normalizeStatus(item?.disbursementStatus);
    const recoveryStatus = normalizeStatus(item?.recoveryStatus);

    return (
      disbursementStatus === "DISBURSED" ||
      recoveryStatus === "RUNNING" ||
      recoveryStatus === "COMPLETED"
    );
  };

  const canDisburseLoan = (item) => {
    if (!isLoanAdmin) {
      return false;
    }

    if (item?.isActive === false) {
      return false;
    }

    if (item?.isForeclosed) {
      return false;
    }

    const requestStatus = normalizeStatus(item?.requestStatus);
    const disbursementStatus = normalizeStatus(item?.disbursementStatus);

    return (
      requestStatus === "APPROVED" &&
      (!disbursementStatus || disbursementStatus === "NOT_DISBURSED")
    );
  };

  const canForecloseLoan = (item) => {
    if (!isLoanAdmin) {
      return false;
    }

    if (item?.isActive === false) {
      return false;
    }

    if (item?.isForeclosed) {
      return false;
    }

    const requestStatus = normalizeStatus(item?.requestStatus);

    const disbursementStatus = normalizeStatus(item?.disbursementStatus);

    const recoveryStatus = normalizeStatus(item?.recoveryStatus);

    return (
      requestStatus === "APPROVED" &&
      disbursementStatus === "DISBURSED" &&
      recoveryStatus === "RUNNING"
    );
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
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
                Loan Requests
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                {isLoanAdmin ? "Employee Loan Requests" : "My Loan Requests"}
              </p>
            </div>
          </div>

          {!isLoanAdmin && (
            <button
              type="button"
              onClick={handleOpenModal}
              disabled={eligibilityLoading}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {eligibilityLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Plus size={17} />
              )}
              Request for Loan
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">Loan Request List</h2>

              <p className="text-gray-500 text-sm mt-1">
                Total Requests: {filteredData.length}
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search loan request..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          <table className="w-full min-w-[1500px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  SNo.
                </th>

                {isLoanAdmin && (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      Employee
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      Department / Designation
                    </th>
                  </>
                )}

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Amount
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Interest
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Duration
                  <span className="block text-[10px] text-gray-500">
                    in months
                  </span>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Monthly EMI
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Reason
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Disbursement
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Recovery
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Status
                </th>

                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Request Id
                </th> */}

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center">
                    <Loader2
                      size={24}
                      className="animate-spin text-indigo-400 mx-auto"
                    />

                    <p className="text-gray-500 text-sm mt-3">
                      Loading loan requests...
                    </p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center text-gray-500">
                    No loan requests found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  // const status =
                  //   item?.requestStatus || item?.loanStatus || item?.status;

                  const status = getDisplayLoanStatus(item);

                  return (
                    <tr
                      key={item.slug}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {index + 1}.
                      </td>

                      {isLoanAdmin && (
                        <>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-white">
                              {item?.employee?.fullName || "-"}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {item?.employee?.employeeId ||
                                item?.employee?.employeeCode ||
                                "-"}
                            </p>
                          </td>

                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-300">
                              {item?.employee?.department?.name || "-"}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {item?.employee?.designation?.name || "-"}
                            </p>
                          </td>
                        </>
                      )}

                      <td className="px-4 py-3 text-sm text-gray-300">
                        {formatDate(item?.requestDate || item?.createdAt)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300">
                        ₹ {formatMoney(getLoanAmount(item))}
                      </td>

                      <td className="px-4 py-3 text-sm text-amber-400">
                        {getInterestRate(item)}%
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300 text-center">
                        {getLoanDuration(item) || "-"}
                      </td>

                      <td className="px-4 py-3 text-sm text-emerald-400 font-medium">
                        ₹ {formatMoney(getMonthlyEmi(item))}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300 max-w-[220px]">
                        <p className="truncate">{item?.reason || "-"}</p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-center">
                          <span
                            className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
                              normalizeStatus(item?.disbursementStatus) ===
                              "DISBURSED"
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                : "bg-gray-700/50 border-gray-600 text-gray-400"
                            }`}
                          >
                            {item?.disbursementStatus || "NOT_DISBURSED"}
                          </span>

                          {item?.disbursedAt && (
                            <p className="text-[11px] text-gray-500 mt-1 whitespace-nowrap">
                              {formatDate(item.disbursedAt)}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-center">
                          <span
                            className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
                              item?.isForeclosed
                                ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
                                : normalizeStatus(item?.recoveryStatus) ===
                                    "COMPLETED"
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : normalizeStatus(item?.recoveryStatus) ===
                                      "RUNNING"
                                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                                    : "bg-gray-700/50 border-gray-600 text-gray-400"
                            }`}
                          >
                            {item?.isForeclosed
                              ? "FORECLOSED"
                              : item?.recoveryStatus || "NOT_STARTED"}
                          </span>

                          {normalizeStatus(item?.recoveryStatus) !==
                            "NOT_STARTED" && (
                            <div className="mt-1 text-[11px] text-gray-500 whitespace-nowrap">
                              ₹{formatMoney(item?.totalRecoveredAmount)} / ₹
                              {formatMoney(item?.totalRecoverableAmount)}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            status,
                          )}`}
                        >
                          {status || "-"}
                        </span>
                      </td>

                      {/* <td className="px-4 py-3 text-sm text-indigo-400">
                        {getRequestId(item)}
                      </td> */}

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {canApproveOrReject(item) && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenApprove(item)}
                                disabled={actionLoading}
                                className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                title="Approve Loan"
                              >
                                <Check size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenReject(item)}
                                disabled={actionLoading}
                                className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                title="Reject Loan"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleView(item)}
                            className="w-8 h-8 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white flex items-center justify-center cursor-pointer"
                            title="View Loan"
                          >
                            <Eye size={16} />
                          </button>

                          {canShowEmi(item) && (
                            <button
                              type="button"
                              onClick={() => handleViewEmi(item)}
                              className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/40 flex items-center justify-center cursor-pointer"
                              title="EMI Details"
                            >
                              <Calculator size={16} />
                            </button>
                          )}

                          {canShowDeductions(item) && (
                            <button
                              type="button"
                              onClick={() => handleViewDeductions(item)}
                              className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 flex items-center justify-center cursor-pointer"
                              title="View Deductions"
                            >
                              <TrendingDown size={16} />
                            </button>
                          )}

                          {canDisburseLoan(item) && (
                            <button
                              type="button"
                              onClick={() => handleOpenDisbursement(item)}
                              disabled={actionLoading}
                              className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                              title="Disburse Loan"
                            >
                              <Banknote size={16} />
                            </button>
                          )}

                          {canForecloseLoan(item) && (
                            <button
                              type="button"
                              onClick={() => handleOpenForeclosure(item)}
                              disabled={actionLoading || foreclosureLoading}
                              className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                              title="Foreclose Loan"
                            >
                              {foreclosureLoading &&
                              foreclosureLoan?.slug === item.slug ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <CircleDollarSign size={16} />
                              )}
                            </button>
                          )}

                          {item?.isActive === false ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(item)}
                              disabled={actionLoading}
                              className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                              title="Restore"
                            >
                              <RefreshCcw size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={actionLoading}
                              className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <IndianRupee size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Request For Loan
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Enter loan details and choose a repayment plan
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto custom-scrollbar">
              <div className="p-5 space-y-5">
                {eligibility && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <SummaryCard
                      label="Eligible Amount"
                      value={`₹ ${formatMoney(eligibility?.eligibleAmount)}`}
                    />

                    <SummaryCard
                      label="Minimum Loan"
                      value={`₹ ${formatMoney(
                        eligibility?.setting?.minimumLoanAmount,
                      )}`}
                    />

                    <SummaryCard
                      label="Maximum Loan"
                      value={`₹ ${formatMoney(
                        eligibility?.setting?.maximumLoanAmount,
                      )}`}
                    />
                  </div>
                )}

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-300 text-sm mb-2">
                        Reason
                        <span className="text-red-500"> *</span>
                      </label>

                      <textarea
                        value={form.reason}
                        onChange={(event) =>
                          handleChange("reason", event.target.value)
                        }
                        placeholder="Enter reason for loan..."
                        rows={3}
                        maxLength={500}
                        className={`${inputClass} resize-none`}
                      />

                      <div className="text-right text-xs text-gray-500 mt-1">
                        {form.reason.length}/500
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Loan Amount
                        <span className="text-red-500"> *</span>
                      </label>

                      <div className="relative">
                        <IndianRupee
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />

                        <input
                          type="number"
                          min="1"
                          value={form.loanAmount}
                          onChange={(event) =>
                            handleChange("loanAmount", event.target.value)
                          }
                          placeholder="Enter loan amount"
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleCalculatePlans}
                        disabled={previewLoading || !form.loanAmount}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {previewLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Calculator size={16} />
                        )}
                        Calculate Repayment Plans
                      </button>
                    </div>
                  </div>
                </div>

                {planPreview?.length > 0 && (
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white font-semibold">
                        Available Loan Options
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Review repayment details before applying for the loan
                      </p>
                    </div>

                    {planPreview.map((option) => (
                      <div
                        key={option.slug || option.loanInterestSlug}
                        className="bg-gray-800/60 border border-gray-700 rounded-xl p-4"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <DetailItem
                            label="Loan Amount"
                            value={`₹ ${formatMoney(form.loanAmount)}`}
                          />

                          <DetailItem
                            label="Duration"
                            value={`${option.durationMonths} Months`}
                          />

                          <DetailItem
                            label="Interest"
                            value={`${getNumber(option.annualInterest)}%`}
                            valueClass="text-amber-400"
                          />

                          <DetailItem
                            label="Monthly EMI"
                            value={`₹ ${formatMoney(option.emi)}`}
                            valueClass="text-emerald-400"
                          />
                        </div>

                        <div className="flex flex-wrap justify-end gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => handleViewPlanDetails(option)}
                            className="bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 px-4 py-2 rounded-lg text-violet-400 text-sm flex items-center gap-2 cursor-pointer"
                          >
                            <List size={15} />
                            Repayment Details
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApplyLoan(option)}
                            disabled={submitLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {submitLoading ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <WalletCards size={15} />
                            )}
                            Apply Loan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-800 px-5 py-4">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openViewModal && (
        <LoanViewModal
          loan={selectedLoan}
          isLoanAdmin={isLoanAdmin}
          loading={actionLoading}
          onClose={() => {
            setOpenViewModal(false);
            clearSelectedLoan();
          }}
          formatMoney={formatMoney}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          getLoanAmount={getLoanAmount}
          getLoanDuration={getLoanDuration}
          getInterestRate={getInterestRate}
          getMonthlyEmi={getMonthlyEmi}
          getRequestId={getRequestId}
          getStatusClass={getStatusClass}
          getDisplayLoanStatus={getDisplayLoanStatus}
        />
      )}

      {openEmiModal && (
        <EmiDetailsModal
          loan={selectedLoan}
          installments={installments}
          loading={actionLoading || installmentLoading}
          onClose={() => {
            setOpenEmiModal(false);
            clearSelectedLoan();
          }}
          formatMoney={formatMoney}
          formatDate={formatDate}
          getLoanAmount={getLoanAmount}
          getLoanDuration={getLoanDuration}
          getInterestRate={getInterestRate}
          getMonthlyEmi={getMonthlyEmi}
          getInstallmentAmount={getInstallmentAmount}
          getPrincipalAmount={getPrincipalAmount}
          getInterestAmount={getInterestAmount}
          getOpeningPrincipal={getOpeningPrincipal}
          getClosingPrincipal={getClosingPrincipal}
          getInstallmentStatus={getInstallmentStatus}
          getInstallmentStatusClass={getInstallmentStatusClass}
        />
      )}

      {openDeductionModal && (
        <DeductionModal
          loan={selectedLoan}
          installments={installments}
          summary={deductionSummary}
          loading={actionLoading || installmentLoading}
          onClose={() => {
            setOpenDeductionModal(false);
            clearSelectedLoan();
          }}
          formatMoney={formatMoney}
          formatDate={formatDate}
          getMonthlyEmi={getMonthlyEmi}
          getRecoveredAmount={getRecoveredAmount}
          getInstallmentAmount={getInstallmentAmount}
          getInstallmentStatus={getInstallmentStatus}
          getInstallmentStatusClass={getInstallmentStatusClass}
          getStatusClass={getStatusClass}
          getDisplayLoanStatus={getDisplayLoanStatus}
        />
      )}

      {openPlanDetailModal && selectedPlanOption && (
        <LoanPlanPreviewModal
          option={selectedPlanOption}
          loanAmount={form.loanAmount}
          schedule={calculateRepaymentSchedule(selectedPlanOption)}
          formatMoney={formatMoney}
          onClose={handleClosePlanDetails}
        />
      )}

      {openApproveModal && actionLoan && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            <ModalHeader
              title="Approve Loan Request"
              subtitle={`${actionLoan?.employee?.fullName || "Employee"} (${
                actionLoan?.employee?.employeeId ||
                actionLoan?.employee?.employeeCode ||
                "-"
              })`}
              onClose={() => {
                if (actionLoading) {
                  return;
                }

                setOpenApproveModal(false);
                setActionLoan(null);
              }}
            />

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <SummaryCard
                  label="Requested Amount"
                  value={`₹ ${formatMoney(actionLoan?.requestedAmount)}`}
                />

                <SummaryCard
                  label="Eligible Amount"
                  value={`₹ ${formatMoney(actionLoan?.eligibleAmount)}`}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Approved Amount
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="number"
                  value={approveForm.approvedAmount}
                  onChange={(event) =>
                    setApproveForm((previous) => ({
                      ...previous,
                      approvedAmount: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Repayment Plan
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  value={approveForm.loanInterestSlug}
                  onChange={(event) =>
                    setApproveForm((previous) => ({
                      ...previous,
                      loanInterestSlug: event.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Select repayment plan</option>

                  {actionLoan?.loanPlan?.slug && (
                    <option value={actionLoan.loanPlan.slug}>
                      {actionLoan?.loanPlan?.durationMonths ||
                        actionLoan?.requestedDurationMonths ||
                        "-"}{" "}
                      Months -{" "}
                      {getNumber(
                        actionLoan?.loanPlan?.annualInterest ??
                          actionLoan?.requestedAnnualInterest,
                      )}
                      %
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Approval Remark
                  <span className="text-red-500"> *</span>
                </label>

                <textarea
                  value={approveForm.remark}
                  onChange={(event) =>
                    setApproveForm((previous) => ({
                      ...previous,
                      remark: event.target.value,
                    }))
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Enter approval remark..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setOpenApproveModal(false);
                  setActionLoan(null);
                }}
                disabled={actionLoading}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApproveLoan}
                disabled={actionLoading}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Approve Loan
              </button>
            </div>
          </div>
        </div>
      )}

      {openRejectModal && actionLoan && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            <ModalHeader
              title="Reject Loan Request"
              subtitle={`${actionLoan?.employee?.fullName || "Employee"} (${
                actionLoan?.employee?.employeeId ||
                actionLoan?.employee?.employeeCode ||
                "-"
              })`}
              onClose={() => {
                if (actionLoading) {
                  return;
                }

                setOpenRejectModal(false);
                setActionLoan(null);
              }}
            />

            <div className="p-5">
              <label className="block text-gray-300 text-sm mb-2">
                Rejection Remark
                <span className="text-red-500"> *</span>
              </label>

              <textarea
                value={rejectRemark}
                onChange={(event) => setRejectRemark(event.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Enter reason for rejecting this loan..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setOpenRejectModal(false);
                  setActionLoan(null);
                  setRejectRemark("");
                }}
                disabled={actionLoading}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRejectLoan}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <X size={16} />
                )}
                Reject Loan
              </button>
            </div>
          </div>
        </div>
      )}

      {openDisburseModal && disbursementLoan && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            <ModalHeader
              title="Disburse Loan"
              subtitle={`${
                disbursementLoan?.employee?.fullName || "Employee"
              } (${
                disbursementLoan?.employee?.employeeId ||
                disbursementLoan?.employee?.employeeCode ||
                "-"
              })`}
              onClose={handleCloseDisbursement}
            />

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Banknote size={22} className="text-blue-400 mt-0.5" />

                  <div>
                    <h3 className="text-blue-300 font-semibold">
                      Loan Disbursement
                    </h3>

                    <p className="text-blue-200/70 text-sm mt-1 leading-relaxed">
                      Disbursement releases the approved loan amount to the
                      employee. After successful disbursement, the backend will
                      create the complete EMI installment schedule and start
                      loan recovery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard
                  label="Approved Amount"
                  value={`₹ ${formatMoney(
                    disbursementLoan?.approvedAmount ??
                      disbursementLoan?.requestedAmount,
                  )}`}
                />

                <SummaryCard
                  label="Duration"
                  value={`${getLoanDuration(disbursementLoan)} Months`}
                />

                <SummaryCard
                  label="Monthly EMI"
                  value={`₹ ${formatMoney(getMonthlyEmi(disbursementLoan))}`}
                  valueClass="text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Disbursed Amount
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="number"
                  value={disbursementForm.disbursedAmount}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-80`}
                />

                <p className="text-gray-500 text-xs mt-1">
                  The complete approved loan is disbursed in one transaction.
                </p>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Payment Mode
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  value={disbursementForm.paymentMode}
                  onChange={(event) =>
                    setDisbursementForm((previous) => ({
                      ...previous,
                      paymentMode: event.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Payment Reference
                </label>

                <input
                  type="text"
                  value={disbursementForm.paymentReference}
                  onChange={(event) =>
                    setDisbursementForm((previous) => ({
                      ...previous,
                      paymentReference: event.target.value,
                    }))
                  }
                  maxLength={150}
                  placeholder="Transaction / cheque / reference number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Disbursement Remark
                </label>

                <textarea
                  value={disbursementForm.remark}
                  onChange={(event) =>
                    setDisbursementForm((previous) => ({
                      ...previous,
                      remark: event.target.value,
                    }))
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Enter disbursement remark..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                <p className="text-white text-sm font-medium">
                  What happens after disbursement?
                </p>

                <div className="mt-3 space-y-2 text-xs text-gray-400">
                  <p>1. Disbursement status becomes DISBURSED.</p>
                  <p>2. EMI installments are generated automatically.</p>
                  <p>3. Recovery status becomes RUNNING.</p>
                  <p>
                    4. Foreclosure becomes available while the loan is running.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseDisbursement}
                disabled={actionLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDisburseLoan}
                disabled={actionLoading}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Banknote size={16} />
                )}
                Disburse Full Loan
              </button>
            </div>
          </div>
        </div>
      )}

      {openForeclosureModal && foreclosureLoan && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            <ModalHeader
              title="Foreclose Loan"
              subtitle={`${
                foreclosureLoan?.employee?.fullName || "Employee"
              } (${
                foreclosureLoan?.employee?.employeeId ||
                foreclosureLoan?.employee?.employeeCode ||
                "-"
              })`}
              onClose={() => {
                if (actionLoading || foreclosureLoading) {
                  return;
                }

                setOpenForeclosureModal(false);

                setForeclosureLoan(null);

                setForeclosureRemark("");

                clearForeclosurePreview?.();
              }}
            />

            {foreclosureLoading || !foreclosurePreview ? (
              <ModalLoader />
            ) : (
              <>
                <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <CircleDollarSign
                        size={22}
                        className="text-orange-400 mt-0.5"
                      />

                      <div>
                        <h3 className="text-orange-300 font-semibold">
                          Early Loan Settlement
                        </h3>

                        <p className="text-orange-200/70 text-sm mt-1 leading-relaxed">
                          Foreclosing this loan will settle the complete
                          outstanding principal along with the configured
                          foreclosure charge.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SummaryCard
                      label="Original Loan Amount"
                      value={`₹ ${formatMoney(getLoanAmount(foreclosureLoan))}`}
                    />

                    <SummaryCard
                      label="Monthly EMI"
                      value={`₹ ${formatMoney(getMonthlyEmi(foreclosureLoan))}`}
                    />

                    <SummaryCard
                      label="Outstanding Principal"
                      value={`₹ ${formatMoney(
                        foreclosurePreview?.outstandingPrincipal,
                      )}`}
                      valueClass="text-amber-400"
                    />

                    <SummaryCard
                      label="Foreclosure Interest"
                      value={`${getNumber(
                        foreclosurePreview?.foreclosureInterestRate,
                      )}%`}
                      valueClass="text-orange-400"
                    />

                    <SummaryCard
                      label="Foreclosure Charge"
                      value={`₹ ${formatMoney(
                        foreclosurePreview?.foreclosureCharge,
                      )}`}
                      valueClass="text-orange-400"
                    />

                    <SummaryCard
                      label="Final Settlement Amount"
                      value={`₹ ${formatMoney(
                        foreclosurePreview?.settlementAmount,
                      )}`}
                      valueClass="text-emerald-400"
                    />
                  </div>

                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                    <p className="text-gray-500 text-xs">
                      Settlement Calculation
                    </p>

                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-400 text-sm">
                          Outstanding Principal
                        </span>

                        <span className="text-white text-sm">
                          ₹{" "}
                          {formatMoney(
                            foreclosurePreview?.outstandingPrincipal,
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-400 text-sm">
                          Foreclosure Charge (
                          {getNumber(
                            foreclosurePreview?.foreclosureInterestRate,
                          )}
                          %)
                        </span>

                        <span className="text-orange-400 text-sm">
                          + ₹{" "}
                          {formatMoney(foreclosurePreview?.foreclosureCharge)}
                        </span>
                      </div>

                      <div className="border-t border-gray-700 pt-3 flex items-center justify-between gap-4">
                        <span className="text-white font-medium">
                          Amount To Settle
                        </span>

                        <span className="text-emerald-400 text-lg font-semibold">
                          ₹ {formatMoney(foreclosurePreview?.settlementAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Foreclosure Remark
                      <span className="text-red-500"> *</span>
                    </label>

                    <textarea
                      value={foreclosureRemark}
                      onChange={(event) =>
                        setForeclosureRemark(event.target.value)
                      }
                      rows={4}
                      maxLength={500}
                      placeholder="Enter foreclosure / settlement remark..."
                      className={`${inputClass} resize-none`}
                    />

                    <div className="text-right text-xs text-gray-500 mt-1">
                      {foreclosureRemark.length}
                      /500
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-300 text-sm font-medium">
                      Important
                    </p>

                    <p className="text-red-200/60 text-xs mt-1 leading-relaxed">
                      Once this loan is foreclosed, its recovery will be marked
                      as completed and the remaining repayment schedule will be
                      settled.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenForeclosureModal(false);

                      setForeclosureLoan(null);

                      setForeclosureRemark("");

                      clearForeclosurePreview?.();
                    }}
                    disabled={actionLoading}
                    className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleForecloseLoan}
                    disabled={actionLoading}
                    className="bg-orange-600 hover:bg-orange-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CircleDollarSign size={16} />
                    )}
                    Confirm Foreclosure
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, valueClass = "text-white" }) => {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
      <p className="text-gray-500 text-xs">{label}</p>

      <p className={`font-semibold mt-1 ${valueClass}`}>{value}</p>
    </div>
  );
};

const DetailItem = ({ label, value, valueClass = "text-gray-200" }) => {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>

      <p className={`text-sm font-medium mt-1 ${valueClass}`}>{value}</p>
    </div>
  );
};

const ModalLoader = () => {
  return (
    <div className="py-20 text-center">
      <Loader2 size={26} className="animate-spin text-indigo-400 mx-auto" />

      <p className="text-gray-500 text-sm mt-3">Loading details...</p>
    </div>
  );
};

const LoanViewModal = ({
  loan,
  loading,
  isLoanAdmin,
  onClose,
  formatMoney,
  formatDate,
  formatDateTime,
  getLoanAmount,
  getLoanDuration,
  getInterestRate,
  getMonthlyEmi,
  getRequestId,
  getStatusClass,
  getDisplayLoanStatus,
}) => {
  // const status = loan?.requestStatus || loan?.loanStatus || loan?.status;
  const status = getDisplayLoanStatus(loan);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
        <ModalHeader
          title="Loan Request Details"
          // subtitle="Complete details of your loan request"
          subtitle={
            isLoanAdmin
              ? "Review employee loan request details"
              : "Complete details of your loan request"
          }
          onClose={onClose}
        />

        {loading || !loan ? (
          <ModalLoader />
        ) : (
          <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard
                label="Approved / Requested Amount"
                value={`₹ ${formatMoney(getLoanAmount(loan))}`}
              />

              <SummaryCard
                label="Monthly EMI"
                value={`₹ ${formatMoney(getMonthlyEmi(loan))}`}
                valueClass="text-emerald-400"
              />

              <SummaryCard
                label="Duration"
                value={`${getLoanDuration(loan)} Months`}
              />

              <SummaryCard
                label="Interest"
                value={`${getInterestRate(loan)}%`}
                valueClass="text-amber-400"
              />
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* <DetailItem label="Request ID" value={getRequestId(loan)} /> */}

                {isLoanAdmin && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-4">
                      Employee Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <DetailItem
                        label="Employee"
                        value={`${loan?.employee?.fullName || "-"} (${
                          loan?.employee?.employeeId ||
                          loan?.employee?.employeeCode ||
                          "-"
                        })`}
                      />

                      <DetailItem
                        label="Department"
                        value={loan?.employee?.department?.name || "-"}
                      />

                      <DetailItem
                        label="Designation"
                        value={loan?.employee?.designation?.name || "-"}
                      />

                      <DetailItem
                        label="Joining Date"
                        value={formatDate(loan?.employee?.joiningDate)}
                      />
                    </div>
                  </div>
                )}

                {/* 3. DISBURSEMENT */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-4">
                    Disbursement
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <DetailItem
                      label="Disbursement Status"
                      value={loan?.disbursementStatus || "-"}
                    />

                    <DetailItem
                      label="Disbursed Amount"
                      value={
                        loan?.disbursedAmount
                          ? `₹ ${formatMoney(loan.disbursedAmount)}`
                          : "-"
                      }
                    />

                    <DetailItem
                      label="Disbursed At"
                      value={formatDateTime(loan?.disbursedAt)}
                    />

                    <DetailItem
                      label="Payment Mode"
                      value={loan?.paymentMode || "-"}
                    />

                    <DetailItem
                      label="Payment Reference"
                      value={loan?.paymentReference || "-"}
                    />

                    <div className="md:col-span-2">
                      <DetailItem
                        label="Disbursement Remark"
                        value={loan?.disbursementRemark || "-"}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. REQUEST & APPROVAL */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-4">
                    Request & Approval
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <DetailItem
                      label="Request Date"
                      value={formatDateTime(
                        loan?.createdAt || loan?.requestDate,
                      )}
                    />

                    <DetailItem
                      label="Request Status"
                      value={loan?.requestStatus || "-"}
                    />

                    <DetailItem
                      label="Requested Amount"
                      value={`₹ ${formatMoney(loan?.requestedAmount)}`}
                    />

                    <DetailItem
                      label="Eligible Amount"
                      value={`₹ ${formatMoney(loan?.eligibleAmount)}`}
                    />

                    <DetailItem
                      label="Approved Amount"
                      value={
                        loan?.approvedAmount != null
                          ? `₹ ${formatMoney(loan.approvedAmount)}`
                          : "-"
                      }
                    />

                    <DetailItem
                      label="Approved By"
                      value={loan?.approvedBy?.name || "-"}
                    />

                    <DetailItem
                      label="Approver Email"
                      value={loan?.approvedBy?.email || "-"}
                    />

                    <DetailItem
                      label="Approved At"
                      value={formatDateTime(loan?.approvedAt)}
                    />

                    <div className="md:col-span-2">
                      <DetailItem
                        label="Approval Remark"
                        value={loan?.approvalRemark || "-"}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <DetailItem label="Reason" value={loan?.reason || "-"} />
                    </div>
                  </div>
                </div>

                {/* 5. RECOVERY */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-4">Recovery</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                    <DetailItem
                      label="Recovery Status"
                      value={loan?.recoveryStatus || "-"}
                    />

                    <DetailItem
                      label="Total Principal"
                      value={`₹ ${formatMoney(loan?.totalPrincipal)}`}
                    />

                    <DetailItem
                      label="Total Interest"
                      value={`₹ ${formatMoney(loan?.totalInterest)}`}
                    />

                    <DetailItem
                      label="Total Recoverable"
                      value={`₹ ${formatMoney(loan?.totalRecoverableAmount)}`}
                    />

                    <DetailItem
                      label="Total Recovered"
                      value={`₹ ${formatMoney(loan?.totalRecoveredAmount)}`}
                      valueClass="text-emerald-400"
                    />

                    <DetailItem
                      label="Outstanding Amount"
                      value={`₹ ${formatMoney(loan?.outstandingAmount)}`}
                      valueClass="text-amber-400"
                    />

                    <DetailItem
                      label="Outstanding Principal"
                      value={`₹ ${formatMoney(loan?.outstandingPrincipal)}`}
                      valueClass="text-amber-400"
                    />
                  </div>
                </div>

                {/* 6. FORECLOSURE */}
                {loan?.isForeclosed && (
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                    <h3 className="text-cyan-300 font-semibold mb-4">
                      Foreclosure Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <DetailItem
                        label="Foreclosed By"
                        value={loan?.foreclosedBy?.name || "-"}
                      />

                      <DetailItem
                        label="Foreclosed At"
                        value={formatDateTime(loan?.foreclosedAt)}
                      />

                      <DetailItem
                        label="Foreclosure Principal"
                        value={`₹ ${formatMoney(loan?.foreclosurePrincipal)}`}
                      />

                      <DetailItem
                        label="Foreclosure Interest Rate"
                        value={`${Number(loan?.foreclosureInterestRate || 0)}%`}
                      />

                      <DetailItem
                        label="Foreclosure Charge"
                        value={`₹ ${formatMoney(loan?.foreclosureCharge)}`}
                      />

                      <DetailItem
                        label="Settlement Amount"
                        value={`₹ ${formatMoney(loan?.foreclosureAmount)}`}
                        valueClass="text-emerald-400"
                      />

                      <div className="md:col-span-2">
                        <DetailItem
                          label="Foreclosure Remark"
                          value={loan?.foreclosureRemark || "-"}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ModalFooter onClose={onClose} />
      </div>
    </div>
  );
};

const LoanPlanPreviewModal = ({
  option,
  loanAmount,
  schedule,
  formatMoney,
  onClose,
}) => {
  const totalInstallmentAmount = schedule.reduce((total, item) => {
    return total + item.installmentAmount;
  }, 0);

  const totalPrincipal = schedule.reduce((total, item) => {
    return total + item.principalAmount;
  }, 0);

  const totalInterest = schedule.reduce((total, item) => {
    return total + item.interestAmount;
  }, 0);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-6xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Loan Repayment Detail
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Review the complete EMI breakup before applying
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 border-b border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              label="Loan Amount"
              value={`₹ ${formatMoney(loanAmount)}`}
            />

            <SummaryCard
              label="Duration"
              value={`${option.durationMonths} Months`}
            />

            <SummaryCard
              label="Interest Rate"
              value={`${Number(option.annualInterest || 0)}%`}
              valueClass="text-amber-400"
            />

            <SummaryCard
              label="Monthly EMI"
              value={`₹ ${formatMoney(option.emi)}`}
              valueClass="text-emerald-400"
            />
          </div>
        </div>

        <div className="max-h-[55vh] overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  #
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Opening Principal
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Installment Amount
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Principal
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Interest
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Closing Principal
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {schedule.map((item) => (
                <tr key={item.installmentNo} className="hover:bg-gray-800/40">
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {item.installmentNo}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-300">
                    ₹ {formatMoney(item.openingPrincipal)}
                  </td>

                  <td className="px-4 py-3 text-sm text-emerald-400 font-medium">
                    ₹ {formatMoney(item.installmentAmount)}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-300">
                    ₹ {formatMoney(item.principalAmount)}
                  </td>

                  <td className="px-4 py-3 text-sm text-amber-400">
                    ₹ {formatMoney(item.interestAmount)}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-300">
                    ₹ {formatMoney(item.closingPrincipal)}
                  </td>
                </tr>
              ))}

              {schedule.length > 0 && (
                <tr className="bg-gray-800/70">
                  <td className="px-4 py-3" />

                  <td className="px-4 py-3 text-sm font-semibold text-gray-300">
                    Total
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-emerald-400">
                    ₹ {formatMoney(totalInstallmentAmount)}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-white">
                    ₹ {formatMoney(totalPrincipal)}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-amber-400">
                    ₹ {formatMoney(totalInterest)}
                  </td>

                  <td className="px-4 py-3" />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs">
            This is the repayment schedule for the selected loan option.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EmiDetailsModal = ({
  loan,
  installments,
  loading,
  onClose,
  formatMoney,
  formatDate,
  getLoanAmount,
  getLoanDuration,
  getInterestRate,
  getMonthlyEmi,
  getInstallmentAmount,
  getPrincipalAmount,
  getInterestAmount,
  getOpeningPrincipal,
  getClosingPrincipal,
  getInstallmentStatus,
  getInstallmentStatusClass,
}) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-6xl bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
        <ModalHeader
          title="EMI & Repayment Schedule"
          subtitle="Your complete loan repayment plan"
          onClose={onClose}
        />

        {loading || !loan ? (
          <ModalLoader />
        ) : (
          <>
            <div className="p-5 border-b border-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                  label="Loan Amount"
                  value={`₹ ${formatMoney(getLoanAmount(loan))}`}
                />

                <SummaryCard
                  label="Duration"
                  value={`${getLoanDuration(loan)} Months`}
                />

                <SummaryCard
                  label="Interest Rate"
                  value={`${getInterestRate(loan)}%`}
                  valueClass="text-amber-400"
                />

                <SummaryCard
                  label="Monthly EMI"
                  value={`₹ ${formatMoney(getMonthlyEmi(loan))}`}
                  valueClass="text-emerald-400"
                />
              </div>
            </div>

            <div className="max-h-[55vh] overflow-x-auto overflow-y-auto custom-scrollbar">
              <table className="w-full min-w-[1150px]">
                <thead className="bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <TableHead title="SNo." />

                    <TableHead title="Due Date" />

                    <TableHead title="Opening Principal" />

                    <TableHead title="EMI Amount" />

                    <TableHead title="Principal" />

                    <TableHead title="Interest" />

                    <TableHead title="Closing Principal" />

                    <TableHead title="Status" center />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">
                  {!installments?.length ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-gray-500"
                      >
                        Repayment schedule is not available yet.
                      </td>
                    </tr>
                  ) : (
                    installments.map((item, index) => {
                      const status = getInstallmentStatus(item);

                      return (
                        <tr
                          key={item.slug || item.id || index}
                          className="hover:bg-gray-800/40"
                        >
                          <TableCell>{index + 1}.</TableCell>

                          <TableCell>
                            {formatDate(item?.dueMonth || item?.dueDate)}
                          </TableCell>

                          <MoneyCell
                            value={getOpeningPrincipal(item)}
                            formatMoney={formatMoney}
                          />

                          <MoneyCell
                            value={getInstallmentAmount(item)}
                            formatMoney={formatMoney}
                            className="text-emerald-400 font-medium"
                          />

                          <MoneyCell
                            value={getPrincipalAmount(item)}
                            formatMoney={formatMoney}
                          />

                          <MoneyCell
                            value={getInterestAmount(item)}
                            formatMoney={formatMoney}
                            className="text-amber-400"
                          />

                          <MoneyCell
                            value={getClosingPrincipal(item)}
                            formatMoney={formatMoney}
                          />

                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex border rounded-md px-2.5 py-1 text-xs ${getInstallmentStatusClass(
                                status,
                              )}`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        <ModalFooter onClose={onClose} />
      </div>
    </div>
  );
};

const DeductionModal = ({
  loan,
  installments,
  summary,
  loading,
  onClose,
  formatMoney,
  formatDate,
  getMonthlyEmi,
  getRecoveredAmount,
  getInstallmentAmount,
  getInstallmentStatus,
  getInstallmentStatusClass,
  getStatusClass,
  getDisplayLoanStatus,
}) => {
  // const status = loan?.requestStatus || loan?.loanStatus || loan?.status;
  // const status = loan?.isForeclosed
  //   ? "FORECLOSED"
  //   : normalizeStatus(loan?.recoveryStatus) === "COMPLETED"
  //     ? "COMPLETED"
  //     : normalizeStatus(loan?.disbursementStatus) === "DISBURSED"
  //       ? "DISBURSED"
  //       : loan?.requestStatus || "-";

  const status = getDisplayLoanStatus(loan);

  const isForeclosed = Boolean(loan?.isForeclosed);

  // const isForeclosed = String(status || "").toUpperCase() === "FORECLOSED";
  // const isForeclosed = Boolean(loan?.isForeclosed);

  // const progress =
  //   summary.totalInstallmentAmount > 0
  //     ? Math.min(
  //         100,
  //         (summary.totalRecovered / summary.totalInstallmentAmount) * 100,
  //       )
  //     : 0;

  const progress = isForeclosed
    ? 100
    : summary.totalInstallmentAmount > 0
      ? Math.min(
          100,
          (summary.totalRecovered / summary.totalInstallmentAmount) * 100,
        )
      : 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-6xl bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
        <ModalHeader
          title="Loan Deduction Details"
          subtitle="Track recovered and remaining loan amount"
          onClose={onClose}
        />

        {loading || !loan ? (
          <ModalLoader />
        ) : (
          <div className="max-h-[72vh] overflow-y-auto custom-scrollbar">
            <div className="p-5 space-y-5">
              {isForeclosed && (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={21} className="text-cyan-400 mt-0.5" />

                    <div>
                      <h3 className="text-cyan-300 font-semibold">
                        Loan Foreclosed
                      </h3>

                      <p className="text-cyan-200/70 text-sm mt-1">
                        This loan has been settled before completion of its
                        original repayment schedule.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <DetailItem
                      label="Foreclosed On"
                      value={formatDate(loan.foreclosedAt)}
                    />

                    <DetailItem
                      label="Settlement Amount"
                      value={`₹ ${formatMoney(
                        loan.foreclosureAmount ?? loan.settlementAmount ?? 0,
                      )}`}
                      valueClass="text-cyan-400"
                    />

                    <DetailItem
                      label="Status"
                      value={
                        <span
                          className={`inline-flex border rounded-md px-2.5 py-1 text-xs ${getStatusClass(
                            status,
                          )}`}
                        >
                          {status}
                        </span>
                      }
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                  label="Monthly EMI"
                  value={`₹ ${formatMoney(getMonthlyEmi(loan))}`}
                />

                <SummaryCard
                  label="Total Recovered"
                  value={`₹ ${formatMoney(summary.totalRecovered)}`}
                  valueClass="text-emerald-400"
                />

                <SummaryCard
                  label="Remaining Amount"
                  value={`₹ ${formatMoney(summary.remainingAmount)}`}
                  valueClass={
                    summary.remainingAmount <= 0
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }
                />

                <SummaryCard
                  label="Installments"
                  value={`${summary.paidInstallments}/${summary.totalInstallments} Paid`}
                />
              </div>

              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white text-sm font-medium">
                      Recovery Progress
                    </p>

                    <p className="text-gray-500 text-xs mt-1">
                      {summary.paidInstallments} paid,{" "}
                      {summary.partialInstallments} partial,{" "}
                      {summary.pendingInstallments} pending
                    </p>
                  </div>

                  <p className="text-emerald-400 font-semibold">
                    {progress.toFixed(1)}%
                  </p>
                </div>

                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[40vh] custom-scrollbar">
              <table className="w-full min-w-[950px]">
                <thead className="bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <TableHead title="SNo." />

                    <TableHead title="Due Date" />

                    <TableHead title="EMI Amount" />

                    <TableHead title="Recovered" />

                    <TableHead title="Balance" />

                    <TableHead title="Recovered On" />

                    <TableHead title="Status" center />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">
                  {!installments?.length ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-500"
                      >
                        No deduction records available.
                      </td>
                    </tr>
                  ) : (
                    installments.map((item, index) => {
                      const installmentAmount = getInstallmentAmount(item);

                      const recoveredAmount = getRecoveredAmount(item);

                      const balance = Math.max(
                        0,
                        installmentAmount - recoveredAmount,
                      );

                      const installmentStatus = getInstallmentStatus(item);

                      return (
                        <tr
                          key={item.slug || item.id || index}
                          className="hover:bg-gray-800/40"
                        >
                          <TableCell>{index + 1}.</TableCell>

                          <TableCell>
                            {formatDate(item?.dueMonth || item?.dueDate)}
                          </TableCell>

                          <MoneyCell
                            value={installmentAmount}
                            formatMoney={formatMoney}
                          />

                          <MoneyCell
                            value={recoveredAmount}
                            formatMoney={formatMoney}
                            className="text-emerald-400 font-medium"
                          />

                          <MoneyCell
                            value={balance}
                            formatMoney={formatMoney}
                            className={
                              balance > 0 ? "text-amber-400" : "text-gray-400"
                            }
                          />

                          <TableCell>
                            {formatDate(item.recoveredAt || item.paidAt)}
                          </TableCell>

                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex border rounded-md px-2.5 py-1 text-xs ${getInstallmentStatusClass(
                                installmentStatus,
                              )}`}
                            >
                              {installmentStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ModalFooter onClose={onClose} />
      </div>
    </div>
  );
};

const ModalHeader = ({ title, subtitle, onClose }) => {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>

        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-white cursor-pointer"
      >
        <X size={20} />
      </button>
    </div>
  );
};

const ModalFooter = ({ onClose }) => {
  return (
    <div className="flex justify-end px-5 py-4 border-t border-gray-800">
      <button
        type="button"
        onClick={onClose}
        className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer"
      >
        Close
      </button>
    </div>
  );
};

const TableHead = ({ title, center = false }) => {
  return (
    <th
      className={`px-4 py-3 text-xs font-medium text-gray-400 ${
        center ? "text-center" : "text-left"
      }`}
    >
      {title}
    </th>
  );
};

const TableCell = ({ children }) => {
  return <td className="px-4 py-3 text-sm text-gray-300">{children}</td>;
};

const MoneyCell = ({ value, formatMoney, className = "text-gray-300" }) => {
  return (
    <td className={`px-4 py-3 text-sm ${className}`}>₹ {formatMoney(value)}</td>
  );
};

export default LoanRequests;
