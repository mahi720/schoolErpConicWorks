import React, { useEffect } from "react";
import { X, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { assignStreamSchema } from "../../../validations/academic/studentAcademicMapping/studentAcademicMappingSchema";

import { useStudentAcademicMappingStore } from "../../../store/academic/studentAcademicMapping/studentAcademicMappingStore";

export default function AssignStreamModal({
  isOpen,
  onClose,
  streams = [],
  selectedStudents = [],
  onSuccess,
}) {
  const { assignStreamToStudents, submitLoading } =
    useStudentAcademicMappingStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignStreamSchema),

    defaultValues: {
      streamSlug: "",
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Reset Form
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      streamSlug: "",
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
      streamSlug: "",
    });

    onClose();
  };

  /*
  |--------------------------------------------------------------------------
  | Assign Stream
  |--------------------------------------------------------------------------
  */

  const onSubmit = async (formData) => {
    const success = await assignStreamToStudents({
      students: selectedStudents,
      streamSlug: formData.streamSlug,
    });

    if (!success) {
      return;
    }

    reset({
      streamSlug: "",
    });

    await onSuccess?.();

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-3xl font-semibold text-white">Assign Stream</h2>

            <p className="mt-1 text-sm text-gray-400">
              {selectedStudents.length} student(s) selected
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="cursor-pointer rounded-lg p-2 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}

          <div className="p-6">
            <label className="mb-2 block text-gray-300">
              Select Stream
              <span className="text-red-500"> *</span>
            </label>

            <select
              {...register("streamSlug")}
              disabled={submitLoading || !streams.length}
              className={`w-full cursor-pointer rounded-xl border bg-gray-800 p-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.streamSlug
                  ? "border-red-500"
                  : "border-gray-700 focus:border-indigo-500"
              }`}
            >
              <option value="">
                {streams.length ? "Select Stream" : "No streams available"}
              </option>

              {streams.map((stream) => (
                <option key={stream.slug} value={stream.slug}>
                  {stream.title || stream.streamName || stream.name || "-"}
                </option>
              ))}
            </select>

            {errors.streamSlug && (
              <p className="mt-2 text-sm text-red-400">
                {errors.streamSlug.message}
              </p>
            )}

            {/* Selected Students */}

            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-400">Selected Students</p>

              <div className="max-h-52 overflow-x-auto overflow-y-auto rounded-xl border border-gray-800 custom-scrollbar">
                <table className="w-full min-w-[500px]">
                  <thead className="sticky top-0 bg-gray-800">
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
                        Section
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedStudents.length ? (
                      selectedStudents.map((student, index) => (
                        <tr
                          key={
                            student.mappingSlug ||
                            student.slug ||
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

                          <td className="p-3 text-gray-300">
                            {student.section?.title ||
                              student.section?.sectionName ||
                              student.sectionName ||
                              "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-6 text-center text-gray-400"
                        >
                          No students selected
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-gray-800 p-6">
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
              disabled={
                submitLoading || !streams.length || !selectedStudents.length
              }
              className="flex min-w-40 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
            >
              {submitLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Stream"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
