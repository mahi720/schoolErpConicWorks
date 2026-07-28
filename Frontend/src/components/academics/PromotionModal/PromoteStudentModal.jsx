import React, { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { promoteStudentSchema } from "../../../validations/academic/studentPromotion/studentPromotionValidation";

import { useSessionStore } from "../../../store/master/session/sessionStore";

import { useStudentAcademicMappingStore } from "../../../store/academic/studentAcademicMapping/studentAcademicMappingStore";

import { useStudentPromotionStore } from "../../../store/academic/studentPromotion/studentPromotionStore";

export default function PromoteStudentModal({
  isOpen,
  onClose,
  selectedStudents = [],
  sourceAcademic = {},
  onSuccess,
}) {
  const [targetBoards, setTargetBoards] = useState([]);

  const [setupLoading, setSetupLoading] = useState(false);

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { fetchAcademicSetup } = useStudentAcademicMappingStore();

  const { createPromotions, submitLoading } = useStudentPromotionStore();

  const sourceSession = sourceAcademic?.session || "";

  const sourceBoard = sourceAcademic?.board || "";

  const sourceClass = sourceAcademic?.classTitle || "";

  const sourceSectionSlug = sourceAcademic?.sectionSlug || null;

  const sourceStreamSlug = sourceAcademic?.streamSlug || null;

  const selectedStudentKey = selectedStudents
    .map((student) => student.studentSlug || student.slug)
    .filter(Boolean)
    .join("|");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(promoteStudentSchema),

    defaultValues: {
      previousSession: "",
      previousBoard: "",
      previousClass: "",

      previousSectionSlug: null,

      previousStreamSlug: null,

      newSession: "",
      newBoard: "",
      newClass: "",

      newStreamSlug: "",
      newSectionSlug: "",

      promotionType: "PROMOTED",

      remarks: "",

      students: [],
    },
  });

  const selectedSession = watch("newSession");

  const selectedBoard = watch("newBoard");

  const selectedClass = watch("newClass");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!sessions || sessions.length === 0) {
      fetchSessions();
    }

    const studentsPayload = selectedStudents
      .map((student) => {
        const studentSlug = student.studentSlug || student.slug;

        if (!studentSlug) {
          return null;
        }

        return {
          studentSlug,

          newSectionSlug: null,

          newStreamSlug: null,

          newRollNumberPrefix: null,

          newRollNumber: null,
        };
      })
      .filter(Boolean);

    reset({
      previousSession: sourceSession,

      previousBoard: sourceBoard,

      previousClass: sourceClass,

      previousSectionSlug: sourceSectionSlug,

      previousStreamSlug: sourceStreamSlug,

      newSession: "",

      newBoard: "",

      newClass: "",

      newStreamSlug: "",

      newSectionSlug: "",

      promotionType: "PROMOTED",

      remarks: "",

      students: studentsPayload,
    });

    setTargetBoards([]);
    setSetupLoading(false);
  }, [
    isOpen,
    sourceSession,
    sourceBoard,
    sourceClass,
    sourceSectionSlug,
    sourceStreamSlug,
    selectedStudentKey,
    reset,
    fetchSessions,
  ]);

  useEffect(() => {
    if (!isOpen || !selectedSession) {
      setTargetBoards([]);

      return;
    }

    let isActive = true;

    const loadAcademicSetup = async () => {
      try {
        setSetupLoading(true);
        setTargetBoards([]);

        setValue("newBoard", "", {
          shouldValidate: false,
        });

        setValue("newClass", "", {
          shouldValidate: false,
        });

        setValue("newStreamSlug", "", {
          shouldValidate: false,
        });

        setValue("newSectionSlug", "", {
          shouldValidate: false,
        });

        await fetchAcademicSetup(selectedSession);

        if (!isActive) {
          return;
        }

        const latestBoards =
          useStudentAcademicMappingStore.getState().boards || [];

        setTargetBoards(latestBoards);

        const matchingBoard = latestBoards.find(
          (board) => board.title === sourceBoard,
        );

        if (matchingBoard) {
          setValue("newBoard", matchingBoard.title, {
            shouldValidate: false,
          });
        }
      } catch (error) {
        if (isActive) {
          setTargetBoards([]);
        }
      } finally {
        if (isActive) {
          setSetupLoading(false);
        }
      }
    };

    loadAcademicSetup();

    return () => {
      isActive = false;
    };
  }, [isOpen, selectedSession, sourceBoard, fetchAcademicSetup, setValue]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValue("newClass", "", {
      shouldValidate: false,
    });

    setValue("newStreamSlug", "", {
      shouldValidate: false,
    });

    setValue("newSectionSlug", "", {
      shouldValidate: false,
    });
  }, [isOpen, selectedBoard, setValue]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValue("newStreamSlug", "", {
      shouldValidate: false,
    });

    setValue("newSectionSlug", "", {
      shouldValidate: false,
    });
  }, [isOpen, selectedClass, setValue]);

  const availableSessions = useMemo(() => {
    return (sessions || []).filter((session) => {
      if (session.isActive === false) {
        return false;
      }

      return session.name !== sourceSession;
    });
  }, [sessions, sourceSession]);

  const availableBoards = useMemo(() => {
    return targetBoards.filter((board) => {
      if (board.isActive === false) {
        return false;
      }

      return board.title === sourceBoard;
    });
  }, [targetBoards, sourceBoard]);

  const selectedBoardData = useMemo(() => {
    if (!selectedBoard) {
      return null;
    }

    return targetBoards.find((board) => board.title === selectedBoard) || null;
  }, [targetBoards, selectedBoard]);

  const availableClasses = useMemo(() => {
    return selectedBoardData?.classes || [];
  }, [selectedBoardData]);

  const selectedClassData = useMemo(() => {
    if (!selectedClass) {
      return null;
    }

    return (
      availableClasses.find(
        (classItem) => classItem.classTitle === selectedClass,
      ) || null
    );
  }, [availableClasses, selectedClass]);

  const availableStreams = useMemo(() => {
    return selectedClassData?.streams || [];
  }, [selectedClassData]);

  const availableSections = useMemo(() => {
    return selectedClassData?.sections || [];
  }, [selectedClassData]);

  const handleClose = () => {
    if (submitLoading) {
      return;
    }

    reset({
      previousSession: "",
      previousBoard: "",
      previousClass: "",

      previousSectionSlug: null,

      previousStreamSlug: null,

      newSession: "",
      newBoard: "",
      newClass: "",

      newStreamSlug: "",
      newSectionSlug: "",

      promotionType: "PROMOTED",

      remarks: "",

      students: [],
    });

    setTargetBoards([]);
    setSetupLoading(false);

    onClose();
  };

  const onSubmit = async (values) => {
    const studentsPayload = selectedStudents
      .map((student) => {
        const studentSlug = student.studentSlug || student.slug;

        if (!studentSlug) {
          return null;
        }

        return {
          studentSlug,

          newSectionSlug: values.newSectionSlug || null,

          newStreamSlug: values.newStreamSlug || null,

          newRollNumberPrefix: null,

          newRollNumber: null,
        };
      })
      .filter(Boolean);

    if (studentsPayload.length === 0) {
      return;
    }

    const payload = {
      previousSession: sourceSession,

      previousBoard: sourceBoard,

      previousClass: sourceClass,

      previousSectionSlug: sourceSectionSlug,

      previousStreamSlug: sourceStreamSlug,

      newSession: values.newSession,

      newBoard: values.newBoard,

      newClass: values.newClass,

      newSectionSlug: values.newSectionSlug || null,

      newStreamSlug: values.newStreamSlug || null,

      promotionType: values.promotionType,

      remarks: values.remarks?.trim() || null,

      students: studentsPayload,
    };

    const success = await createPromotions(payload);

    if (!success) {
      return;
    }

    reset();
    setTargetBoards([]);
    setSetupLoading(false);

    if (onSuccess) {
      await onSuccess({
        session: values.newSession,
        board: values.newBoard,
        classTitle: values.newClass,
        sectionSlug: values.newSectionSlug || null,
        streamSlug: values.newStreamSlug || null,
        promotionType: values.promotionType,
      });
    }

    onClose();
  };

  const onInvalid = (validationErrors) => {
    console.error("Promotion validation errors:", validationErrors);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="
          bg-gray-900
          w-full
          max-w-2xl
          rounded-2xl
          border border-gray-800
          max-h-[90vh]
          overflow-hidden
          flex flex-col
        "
      >
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Promote Students
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              {selectedStudents.length} student(s) selected
            </p>
          </div>

          <button type="button" onClick={handleClose} disabled={submitLoading}>
            <X className="text-gray-400 cursor-pointer" />
          </button>
        </div>

        {/* Body */}

        <div className="p-5 space-y-5 overflow-y-auto overflow-x-auto custom-scrollbar custom-scrollbar-horizontal">
          <h3 className="text-white font-bold border-b border-gray-700 pb-4">
            Target Class Informations
          </h3>

          {/* Promotion Type */}

          <div>
            <label className="text-gray-300">Promotion Type</label>

            <select
              {...register("promotionType")}
              disabled={submitLoading}
              className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="PROMOTED">Promoted</option>

              <option value="DETAINED">Detained</option>

              <option value="DEMOTED">Demoted</option>
            </select>

            <FieldError message={errors.promotionType?.message} />
          </div>

          {/* Academic Year */}

          <div>
            <label className="text-gray-300">
              Academic Year
              <sup className="text-red-400 text-xs ml-2">
                Must be different and newer than source class
              </sup>
            </label>

            <select
              {...register("newSession")}
              disabled={submitLoading || sessionLoading}
              className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {sessionLoading
                  ? "Loading Academic Years..."
                  : "Select Acd. Year"}
              </option>

              {availableSessions.map((session) => (
                <option key={session.slug} value={session.name}>
                  {session.name}
                </option>
              ))}
            </select>

            <FieldError message={errors.newSession?.message} />
          </div>

          {/* Board */}

          <div>
            <label className="text-gray-300">
              Board
              <sup className="text-red-400 text-xs ml-2">
                Must be same as source class
              </sup>
            </label>

            <select
              {...register("newBoard")}
              disabled={submitLoading || setupLoading || !selectedSession}
              className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {setupLoading ? "Loading Boards..." : "Select Board"}
              </option>

              {availableBoards.map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
            </select>

            <FieldError message={errors.newBoard?.message} />
          </div>

          {/* Class */}

          <div>
            <label className="text-gray-300">
              Class
              <sup className="text-red-400 text-xs ml-2">
                Must be upgraded class than source.
              </sup>
            </label>

            <select
              {...register("newClass")}
              disabled={submitLoading || setupLoading || !selectedBoard}
              className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select Class</option>

              {availableClasses.map((classItem) => (
                <option key={classItem.slug} value={classItem.classTitle}>
                  {classItem.classTitle}
                </option>
              ))}
            </select>

            <FieldError message={errors.newClass?.message} />
          </div>

          {/* Stream */}

          <div>
            <label className="text-gray-300">
              Stream
              <sup className="text-red-400 text-xs ml-2 ">Optional</sup>
            </label>

            <select
              {...register("newStreamSlug")}
              disabled={submitLoading || !selectedClass}
              className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select Stream</option>

              {availableStreams.map((stream) => (
                <option key={stream.slug} value={stream.slug}>
                  {stream.streamTitle || stream.title || stream.name}
                </option>
              ))}
            </select>

            <FieldError message={errors.newStreamSlug?.message} />
          </div>

          {/* Section */}

          <div>
            <label className="text-gray-300">
              Section
              <sup className="text-red-400 text-xs ml-2">Optional</sup>
            </label>

            <select
              {...register("newSectionSlug")}
              disabled={submitLoading || !selectedClass}
              className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select Section</option>

              {availableSections.map((section) => (
                <option key={section.slug} value={section.slug}>
                  {section.sectionTitle || section.title || section.name}
                </option>
              ))}
            </select>

            <FieldError message={errors.newSectionSlug?.message} />
          </div>

          <FieldError message={errors.students?.message} />
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-5 border-t border-gray-800">
          <button
            type="submit"
            disabled={
              submitLoading || setupLoading || selectedStudents.length === 0
            }
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white cursor-pointer flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading && <Loader2 size={18} className="animate-spin" />}

            {submitLoading ? "Promoting..." : "Promote Students"}
          </button>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="px-5 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p className="text-red-400 text-sm mt-1">{message}</p>;
}
