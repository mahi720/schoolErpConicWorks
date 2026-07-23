import React, { useEffect } from "react";
import { X, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { studentAcademicMappingSchema } from "../../../validations/academic/studentAcademicMapping/studentAcademicMappingSchema";

import { useStudentAcademicMappingStore } from "../../../store/academic/studentAcademicMapping/studentAcademicMappingStore";

export default function AssignSectionModal({
  isOpen,
  onClose,
  sections = [],
  selectedStudents = [],
  session,
  board,
  classTitle,
  onSuccess,
}) {
  const { createStudentMappings, submitLoading } =
    useStudentAcademicMappingStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentAcademicMappingSchema),

    defaultValues: {
      mappingType: "section",
      session: session || "",
      board: board || "",
      classTitle: classTitle || "",
      sectionSlug: "",
      streamSlug: null,
      rollNumberPrefix: null,
      rollNumberStartFrom: undefined,
      students: [],
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Reset Modal
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) return;

    reset({
      mappingType: "section",
      session: session || "",
      board: board || "",
      classTitle: classTitle || "",

      sectionSlug: "",
      streamSlug: null,
      rollNumberPrefix: null,
      rollNumberStartFrom: undefined,

      students: selectedStudents.map((student) => ({
        studentSlug: student.studentSlug,
        rollNumber: undefined,
      })),
    });
  }, [isOpen, session, board, classTitle, selectedStudents, reset]);

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
      sectionSlug: "",
    });

    onClose();
  };

  /*
  |--------------------------------------------------------------------------
  | Assign Section
  |--------------------------------------------------------------------------
  */

  const onSubmit = async (formData) => {
    const payload = {
      mappingType: "section",

      session: formData.session,
      board: formData.board,
      classTitle: formData.classTitle,

      sectionSlug: formData.sectionSlug,

      students: formData.students.map((student) => ({
        studentSlug: student.studentSlug,
      })),
    };

    console.log("ASSIGN SECTION PAYLOAD:", payload);

    const success = await createStudentMappings(payload);

    if (!success) {
      return;
    }

    reset({
      mappingType: "section",
      session: "",
      board: "",
      classTitle: "",
      sectionSlug: "",
      streamSlug: null,
      rollNumberPrefix: null,
      rollNumberStartFrom: undefined,
      students: [],
    });

    onSuccess?.();

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Assign Section
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Assign section to {selectedStudents.length} selected student(s)
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="p-2 rounded-lg hover:bg-gray-800 disabled:cursor-not-allowed"
          >
            <X
              size={24}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            {/* Selected Academic Details */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400">Academic Year</p>

                <p className="mt-1 text-white font-medium">{session || "-"}</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400">Board</p>

                <p className="mt-1 text-white font-medium">{board || "-"}</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400">Class</p>

                <p className="mt-1 text-white font-medium">
                  {classTitle || "-"}
                </p>
              </div>
            </div>

            {/* Section Select */}

            <div>
              <label className="block text-gray-300 mb-2">
                Select Section
                <span className="text-red-500">*</span>
              </label>

              <select
                {...register("sectionSlug")}
                disabled={submitLoading || !sections.length}
                className={`w-full bg-gray-800 border cursor-pointer rounded-xl p-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                  errors.sectionSlug
                    ? "border-red-500"
                    : "border-gray-700 focus:border-indigo-500"
                }`}
              >
                <option value="">
                  {sections.length ? "Select Section" : "No sections available"}
                </option>

                {sections.map((section) => (
                  <option key={section.slug} value={section.slug}>
                    {section.title || section.sectionName || section.name}
                  </option>
                ))}
              </select>

              {errors.sectionSlug && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.sectionSlug.message}
                </p>
              )}
            </div>

            {/* Selected Students */}

            <div>
              <p className="mb-2 text-sm text-gray-400">Selected Students</p>

              <div className="max-h-48 overflow-x-auto overflow-y-auto custom-scrollbar border border-gray-800 rounded-xl">
                <table className="w-full min-w-[450px]">
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
                    </tr>
                  </thead>

                  <tbody>
                    {selectedStudents.map((student, index) => (
                      <tr
                        key={student.studentSlug}
                        className="border-t border-gray-800"
                      >
                        <td className="p-3 text-gray-300">{index + 1}.</td>

                        <td className="p-3 text-gray-300">
                          {student.admissionNumber || "-"}
                        </td>

                        <td className="p-3 text-white font-medium">
                          {student.studentName || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-800">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitLoading}
              className="px-5 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 rounded-xl text-white cursor-pointer disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitLoading || !sections.length || !selectedStudents.length
              }
              className="min-w-40 flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed rounded-xl text-white cursor-pointer"
            >
              {submitLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Section"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
