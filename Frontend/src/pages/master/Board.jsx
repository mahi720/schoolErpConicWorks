import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Pencil, Plus, Trash2, X, Loader2 } from "lucide-react";
import { useBoardStore } from "../../store/master/board/boardStore";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boardSchema } from "../../validations/master/board/boardSchema";

const defaultValues = {
  title: "",
  description: "",
};

export default function Board() {
  const [showModal, setShowModal] = useState(false);
  const [editBoard, setEditBoard] = useState(null);

  const {
    boards,
    loading,
    submitLoading,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
  } = useBoardStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues,
  });

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const openAddModal = () => {
    setEditBoard(null);
    reset(defaultValues);
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setEditBoard(row);

    reset({
      title: row.title || "",
      description: row.description || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditBoard(null);
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    let success = false;

    if (editBoard) {
      success = await updateBoard(editBoard.slug, data);
    } else {
      success = await createBoard(data);
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
      key: "title",
      label: "Board Title",
    },
    {
      key: "description",
      label: "Description",
      render: (value) => value || "-",
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
          `Are you sure you want to delete ${row.title}?`,
        );

        if (!confirmDelete) return;

        await deleteBoard(row.slug);
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-300">Boards</h1>
          <p className="text-gray-400">Manage school boards</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus size={18} />
          Add Board
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-300">
          <Loader2 className="animate-spin mr-2" size={22} />
          Loading boards...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={boards}
          searchFields={["title", "description"]}
          title="Board List"
          actions={actions}
          rowKey="slug"
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-300">
                {editBoard ? "Edit Board" : "Add Board"}
              </h2>

              <button onClick={closeModal} disabled={submitLoading}>
                <X className="text-gray-300 cursor-pointer" size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-gray-300">Board Title</label>

                <input
                  type="text"
                  placeholder="Enter Board Name"
                  {...register("title")}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-300">Description</label>

                <textarea
                  rows="4"
                  placeholder="Enter Description"
                  {...register("description")}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-2 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.description.message}
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

                  {editBoard ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
