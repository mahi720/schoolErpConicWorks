import React, { useEffect } from "react";
import { Loader2, X } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { editRollNumberSchema } from "../../../validations/academic/studentAcademicMapping/studentAcademicMappingSchema";

import { useStudentAcademicMappingStore } from "../../../store/academic/studentAcademicMapping/studentAcademicMappingStore";

export default function EditRollNumberModal({
  isOpen,
  onClose,
  student,
  onSuccess,
}) {
  /*
  |--------------------------------------------------------------------------
  | Store
  |--------------------------------------------------------------------------
  */

  const { updateStudentRollNumber, submitLoading } =
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editRollNumberSchema),

    defaultValues: {
      rollNumber: "",
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Set Existing Roll Number
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen || !student) {
      return;
    }

    reset({
      rollNumber: student.rollNumber ?? student.rollNo ?? "",
    });
  }, [isOpen, student, reset]);

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
      rollNumber: "",
    });

    onClose();
  };

  /*
  |--------------------------------------------------------------------------
  | Update Roll Number
  |--------------------------------------------------------------------------
  */

  const onSubmit = async (formData) => {
    const mappingSlug =
      student.mappingSlug ||
      student.academicMappingSlug ||
      student.academicMapping?.slug ||
      student.slug;

    const success = await updateStudentRollNumber({
      mappingSlug,

      rollNumber: formData.rollNumber,
    });

    if (!success) {
      return;
    }

    reset({
      rollNumber: "",
    });

    await onSuccess?.();

    onClose();
  };

  if (!isOpen || !student) {
    return null;
  }

  const studentName =
    student.studentName || student.name || student.student?.studentName || "-";

  const admissionNumber =
    student.admissionNumber || student.student?.admissionNumber || "-";

  const currentRollNumber =
    student.formattedRollNumber ||
    (student.rollNumber !== null && student.rollNumber !== undefined
      ? `${student.rollNumberPrefix || ""}${student.rollNumber}`
      : "-");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Update Roll Number
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Update roll number for{" "}
              <span className="font-medium text-gray-200">"{studentName}"</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}

          <div className="space-y-6 p-6">
            {/* Student Details */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-800 bg-gray-800/70 p-4">
                <p className="text-xs text-gray-400">Admission Number</p>

                <p className="mt-1 font-medium text-white">{admissionNumber}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-800/70 p-4">
                <p className="text-xs text-gray-400">Current Roll Number</p>

                <p className="mt-1 font-medium text-indigo-400">
                  {currentRollNumber}
                </p>
              </div>
            </div>

            {/* Prefix Information */}

            {student.rollNumberPrefix && (
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                <p className="text-sm text-gray-300">
                  Current prefix:{" "}
                  <span className="font-medium text-indigo-400">
                    {student.rollNumberPrefix}
                  </span>
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Only the numeric roll number will be updated. The existing
                  prefix will remain unchanged.
                </p>
              </div>
            )}

            {/* Roll Number */}

            <div>
              <label className="mb-2 block text-gray-300">
                New Roll Number
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="number"
                min="1"
                step="1"
                {...register("rollNumber")}
                disabled={submitLoading}
                placeholder="Enter roll number"
                className={`w-full rounded-xl border bg-gray-800 p-3 text-white outline-none transition-colors placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                  errors.rollNumber
                    ? "border-red-500"
                    : "border-gray-700 focus:border-indigo-500"
                }`}
              />

              {errors.rollNumber && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.rollNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-gray-800 px-6 py-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitLoading}
              className="cursor-pointer rounded-xl bg-red-500 px-5 py-3 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitLoading}
              className="flex min-w-48 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
            >
              {submitLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Roll Number"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
