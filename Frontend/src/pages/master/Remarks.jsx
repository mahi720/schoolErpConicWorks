import React, { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  X,
  Search,
  Loader2,
} from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { remarkSchema } from "../../../src/validations/master/remark/remarkSchema";

import { useRemarkStore } from "../../../src/store/master/remark/remarkStore";

const defaultValues = {
  remarksTitle: "",
};

export default function Remarks() {
  const [showModal, setShowModal] = useState(false);

  const [editRemark, setEditRemark] = useState(null);

  const [search, setSearch] = useState("");

  const {
    remarks,
    loading,
    submitLoading,
    fetchRemarks,
    createRemark,
    updateRemark,
    deleteRemark,
    restoreRemark,
  } = useRemarkStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(remarkSchema),

    defaultValues,
  });

  useEffect(() => {
    fetchRemarks({
      status: "all",
    });
  }, [fetchRemarks]);

  useEffect(() => {
    if (!showModal) return;

    if (editRemark) {
      reset({
        remarksTitle: editRemark.remarksTitle || "",
      });

      return;
    }

    reset(defaultValues);
  }, [showModal, editRemark, reset]);

  const filteredRemarks = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return remarks;
    }

    return remarks.filter((item) =>
      item.remarksTitle?.toLowerCase().includes(searchText),
    );
  }, [remarks, search]);

  const openCreateModal = () => {
    setEditRemark(null);

    reset(defaultValues);

    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditRemark(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditRemark(null);

    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    const payload = {
      remarksTitle: data.remarksTitle.trim(),
    };

    const success = editRemark
      ? await updateRemark(editRemark.slug, payload)
      : await createRemark(payload);

    if (success) {
      handleCloseModal();
    }
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this remark?\n\n"${item.remarksTitle}"`,
    );

    if (!confirmDelete) return;

    await deleteRemark(item.slug);
  };

  const handleRestore = async (item) => {
    const confirmRestore = window.confirm(
      `Are you sure you want to restore this remark?\n\n"${item.remarksTitle}"`,
    );

    if (!confirmRestore) return;

    await restoreRemark(item.slug);
  };

  const isInactive = (item) => {
    return (
      item.isActive === false ||
      item.status === "inactive" ||
      Boolean(item.deletedAt)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">Remarks</h1>

          <p className="text-gray-400 mt-1">Manage remarks</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer"
        >
          <Plus size={18} />
          Add New Remark
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 flex justify-between items-center gap-4 flex-wrap border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Remarks</h2>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search remark"
              className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Horizontal and vertical custom scrollbar */}
        <div className="overflow-auto max-h-[65vh] custom-scrollbar">
          <table className="w-full min-w-[750px] table-fixed">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="w-24 p-4 text-left text-gray-300">SN.</th>

                <th className="p-4 text-left text-gray-300">Remarks</th>

                <th className="w-32 p-4 text-center text-gray-300">Status</th>

                <th className="w-40 p-4 text-center text-gray-300">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12">
                    <div className="flex items-center justify-center text-gray-400">
                      <Loader2 size={21} className="animate-spin mr-2" />
                      Loading remarks...
                    </div>
                  </td>
                </tr>
              ) : filteredRemarks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400">
                    No remarks found
                  </td>
                </tr>
              ) : (
                filteredRemarks.map((item, index) => {
                  const inactive = isInactive(item);

                  return (
                    <tr
                      key={item.slug}
                      className="border-t border-gray-800 hover:bg-gray-800/30"
                    >
                      <td className="w-24 p-4 text-white">{index + 1}.</td>

                      <td className="p-4 text-white break-words whitespace-pre-wrap">
                        {item.remarksTitle}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            inactive
                              ? "bg-red-500/15 border border-red-500/30 text-red-400"
                              : "bg-green-500/15 border border-green-500/30 text-green-400"
                          }`}
                        >
                          {inactive ? "Inactive" : "Active"}
                        </span>
                      </td>

                      <td className="w-40 p-4">
                        <div className="flex justify-center gap-2">
                          {!inactive && (
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 cursor-pointer text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit Remark"
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {inactive ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(item)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 cursor-pointer text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Restore Remark"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 cursor-pointer text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Remark"
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-white text-xl font-bold">
                  {editRemark ? "Edit Remark" : "Add Remark"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {editRemark ? "Update remark details" : "Create a new remark"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitLoading}
                className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-50"
              >
                <X className="text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Remarks <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={5}
                  {...register("remarksTitle")}
                  placeholder="Enter remark..."
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white resize-none outline-none focus:border-blue-500 disabled:opacity-60"
                />

                {errors.remarksTitle && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.remarksTitle.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitLoading}
                  className="px-4 py-2 border border-gray-700 rounded-xl text-white hover:bg-gray-800 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitLoading && (
                    <Loader2 size={17} className="animate-spin" />
                  )}

                  {editRemark ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
