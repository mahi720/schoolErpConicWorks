import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  IndianRupee,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdvanceRequests = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reason: "",
    advanceAmount: "",
  });

  const advanceRequests = [
    {
      id: 1,
      date: "12-08-2026",
      amount: 10000,
      status: "Pending",
      requestId: "NA",
      reason: "Personal requirement",
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return advanceRequests;
    }

    return advanceRequests.filter((item) => {
      return (
        item.date.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.requestId.toLowerCase().includes(keyword) ||
        item.reason.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleOpenModal = () => {
    setForm({
      reason: "",
      advanceAmount: "",
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
      advanceAmount: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.reason.trim()) {
      return;
    }

    if (!form.advanceAmount || Number(form.advanceAmount) <= 0) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        reason: form.reason.trim(),
        advanceAmount: Number(form.advanceAmount),
      };

      console.log("Advance Request Payload", payload);

      // Yahan create advance request API call karna hai.

      setOpenModal(false);

      setForm({
        reason: "",
        advanceAmount: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item) => {
    console.log("View advance request", item);
  };

  const handleDelete = async (item) => {
    console.log("Delete advance request", item);
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
                Advance Requests
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Manage and track employee advance requests
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
          >
            <Plus size={17} />
            Request for Advance
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">Advance Request List</h2>

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
                placeholder="Search advance request..."
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
                  #
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Amount
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16">
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
                  <td colSpan={6} className="py-14 text-center text-gray-500">
                    No advance requests found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.date}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-emerald-400 font-medium">
                        ₹ {item.amount.toLocaleString("en-IN")}
                      </span>
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

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.requestId || "NA"}
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

        <div className="px-4 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>{" "}
            advance requests
          </p>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <IndianRupee size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Request For Advance
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Submit a new advance request
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

            <div className="p-5 space-y-5">
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
                  placeholder="Write reason..."
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
                  Advance Amount
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
                    value={form.advanceAmount}
                    onChange={(event) =>
                      handleChange("advanceAmount", event.target.value)
                    }
                    placeholder="Enter advance amount"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                <p className="text-indigo-300 text-xs leading-relaxed">
                  Advance request will be submitted for approval after
                  verification.
                </p>
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
    </div>
  );
};

export default AdvanceRequests;
