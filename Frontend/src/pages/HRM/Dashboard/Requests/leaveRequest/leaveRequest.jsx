import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  FileSpreadsheet,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeaveRequests = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [approveForm, setApproveForm] = useState({
    leaveType: "",
    reply: "",
    payType: "",
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

  const leaveBalanceData = [
    {
      leaveType: "CL",
      balance: 2,
    },
    {
      leaveType: "EL",
      balance: 55.5,
    },
    {
      leaveType: "LWP",
      balance: 0,
    },
    {
      leaveType: "OOD",
      balance: 0,
    },
    {
      leaveType: "CPL",
      balance: 0,
    },
    {
      leaveType: "CHPL",
      balance: 0,
    },
    {
      leaveType: "Maternity Leave",
      balance: 0,
    },
  ];

  const [form, setForm] = useState({
    employee: "",
    subject: "",
    leaveCategory: "",
    leaveType: "",
    description: "",
    fromDate: "",
    toDate: "",
  });

  const leaveRequests = [
    {
      id: 1,
      name: "SUMATHY K",
      department: "TEACHING",
      designation: "PRT",
      leaveCategory: "Full Day",
      leaveType: "CL",
      date: "13-08-2026",
      totalDays: 1,
      document: null,
      status: "Pending",
    },
    {
      id: 2,
      name: "S CHAITHANYA SIROMANI",
      department: "TEACHING",
      designation: "TGT",
      leaveCategory: "Full Day",
      leaveType: "CL",
      date: "04-08-2026",
      totalDays: 1,
      document: null,
      status: "Pending",
    },
    {
      id: 3,
      name: "B G ANILA KUMARI",
      department: "TEACHING",
      designation: "NURSERY TEACHER",
      leaveCategory: "Full Day",
      leaveType: "EL",
      date: "13-08-2026",
      totalDays: 1,
      document: null,
      status: "Pending",
    },
    {
      id: 4,
      name: "SOWMINI RAMESH",
      department: "TEACHING",
      designation: "PGT",
      leaveCategory: "Full Day",
      leaveType: "CL",
      date: "10-08-2026",
      totalDays: 1,
      document: null,
      status: "Pending",
    },
    {
      id: 5,
      name: "RAJESWARI RAMESH",
      department: "TEACHING",
      designation: "PRT",
      leaveCategory: "Multi Day",
      leaveType: "EL",
      date: "28-07-2026",
      totalDays: 11,
      document: null,
      status: "Pending",
    },
    {
      id: 6,
      name: "RAJESWARI RAMESH",
      department: "TEACHING",
      designation: "PRT",
      leaveCategory: "Half Day",
      leaveType: "EL",
      date: "27-07-2026",
      totalDays: 0.5,
      document: null,
      status: "Pending",
    },
  ];

  const employeeOptions = [
    {
      value: "sumathy-k",
      label: "SUMATHY K",
    },
    {
      value: "chaithanya-siromani",
      label: "S CHAITHANYA SIROMANI",
    },
    {
      value: "anila-kumari",
      label: "B G ANILA KUMARI",
    },
    {
      value: "sowmini-ramesh",
      label: "SOWMINI RAMESH",
    },
  ];

  const leaveTypeOptions = [
    {
      value: "CL",
      label: "Casual Leave (CL)",
    },
    {
      value: "EL",
      label: "Earned Leave (EL)",
    },
    {
      value: "SL",
      label: "Sick Leave (SL)",
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return leaveRequests;
    }

    return leaveRequests.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword) ||
        item.designation.toLowerCase().includes(keyword) ||
        item.leaveType.toLowerCase().includes(keyword) ||
        item.leaveCategory.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const allSelected =
    filteredData.length > 0 &&
    filteredData.every((item) => selectedRows.includes(item.id));

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
      employee: "",
      subject: "",
      leaveCategory: "",
      leaveType: "",
      description: "",
      fromDate: "",
      toDate: "",
    });

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (loading) {
      return;
    }

    setOpenModal(false);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);

      return;
    }

    setSelectedRows(filteredData.map((item) => item.id));
  };

  const handleSelectRow = (id) => {
    setSelectedRows((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      return [...previous, id];
    });
  };

  const handleSubmit = async () => {
    if (!form.employee) {
      return;
    }

    if (!form.subject.trim()) {
      return;
    }

    if (!form.leaveCategory) {
      return;
    }

    if (!form.leaveType) {
      return;
    }

    if (!form.description.trim()) {
      return;
    }

    if (!form.fromDate) {
      return;
    }

    if (isMultiDay && !form.toDate) {
      return;
    }

    if (isMultiDay && new Date(form.toDate) < new Date(form.fromDate)) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        employee: form.employee,
        subject: form.subject.trim(),
        leaveCategory: form.leaveCategory,
        leaveType: form.leaveType,
        description: form.description.trim(),
        fromDate: form.fromDate,
        toDate: isMultiDay ? form.toDate : null,
      };

      console.log("Leave Request Payload", payload);

      // Yahan create leave request API call karna hai.

      setOpenModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSelected = () => {
    if (selectedRows.length === 0) {
      return;
    }

    setBulkApproveForm({
      reply: "",
      payType: "UNPAID",
    });

    setOpenBulkApproveModal(true);
  };

  const handleApprove = (item) => {
    setSelectedLeave(item);

    setApproveForm({
      leaveType: item.leaveType || "",
      reply: "",
      payType: "PAID",
      numberOfDaysPaid: String(item.totalDays || ""),
    });

    setOpenApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    if (loading) {
      return;
    }

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
    }));
  };

  const handleConfirmApprove = async () => {
    if (!selectedLeave) {
      return;
    }

    if (!approveForm.leaveType) {
      return;
    }

    if (!approveForm.payType) {
      return;
    }

    if (
      approveForm.payType === "PAID" &&
      (!approveForm.numberOfDaysPaid ||
        Number(approveForm.numberOfDaysPaid) <= 0)
    ) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        leaveSlug: selectedLeave.slug || selectedLeave.id,
        leaveType: approveForm.leaveType,
        reply: approveForm.reply.trim(),
        payType: approveForm.payType,
        numberOfDaysPaid:
          approveForm.payType === "PAID"
            ? Number(approveForm.numberOfDaysPaid)
            : 0,
      };

      console.log("Approve Leave Payload", payload);

      // Yahan approve API call karna hai.
      // await approveLeave(payload);

      setOpenApproveModal(false);
      setSelectedLeave(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkApproveChange = (field, value) => {
    setBulkApproveForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCloseBulkApproveModal = () => {
    if (loading) {
      return;
    }

    setOpenBulkApproveModal(false);

    setBulkApproveForm({
      reply: "",
      payType: "UNPAID",
    });
  };

  const handleConfirmBulkApprove = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    if (!bulkApproveForm.reply.trim()) {
      return;
    }

    if (!bulkApproveForm.payType) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        leaveSlugs: selectedRows,
        reply: bulkApproveForm.reply.trim(),
        payType: bulkApproveForm.payType,
      };

      console.log("Bulk Approve Payload", payload);

      // Yahan bulk approve API call karna hai.
      // await bulkApproveLeaves(payload);

      setOpenBulkApproveModal(false);
      setSelectedRows([]);

      setBulkApproveForm({
        reply: "",
        payType: "UNPAID",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineChange = (field, value) => {
    setDeclineForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCloseDeclineModal = () => {
    if (loading) {
      return;
    }

    setOpenDeclineModal(false);
    setSelectedDeclineLeave(null);

    setDeclineForm({
      reply: "",
    });
  };

  const handleConfirmDecline = async () => {
    if (!selectedDeclineLeave) {
      return;
    }

    if (!declineForm.reply.trim()) {
      toast.error("Reply is required");

      return;
    }

    try {
      setLoading(true);

      const payload = {
        leaveSlug: selectedDeclineLeave.slug || selectedDeclineLeave.id,

        reply: declineForm.reply.trim(),
      };

      console.log("Decline Leave Payload", payload);

      // Yahan decline API call karna hai.
      // const success = await declineLeave(payload);

      // if (!success) {
      //   return;
      // }

      setOpenDeclineModal(false);
      setSelectedDeclineLeave(null);

      setDeclineForm({
        reply: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = (item) => {
    setSelectedDeclineLeave(item);

    setDeclineForm({
      reply: "",
    });

    setOpenDeclineModal(true);
  };

  const handleView = (item) => {
    setSelectedLeaveDetail(item);
    setOpenLeaveDetailModal(true);
  };

  const handleCloseLeaveDetailModal = () => {
    setOpenLeaveDetailModal(false);
    setSelectedLeaveDetail(null);
  };

  const handleDelete = (item) => {
    console.log("Delete leave", item);
  };

  const handleExcel = () => {
    console.log("Export Excel");
  };

  const getCategoryClass = (category) => {
    if (category === "Full Day") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (category === "Half Day") {
      return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    }

    return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
  };

  const getStatusClass = (status) => {
    if (status?.toLowerCase() === "approved") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (status?.toLowerCase() === "rejected") {
      return "bg-red-500/10 border-red-500/20 text-red-400";
    }

    return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500";

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
              disabled={selectedRows.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              Approve Requests
            </button>

            <button
              type="button"
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus size={17} className="mt-0.4" />
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
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
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
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-14 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                      />
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-sm text-indigo-400 font-medium">
                      {item.name}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-300">{item.department}</p>

                      <p className="text-xs text-gray-500 mt-1">
                        {item.designation}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getCategoryClass(
                          item.leaveCategory,
                        )}`}
                      >
                        {item.leaveCategory}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.leaveType}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.date}
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
                            className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-600 hover:text-white flex items-center justify-center cursor-pointer"
                          >
                            <Upload size={15} />
                          </button>
                        )}
                      </div>
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

                        <button
                          type="button"
                          onClick={() => handleApprove(item)}
                          className="w-8 h-8 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white flex items-center justify-center cursor-pointer"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReject(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/40 cursor-pointer transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="w-8 h-8 rounded-lg bg-rose-600/10 hover:text-white hover:bg-rose-700 text-rose-400 flex items-center justify-center cursor-pointer"
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
                disabled={loading}
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
                      Employee
                      <span className="text-red-500"> *</span>
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
                      Subject
                      <span className="text-red-500"> *</span>
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
                      Leave Category
                      <span className="text-red-500"> *</span>
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
                      Leave Type
                      <span className="text-red-500"> *</span>
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
                      Description
                      <span className="text-red-500"> *</span>
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
                      {isMultiDay ? "From Date" : "Date"}
                      <span className="text-red-500"> *</span>
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

                  {isMultiDay && (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        To Date
                        <span className="text-red-500"> *</span>
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
                  )}

                  {!isMultiDay && (
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
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}

                {loading ? "Applying..." : "Apply"}
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
                  {selectedLeave.name} • {selectedLeave.leaveCategory}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseApproveModal}
                disabled={loading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto custom-scrollbar">
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Leave Type
                      <span className="text-red-500"> *</span>
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
                    Pay Type
                    <span className="text-red-500"> *</span>
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
                        Number of days to be Paid
                        <span className="text-red-500"> *</span>
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
                                Balance
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
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}

                {loading ? "Approving..." : "Approve"}
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
                disabled={loading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Reply
                  <span className="text-red-500"> *</span>
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
                  Pay Type
                  <span className="text-red-500"> *</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                      bulkApproveForm.payType === "UNPAID"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="bulkPayType"
                      value="UNPAID"
                      checked={bulkApproveForm.payType === "UNPAID"}
                      onChange={(event) =>
                        handleBulkApproveChange("payType", event.target.value)
                      }
                      className="accent-indigo-600"
                    />

                    <div>
                      <p className="text-gray-200 text-sm font-medium">
                        Unpaid
                      </p>

                      <p className="text-gray-500 text-xs mt-1">
                        Approve selected leaves as unpaid
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                      bulkApproveForm.payType === "PAID"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="bulkPayType"
                      value="PAID"
                      checked={bulkApproveForm.payType === "PAID"}
                      onChange={(event) =>
                        handleBulkApproveChange("payType", event.target.value)
                      }
                      className="accent-emerald-600"
                    />

                    <div>
                      <p className="text-gray-200 text-sm font-medium">
                        Paid (All Days)
                      </p>

                      <p className="text-gray-500 text-xs mt-1">
                        Approve all selected leave days as paid
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-3">
                <p className="text-indigo-300 text-xs leading-relaxed">
                  Selected pay type will be applied to all selected leave
                  requests.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseBulkApproveModal}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleConfirmBulkApprove}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}

                {loading ? "Approving..." : "Approve"}
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
                disabled={loading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Reply
                  <span className="text-red-500"> *</span>
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

                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    {declineForm.reply.length}/500
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleCloseDeclineModal}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}

                {loading ? "Declining..." : "Decline"}
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
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto custom-scrollbar">
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
                        {selectedLeaveDetail.date || "-"}
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
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          selectedLeaveDetail.status,
                        )}`}
                      >
                        {selectedLeaveDetail.status || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
                    <p className="text-gray-500 text-xs">Leave Category</p>

                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getCategoryClass(
                          selectedLeaveDetail.leaveCategory,
                        )}`}
                      >
                        {selectedLeaveDetail.leaveCategory || "-"}
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
                        {selectedLeaveDetail.fromDate ||
                          selectedLeaveDetail.date ||
                          "-"}
                      </p>
                    </div>

                    <div className="p-4">
                      <p className="text-gray-500 text-xs">To Date</p>

                      <p className="text-gray-300 text-sm mt-1">
                        {selectedLeaveDetail.toDate ||
                          selectedLeaveDetail.date ||
                          "-"}
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
                          {selectedLeaveDetail.documentName || "Leave Document"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          console.log(
                            "View document",
                            selectedLeaveDetail.document,
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
