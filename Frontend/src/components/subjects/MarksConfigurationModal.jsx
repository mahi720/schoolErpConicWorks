import React, { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import toast from "react-hot-toast";

import Modal from "../common/Modal";

import { marksConfigurationSchema } from "../../validations/master/subjectMarksConfig/subjectMarksConfigSchema";

import { useSubjectMarksConfigStore } from "../../store/master/subjectMarksConfigStore/subjectMarksConfigStore";

const createEmptyRow = () => ({
  id: `${Date.now()}-${Math.random()}`,
  subject: "",
  totalMarks: "",
});

export default function MarksConfigurationModal({
  isOpen,
  onClose,
  subjectData,
}) {
  // const [rows, setRows] = useState([createEmptyRow()]);
  const [rows, setRows] = useState([]);

  const [deletedSlugs, setDeletedSlugs] = useState([]);

  const {
    marksConfigs,
    loading,
    submitLoading,
    fetchMarksConfigs,
    saveMarksConfigurations,
    clearMarksConfigs,
  } = useSubjectMarksConfigStore();

  // useEffect(() => {
  //   if (!isOpen || !subjectData?.slug) return;

  //   fetchMarksConfigs({
  //     addedSubjectToClassSlug: subjectData.slug,
  //     status: "active",
  //   });
  // }, [isOpen, subjectData?.slug, fetchMarksConfigs]);

  useEffect(() => {
    if (!isOpen || !subjectData?.slug) return;

    setRows([]);
    setDeletedSlugs([]);

    fetchMarksConfigs({
      addedSubjectToClassSlug: subjectData.slug,
      status: "active",
    });
  }, [isOpen, subjectData?.slug, fetchMarksConfigs]);

  // useEffect(() => {
  //   if (!isOpen) return;

  //   if (marksConfigs.length > 0) {
  //     setRows(
  //       marksConfigs.map((item) => ({
  //         id: item.slug,
  //         slug: item.slug,

  //         // componentName UI के Subject field में दिखेगा.
  //         subject: item.componentName || "",

  //         totalMarks:
  //           item.totalMarks !== undefined && item.totalMarks !== null
  //             ? String(item.totalMarks)
  //             : "",
  //       })),
  //     );
  //   } else if (!loading) {
  //     setRows([createEmptyRow()]);
  //   }

  //   setDeletedSlugs([]);
  // }, [isOpen, marksConfigs, loading]);

  useEffect(() => {
    if (!isOpen || loading) return;

    if (marksConfigs.length > 0) {
      setRows(
        marksConfigs.map((item) => ({
          id: item.slug,
          slug: item.slug,
          subject: item.componentName || "",
          totalMarks:
            item.totalMarks !== undefined && item.totalMarks !== null
              ? String(item.totalMarks)
              : "",
        })),
      );
    } else {
      setRows([createEmptyRow()]);
    }

    setDeletedSlugs([]);
  }, [isOpen, marksConfigs, loading]);

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeRow = (id) => {
    if (rows.length === 1) return;

    const removedRow = rows.find((item) => item.id === id);

    if (removedRow?.slug) {
      setDeletedSlugs((prev) => [...prev, removedRow.slug]);
    }

    setRows((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const handleClose = () => {
    setRows([createEmptyRow()]);
    setDeletedSlugs([]);
    clearMarksConfigs();
    onClose();
  };

  const handleSave = async () => {
    if (!subjectData?.slug) {
      toast.error("Mapped class subject information not found");
      return;
    }

    const validationResult = marksConfigurationSchema.safeParse({
      rows,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];

      toast.error(
        firstError?.message || "Please enter valid marks configuration",
      );

      return;
    }

    const success = await saveMarksConfigurations({
      addedSubjectToClassSlug: subjectData.slug,

      rows: validationResult.data.rows,

      deletedSlugs,
    });

    if (success) {
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Marks Configuration">
      <div className="space-y-5">
        {/* Header */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7">
            <label className="text-sm font-medium text-gray-300">Subject</label>
          </div>

          <div className="col-span-3">
            <label className="text-sm font-medium text-gray-300">
              Total Marks
            </label>
          </div>

          <div className="col-span-2"></div>
        </div>

        {/* Rows */}
        <div className="max-h-72 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 size={20} className="animate-spin mr-2" />
              Loading marks configurations...
            </div>
          ) : (
            <AnimatePresence initial={false} mode="popLayout">
              {rows.map((row) => (
                <motion.div
                  key={row.id}
                  initial={{
                    opacity: 0,
                    y: -15,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  {/* Subject */}
                  <div className="col-span-7">
                    <input
                      type="text"
                      placeholder="Enter Subject"
                      value={row.subject}
                      onChange={(e) =>
                        handleChange(row.id, "subject", e.target.value)
                      }
                      disabled={submitLoading}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-60"
                    />
                  </div>

                  {/* Total Marks */}
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="1"
                      placeholder="100"
                      value={row.totalMarks}
                      onChange={(e) =>
                        handleChange(row.id, "totalMarks", e.target.value)
                      }
                      disabled={submitLoading}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-60"
                    />
                  </div>

                  {/* Remove */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1 || submitLoading}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        rows.length === 1 || submitLoading
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
                      }`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={addRow}
          disabled={loading || submitLoading}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Add Subject Marks
        </button>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading || submitLoading || !subjectData?.slug}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitLoading && <Loader2 size={17} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
