import React, { useEffect, useMemo, useState } from "react";

import { Loader2, X, Plus, Trash } from "lucide-react";

import toast from "react-hot-toast";

import { useSessionStore } from "../../../store/master/session/sessionStore";
import { useBoardStore } from "../../../store/master/board/boardStore";
import { useClassMappingStore } from "../../../store/master/classMapping/classMappingStore";

import { useWeeklyPlanStore } from "../../../store/academic/weeklyPlan/weeklyPlanStore";

import { weeklyPlanSchema } from "../../../validations/academic/weeklyPlan/weeklyPlanSchema";

const initialFormData = {
  session: "",
  board: "",
  classTitle: "",
  sectionTitle: "",

  fromDate: "",
  toDate: "",

  topic: "",
  subTopic: "",
  introductionAids: "",
  introductionActivity: "",
  learningObjective: "",

  numberOfPeriods: "0",
};

const initialLesson = {
  day: "",
  teachingMethodology: "",
  studentActivities: "",
  assessment: "",
};

const createLocalId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
};

const formatInputDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const getSessionName = (session) => {
  return session?.name || session?.title || "";
};

const getBoardTitle = (board) => {
  return board?.title || board?.name || "";
};

const getMappingClassSlug = (mapping) => {
  return (
    mapping?.classSlug || mapping?.class?.slug || mapping?.classData?.slug || ""
  );
};

const getMappingClassTitle = (mapping) => {
  return (
    mapping?.classTitle ||
    mapping?.class?.classTitle ||
    mapping?.classData?.classTitle ||
    ""
  );
};

const getSectionSlug = (section) => {
  return section?.slug || section?.sectionSlug || section?.section?.slug || "";
};

const getSectionTitle = (section) => {
  return (
    section?.sectionTitle ||
    section?.title ||
    section?.name ||
    section?.sectionName ||
    section?.section?.sectionTitle ||
    section?.section?.title ||
    ""
  );
};

const getMappingSections = (mapping) => {
  if (Array.isArray(mapping?.sections)) {
    return mapping.sections;
  }

  if (Array.isArray(mapping?.sectionMappings)) {
    return mapping.sectionMappings;
  }

  if (Array.isArray(mapping?.classSections)) {
    return mapping.classSections;
  }

  if (mapping?.section) {
    return [mapping.section];
  }

  if (mapping?.sectionSlug || mapping?.sectionTitle) {
    return [
      {
        slug: mapping.sectionSlug || mapping?.section?.slug || "",

        sectionTitle:
          mapping.sectionTitle ||
          mapping?.section?.sectionTitle ||
          mapping?.section?.title ||
          "",
      },
    ];
  }

  return [];
};

const normalizeMappings = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value) {
    return [value];
  }

  return [];
};

const normalizeEditLessons = (lessons = []) => {
  if (!Array.isArray(lessons)) {
    return [];
  }

  return lessons
    .filter((lesson) => lesson?.isActive !== false)
    .sort(
      (first, second) =>
        Number(first?.lessonOrder || 0) - Number(second?.lessonOrder || 0),
    )
    .map((lesson, index) => ({
      localId: lesson?.slug || createLocalId(),

      slug: lesson?.slug || null,

      lessonOrder: Number(lesson?.lessonOrder) || index + 1,

      day: lesson?.day || "",

      teachingMethodology: lesson?.teachingMethodology || "",

      studentActivities: lesson?.studentActivities || "",

      assessment: lesson?.assessment || "",

      status: lesson?.status || "active",

      isActive: lesson?.isActive !== false,

      deletedAt: lesson?.deletedAt || null,
    }));
};

export default function GenerateWeeklyPlanModal({
  open,
  close,
  selectedWeeklyPlan,
  onSuccess,
}) {
  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { boards, loading: boardLoading, fetchBoards } = useBoardStore();

  const {
    mappings,
    loading: mappingLoading,
    fetchMappings,
  } = useClassMappingStore();

  const {
    submitLoading,
    lessonDeleteLoading,
    deletingLessonSlug,

    createWeeklyPlan,
    updateWeeklyPlan,
    deleteWeeklyPlanLesson,
  } = useWeeklyPlanStore();

  const [formData, setFormData] = useState(initialFormData);

  const [lesson, setLesson] = useState(initialLesson);

  const [rows, setRows] = useState([]);

  const [initializedEditSlug, setInitializedEditSlug] = useState(null);

  const isEdit = Boolean(selectedWeeklyPlan?.slug);

  const optionsLoading = sessionLoading || boardLoading || mappingLoading;

  const activeSessions = useMemo(() => {
    return (sessions || []).filter((session) => session?.isActive !== false);
  }, [sessions]);

  const activeBoards = useMemo(() => {
    return (boards || []).filter((board) => board?.isActive !== false);
  }, [boards]);

  const activeMappings = useMemo(() => {
    return normalizeMappings(mappings).filter(
      (mapping) => mapping?.isActive !== false,
    );
  }, [mappings]);

  const selectedClassMapping = useMemo(() => {
    return activeMappings.find((mapping) => {
      const mappingClassTitle =
        mapping?.class?.classTitle || mapping?.classTitle || "";

      return mappingClassTitle === formData.classTitle;
    });
  }, [activeMappings, formData.classTitle]);

  const classOptions = useMemo(() => {
    const classMap = new Map();

    activeMappings.forEach((mapping) => {
      const classSlug = getMappingClassSlug(mapping);

      const classTitle = getMappingClassTitle(mapping);

      if (!classTitle) {
        return;
      }

      const key = classSlug || classTitle;

      if (!classMap.has(key)) {
        classMap.set(key, {
          slug: classSlug,
          classTitle,
        });
      }
    });

    return Array.from(classMap.values());
  }, [activeMappings]);

  const sectionOptions = useMemo(() => {
    const mappingSections = selectedClassMapping?.sections || [];

    return mappingSections
      .filter((section) => section?.isActive !== false)
      .map((section) => ({
        slug: section.slug,

        sectionTitle: section.sectionTitle || section.title || "",
      }))
      .filter((section) => section.sectionTitle);
  }, [selectedClassMapping]);

  const activeRows = useMemo(() => {
    return rows.filter((item) => item?.isActive !== false);
  }, [rows]);

  useEffect(() => {
    if (!open) {
      return;
    }

    fetchSessions();
    fetchBoards();
  }, [open, fetchSessions, fetchBoards]);

  useEffect(() => {
    if (!open || !formData.session || !formData.board) {
      return;
    }

    fetchMappings({
      session: formData.session,

      board: formData.board,
    });
  }, [open, formData.session, formData.board, fetchMappings]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (selectedWeeklyPlan?.slug) {
      if (initializedEditSlug === selectedWeeklyPlan.slug) {
        return;
      }

      const lessons = normalizeEditLessons(selectedWeeklyPlan?.lessons || []);

      setFormData({
        session:
          selectedWeeklyPlan?.session?.name ||
          selectedWeeklyPlan?.sessionName ||
          "",

        board:
          selectedWeeklyPlan?.board?.title ||
          selectedWeeklyPlan?.boardTitle ||
          "",

        classTitle:
          selectedWeeklyPlan?.class?.classTitle ||
          selectedWeeklyPlan?.classTitle ||
          "",

        sectionTitle:
          selectedWeeklyPlan?.section?.sectionTitle ||
          selectedWeeklyPlan?.section?.title ||
          selectedWeeklyPlan?.sectionTitle ||
          "",

        fromDate: formatInputDate(selectedWeeklyPlan?.fromDate),

        toDate: formatInputDate(selectedWeeklyPlan?.toDate),

        topic: selectedWeeklyPlan?.topic || "",

        subTopic: selectedWeeklyPlan?.subTopic || "",

        introductionAids: selectedWeeklyPlan?.introductionAids || "",

        introductionActivity: selectedWeeklyPlan?.introductionActivity || "",

        learningObjective: selectedWeeklyPlan?.learningObjective || "",

        numberOfPeriods: String(lessons.length),
      });

      setRows(lessons);

      setLesson(initialLesson);

      setInitializedEditSlug(selectedWeeklyPlan.slug);

      return;
    }

    setFormData(initialFormData);

    setLesson(initialLesson);

    setRows([]);

    setInitializedEditSlug(null);
  }, [open, selectedWeeklyPlan, initializedEditSlug]);

  useEffect(() => {
    if (open) {
      return;
    }

    setFormData(initialFormData);

    setLesson(initialLesson);

    setRows([]);

    setInitializedEditSlug(null);
  }, [open]);

  const handleFormChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSessionChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      session: value,
      classTitle: "",
      sectionTitle: "",
    }));
  };

  const handleBoardChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      board: value,
      classTitle: "",
      sectionTitle: "",
    }));
  };

  const handleClassChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      classTitle: value,
      sectionTitle: "",
    }));
  };

  const handleLessonChange = (field, value) => {
    setLesson((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addRow = () => {
    const cleanedLesson = {
      day: lesson.day.trim(),

      teachingMethodology: lesson.teachingMethodology.trim(),

      studentActivities: lesson.studentActivities.trim(),

      assessment: lesson.assessment.trim(),
    };

    if (
      !cleanedLesson.day ||
      !cleanedLesson.teachingMethodology ||
      !cleanedLesson.studentActivities ||
      !cleanedLesson.assessment
    ) {
      toast.error("Please fill all lesson fields");

      return;
    }

    const newLesson = {
      localId: createLocalId(),

      slug: null,

      lessonOrder: activeRows.length + 1,

      ...cleanedLesson,

      status: "active",

      isActive: true,

      deletedAt: null,
    };

    setRows((previous) => [...previous, newLesson]);

    setFormData((previous) => ({
      ...previous,

      numberOfPeriods: String(activeRows.length + 1),
    }));

    setLesson(initialLesson);
  };

  const removeRow = async (item) => {
    if (activeRows.length <= 1) {
      toast.error("At least one lesson is required");

      return;
    }

    if (item?.slug && selectedWeeklyPlan?.slug) {
      const confirmed = window.confirm(
        "Are you sure you want to delete this lesson?",
      );

      if (!confirmed) {
        return;
      }

      const success = await deleteWeeklyPlanLesson(
        selectedWeeklyPlan.slug,
        item.slug,
      );

      if (!success) {
        return;
      }
    }

    setRows((previous) => {
      const updatedRows = previous
        .filter((row) => row.localId !== item.localId)
        .map((row, index) => ({
          ...row,

          lessonOrder: index + 1,
        }));

      setFormData((current) => ({
        ...current,

        numberOfPeriods: String(
          updatedRows.filter((row) => row?.isActive !== false).length,
        ),
      }));

      return updatedRows;
    });
  };

  const handleSubmit = async () => {
    const lessons = activeRows.map((row, index) => ({
      ...(row.slug && {
        slug: row.slug,
      }),

      lessonOrder: index + 1,

      day: row.day.trim(),

      teachingMethodology: row.teachingMethodology.trim(),

      studentActivities: row.studentActivities.trim(),

      assessment: row.assessment.trim(),
    }));

    const payload = {
      session: formData.session,

      board: formData.board,

      classTitle: formData.classTitle,

      sectionTitle: formData.sectionTitle,

      fromDate: formData.fromDate,

      toDate: formData.toDate,

      topic: formData.topic.trim(),

      subTopic: formData.subTopic?.trim() || "",

      introductionAids: formData.introductionAids?.trim() || "",

      introductionActivity: formData.introductionActivity?.trim() || "",

      learningObjective: formData.learningObjective?.trim() || "",

      numberOfPeriods: lessons.length,

      lessons,
    };

    const validationResult = weeklyPlanSchema.safeParse(payload);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0];

      toast.error(firstError?.message || "Please fill all required fields");

      return;
    }

    let success = false;

    if (selectedWeeklyPlan?.slug) {
      success = await updateWeeklyPlan(
        selectedWeeklyPlan.slug,
        validationResult.data,
      );
    } else {
      success = await createWeeklyPlan(validationResult.data);
    }

    if (!success) {
      return;
    }

    if (onSuccess) {
      await onSuccess();

      return;
    }

    close();
  };

  const handleClose = () => {
    if (submitLoading || lessonDeleteLoading) {
      return;
    }

    close();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-2xl w-[60%] max-h-[90vh] overflow-x-auto overflow-y-auto custom-scrollbar">
        <div className="p-5 border-b border-gray-800 flex justify-between">
          <h2 className="text-2xl text-white">
            {isEdit ? "Edit Weekly Plan" : "Generate New Weekly Plan"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading || lessonDeleteLoading}
            className="text-gray-400 cursor-pointer hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <Field label="From" required>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(event) =>
                    handleFormChange("fromDate", event.target.value)
                  }
                  className="input w-full h-12"
                />
              </Field>

              <Field label="Topic" required>
                <textarea
                  rows="2"
                  value={formData.topic}
                  onChange={(event) =>
                    handleFormChange("topic", event.target.value)
                  }
                  placeholder="Enter Topic"
                  className="input w-full resize-none h-20"
                />
              </Field>

              <Field
                label="Introduction Aids : (Smart Class Module/Online resource/Any Other)"
                required
                tallLabel
              >
                <textarea
                  value={formData.introductionAids}
                  onChange={(event) =>
                    handleFormChange("introductionAids", event.target.value)
                  }
                  placeholder="Introduction Aids : (Smart Class Module/Online...)"
                  className="input w-full resize-none h-20 overflow-hidden"
                />
              </Field>

              <Field label="To" required>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(event) =>
                    handleFormChange("toDate", event.target.value)
                  }
                  className="input w-full h-12"
                />
              </Field>

              <Field label="Sub Topic" required>
                <textarea
                  rows="2"
                  value={formData.subTopic}
                  onChange={(event) =>
                    handleFormChange("subTopic", event.target.value)
                  }
                  className="input w-full resize-none h-20"
                  placeholder="Enter Sub Topic"
                />
              </Field>

              <Field label="Introduction Activity" required>
                <textarea
                  rows="2"
                  value={formData.introductionActivity}
                  onChange={(event) =>
                    handleFormChange("introductionActivity", event.target.value)
                  }
                  className="input w-full resize-none h-20"
                  placeholder="Enter Introduction Activity"
                />
              </Field>

              <Field label="No Of Periods" required>
                <input
                  type="number"
                  value={formData.numberOfPeriods}
                  readOnly
                  className="input w-full h-12"
                  placeholder="No Of Periods"
                />
              </Field>

              <Field label="Learning Objective" required>
                <textarea
                  rows="2"
                  value={formData.learningObjective}
                  onChange={(event) =>
                    handleFormChange("learningObjective", event.target.value)
                  }
                  className="input w-full resize-none h-20"
                  placeholder="Enter Learning Objective"
                />
              </Field>

              <Field label="Session" required>
                <select
                  value={formData.session}
                  onChange={(event) => handleSessionChange(event.target.value)}
                  disabled={sessionLoading}
                  className="input w-full h-12 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {sessionLoading ? "Loading Sessions..." : "Select Session"}
                  </option>

                  {activeSessions.map((session) => {
                    const name = getSessionName(session);

                    return (
                      <option key={session.slug || name} value={name}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </Field>

              <Field label="Board" required>
                <select
                  value={formData.board}
                  onChange={(event) => handleBoardChange(event.target.value)}
                  disabled={boardLoading}
                  className="input w-full h-12 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {boardLoading ? "Loading Boards..." : "Select Board"}
                  </option>

                  {activeBoards.map((board) => {
                    const title = getBoardTitle(board);

                    return (
                      <option key={board.slug || title} value={title}>
                        {title}
                      </option>
                    );
                  })}
                </select>
              </Field>

              <Field label="Class" required>
                <select
                  value={formData.classTitle}
                  onChange={(event) => handleClassChange(event.target.value)}
                  disabled={
                    !formData.session || !formData.board || mappingLoading
                  }
                  className="input w-full h-12 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {mappingLoading ? "Loading Classes..." : "Select Class"}
                  </option>

                  {classOptions.map((classItem) => (
                    <option
                      key={classItem.slug || classItem.classTitle}
                      value={classItem.classTitle}
                    >
                      {classItem.classTitle}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Section">
                <select
                  value={formData.sectionTitle}
                  onChange={(event) =>
                    handleFormChange("sectionTitle", event.target.value)
                  }
                  disabled={!formData.classTitle || mappingLoading}
                  className="input w-full h-12 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {mappingLoading ? "Loading Sections..." : "Select Section"}
                  </option>

                  {formData.sectionTitle &&
                    !sectionOptions.some(
                      (section) =>
                        section.sectionTitle === formData.sectionTitle,
                    ) && (
                      <option value={formData.sectionTitle}>
                        {formData.sectionTitle}
                      </option>
                    )}

                  {sectionOptions.map((section) => (
                    <option
                      key={section.slug || section.sectionTitle}
                      value={section.sectionTitle}
                    >
                      {section.sectionTitle}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <h3 className="text-white text-lg">Lesson Development</h3>

          <div className="overflow-x-auto overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr>
                  {[
                    "Day",
                    "Teaching Methodology",
                    "Students Activities",
                    "Assessment",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="text-gray-400 p-3 text-left whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-3">
                    <input
                      value={lesson.day}
                      onChange={(event) =>
                        handleLessonChange("day", event.target.value)
                      }
                      placeholder="Day"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </td>

                  <td className="p-3">
                    <input
                      value={lesson.teachingMethodology}
                      onChange={(event) =>
                        handleLessonChange(
                          "teachingMethodology",
                          event.target.value,
                        )
                      }
                      placeholder="Teaching Methodology"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </td>

                  <td className="p-3">
                    <input
                      value={lesson.studentActivities}
                      onChange={(event) =>
                        handleLessonChange(
                          "studentActivities",
                          event.target.value,
                        )
                      }
                      placeholder="Students Activities"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </td>

                  <td className="p-3">
                    <input
                      value={lesson.assessment}
                      onChange={(event) =>
                        handleLessonChange("assessment", event.target.value)
                      }
                      placeholder="Assessment"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </td>

                  <td className="p-3">
                    <button
                      type="button"
                      onClick={addRow}
                      disabled={submitLoading || lessonDeleteLoading}
                      className="bg-indigo-600 text-white p-2 rounded-lg cursor-pointer hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Plus size={18} />
                    </button>
                  </td>
                </tr>

                {activeRows.map((item, index) => (
                  <tr
                    key={item.localId || item.slug || index}
                    className="border-t border-gray-800"
                  >
                    <td className="p-3 text-white whitespace-normal break-words max-w-[200px]">
                      {item.day}
                    </td>

                    <td className="p-3 text-white whitespace-normal break-words max-w-[200px]">
                      {item.teachingMethodology}
                    </td>

                    <td className="p-3 text-white whitespace-normal break-words max-w-[200px]">
                      {item.studentActivities}
                    </td>

                    <td className="p-3 text-white whitespace-normal break-words max-w-[200px]">
                      {item.assessment}
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => removeRow(item)}
                        disabled={submitLoading || lessonDeleteLoading}
                        className="bg-red-500 p-2 rounded-lg cursor-pointer text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {item.slug && deletingLessonSlug === item.slug ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {activeRows.length === 0 && (
                  <tr className="border-t border-gray-800">
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      No lessons added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading || lessonDeleteLoading || optionsLoading}
            className="bg-green-500 px-6 py-3 rounded-xl text-white cursor-pointer hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </span>
            ) : isEdit ? (
              "Update Weekly Plan"
            ) : (
              "Create Weekly Plan"
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading || lessonDeleteLoading}
            className="bg-red-500 px-6 py-3 rounded-xl text-gray-300 cursor-pointer hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required = false, tallLabel = false, children }) {
  return (
    <div className="space-y-2">
      <label
        className={`text-gray-400 text-sm block ${tallLabel ? "h-9" : "h-4"}`}
      >
        {label}

        {required && <span className="text-red-500"> *</span>}
      </label>

      {children}
    </div>
  );
}
