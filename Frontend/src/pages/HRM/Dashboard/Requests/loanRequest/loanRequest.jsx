import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Eye,
  FileText,
  IndianRupee,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoanRequests = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reason: "",
    loanAmount: "",
  });

  const [openRepaymentModal, setOpenRepaymentModal] = useState(false);

  const [repaymentData, setRepaymentData] = useState({
    loanAmount: 0,
    duration: 0,
    rate: 0,
    emi: 0,
    schedule: [],
  });

  const loanRequests = [
    {
      id: 1,
      date: "12-08-2026",
      amount: 30000,
      interest: 10,
      duration: 10,
      monthlyDeduction: 3169.37,
      remainingAmount: 30000,
      deductionMonths: 0,
      reason: "Personal requirement",
      status: "Pending",
      requestId: "LR-2026-001",
    },
  ];

  const loanOptions = [
    {
      id: 1,
      duration: 1,
      rate: 10,
    },
    {
      id: 2,
      duration: 3,
      rate: 8,
    },
    {
      id: 3,
      duration: 9,
      rate: 12,
    },
    {
      id: 4,
      duration: 24,
      rate: 20.76,
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return loanRequests;
    }

    return loanRequests.filter((item) => {
      return (
        item.date.toLowerCase().includes(keyword) ||
        item.reason.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.requestId.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const showLoanDetails =
    form.reason.trim().length > 0 && Number(form.loanAmount) > 0;

  const calculateEmi = (amount, annualRate, months) => {
    const principal = Number(amount);

    if (!principal || !annualRate || !months) {
      return 0;
    }

    const monthlyRate = annualRate / 12 / 100;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Number(emi.toFixed(2));
  };

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleOpenModal = () => {
    setForm({
      reason: "",
      loanAmount: "",
    });

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (loading) {
      return;
    }

    setOpenModal(false);

    setForm({
      reason: "",
      loanAmount: "",
    });
  };

  const handleApplyLoan = async (option) => {
    if (!showLoanDetails) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        reason: form.reason.trim(),
        loanAmount: Number(form.loanAmount),
        duration: option.duration,
        interestRate: option.rate,
        emi: calculateEmi(form.loanAmount, option.rate, option.duration),
      };

      console.log("Loan Request Payload", payload);

      // Yahan create loan request API call karna hai.

      setOpenModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRepaymentSchedule = (option) => {
    const loanAmount = Number(form.loanAmount);
    const duration = Number(option.duration);
    const rate = Number(option.rate);

    const emi = calculateEmi(loanAmount, rate, duration);

    const monthlyRate = rate / 12 / 100;

    let openingPrincipal = loanAmount;

    const schedule = Array.from({ length: duration }, (_, index) => {
      const interestAmount = openingPrincipal * monthlyRate;

      let principalAmount = emi - interestAmount;

      let installmentAmount = emi;

      if (index === duration - 1) {
        principalAmount = openingPrincipal;

        installmentAmount = principalAmount + interestAmount;
      }

      const closingPrincipal = Math.max(0, openingPrincipal - principalAmount);

      const row = {
        id: index + 1,

        openingPrincipal: Number(openingPrincipal.toFixed(2)),

        installmentAmount: Number(installmentAmount.toFixed(2)),

        principal: Number(principalAmount.toFixed(2)),

        interest: Number(interestAmount.toFixed(2)),

        closingPrincipal: Number(closingPrincipal.toFixed(2)),
      };

      openingPrincipal = closingPrincipal;

      return row;
    });

    setRepaymentData({
      loanAmount,
      duration,
      rate,
      emi,
      schedule,
    });

    setOpenRepaymentModal(true);
  };

  const handleCloseRepaymentModal = () => {
    setOpenRepaymentModal(false);

    setRepaymentData({
      loanAmount: 0,
      duration: 0,
      rate: 0,
      emi: 0,
      schedule: [],
    });
  };

  const handleView = (item) => {
    console.log("View loan request", item);
  };

  const handleDelete = (item) => {
    console.log("Delete loan request", item);
  };

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "approved") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (value === "rejected") {
      return "bg-red-500/10 border-red-500/20 text-red-400";
    }

    return "bg-amber-500/10 border-amber-500/20 text-amber-400";
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
                Manage and track employee loan requests
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
          >
            <Plus size={17} />
            Request for Loan
          </button>
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
          <table className="w-full min-w-[1450px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  SNo.
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Amount
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Interests
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Duration
                  <span className="block text-[10px] text-gray-500">
                    in months
                  </span>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Monthly Deduction
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Remaining Amount
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Deductions
                  <span className="block text-[10px] text-gray-500">
                    in months
                  </span>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Reason
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Request Id
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-14 text-center text-gray-500">
                    No loan requests found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}.
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.date}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      ₹ {item.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.interest}%
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.duration}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      ₹ {item.monthlyDeduction.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      ₹ {item.remainingAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 text-center">
                      {item.deductionMonths}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.reason}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-indigo-400">
                      {item.requestId}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(item)}
                          className="w-8 h-8 rounded-lg bg-indigo-6 hover:bg-indigo-800 bg-indigo-700 text-white flex items-center justify-center cursor-pointer"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/40 cursor-pointer transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
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
                    Enter loan details and choose a repayment option
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto custom-scrollbar">
              <div className="p-5 space-y-5">
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
                      <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2.5">
                        <p className="text-xs text-indigo-300">
                          Enter reason and loan amount to view available
                          repayment options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {showLoanDetails && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">
                          Available Loan Options
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          Select the repayment plan that suits you
                        </p>
                      </div>

                      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-500">Loan Amount</p>

                        <p className="text-white font-semibold mt-1">
                          ₹ {Number(form.loanAmount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {loanOptions.map((option) => {
                      const emi = calculateEmi(
                        form.loanAmount,
                        option.rate,
                        option.duration,
                      );

                      return (
                        <div
                          key={option.id}
                          className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                              <div>
                                <p className="text-gray-500 text-xs">
                                  Loan Amount
                                </p>

                                <p className="text-gray-200 text-sm mt-1 font-medium">
                                  ₹{" "}
                                  {Number(form.loanAmount).toLocaleString(
                                    "en-IN",
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-500 text-xs">
                                  Duration
                                </p>

                                <p className="text-gray-200 text-sm mt-1 font-medium">
                                  {option.duration} Month
                                  {option.duration > 1 ? "s" : ""}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-500 text-xs">
                                  Interest Rate
                                </p>

                                <p className="text-amber-400 text-sm mt-1 font-medium">
                                  {option.rate}%
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-500 text-xs">
                                  Monthly EMI
                                </p>

                                <p className="text-emerald-400 text-sm mt-1 font-semibold">
                                  ₹ {emi.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleViewRepaymentSchedule(option)
                                }
                                className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-gray-200 text-xs flex items-center gap-2 cursor-pointer"
                              >
                                <FileText size={14} />
                                Repayment Schedule
                              </button>

                              <button
                                type="button"
                                onClick={() => handleApplyLoan(option)}
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loading ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Calculator size={14} />
                                )}
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!showLoanDetails && (
                  <div className="border border-dashed border-gray-700 rounded-xl py-10 px-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 mx-auto flex items-center justify-center text-gray-500">
                      <Calculator size={22} />
                    </div>

                    <p className="text-gray-400 text-sm mt-3">
                      Loan repayment options will appear here
                    </p>

                    <p className="text-gray-600 text-xs mt-1">
                      Please enter reason and loan amount first
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-800 px-5 py-4 bg-gray-900">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openRepaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Loan Repayment Detail
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Complete monthly repayment schedule
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseRepaymentModal}
                className="text-gray-400 hover:text-white cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 border-b border-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                  <p className="text-gray-500 text-xs">Loan Amount</p>

                  <p className="text-white font-semibold mt-1">
                    ₹{" "}
                    {repaymentData.loanAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                  <p className="text-gray-500 text-xs">Duration</p>

                  <p className="text-white font-semibold mt-1">
                    {repaymentData.duration} Month
                    {repaymentData.duration > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                  <p className="text-gray-500 text-xs">Interest Rate</p>

                  <p className="text-amber-400 font-semibold mt-1">
                    {repaymentData.rate}%
                  </p>
                </div>

                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                  <p className="text-gray-500 text-xs">Monthly EMI</p>

                  <p className="text-emerald-400 font-semibold mt-1">
                    ₹{" "}
                    {repaymentData.emi.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-[55vh] overflow-x-auto overflow-y-auto custom-scrollbar">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-16">
                      Sno.
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
                  {repaymentData.schedule.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {index + 1}.
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300">
                        ₹{" "}
                        {item.openingPrincipal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-4 py-3 text-sm text-emerald-400 font-medium">
                        ₹{" "}
                        {item.installmentAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300">
                        ₹{" "}
                        {item.principal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-4 py-3 text-sm text-amber-400">
                        ₹{" "}
                        {item.interest.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300">
                        ₹{" "}
                        {item.closingPrincipal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseRepaymentModal}
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

export default LoanRequests;
