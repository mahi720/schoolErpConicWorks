import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  FileSpreadsheet,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useEmployeeStore } from "../../../../../store/HRM/employee/employeeStore";
import { useLeaveTypeStore } from "../../../../../store/hrm/settings/leaveType/leaveTypeStore";
import { useEmployeeLeaveRequestStore } from "../../../../../store/hrm/request/leaveRequest/employeeLeaveRequestStore";

import {
  approveEmployeeLeaveRequestSchema,
  buildApproveLeaveRequestPayload,
  buildBulkApproveLeaveRequestPayload,
  buildCreateLeaveRequestPayload,
  buildRejectLeaveRequestPayload,
  bulkApproveEmployeeLeaveRequestSchema,
  createEmployeeLeaveRequestSchema,
  leaveRequestInitialValues,
  rejectEmployeeLeaveRequestSchema,
} from "../../../../../validations/hrm/request/leaveRequest/employeeLeaveRequestValidation";

const categoryLabels = {
  FULL_DAY: "Full Day",
  HALF_DAY: "Half Day",
  MULTI_DAY: "Multi Day",
};

const statusLabels = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const formatDate = (value) => {
  if (!value) return "-";

  const raw = String(value).slice(0, 10);
  const [year, month, day] = raw.split("-");

  if (!year || !month || !day) return value;

  return `${day}-${month}-${year}`;
};

const formatDateRange = (fromDate, toDate) => {
  if (!fromDate) return "-";

  const from = formatDate(fromDate);
  const to = formatDate(toDate);

  if (
    !toDate ||
    String(fromDate).slice(0, 10) === String(toDate).slice(0, 10)
  ) {
    return from;
  }

  return `${from} - ${to}`;
};

const LeaveRequests = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [approveForm, setApproveForm] = useState({
    leaveType: "",
    reply: "",
    payType: "PAID",
    numberOfDaysPaid: "",
  });

  const [openBulkApproveModal, setOpenBulkApproveModal] = useState(false);
  const [bulkApproveForm, setBulkApproveForm] = useState({
    reply: "",
    payType: "UNPAID",
  });

  const [openDeclineModal, setOpenDeclineModal] = useState(false);
  const [selectedDeclineLeave, setSelectedDeclineLeave] = useState(null);
  const [declineForm, setDeclineForm] = useState({
    reply: "",
  });

  const [openLeaveDetailModal, setOpenLeaveDetailModal] = useState(false);
  const [selectedLeaveDetail, setSelectedLeaveDetail] = useState(null);

  const [form, setForm] = useState({
    ...leaveRequestInitialValues,
    leaveCategory: "",
  });

  const {
    employees = [],
    loading: employeeLoading,
    fetchEmployees,
  } = useEmployeeStore();

  const {
    leaveTypes = [],
    loading: leaveTypeLoading,
    fetchLeaveTypes,
  } = useLeaveTypeStore();

  const {
    leaveRequests = [],
    loading: listLoading,
    submitLoading,
    detailLoading,
    selectedLeaveRequest,
    fetchLeaveRequests,
    fetchLeaveRequestBySlug,
    createLeaveRequest,
    approveLeaveRequest,
    bulkApproveLeaveRequests,
    rejectLeaveRequest,
    deleteLeaveRequest,
    restoreLeaveRequest,
    clearSelectedLeaveRequest,
  } = useEmployeeLeaveRequestStore();

  const loading =
    listLoading ||
    submitLoading ||
    employeeLoading ||
    leaveTypeLoading ||
    detailLoading;

  useEffect(() => {
    Promise.all([
      fetchLeaveRequests({ status: "all" }),
      fetchEmployees(),
      fetchLeaveTypes({ status: "active" }),
    ]);
  }, [fetchLeaveRequests, fetchEmployees, fetchLeaveTypes]);

  useEffect(() => {
    if (!openLeaveDetailModal || !selectedLeaveRequest) return;

    setSelectedLeaveDetail(selectedLeaveRequest);
  }, [openLeaveDetailModal, selectedLeaveRequest]);

  const employeeOptions = useMemo(() => {
    return employees
      .filter((item) => item.isActive !== false && item.isTransferred !== true)
      .map((item) => ({
        value: item.slug,
        label: `${item.fullName}${item.employeeId || item.employeeCode ? ` (${item.employeeId || item.employeeCode})` : ""}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [employees]);

  const leaveTypeOptions = useMemo(() => {
    return leaveTypes
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        value: item.slug,
        label: item.leaveType,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [leaveTypes]);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return leaveRequests;

    return leaveRequests.filter((item) => {
      return [
        item.name,
        item.employeeId,
        item.department,
        item.designation,
        item.leaveType,
        categoryLabels[item.leaveCategory] || item.leaveCategory,
        statusLabels[item.requestStatus] || item.requestStatus || item.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [search, leaveRequests]);

  const selectableRows = useMemo(() => {
    return filteredData.filter(
      (item) => item.isActive !== false && item.requestStatus === "PENDING",
    );
  }, [filteredData]);

  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((item) => selectedRows.includes(item.slug));

  const isMultiDay = form.leaveCategory === "MULTI_DAY";

  const handleChange = (field, value) => {
    setForm((previous) => {
      if (field === "leaveCategory" && value !== "MULTI_DAY") {
        return {
          ...previous,
          leaveCategory: value,
          toDate: "",
        };
      }

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  const handleOpenModal = () => {
    setForm({
      ...leaveRequestInitialValues,
      leaveCategory: "",
    });

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (submitLoading) return;

    setOpenModal(false);
    setForm({
      ...leaveRequestInitialValues,
      leaveCategory: "",
    });
  };

  const handleSelectAll = () => {
    const visibleSlugs = selectableRows.map((item) => item.slug);

    if (allSelected) {
      setSelectedRows((previous) =>
        previous.filter((slug) => !visibleSlugs.includes(slug)),
      );
      return;
    }

    setSelectedRows((previous) => [...new Set([...previous, ...visibleSlugs])]);
  };

  const handleSelectRow = (item) => {
    if (item.isActive === false || item.requestStatus !== "PENDING") return;

    setSelectedRows((previous) => {
      if (previous.includes(item.slug)) {
        return previous.filter((slug) => slug !== item.slug);
      }

      return [...previous, item.slug];
    });
  };

  const handleSubmit = async () => {
    const payload = buildCreateLeaveRequestPayload(form);
    const validation = createEmployeeLeaveRequestSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid leave details",
      );
      return;
    }

    const success = await createLeaveRequest(validation.data);

    if (!success) return;

    handleCloseModal();
    await fetchLeaveRequests({ status: "all" });
  };

  const handleApproveSelected = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select pending leave requests");
      return;
    }

    setBulkApproveForm({
      reply: "",
      payType: "UNPAID",
    });

    setOpenBulkApproveModal(true);
  };

  const handleApprove = (item) => {
    if (item.isActive === false) return;

    if (item.requestStatus !== "PENDING") {
      toast.error("Only pending leave request can be approved");
      return;
    }

    setSelectedLeave(item);

    setApproveForm({
      leaveType: item.leaveTypeSlug || "",
      reply: "",
      payType: "PAID",
      numberOfDaysPaid: String(item.totalDays || ""),
    });

    setOpenApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    if (submitLoading) return;

    setOpenApproveModal(false);
    setSelectedLeave(null);
    setApproveForm({
      leaveType: "",
      reply: "",
      payType: "PAID",
      numberOfDaysPaid: "",
    });
  };

  const handleApproveChange = (field, value) => {
    setApproveForm((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "payType" && value === "UNPAID"
        ? { numberOfDaysPaid: "" }
        : {}),
    }));
  };

  const handleConfirmApprove = async () => {
    if (!selectedLeave?.slug) return;

    const payload = buildApproveLeaveRequestPayload(approveForm);
    const validation = approveEmployeeLeaveRequestSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid approval details",
      );
      return;
    }

    if (
      validation.data.payType === "PAID" &&
      Number(validation.data.numberOfDaysPaid) > Number(selectedLeave.totalDays)
    ) {
      toast.error("Paid days cannot exceed total leave days");
      return;
    }

    const success = await approveLeaveRequest(
      selectedLeave.slug,
      validation.data,
    );

    if (!success) return;

    handleCloseApproveModal();
    await fetchLeaveRequests({ status: "all" });
  };

  const handleBulkApproveChange = (field, value) => {
    setBulkApproveForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCloseBulkApproveModal = () => {
    if (submitLoading) return;

    setOpenBulkApproveModal(false);
    setBulkApproveForm({
      reply: "",
      payType: "UNPAID",
    });
  };

  const handleConfirmBulkApprove = async () => {
    const payload = buildBulkApproveLeaveRequestPayload({
      selectedSlugs: selectedRows,
      form: bulkApproveForm,
    });

    const validation = bulkApproveEmployeeLeaveRequestSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid bulk approval details",
      );
      return;
    }

    const success = await bulkApproveLeaveRequests(validation.data);

    if (!success) return;

    setOpenBulkApproveModal(false);
    setSelectedRows([]);
    setBulkApproveForm({
      reply: "",
      payType: "UNPAID",
    });

    await fetchLeaveRequests({ status: "all" });
  };

  const handleDeclineChange = (field, value) => {
    setDeclineForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCloseDeclineModal = () => {
    if (submitLoading) return;

    setOpenDeclineModal(false);
    setSelectedDeclineLeave(null);
    setDeclineForm({ reply: "" });
  };

  const handleConfirmDecline = async () => {
    if (!selectedDeclineLeave?.slug) return;

    const payload = buildRejectLeaveRequestPayload(declineForm.reply);
    const validation = rejectEmployeeLeaveRequestSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(validation.error.issues?.[0]?.message || "Reply is required");
      return;
    }

    const success = await rejectLeaveRequest(
      selectedDeclineLeave.slug,
      validation.data,
    );

    if (!success) return;

    handleCloseDeclineModal();
    setSelectedRows((previous) =>
      previous.filter((slug) => slug !== selectedDeclineLeave.slug),
    );
    await fetchLeaveRequests({ status: "all" });
  };

  const handleReject = (item) => {
    if (item.isActive === false) return;

    if (item.requestStatus !== "PENDING") {
      toast.error("Only pending leave request can be rejected");
      return;
    }

    setSelectedDeclineLeave(item);
    setDeclineForm({ reply: "" });
    setOpenDeclineModal(true);
  };

  const handleView = async (item) => {
    setSelectedLeaveDetail(item);
    setOpenLeaveDetailModal(true);
    clearSelectedLeaveRequest();

    await fetchLeaveRequestBySlug(item.slug);
  };

  const handleCloseLeaveDetailModal = () => {
    setOpenLeaveDetailModal(false);
    setSelectedLeaveDetail(null);
    clearSelectedLeaveRequest();
  };

  const handleDelete = async (item) => {
    if (!item?.slug || item.isActive === false) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${item.name || "this leave request"}?`,
    );

    if (!confirmed) return;

    const success = await deleteLeaveRequest(item.slug);

    if (!success) return;

    setSelectedRows((previous) =>
      previous.filter((slug) => slug !== item.slug),
    );
    await fetchLeaveRequests({ status: "all" });
  };

  const handleRestore = async (item) => {
    if (!item?.slug || item.isActive !== false) return;

    const success = await restoreLeaveRequest(item.slug);

    if (!success) return;

    await fetchLeaveRequests({ status: "all" });
  };

  const handleExcel = () => {
    console.log("Export Excel", filteredData);
  };

  const getCategoryClass = (category) => {
    if (category === "FULL_DAY" || category === "Full Day") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (category === "HALF_DAY" || category === "Half Day") {
      return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    }

    return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "").toUpperCase();

    if (normalized === "APPROVED") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (normalized === "REJECTED") {
      return "bg-red-500/10 border-red-500/20 text-red-400";
    }

    if (normalized === "CANCELLED") {
      return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }

    return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500";

  const leaveBalanceData = leaveTypes.map((item) => ({
    leaveType: item.leaveType,
    balance: Number(item.daysPerYear || 0),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
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
                Leave Requests
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Manage employee leave requests and approvals
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExcel}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>

            <button
              type="button"
              onClick={handleApproveSelected}
              disabled={selectedRows.length === 0 || submitLoading}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              Approve Requests
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/hrm/employe-dashboard/multiple-leave-requests")
              }
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus size={17} />
              Create Multiple Leave Requests
            </button>

            <button
              type="button"
              onClick={handleOpenModal}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Request for Leave
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">Leave Request List</h2>
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
                placeholder="Search leave request..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          <table className="w-full min-w-[1500px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    disabled={!selectableRows.length}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Sr No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Department/Designation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Leave Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Total Days
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  View Docs
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {listLoading ? (
                <tr>
                  <td colSpan={11} className="py-14">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 size={20} className="animate-spin" />
                      Loading leave requests...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-14 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const pending = item.requestStatus === "PENDING";
                  const inactive = item.isActive === false;

                  return (
                    <tr
                      key={item.slug}
                      className={`hover:bg-gray-800/40 transition-colors ${inactive ? "opacity-60" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.slug)}
                          onChange={() => handleSelectRow(item)}
                          disabled={inactive || !pending}
                          className="w-4 h-4 accent-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                        />
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-400">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-indigo-400 font-medium">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.employeeId || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-300">
                          {item.department}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.designation}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getCategoryClass(item.leaveCategory)}`}
                        >
                          {categoryLabels[item.leaveCategory] ||
                            item.leaveCategory}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300">
                        {item.leaveType}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                        {formatDateRange(item.fromDate, item.toDate)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300 text-center">
                        {item.totalDays}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {item.document ? "Document" : "No Document"}
                          </span>

                          {item.document && (
                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  item.document,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                              className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-600 hover:text-white flex items-center justify-center cursor-pointer"
                            >
                              <Upload size={15} />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getStatusClass(item.requestStatus)}`}
                        >
                          {statusLabels[item.requestStatus] ||
                            item.requestStatus ||
                            "-"}
                        </span>

                        {inactive && (
                          <span className="ml-2 inline-flex rounded-md border border-gray-600 bg-gray-700 text-gray-300 px-2 py-1 text-xs">
                            Deleted
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleView(item)}
                            className="w-8 h-8 rounded-lg text-indigo-400 bg-indigo-500/10 hover:bg-indigo-600 hover:text-white flex items-center justify-center cursor-pointer"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>

                          {inactive ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(item)}
                              disabled={submitLoading}
                              className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center cursor-pointer disabled:opacity-50"
                              title="Restore"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(item)}
                                disabled={!pending || submitLoading}
                                className="w-8 h-8 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-500/10"
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleReject(item)}
                                disabled={!pending || submitLoading}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/40 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Reject"
                              >
                                <X size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                disabled={submitLoading}
                                className="w-8 h-8 rounded-lg bg-rose-600/10 hover:text-white hover:bg-rose-700 text-rose-400 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
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
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Request For Leave
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Create a new employee leave request
                </p>
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
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2">
                      Employee <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.employee}
                      onChange={(event) =>
                        handleChange("employee", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select Employee</option>
                      {employeeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(event) =>
                        handleChange("subject", event.target.value)
                      }
                      placeholder="Enter subject"
                      maxLength={150}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Leave Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.leaveCategory}
                      onChange={(event) =>
                        handleChange("leaveCategory", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select Leave Category</option>
                      <option value="FULL_DAY">Full Day</option>
                      <option value="HALF_DAY">Half Day</option>
                      <option value="MULTI_DAY">Multi Day</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.leaveType}
                      onChange={(event) =>
                        handleChange("leaveType", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select Leave Type</option>
                      {leaveTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        handleChange("description", event.target.value)
                      }
                      placeholder="Write leave description..."
                      rows={3}
                      maxLength={500}
                      className={`${inputClass} resize-none`}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {form.description.length}/500
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {isMultiDay ? "From Date" : "Date"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.fromDate}
                      onChange={(event) =>
                        handleChange("fromDate", event.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {isMultiDay ? (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        To Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.toDate}
                        min={form.fromDate || undefined}
                        onChange={(event) =>
                          handleChange("toDate", event.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  ) : (
                    <div className="flex items-end">
                      <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2.5">
                        <p className="text-indigo-300 text-xs">
                          {form.leaveCategory === "HALF_DAY"
                            ? "Half Day leave will count as 0.5 day."
                            : "Single day leave will count as 1 day."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitLoading}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {submitLoading ? "Applying..." : "Apply"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openApproveModal && selectedLeave && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Approve Request
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedLeave.name} •{" "}
                  {categoryLabels[selectedLeave.leaveCategory] ||
                    selectedLeave.leaveCategory}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseApproveModal}
                disabled={submitLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto custom-scrollbar">
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={approveForm.leaveType}
                      onChange={(event) =>
                        handleApproveChange("leaveType", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select Leave Type</option>
                      {leaveTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <p className="text-gray-500 text-xs">Requested Leave</p>
                    <p className="text-white font-medium mt-1">
                      {selectedLeave.leaveType}
                    </p>
                    <p className="text-gray-500 text-xs mt-3">Total Days</p>
                    <p className="text-white font-medium mt-1">
                      {selectedLeave.totalDays}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2">
                      Reply
                    </label>
                    <textarea
                      value={approveForm.reply}
                      onChange={(event) =>
                        handleApproveChange("reply", event.target.value)
                      }
                      placeholder="Write reply..."
                      rows={3}
                      maxLength={500}
                      className={`${inputClass} resize-none`}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {approveForm.reply.length}/500
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <label className="block text-gray-300 text-sm mb-3">
                    Pay Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payType"
                        value="UNPAID"
                        checked={approveForm.payType === "UNPAID"}
                        onChange={(event) =>
                          handleApproveChange("payType", event.target.value)
                        }
                        className="accent-indigo-600"
                      />
                      <span className="text-gray-300 text-sm">Unpaid</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payType"
                        value="PAID"
                        checked={approveForm.payType === "PAID"}
                        onChange={(event) =>
                          handleApproveChange("payType", event.target.value)
                        }
                        className="accent-indigo-600"
                      />
                      <span className="text-gray-300 text-sm">Paid</span>
                    </label>
                  </div>
                </div>

                {approveForm.payType === "PAID" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Number of days to be Paid{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        max={selectedLeave.totalDays}
                        value={approveForm.numberOfDaysPaid}
                        onChange={(event) =>
                          handleApproveChange(
                            "numberOfDaysPaid",
                            event.target.value,
                          )
                        }
                        placeholder="Enter paid days"
                        className={inputClass}
                      />
                    </div>

                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                      <div className="bg-gray-800 px-4 py-3">
                        <h3 className="text-white text-sm font-medium">
                          Leave Balance
                        </h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        <table className="w-full">
                          <thead className="bg-gray-800/50 sticky top-0">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                                Leave Type
                              </th>
                              <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                                Configured Days
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {leaveBalanceData.map((item) => (
                              <tr key={item.leaveType}>
                                <td className="px-4 py-2 text-sm text-gray-300">
                                  {item.leaveType}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-300">
                                  {item.balance}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800 bg-gray-900">
              <button
                type="button"
                onClick={handleCloseApproveModal}
                disabled={submitLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={submitLoading}
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {submitLoading ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openBulkApproveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Approve Multiple Requests
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedRows.length} leave request
                  {selectedRows.length > 1 ? "s" : ""} selected
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseBulkApproveModal}
                disabled={submitLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Reply <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={bulkApproveForm.reply}
                  onChange={(event) =>
                    handleBulkApproveChange("reply", event.target.value)
                  }
                  placeholder="Write reply..."
                  rows={4}
                  maxLength={500}
                  className={`${inputClass} resize-none`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {bulkApproveForm.reply.length}/500
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <label className="block text-gray-300 text-sm mb-4">
                  Pay Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      value: "UNPAID",
                      label: "Unpaid",
                      description: "Approve selected leaves as unpaid",
                    },
                    {
                      value: "PAID",
                      label: "Paid (All Days)",
                      description: "Approve all selected leave days as paid",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${bulkApproveForm.payType === option.value ? "border-indigo-500 bg-indigo-500/10" : "border-gray-700 bg-gray-800 hover:border-gray-600"}`}
                    >
                      <input
                        type="radio"
                        name="bulkPayType"
                        value={option.value}
                        checked={bulkApproveForm.payType === option.value}
                        onChange={(event) =>
                          handleBulkApproveChange("payType", event.target.value)
                        }
                        className="accent-indigo-600"
                      />
                      <div>
                        <p className="text-gray-200 text-sm font-medium">
                          {option.label}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseBulkApproveModal}
                disabled={submitLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkApprove}
                disabled={submitLoading}
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {submitLoading ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openDeclineModal && selectedDeclineLeave && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Decline Request
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedDeclineLeave.name}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseDeclineModal}
                disabled={submitLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <label className="block text-gray-300 text-sm mb-2">
                Reply <span className="text-red-500">*</span>
              </label>
              <textarea
                value={declineForm.reply}
                onChange={(event) =>
                  handleDeclineChange("reply", event.target.value)
                }
                placeholder="Write reply..."
                rows={4}
                maxLength={500}
                className={`${inputClass} resize-none`}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {declineForm.reply.length}/500
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseDeclineModal}
                disabled={submitLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={submitLoading}
                className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {submitLoading ? "Declining..." : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openLeaveDetailModal && selectedLeaveDetail && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Leave Detail
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Complete employee leave request information
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseLeaveDetailModal}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto custom-scrollbar">
              {detailLoading ? (
                <div className="py-16 flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 size={20} className="animate-spin" />
                  Loading details...
                </div>
              ) : (
                <div className="p-5 space-y-5">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <div className="md:col-span-2 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-lg shrink-0">
                          {selectedLeaveDetail.name
                            ?.split(" ")
                            .map((item) => item?.[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {selectedLeaveDetail.name || "-"}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            {selectedLeaveDetail.department || "-"}{" "}
                            {selectedLeaveDetail.designation
                              ? `(${selectedLeaveDetail.designation})`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Date</p>
                        <p className="text-gray-300 text-sm mt-1">
                          {formatDateRange(
                            selectedLeaveDetail.fromDate,
                            selectedLeaveDetail.toDate,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">No. of Days</p>
                        <p className="text-gray-300 text-sm mt-1">
                          {selectedLeaveDetail.totalDays ?? "-"} day
                          {Number(selectedLeaveDetail.totalDays) > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-500 text-xs">Status</p>
                      <div className="mt-2">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getStatusClass(selectedLeaveDetail.requestStatus)}`}
                        >
                          {statusLabels[selectedLeaveDetail.requestStatus] ||
                            selectedLeaveDetail.requestStatus ||
                            "-"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-500 text-xs">Leave Category</p>
                      <div className="mt-2">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getCategoryClass(selectedLeaveDetail.leaveCategory)}`}
                        >
                          {categoryLabels[selectedLeaveDetail.leaveCategory] ||
                            selectedLeaveDetail.leaveCategory ||
                            "-"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-500 text-xs">Leave Type</p>
                      <p className="text-gray-300 text-sm font-medium mt-2">
                        {selectedLeaveDetail.leaveType || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-700">
                      <div className="p-4">
                        <p className="text-gray-500 text-xs">From Date</p>
                        <p className="text-gray-300 text-sm mt-1">
                          {formatDate(selectedLeaveDetail.fromDate)}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-500 text-xs">To Date</p>
                        <p className="text-gray-300 text-sm mt-1">
                          {formatDate(selectedLeaveDetail.toDate)}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-500 text-xs">Total Days</p>
                        <p className="text-gray-300 text-sm mt-1">
                          {selectedLeaveDetail.totalDays ?? "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-xs mb-2">Subject</p>
                      <div className="bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3">
                        <p className="text-gray-300 text-sm">
                          {selectedLeaveDetail.subject || "Leave application"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-2">Description</p>
                      <div className="bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3 min-h-[80px]">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {selectedLeaveDetail.description ||
                            "No description available"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-2">Reply</p>
                      <div className="bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3 min-h-[70px]">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {selectedLeaveDetail.reply || "No reply yet"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedLeaveDetail.document && (
                    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-gray-500 text-xs">
                            Attached Document
                          </p>
                          <p className="text-gray-300 text-sm mt-1">
                            {selectedLeaveDetail.documentName ||
                              "Leave Document"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              selectedLeaveDetail.document,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
                        >
                          <Eye size={15} />
                          View Document
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseLeaveDetailModal}
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

export default LeaveRequests;
