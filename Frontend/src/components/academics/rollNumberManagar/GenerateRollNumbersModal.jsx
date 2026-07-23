import React, { useEffect, useMemo } from "react";
import { Loader2, X } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { assignBulkRollNumberSchema } from "../../../validations/academic/studentAcademicMapping/studentAcademicMappingSchema";

import { useStudentAcademicMappingStore } from "../../../store/academic/studentAcademicMapping/studentAcademicMappingStore";

/*
|--------------------------------------------------------------------------
| Format Roll Number
|--------------------------------------------------------------------------
|
| Prefix: UKG-
| Start: 001
|
| Index 0 => UKG-001
| Index 1 => UKG-002
| Index 9 => UKG-010
|
*/

const formatRollNumber = ({ prefix, startNumber, paddingLength, index }) => {
  const currentNumber = startNumber + index;

  return `${prefix}${String(currentNumber).padStart(paddingLength, "0")}`;
};

export default function AssignRollNumberModal({
  isOpen,
  onClose,
  selectedStudents = [],
  session = "",
  board = "",
  classTitle = "",
  onSuccess,
}) {
  /*
  |--------------------------------------------------------------------------
  | Store
  |--------------------------------------------------------------------------
  */

  const { assignBulkRollNumbers, submitLoading } =
    useStudentAcademicMappingStore();

  /*
  |--------------------------------------------------------------------------
  | Form
  |--------------------------------------------------------------------------
  */

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignBulkRollNumberSchema),

    defaultValues: {
      rollNumberPrefix: "",
      rollNumberStartFrom: "",
    },
  });

  const rollNumberPrefix = watch("rollNumberPrefix");

  const rollNumberStartFrom = watch("rollNumberStartFrom");

  /*
  |--------------------------------------------------------------------------
  | Parsed Start Number
  |--------------------------------------------------------------------------
  */

  const previewData = useMemo(() => {
    const startText = String(rollNumberStartFrom || "").trim();

    const startNumber = Number(startText);

    const isValid =
      /^\d+$/.test(startText) &&
      Number.isInteger(startNumber) &&
      startNumber > 0;

    return {
      isValid,

      startNumber,

      paddingLength: startText.length,
    };
  }, [rollNumberStartFrom]);

  /*
  |--------------------------------------------------------------------------
  | Reset On Open
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      rollNumberPrefix: "",
      rollNumberStartFrom: "",
    });
  }, [isOpen, reset]);

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */

  const handleClose = () => {
    if (submitLoading) {
      return;
    }

    reset({
      rollNumberPrefix: "",
      rollNumberStartFrom: "",
    });

    onClose();
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Bulk Roll Numbers
  |--------------------------------------------------------------------------
  */

  const onSubmit = async (formData) => {
    const success = await assignBulkRollNumbers({
      students: selectedStudents,

      rollNumberPrefix: formData.rollNumberPrefix,

      rollNumberStartFrom: formData.rollNumberStartFrom,
    });

    if (!success) {
      return;
    }

    reset({
      rollNumberPrefix: "",
      rollNumberStartFrom: "",
    });

    await onSuccess?.();

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const canShowPreview = previewData.isValid && selectedStudents.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Generate Roll Numbers
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Assign roll numbers to {selectedStudents.length} selected
              student(s)
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}

          <div className="max-h-[70vh] space-y-6 overflow-x-hidden overflow-y-auto p-6 custom-scrollbar">
            {/* Academic Details */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-800 bg-gray-800/70 p-4">
                <p className="text-xs text-gray-400">Academic Year</p>

                <p className="mt-1 font-medium text-white">{session || "-"}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-800/70 p-4">
                <p className="text-xs text-gray-400">Board</p>

                <p className="mt-1 font-medium text-white">{board || "-"}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-800/70 p-4">
                <p className="text-xs text-gray-400">Class</p>

                <p className="mt-1 font-medium text-white">
                  {classTitle || "-"}
                </p>
              </div>
            </div>

            {/* Roll Fields */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Prefix */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Roll Number Prefix
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  {...register("rollNumberPrefix")}
                  disabled={submitLoading}
                  placeholder="Example: UKG-"
                  className={`w-full rounded-xl border bg-gray-800 p-3 text-white outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.rollNumberPrefix
                      ? "border-red-500"
                      : "border-gray-700 focus:border-indigo-500"
                  }`}
                />

                {errors.rollNumberPrefix && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.rollNumberPrefix.message}
                  </p>
                )}
              </div>

              {/* Start From */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Roll Number Start From
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  {...register("rollNumberStartFrom")}
                  disabled={submitLoading}
                  placeholder="Example: 001"
                  className={`w-full rounded-xl border bg-gray-800 p-3 text-white outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.rollNumberStartFrom
                      ? "border-red-500"
                      : "border-gray-700 focus:border-indigo-500"
                  }`}
                />

                {errors.rollNumberStartFrom && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.rollNumberStartFrom.message}
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  Leading zeros will be preserved. Example: 001, 002, 003.
                </p>
              </div>
            </div>

            {/* Preview */}

            {canShowPreview && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-gray-300">
                    Roll Number Preview
                  </p>

                  <p className="text-sm text-gray-500">
                    All selected students will be updated
                  </p>
                </div>

                <div className="max-h-64 overflow-x-auto overflow-y-auto rounded-xl border border-gray-800 custom-scrollbar">
                  <table className="w-full min-w-[650px]">
                    <thead className="sticky top-0 z-10 bg-gray-800">
                      <tr>
                        <th className="p-3 text-left text-sm text-gray-300">
                          SN.
                        </th>

                        <th className="p-3 text-left text-sm text-gray-300">
                          Admission No.
                        </th>

                        <th className="p-3 text-left text-sm text-gray-300">
                          Student Name
                        </th>

                        <th className="p-3 text-left text-sm text-gray-300">
                          Current Roll
                        </th>

                        <th className="p-3 text-left text-sm text-gray-300">
                          New Roll
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedStudents.map((student, index) => {
                        const newRollNumber = formatRollNumber({
                          prefix: rollNumberPrefix || "",

                          startNumber: previewData.startNumber,

                          paddingLength: previewData.paddingLength,

                          index,
                        });

                        return (
                          <tr
                            key={
                              student.mappingSlug ||
                              student.rowSlug ||
                              student.studentSlug
                            }
                            className="border-t border-gray-800"
                          >
                            <td className="p-3 text-gray-300">{index + 1}.</td>

                            <td className="p-3 text-gray-300">
                              {student.admissionNumber ||
                                student.student?.admissionNumber ||
                                "-"}
                            </td>

                            <td className="p-3 font-medium text-white">
                              {student.studentName ||
                                student.student?.studentName ||
                                "-"}
                            </td>

                            <td className="p-3 text-indigo-400">
                              {student.formattedRollNumber ||
                                (student.rollNumber !== null &&
                                student.rollNumber !== undefined
                                  ? `${student.rollNumberPrefix || ""}${student.rollNumber}`
                                  : "-")}
                            </td>

                            <td className="p-3 font-medium text-emerald-400">
                              {newRollNumber}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!selectedStudents.length && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-400">
                Select at least one mapped student to assign roll numbers.
              </div>
            )}
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-gray-800 px-6 py-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitLoading}
              className="cursor-pointer rounded-xl bg-red-500 px-5 py-3 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitLoading || !selectedStudents.length}
              className="flex min-w-48 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
            >
              {submitLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Assigning...
                </>
              ) : (
                `Assign To ${selectedStudents.length} Students`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
