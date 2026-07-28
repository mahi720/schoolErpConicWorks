import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, RotateCcw, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useExamTypeStore } from "../../../store/examManager/examType/examTypeStore";
import { examTypeSchema } from "../../../validations/examManager/examType/examTypeSchema";

export default function ExamType() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [actionSlug, setActionSlug] = useState(null);

  const {
    examTypes,
    loading,
    submitLoading,
    fetchExamTypes,
    deleteExamType,
    restoreExamType,
  } = useExamTypeStore();

  useEffect(() => {
    fetchExamTypes({
      status: "all",
    });
  }, [fetchExamTypes]);

  const handleEdit = (item) => {
    if (!item.isActive) return;

    setEditData(item);
    setOpen(true);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.examType}"?`,
    );

    if (!confirmed) return;

    setActionSlug(item.slug);

    await deleteExamType(item.slug);

    setActionSlug(null);
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to restore "${item.examType}"?`,
    );

    if (!confirmed) return;

    setActionSlug(item.slug);

    await restoreExamType(item.slug);

    setActionSlug(null);
  };

  const handleClose = () => {
    if (submitLoading) return;

    setOpen(false);
    setEditData(null);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Exam Type</h1>

          <p className="text-gray-400 mt-1">Manage all exam types</p>
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Create Exam Type
        </button>
      </div>

      {/* Table Card */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="max-h-[68vh] overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full min-w-[750px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {["SN.", "Exam Type", "Description", "Action"].map((h) => (
                  <th key={h} className="p-4 text-left text-gray-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-400">
                      <Loader2 size={22} className="animate-spin" />
                      Loading exam types...
                    </div>
                  </td>
                </tr>
              ) : examTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400">
                    No exam types found
                  </td>
                </tr>
              ) : (
                examTypes.map((item, index) => {
                  const isActionLoading =
                    actionSlug === item.slug && submitLoading;

                  return (
                    <tr
                      key={item.slug}
                      className={`border-t border-gray-800 hover:bg-gray-800/40 ${
                        !item.isActive ? "opacity-70" : ""
                      }`}
                    >
                      <td className="p-4 text-gray-300">{index + 1}</td>

                      <td
                        className={`p-4 ${
                          item.isActive
                            ? "text-white"
                            : "text-gray-500 line-through"
                        }`}
                      >
                        {item.examType}
                      </td>

                      <td className="p-4 text-gray-400">
                        {item.description || "-"}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-3">
                          {item.isActive ? (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                disabled={submitLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Edit size={17} />
                              </button>

                              <button
                                onClick={() => handleDelete(item)}
                                disabled={submitLoading}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isActionLoading ? (
                                  <Loader2 size={17} className="animate-spin" />
                                ) : (
                                  <Trash2 size={17} />
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRestore(item)}
                              disabled={submitLoading}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isActionLoading ? (
                                <Loader2 size={17} className="animate-spin" />
                              ) : (
                                <RotateCcw size={17} />
                              )}
                              Restore
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

      <ExamTypeModal open={open} close={handleClose} editData={editData} />
    </div>
  );
}

function ExamTypeModal({ open, close, editData }) {
  const { createExamType, updateExamType, submitLoading } = useExamTypeStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examTypeSchema),
    defaultValues: {
      examType: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (editData) {
      reset({
        examType: editData.examType || "",
        description: editData.description || "",
      });

      return;
    }

    reset({
      examType: "",
      description: "",
    });
  }, [open, editData, reset]);

  const handleClose = () => {
    if (submitLoading) return;

    reset({
      examType: "",
      description: "",
    });

    close();
  };

  const onSubmit = async (values) => {
    const payload = {
      examType: values.examType.trim(),
      description: values.description?.trim() || null,
    };

    const success = editData
      ? await updateExamType(editData.slug, payload)
      : await createExamType(payload);

    if (!success) return;

    reset({
      examType: "",
      description: "",
    });

    close();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-[90%] max-w-xl overflow-hidden">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white font-semibold">
            {editData ? "Edit Exam Type" : "Create Exam Type"}
          </h2>

          <X
            onClick={handleClose}
            className="text-gray-400 cursor-pointer hover:text-white"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}

          <div className="p-5 space-y-5">
            <div>
              <label className="text-gray-400">Exam Type</label>

              <input
                {...register("examType")}
                placeholder="Enter Exam Type"
                disabled={submitLoading}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {errors.examType && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.examType.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-400">Description</label>

              <textarea
                {...register("description")}
                placeholder="Enter Description"
                rows="4"
                disabled={submitLoading}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full resize-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}

          <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitLoading}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitLoading}
              className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading && <Loader2 size={17} className="animate-spin" />}

              {submitLoading
                ? editData
                  ? "Updating..."
                  : "Saving..."
                : editData
                  ? "Update"
                  : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
