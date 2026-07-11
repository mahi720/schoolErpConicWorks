import React, { useEffect, useMemo } from "react";
import Modal from "../common/Modal";
import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { classSubjectSchema } from "../../validations/master/addSubjectToClass/classSubjectSchema";
import { useClassSubjectStore } from "../../store/master/addSubjectToClass/classSubjectStore";
import { useClassStore } from "../../store/master/class/classStore";
import { useStreamStore } from "../../store/master/stream/streamStore";

export default function AddSubjectToClassModal({
  isOpen,
  onClose,
  board,
  session,
  selectedSubjects = [],
  onSaved,
}) {
  const { createClassSubjects, submitLoading } = useClassSubjectStore();
  const { classes, fetchClasses } = useClassStore();
  const { streams, loading: streamLoading, fetchStreams } = useStreamStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classSubjectSchema),
    defaultValues: {
      session: "",
      board: "",
      classTitle: "",
      classType: "",
      stream: "",
      subjectSlugs: [],
      studyType: "THEORY",
    },
  });

  const selectedClassTitle = watch("classTitle");

  const selectedClassData = useMemo(() => {
    return classes.find((item) => item.classTitle === selectedClassTitle);
  }, [classes, selectedClassTitle]);

  const isSeniorSecondary = useMemo(() => {
    if (!selectedClassData) return false;

    const normalizedTitle = String(selectedClassData.classTitle || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/class|grade|standard/g, "");

    return (
      selectedClassData.classType?.toLowerCase() === "senior secondary" ||
      ["11", "11th", "xi", "12", "12th", "xii"].includes(normalizedTitle)
    );
  }, [selectedClassData]);

  useEffect(() => {
    if (!isOpen || !board || !session) return;

    fetchClasses({
      board,
      session,
    });

    fetchStreams({
      board,
    });
  }, [isOpen, board, session, fetchClasses, fetchStreams]);

  useEffect(() => {
    if (!isOpen) return;

    reset({
      session: session || "",
      board: board || "",
      classTitle: "",
      classType: "",
      stream: "",
      subjectSlugs: selectedSubjects,
      studyType: "THEORY",
    });
  }, [isOpen, board, session, selectedSubjects, reset]);

  useEffect(() => {
    setValue("classType", selectedClassData?.classType || "");

    if (!isSeniorSecondary) {
      setValue("stream", "");
    }
  }, [selectedClassData, isSeniorSecondary, setValue]);

  const handleClose = () => {
    reset({
      session: "",
      board: "",
      classTitle: "",
      classType: "",
      stream: "",
      subjectSlugs: [],
      studyType: "THEORY",
    });

    onClose();
  };

  const onSubmit = async (data) => {
    const payload = {
      session: data.session,
      board: data.board,
      classTitle: data.classTitle,
      subjectSlugs: selectedSubjects,
      studyType: data.studyType,
    };

    if (isSeniorSecondary) {
      payload.stream = data.stream;
    }

    const success = await createClassSubjects(payload);

    if (success) {
      handleClose();
      onSaved?.();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Subject To Class">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("session")} />
        <input type="hidden" {...register("board")} />
        <input type="hidden" {...register("classType")} />

        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Academic Year <span className="text-red-500">*</span>
          </label>

          <input
            value={session || ""}
            readOnly
            className="w-full p-3 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 cursor-not-allowed"
          />

          {errors.session && (
            <p className="mt-1 text-sm text-red-400">
              {errors.session.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Class <span className="text-red-500">*</span>
          </label>

          <select
            {...register("classTitle")}
            className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 cursor-pointer"
          >
            <option value="">Select Class</option>

            {classes.map((item) => (
              <option key={item.slug} value={item.classTitle}>
                {item.classTitle}
              </option>
            ))}
          </select>

          {errors.classTitle && (
            <p className="mt-1 text-sm text-red-400">
              {errors.classTitle.message}
            </p>
          )}
        </div>

        {isSeniorSecondary && (
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Stream <span className="text-red-500">*</span>
            </label>

            <select
              {...register("stream")}
              disabled={streamLoading}
              className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 cursor-pointer disabled:opacity-60"
            >
              <option value="">
                {streamLoading ? "Loading streams..." : "Select Stream"}
              </option>

              {streams.map((item) => (
                <option key={item.slug} value={item.streamTitle}>
                  {item.streamTitle}
                </option>
              ))}
            </select>

            {errors.stream && (
              <p className="mt-1 text-sm text-red-400">
                {errors.stream.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Study Type <span className="text-red-500">*</span>
          </label>

          <select
            {...register("studyType")}
            className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 cursor-pointer"
          >
            <option value="THEORY">Theory</option>
            <option value="PRACTICAL">Practical</option>
            <option value="BOTH">Theory + Practical</option>
          </select>

          {errors.studyType && (
            <p className="mt-1 text-sm text-red-400">
              {errors.studyType.message}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">Selected Subjects</p>

          <p className="mt-1 text-xl font-semibold text-white">
            {selectedSubjects.length}
          </p>

          {errors.subjectSlugs && (
            <p className="mt-1 text-sm text-red-400">
              {errors.subjectSlugs.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="px-4 py-2 border border-gray-700 rounded-xl text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitLoading ||
              !board ||
              !session ||
              selectedSubjects.length === 0
            }
            className="px-4 py-2 bg-green-600 rounded-xl text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitLoading && <Loader2 size={16} className="animate-spin" />}
            Assign Subject
          </button>
        </div>
      </form>
    </Modal>
  );
}
