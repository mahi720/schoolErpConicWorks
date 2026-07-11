import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Pencil, Plus, Trash2, X, Loader2 } from "lucide-react";
import { useSessionStore } from "../../store/master/session/sessionStore";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionSchema } from "../../validations/master/session/sessionSchema";

const defaultValues = {
  name: "",
  startDate: "",
  endDate: "",
  status: "active",
};

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const formatDateForTable = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Sessions() {
  const [showModal, setShowModal] = useState(false);
  const [editSession, setEditSession] = useState(null);

  const {
    sessions,
    loading,
    submitLoading,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  } = useSessionStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues,
  });

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const openAddModal = () => {
    setEditSession(null);
    reset(defaultValues);
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setEditSession(row);

    reset({
      name: row.name || "",
      startDate: formatDateForInput(row.startDate),
      endDate: formatDateForInput(row.endDate),
      status: row.status || "active",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditSession(null);
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    let success = false;

    if (editSession) {
      success = await updateSession(editSession.slug, data);
    } else {
      success = await createSession(data);
    }

    if (success) {
      closeModal();
    }
  };

  const columns = [
    {
      key: "sn",
      label: "SN",
      render: (v, row, index) => index + 1,
    },
    {
      key: "name",
      label: "Session Name",
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (value) => formatDateForTable(value),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (value) => formatDateForTable(value),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            value === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: <Pencil size={16} />,
      onClick: (row) => openEditModal(row),
    },
    {
      label: <Trash2 size={16} />,
      variant: "danger",
      onClick: async (row) => {
        const confirmDelete = window.confirm(
          `Are you sure you want to delete ${row.name}?`,
        );

        if (!confirmDelete) return;

        await deleteSession(row.slug);
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-300">Sessions & Years</h1>

          <p className="text-gray-400">Manage academic sessions</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus size={18} />
          Add Session
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-300">
          <Loader2 className="animate-spin mr-2" size={22} />
          Loading sessions...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sessions}
          searchFields={["name"]}
          title="Sessions"
          actions={actions}
          rowKey="slug"
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-300">
                {editSession ? "Edit Session" : "Add Session"}
              </h2>

              <button onClick={closeModal} disabled={submitLoading}>
                <X className="text-gray-300 cursor-pointer" size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-gray-300">Session Name</label>

                <input
                  type="text"
                  placeholder="2025-2026"
                  {...register("name")}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-300">Start Date</label>

                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full cursor-pointer bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                {errors.startDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-300">End Date</label>

                <input
                  type="date"
                  {...register("endDate")}
                  className="w-full cursor-pointer bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                {errors.endDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-300">Status</label>

                <select
                  {...register("status")}
                  className="w-full cursor-pointer bg-gray-800 text-white border border-gray-700 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>

                {errors.status && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitLoading}
                  className="text-gray-300 cursor-pointer px-4 py-2 border border-gray-600 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}

                  {editSession ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
