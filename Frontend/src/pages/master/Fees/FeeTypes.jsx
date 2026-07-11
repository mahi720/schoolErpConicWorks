import React, { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Search,
  X,
  Loader2,
} from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useBoardStore } from "../../../store/master/board/boardStore";
import { useFeeTypeStore } from "../../../store/master/feeType/feeTypeStore";

import { feeTypeSchema } from "../../../validations/master/feeType/feeTypeSchema";

const defaultValues = {
  board: "",
  feeType: "",
  description: "",
};

export default function FeesType() {
  const [showModal, setShowModal] = useState(false);

  const [editFeeType, setEditFeeType] = useState(null);

  const [activeBoard, setActiveBoard] = useState("");

  const [search, setSearch] = useState("");

  const { boards, loading: boardLoading, fetchBoards } = useBoardStore();

  const {
    feeTypes,
    loading,
    submitLoading,
    fetchFeeTypes,
    createFeeType,
    updateFeeType,
    deleteFeeType,
    restoreFeeType,
  } = useFeeTypeStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feeTypeSchema),

    defaultValues,
  });

  // Boards load
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  //  First active board automatically select

  useEffect(() => {
    if (boards.length > 0 && !activeBoard) {
      const firstActiveBoard =
        boards.find(
          (item) => item.isActive !== false && item.status !== "inactive",
        ) || boards[0];

      setActiveBoard(firstActiveBoard.title);
    }
  }, [boards, activeBoard]);

  /*
   * Board-wise fee types fetch
   */
  useEffect(() => {
    if (!activeBoard) return;

    fetchFeeTypes({
      board: activeBoard,
      status: "all",
    });
  }, [activeBoard, fetchFeeTypes]);

  /*
   * Modal create/edit values
   */
  useEffect(() => {
    if (!showModal) return;

    if (editFeeType) {
      reset({
        board: editFeeType.board || activeBoard || "",

        feeType: editFeeType.feeType || "",

        description: editFeeType.description || "",
      });

      return;
    }

    reset({
      board: activeBoard || "",
      feeType: "",
      description: "",
    });
  }, [showModal, editFeeType, activeBoard, reset]);

  const filteredFeeTypes = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return feeTypes;
    }

    return feeTypes.filter((item) => {
      const feeType = item.feeType?.toLowerCase() || "";

      const description = item.description?.toLowerCase() || "";

      const board = item.board?.toLowerCase() || "";

      return (
        feeType.includes(searchText) ||
        description.includes(searchText) ||
        board.includes(searchText)
      );
    });
  }, [feeTypes, search]);

  const openCreateModal = () => {
    setEditFeeType(null);

    reset({
      board: activeBoard || "",
      feeType: "",
      description: "",
    });

    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditFeeType(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditFeeType(null);

    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    const payload = {
      board: data.board.trim(),

      feeType: data.feeType.trim(),

      description: data.description?.trim() || "",
    };

    const success = editFeeType
      ? await updateFeeType(editFeeType.slug, payload)
      : await createFeeType(payload);

    if (!success) return;

    /*
     * Edit/create ke board ke hisaab se filter update.
     * Isse created record turant visible hoga.
     */
    if (activeBoard !== data.board) {
      setActiveBoard(data.board);
    } else {
      await fetchFeeTypes({
        board: activeBoard,
        status: "all",
      });
    }

    handleCloseModal();
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.feeType}"?`,
    );

    if (!confirmDelete) return;

    await deleteFeeType(item.slug);
  };

  const handleRestore = async (item) => {
    const confirmRestore = window.confirm(
      `Are you sure you want to restore "${item.feeType}"?`,
    );

    if (!confirmRestore) return;

    await restoreFeeType(item.slug);
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
      {/* Page Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">Fees Type</h1>

          <p className="text-gray-400 mt-1">Manage fees types board-wise</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Board Filter */}
          <select
            value={activeBoard}
            onChange={(e) => {
              setActiveBoard(e.target.value);

              setSearch("");
            }}
            disabled={boardLoading}
            className="min-w-[190px] px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="">
              {boardLoading ? "Loading boards..." : "Select Board"}
            </option>

            {boards
              .filter(
                (board) =>
                  board.isActive !== false && board.status !== "inactive",
              )
              .map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
          </select>

          <button
            onClick={openCreateModal}
            disabled={!activeBoard}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-700 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Add Fees
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 flex justify-between items-center gap-4 flex-wrap border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">Fees Type</h2>

            <p className="mt-1 text-sm text-gray-400">
              Board:{" "}
              <span className="text-blue-400 font-medium">
                {activeBoard || "-"}
              </span>
            </p>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fee type"
              className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Horizontal + Vertical Custom Scrollbar */}
        <div className="overflow-auto max-h-[65vh] custom-scrollbar">
          <table className="w-full min-w-[850px] table-fixed">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="w-20 p-4 text-left text-gray-300">SN.</th>

                <th className="w-[18%] p-4 text-left text-gray-300">Board</th>

                <th className="w-[25%] p-4 text-left text-gray-300">
                  Fee Type
                </th>

                <th className="p-4 text-left text-gray-300">Description</th>

                <th className="w-28 p-4 text-center text-gray-300">Status</th>

                <th className="w-40 p-4 text-center text-gray-300">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12">
                    <div className="flex items-center justify-center text-gray-400">
                      <Loader2 size={21} className="animate-spin mr-2" />
                      Loading fee types...
                    </div>
                  </td>
                </tr>
              ) : filteredFeeTypes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    {activeBoard
                      ? "No fee types found"
                      : "Please select a board"}
                  </td>
                </tr>
              ) : (
                filteredFeeTypes.map((item, index) => {
                  const inactive = isInactive(item);

                  return (
                    <tr
                      key={item.slug}
                      className="border-t border-gray-800 hover:bg-gray-800/30"
                    >
                      <td className="p-4 text-white">{index + 1}.</td>

                      <td className="p-4 text-white">
                        <span className="inline-flex px-3 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                          {item.board || activeBoard}
                        </span>
                      </td>

                      <td className="p-4 text-white font-medium break-words">
                        {item.feeType}
                      </td>

                      <td className="p-4 text-gray-300 break-words">
                        {item.description || "-"}
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

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {!inactive && (
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg cursor-pointer bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit Fee Type"
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {inactive ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(item)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg cursor-pointer bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Restore Fee Type"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={submitLoading}
                              className="p-2 rounded-lg cursor-pointer bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Fee Type"
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
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editFeeType ? "Edit Fees Type" : "Add Fees Type"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {editFeeType
                    ? "Update fee type details"
                    : "Create a new board-wise fee type"}
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
              {/* Board Dropdown */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Board <span className="text-red-500">*</span>
                </label>

                <select
                  {...register("board")}
                  disabled={boardLoading || submitLoading}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none cursor-pointer focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Select Board</option>

                  {boards
                    .filter(
                      (board) =>
                        board.isActive !== false && board.status !== "inactive",
                    )
                    .map((board) => (
                      <option key={board.slug} value={board.title}>
                        {board.title}
                      </option>
                    ))}
                </select>

                {errors.board && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.board.message}
                  </p>
                )}
              </div>

              {/* Fee Type */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Fee Type <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("feeType")}
                  placeholder="Enter Fee Type"
                  disabled={submitLoading}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 disabled:opacity-60"
                />

                {errors.feeType && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.feeType.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Description
                </label>

                <textarea
                  rows={4}
                  {...register("description")}
                  placeholder="Enter Description"
                  disabled={submitLoading}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none outline-none focus:border-blue-500 disabled:opacity-60"
                />

                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitLoading}
                  className="px-4 py-2 border border-gray-700 cursor-pointer rounded-xl text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer text-white flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitLoading && (
                    <Loader2 size={17} className="animate-spin" />
                  )}

                  {editFeeType ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
