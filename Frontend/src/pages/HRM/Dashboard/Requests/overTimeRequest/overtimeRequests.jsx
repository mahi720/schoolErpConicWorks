import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Ban,
  Check,
  Clock3,
  Eye,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useEmployeeStore } from "../../../../../store/hrm/employee/employeeStore";

import { useOvertimeRequestStore } from "../../../../../store/HRM/request/overtimeRequest/overtimeRequestStore";

// import {
//   buildOvertimeRequestPayload,
//   createOvertimeRequestSchema,
//   overtimeRequestInitialValues,
// } from "../../../../../validations/hrm/request/overtimeRequest/overtimeRequestValidation";

import {
  approveOvertimeRequestSchema,
  buildOvertimeActionPayload,
  buildOvertimeRequestPayload,
  rejectOvertimeRequestSchema,
  createOvertimeRequestSchema,
  overtimeRequestInitialValues,
} from "../../../../../validations/hrm/request/overtimeRequest/overtimeRequestValidation";

const OvertimeRequests = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [requestView, setRequestView] = useState("MY_REQUESTS");

  const [actionModalOpen, setActionModalOpen] = useState(false);

  const [actionType, setActionType] = useState("");

  const [actionRequest, setActionRequest] = useState(null);

  const [remark, setRemark] = useState("");

  const [form, setForm] = useState({
    ...overtimeRequestInitialValues,
  });

  const {
    employees,
    loading: employeeLoading,
    fetchEmployees,
  } = useEmployeeStore();

  const {
    myOvertimeRequests,
    assignedOvertimeRequests,
    selectedOvertimeRequest,

    loading,
    submitLoading,
    actionLoading,

    fetchMyOvertimeRequests,
    fetchAssignedOvertimeRequests,
    fetchOvertimeRequestBySlug,

    createOvertimeRequest,
    approveOvertimeRequest,
    rejectOvertimeRequest,
    deleteOvertimeRequest,
    restoreOvertimeRequest,

    clearSelectedOvertimeRequest,
  } = useOvertimeRequestStore();

  useEffect(() => {
    Promise.all([
      fetchMyOvertimeRequests({
        status: "all",
      }),

      fetchAssignedOvertimeRequests({
        status: "all",
      }),

      fetchEmployees(),
    ]);
  }, [fetchMyOvertimeRequests, fetchAssignedOvertimeRequests, fetchEmployees]);

  const employeeList = useMemo(() => {
    if (Array.isArray(employees)) {
      return employees;
    }

    if (Array.isArray(employees?.employees)) {
      return employees.employees;
    }

    if (Array.isArray(employees?.data)) {
      return employees.data;
    }

    return [];
  }, [employees]);

  const appointedByOptions = useMemo(() => {
    return employeeList
      .filter(
        (employee) =>
          employee.isActive !== false && employee.isTransferred !== true,
      )
      .map((employee) => ({
        value: employee.slug,

        label:
          employee.fullName || employee.employeeName || employee.name || "-",

        employeeId: employee.employeeId || employee.employeeCode || "",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [employeeList]);

  const pendingAssignedOvertimeCount = useMemo(() => {
    return (assignedOvertimeRequests || []).filter((item) => {
      const status = String(
        item.requestStatus || item.status || "",
      ).toUpperCase();

      return status === "PENDING" && item.isActive !== false;
    }).length;
  }, [assignedOvertimeRequests]);

  const currentOvertimeRequests = useMemo(() => {
    if (requestView === "ASSIGNED_TO_ME") {
      return assignedOvertimeRequests || [];
    }

    return myOvertimeRequests || [];
  }, [requestView, myOvertimeRequests, assignedOvertimeRequests]);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const rows = currentOvertimeRequests;

    if (!keyword) {
      return rows;
    }

    return rows.filter((item) => {
      const date = formatDate(item.date || item.overtimeDate).toLowerCase();

      const appointedBy = String(item.appointedBy || "").toLowerCase();

      const status = String(
        item.requestStatus || item.status || "",
      ).toLowerCase();

      const description = String(item.description || "").toLowerCase();

      const hours = String(
        item.hoursSpent ?? item.requestedHours ?? "",
      ).toLowerCase();

      return (
        date.includes(keyword) ||
        appointedBy.includes(keyword) ||
        status.includes(keyword) ||
        description.includes(keyword) ||
        hours.includes(keyword)
      );
    });
  }, [search, currentOvertimeRequests]);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  const handleOpenModal = () => {
    setForm({
      ...overtimeRequestInitialValues,
    });

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (submitLoading) {
      return;
    }

    setOpenModal(false);

    setForm({
      ...overtimeRequestInitialValues,
    });
  };

  const handleSubmit = async () => {
    const payload = buildOvertimeRequestPayload(form);

    const validation = createOvertimeRequestSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message ||
          "Please enter valid overtime details",
      );

      return;
    }

    const success = await createOvertimeRequest(validation.data);

    if (!success) {
      return;
    }

    setOpenModal(false);

    setForm({
      ...overtimeRequestInitialValues,
    });
  };

  const handleView = async (item) => {
    const success = await fetchOvertimeRequestBySlug(item.slug);

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

    clearSelectedOvertimeRequest();
  };

  const handleDelete = async (item) => {
    if (item.requestStatus === "APPROVED" || item.status === "APPROVED") {
      toast.error("Approved overtime request cannot be deleted");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this overtime request?",
    );

    if (!confirmed) {
      return;
    }

    await deleteOvertimeRequest(item.slug);
  };

  const handleRestore = async (item) => {
    await restoreOvertimeRequest(item.slug);
  };

  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "").toUpperCase();

    if (normalizedStatus === "APPROVED") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (normalizedStatus === "REJECTED") {
      return "bg-red-500/10 border-red-500/20 text-red-400";
    }

    if (normalizedStatus === "CANCELLED") {
      return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }

    return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  };

  const formatStatus = (value) => {
    if (!value) {
      return "-";
    }

    const valueText = String(value).replaceAll("_", " ").toLowerCase();

    return valueText.replace(/\b\w/g, (character) => character.toUpperCase());
  };

  const handleOpenActionModal = (type, item) => {
    if (item.requestStatus !== "PENDING" && item.status !== "PENDING") {
      toast.error("Only pending request can be updated");

      return;
    }

    setActionType(type);
    setActionRequest(item);
    setRemark("");
    setActionModalOpen(true);
  };

  const handleCloseActionModal = () => {
    if (actionLoading) {
      return;
    }

    setActionModalOpen(false);
    setActionType("");
    setActionRequest(null);
    setRemark("");
  };

  const handleSubmitAction = async () => {
    if (!actionRequest?.slug) {
      return;
    }

    const payload = buildOvertimeActionPayload(remark);

    const schema =
      actionType === "APPROVE"
        ? approveOvertimeRequestSchema
        : rejectOvertimeRequestSchema;

    const validation = schema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Remark is required",
      );

      return;
    }

    let success = false;

    if (actionType === "APPROVE") {
      success = await approveOvertimeRequest(
        actionRequest.slug,
        validation.data,
      );
    } else {
      success = await rejectOvertimeRequest(
        actionRequest.slug,
        validation.data,
      );
    }

    if (!success) {
      return;
    }

    handleCloseActionModal();
  };

  const formatEmployee = (employee) => {
    if (!employee) {
      return "-";
    }

    const name = employee.fullName || employee.name || "-";

    const employeeId = employee.employeeId || employee.employeeCode || "";

    if (!employeeId) {
      return name;
    }

    return `${name} (${employeeId})`;
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

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
                Overtime Requests
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Manage and track employee overtime requests
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setRequestView("MY_REQUESTS")}
              className={`px-4 py-2.5 rounded-lg text-sm cursor-pointer ${
                requestView === "MY_REQUESTS"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              My Requests
            </button>

            <button
              type="button"
              onClick={() => setRequestView("ASSIGNED_TO_ME")}
              className={`px-4 py-2.5 rounded-lg text-sm cursor-pointer ${
                requestView === "ASSIGNED_TO_ME"
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Assigned To Me
              {pendingAssignedOvertimeCount > 0 && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {pendingAssignedOvertimeCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenModal}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <Plus size={17} />
              Request for Overtime
            </button>
          </div>
        </div>
      </div>

      {/* List */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">
                Overtime Request List
              </h2>

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
                placeholder="Search request..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          <table className="w-full min-w-[950px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-16">
                  SNo.
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Requested By
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Assigned By
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Req Hours
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Status
                </th>

                {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Record
                </th> */}

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16">
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
                  <td colSpan={8} className="py-14 text-center text-gray-500">
                    No overtime requests found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const requestStatus = item.requestStatus || item.status;

                  return (
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

                      <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                        {formatDate(item.date || item.overtimeDate)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        {formatEmployee(item.requestedBy)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        {formatEmployee(item.assignedBy)}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-300 text-center">
                        {item.requestedHours ?? item.hoursSpent ?? "-"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            requestStatus,
                          )}`}
                        >
                          {formatStatus(requestStatus)}
                        </span>
                      </td>

                      {/* <td className="px-4 py-3 text-center">
                        {item.isActive === false ? (
                          <span className="inline-flex rounded-md border border-red-500/20 bg-red-500/10 text-red-400 px-2.5 py-1 text-xs">
                            Deleted
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 text-xs">
                            Active
                          </span>
                        )}
                      </td> */}

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleView(item)}
                            disabled={actionLoading}
                            title="View"
                            className="w-8 h-8 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white flex items-center justify-center cursor-pointer disabled:opacity-50"
                          >
                            <Eye size={16} />
                          </button>

                          {requestView === "ASSIGNED_TO_ME" &&
                            item.isActive !== false &&
                            requestStatus === "PENDING" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenActionModal("APPROVE", item)
                                  }
                                  disabled={actionLoading}
                                  title="Approve"
                                  className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                >
                                  <Check size={17} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenActionModal("REJECT", item)
                                  }
                                  disabled={actionLoading}
                                  title="Reject"
                                  className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                >
                                  <Ban size={16} />
                                </button>
                              </>
                            )}

                          {requestView === "MY_REQUESTS" && (
                            <>
                              {item.isActive !== false ? (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item)}
                                  disabled={
                                    actionLoading ||
                                    requestStatus === "APPROVED"
                                  }
                                  title={
                                    requestStatus === "APPROVED"
                                      ? "Approved request cannot be deleted"
                                      : "Delete"
                                  }
                                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <Trash2 size={16} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleRestore(item)}
                                  disabled={actionLoading}
                                  title="Restore"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 cursor-pointer disabled:opacity-40"
                                >
                                  <RefreshCcw size={16} />
                                </button>
                              )}
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

        <div className="px-4 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>{" "}
            overtime requests
          </p>
        </div>
      </div>

      {/* Create Modal */}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Request For Over-Time
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Submit a new overtime request
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

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm mb-2">
                    Description
                    <span className="text-red-500"> *</span>
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      handleChange("description", event.target.value)
                    }
                    placeholder="Write description..."
                    rows={3}
                    maxLength={500}
                    disabled={submitLoading}
                    className={`${inputClass} resize-none`}
                  />

                  <div className="text-right text-xs text-gray-500 mt-1">
                    {form.description.length}
                    /500
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Appointed By
                    <span className="text-red-500"> *</span>
                  </label>

                  <select
                    value={form.appointedBy}
                    onChange={(event) =>
                      handleChange("appointedBy", event.target.value)
                    }
                    disabled={submitLoading || employeeLoading}
                    className={inputClass}
                  >
                    <option value="">
                      {employeeLoading ? "Loading Employees..." : "Select Name"}
                    </option>

                    {appointedByOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}

                        {item.employeeId ? ` (${item.employeeId})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Date
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      handleChange("date", event.target.value)
                    }
                    disabled={submitLoading}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Hours Spent
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={form.hoursSpent}
                    onChange={(event) =>
                      handleChange("hoursSpent", event.target.value)
                    }
                    placeholder="Enter hours"
                    disabled={submitLoading}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-end">
                  <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2.5">
                    <p className="text-indigo-300 text-xs leading-relaxed">
                      Overtime request will remain Pending until it is approved
                      or rejected.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-800 px-5 py-4">
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

      {/* Detail Modal */}

      {detailModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Over-Time Request Detail
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    View overtime request details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDetail}
                disabled={actionLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {actionLoading ? (
              <div className="py-16 flex justify-center">
                <Loader2 size={28} className="animate-spin text-indigo-500" />
              </div>
            ) : selectedOvertimeRequest ? (
              <>
                <div className="p-5 space-y-5">
                  <div>
                    <p className="text-gray-500 text-xs uppercase">
                      Description
                    </p>

                    <p className="text-gray-200 text-sm mt-2 whitespace-pre-wrap">
                      {selectedOvertimeRequest.description || "-"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailBox
                      label="Date"
                      value={formatDate(
                        selectedOvertimeRequest.date ||
                          selectedOvertimeRequest.overtimeDate,
                      )}
                    />

                    <DetailBox
                      label="Hours Spent"
                      value={`${
                        selectedOvertimeRequest.hoursSpent ??
                        selectedOvertimeRequest.requestedHours ??
                        "-"
                      } Hours`}
                    />

                    <DetailBox
                      label="Requested By"
                      value={formatEmployee(
                        selectedOvertimeRequest.requestedBy,
                      )}
                    />

                    <DetailBox
                      label="Assigned By"
                      value={formatEmployee(selectedOvertimeRequest.assignedBy)}
                    />

                    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-500 text-xs uppercase">Status</p>

                      <div className="mt-2">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            selectedOvertimeRequest.requestStatus ||
                              selectedOvertimeRequest.status,
                          )}`}
                        >
                          {formatStatus(
                            selectedOvertimeRequest.requestStatus ||
                              selectedOvertimeRequest.status,
                          )}
                        </span>
                      </div>
                    </div>

                    {selectedOvertimeRequest.requestStatus === "APPROVED" && (
                      <DetailBox
                        label="Approved By"
                        value={formatEmployee(
                          selectedOvertimeRequest.approvedBy,
                        )}
                      />
                    )}

                    {selectedOvertimeRequest.approvedAt && (
                      <DetailBox
                        label="Approved At"
                        value={formatDateTime(
                          selectedOvertimeRequest.approvedAt,
                        )}
                      />
                    )}

                    {selectedOvertimeRequest.requestStatus === "REJECTED" && (
                      <DetailBox
                        label="Rejected By"
                        value={formatEmployee(
                          selectedOvertimeRequest.rejectedBy,
                        )}
                      />
                    )}

                    {selectedOvertimeRequest.rejectedAt && (
                      <DetailBox
                        label="Rejected At"
                        value={formatDateTime(
                          selectedOvertimeRequest.rejectedAt,
                        )}
                      />
                    )}

                    {selectedOvertimeRequest.remark && (
                      <div className="sm:col-span-2 bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                        <p className="text-gray-500 text-xs uppercase">
                          Remark
                        </p>

                        <p className="text-gray-200 text-sm mt-2">
                          {selectedOvertimeRequest.remark}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end border-t border-gray-800 px-5 py-4">
                  <button
                    type="button"
                    onClick={handleCloseDetail}
                    className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="py-14 text-center text-gray-500">
                Overtime request not found
              </div>
            )}
          </div>
        </div>
      )}

      {actionModalOpen && actionRequest && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {actionType === "APPROVE"
                    ? "Approve Overtime Request"
                    : "Reject Overtime Request"}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  {actionRequest.employeeName}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseActionModal}
                disabled={actionLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <DetailBox
                  label="Date"
                  value={formatDate(
                    actionRequest.date || actionRequest.overtimeDate,
                  )}
                />

                <DetailBox
                  label="Hours"
                  value={`${
                    actionRequest.hoursSpent ??
                    actionRequest.requestedHours ??
                    "-"
                  } Hours`}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Remark
                  <span className="text-red-500"> *</span>
                </label>

                <textarea
                  value={remark}
                  onChange={(event) => setRemark(event.target.value)}
                  placeholder={
                    actionType === "APPROVE"
                      ? "Enter approval remark"
                      : "Enter rejectation remark"
                  }
                  rows={4}
                  maxLength={500}
                  disabled={actionLoading}
                  className={`${inputClass} resize-none`}
                />

                <div className="text-right text-xs text-gray-500 mt-1">
                  {remark.length}
                  /500
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseActionModal}
                disabled={actionLoading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSubmitAction}
                disabled={actionLoading}
                className={`px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                  actionType === "APPROVE"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {actionLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}

                {actionLoading
                  ? "Saving..."
                  : actionType === "APPROVE"
                    ? "Approve"
                    : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailBox = ({ label, value }) => {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
      <p className="text-gray-500 text-xs uppercase">{label}</p>

      <p className="text-gray-200 text-sm mt-2">{value || "-"}</p>
    </div>
  );
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
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
    return value;
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

export default OvertimeRequests;
