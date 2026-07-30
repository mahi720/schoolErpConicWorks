import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

import { usePeriodicTestStore } from "../../../store/examManager/periodicTestTimeTable/periodicTestTimeTableStore";
import { useClassStore } from "../../../store/master/class/classStore";
import { useClassSubjectStore } from "../../../store/master/addSubjectToClass/classSubjectStore";

import { savePeriodicTestTimeTableSchema } from "../../../validations/examManager/periodicTestTimeTable/periodicTestTimeTableValidation";

const formatDisplayDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB");
};

const formatInputDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
};

const getPeriodicTestSlug = (state) => {
  return state?.slug || state?.periodicTestSlug || "";
};

const getTestTitle = (state) => {
  return state?.testTitle || state?.title || "";
};

const getSessionName = (state) => {
  return state?.sessionName || state?.session?.name || state?.year || "";
};

const getBoardTitle = (state) => {
  return state?.boardTitle || state?.board?.title || state?.board || "";
};

const getTestStatus = (state) => {
  const status = state?.testStatus || "scheduled";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getStartDate = (state) => {
  return state?.startDate || state?.start || "";
};

const getEndDate = (state) => {
  return state?.endDate || state?.end || "";
};

const normalizeClassSubjects = (classSubjects = []) => {
  if (!Array.isArray(classSubjects)) {
    return [];
  }

  return classSubjects.map((item, index) => ({
    id: item.slug || item.classSubjectSlug || index + 1,

    slug: item.slug || item.classSubjectSlug || "",

    classSubjectSlug: item.classSubjectSlug || item.slug || "",

    subjectSlug: item.subjectSlug || item.subject?.slug || "",

    subject:
      item.subjectTitle || item.subject?.subjectTitle || item.subject || "-",

    mode: item.studyMode || item.studyType || item.mode || "-",

    streamSlug: item.streamSlug || item.stream?.slug || null,

    stream:
      typeof item.stream === "string"
        ? item.stream
        : item.streamTitle ||
          item.stream?.streamTitle ||
          item.stream?.title ||
          "NA",

    subjectOrder: item.subjectOrder ?? item.subject?.subjectOrder ?? 0,

    max: "",

    min: "",

    date: "",

    time: "",

    duration: "",

    questionPaper: null,

    savedSlug: null,

    isSaved: false,
  }));
};

const normalizeSavedSubjects = (savedSubjects = []) => {
  if (!Array.isArray(savedSubjects)) {
    return [];
  }

  return savedSubjects.map((item, index) => ({
    id: item.slug || item.classSubjectSlug || index + 1,

    savedSlug: item.slug || null,

    classSubjectSlug: item.classSubjectSlug || item.classSubject?.slug || "",

    subjectSlug: item.subjectSlug || item.classSubject?.subject?.slug || "",

    subject:
      item.subjectTitle ||
      item.classSubject?.subject?.subjectTitle ||
      item.subject ||
      "-",

    mode:
      item.studyMode || item.studyType || item.classSubject?.studyType || "-",

    streamSlug:
      item.streamSlug ||
      item.stream?.slug ||
      item.classSubject?.stream?.slug ||
      null,

    stream:
      typeof item.stream === "string"
        ? item.stream
        : item.streamTitle ||
          item.stream?.streamTitle ||
          item.stream?.title ||
          item.classSubject?.stream?.streamTitle ||
          "NA",

    subjectOrder:
      item.subjectOrder ?? item.classSubject?.subject?.subjectOrder ?? 0,

    max: item.maxMarks ?? item.max ?? "",

    min: item.minMarks ?? item.min ?? "",

    date: formatInputDate(item.testDate || item.date),

    time: item.testTime || item.time || "",

    duration: item.duration ?? "",

    questionPaper: item.questionPaper || null,

    isSaved: true,
  }));
};

const getSubjectKey = (item) => {
  return `${item.classSubjectSlug}-${item.streamSlug || "NA"}`;
};

const mergeSavedTimeTable = (classSubjects, savedSubjects) => {
  const normalizedClassSubjects = normalizeClassSubjects(classSubjects);

  const normalizedSavedSubjects = normalizeSavedSubjects(savedSubjects);

  const savedMap = new Map(
    normalizedSavedSubjects.map((item) => [getSubjectKey(item), item]),
  );

  const mergedSubjects = normalizedClassSubjects.map((item) => {
    const savedSubject = savedMap.get(getSubjectKey(item));

    if (!savedSubject) {
      return item;
    }

    return {
      ...item,

      savedSlug: savedSubject.savedSlug,

      subject: savedSubject.subject || item.subject,

      mode: savedSubject.mode || item.mode,

      streamSlug: savedSubject.streamSlug || item.streamSlug || null,

      stream: savedSubject.stream || item.stream || "NA",

      max: savedSubject.max,

      min: savedSubject.min,

      date: savedSubject.date,

      time: savedSubject.time,

      duration: savedSubject.duration,

      questionPaper: savedSubject.questionPaper,

      isSaved: true,
    };
  });

  const classSubjectKeys = new Set(mergedSubjects.map(getSubjectKey));

  const missingSavedSubjects = normalizedSavedSubjects.filter(
    (item) => !classSubjectKeys.has(getSubjectKey(item)),
  );

  return [...mergedSubjects, ...missingSavedSubjects].sort(
    (first, second) =>
      Number(first.subjectOrder || 0) - Number(second.subjectOrder || 0),
  );
};

const hasAnyTimeTableValue = (item) => {
  return Boolean(
    item.max !== "" ||
    item.min !== "" ||
    item.date ||
    item.time ||
    item.duration !== "" ||
    item.questionPaper,
  );
};

const isSubjectComplete = (item) => {
  return Boolean(
    item.classSubjectSlug &&
    item.max !== "" &&
    item.min !== "" &&
    item.date &&
    item.time &&
    item.duration !== "",
  );
};

export default function ManagePeriodicTestExamTimeTable() {
  const { state } = useLocation();

  const periodicTestSlug = getPeriodicTestSlug(state);

  const academicYear = getSessionName(state);

  const boardTitle = getBoardTitle(state);

  const [activeClassSlug, setActiveClassSlug] = useState("");

  const [subjects, setSubjects] = useState([]);

  const [publishResult, setPublishResult] = useState("");

  const {
    loading: periodicTestLoading,

    submitLoading,

    configuration,

    fetchPeriodicTestTimeTable,

    savePeriodicTestTimeTable,
  } = usePeriodicTestStore();

  const {
    classes,

    loading: classLoading,

    fetchClasses,
  } = useClassStore();

  const {
    classSubjects,

    loading: classSubjectLoading,

    fetchClassSubjects,
  } = useClassSubjectStore();

  const activeClass = useMemo(() => {
    return classes?.find((item) => item.slug === activeClassSlug);
  }, [classes, activeClassSlug]);

  useEffect(() => {
    if (!academicYear || !boardTitle) {
      return;
    }

    fetchClasses({
      session: academicYear,

      board: boardTitle,
    });
  }, [academicYear, boardTitle, fetchClasses]);

  useEffect(() => {
    if (!Array.isArray(classes) || classes.length === 0) {
      setActiveClassSlug("");
      setSubjects([]);

      return;
    }

    const activeClassExists = classes.some(
      (item) => item.slug === activeClassSlug,
    );

    if (!activeClassExists) {
      setActiveClassSlug(classes[0].slug);
    }
  }, [classes, activeClassSlug]);

  useEffect(() => {
    if (
      !activeClassSlug ||
      !activeClass?.classTitle ||
      !academicYear ||
      !boardTitle
    ) {
      setSubjects([]);

      return;
    }

    fetchClassSubjects({
      session: academicYear,

      board: boardTitle,

      classTitle: activeClass.classTitle,
    });
  }, [
    activeClassSlug,
    activeClass?.classTitle,
    academicYear,
    boardTitle,
    fetchClassSubjects,
  ]);

  useEffect(() => {
    if (!periodicTestSlug || !activeClassSlug) {
      return;
    }

    fetchPeriodicTestTimeTable(periodicTestSlug, activeClassSlug);
  }, [periodicTestSlug, activeClassSlug, fetchPeriodicTestTimeTable]);

  useEffect(() => {
    if (!activeClassSlug) {
      setSubjects([]);

      return;
    }

    const savedSubjects =
      configuration?.subjects || configuration?.periodicTestTimeTables || [];

    const mergedSubjects = mergeSavedTimeTable(classSubjects, savedSubjects);

    setSubjects(mergedSubjects);

    if (configuration) {
      setPublishResult(configuration.publishResult ? "Yes" : "No");
    } else {
      setPublishResult("");
    }
  }, [activeClassSlug, classSubjects, configuration]);

  const handleClassChange = (classSlug) => {
    setActiveClassSlug(classSlug);

    setSubjects([]);

    setPublishResult("");
  };

  const handleChange = (id, name, value) => {
    setSubjects((previousSubjects) =>
      previousSubjects.map((item) =>
        item.id === id
          ? {
              ...item,
              [name]: value,
            }
          : item,
      ),
    );
  };

  const saveTimeTable = async () => {
    if (!periodicTestSlug) {
      toast.error("Periodic test information not found");

      return;
    }

    if (!activeClassSlug) {
      toast.error("Please select a class");

      return;
    }

    if (!publishResult) {
      toast.error("Please select publish result");

      return;
    }

    const filledSubjects = subjects.filter(hasAnyTimeTableValue);

    if (filledSubjects.length === 0) {
      toast.error("Fill timetable details for at least one subject");

      return;
    }

    const incompleteSubject = filledSubjects.find(
      (item) => !isSubjectComplete(item),
    );

    if (incompleteSubject) {
      toast.error(
        `Complete all timetable fields for ${
          incompleteSubject.subject || "selected subject"
        }`,
      );

      return;
    }

    const invalidMarksSubject = filledSubjects.find(
      (item) => Number(item.min) > Number(item.max),
    );

    if (invalidMarksSubject) {
      toast.error(
        `Minimum marks cannot exceed maximum marks for ${
          invalidMarksSubject.subject || "selected subject"
        }`,
      );

      return;
    }

    const payload = {
      periodicTestSlug,

      classSlug: activeClassSlug,

      publishResult: publishResult === "Yes",

      subjects: filledSubjects.map((item) => ({
        classSubjectSlug: item.classSubjectSlug,

        streamSlug: item.streamSlug || null,

        studyMode: item.mode || null,

        maxMarks: Number(item.max),

        minMarks: Number(item.min),

        testDate: item.date,

        testTime: item.time,

        duration: Number(item.duration),

        questionPaper: item.questionPaper || null,
      })),
    };

    const result = savePeriodicTestTimeTableSchema.safeParse(payload);

    if (!result.success) {
      toast.error(
        result.error.issues?.[0]?.message ||
          "Please complete timetable information",
      );

      return;
    }

    const success = await savePeriodicTestTimeTable(result.data);

    if (success) {
      await fetchPeriodicTestTimeTable(periodicTestSlug, activeClassSlug);
    }
  };

  const pageLoading =
    periodicTestLoading || classLoading || classSubjectLoading;

  return (
    <div className="space-y-6 overflow-auto w-full">
      {/* Exam Info */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex justify-between">
        <div>
          <h2 className="text-xl text-white font-semibold">
            {getTestTitle(state)}
          </h2>

          <p className="text-gray-400 mt-3">Academic Year : {academicYear}</p>

          <p className="text-gray-400">Board : {boardTitle}</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="bg-green-500 px-3 py-2 rounded-lg text-white">
              Start : {formatDisplayDate(getStartDate(state))}
            </span>

            <span className="bg-red-500 px-3 py-2 rounded-lg text-white">
              End : {formatDisplayDate(getEndDate(state))}
            </span>
          </div>

          <p className="text-gray-300">Status : {getTestStatus(state)}</p>
        </div>
      </div>

      {/* Classes */}

      <div className="bg-gray-900 border whitespace-nowrap border-gray-800 rounded-xl p-3 flex gap-4 overflow-auto custom-scrollbar">
        {classes?.map((classItem) => (
          <button
            key={classItem.slug}
            onClick={() => handleClassChange(classItem.slug)}
            className={`px-5 py-2 rounded-lg cursor-pointer ${
              activeClassSlug === classItem.slug
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            {classItem.classTitle}
          </button>
        ))}
      </div>

      {/* Title */}

      <div className="flex justify-between items-center">
        {/* left */}

        <h2 className="text-xl text-white">
          Time Table for {boardTitle} ({activeClass?.classTitle || "-"})
        </h2>

        {/* right */}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-gray-400 whitespace-nowrap">Publish Result:</p>

            <select
              value={publishResult}
              onChange={(event) => setPublishResult(event.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white w-32 cursor-pointer"
            >
              <option value="">Select Result</option>

              <option value="Yes">Yes</option>

              <option value="No">No</option>
            </select>
          </div>

          <button
            onClick={saveTimeTable}
            disabled={submitLoading || !activeClassSlug}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />

            {submitLoading
              ? "Saving..."
              : `Save Time Table For ${activeClass?.classTitle || ""}`}
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SN.",
                "Subject Name",
                "Study Mode",
                "Stream",
                "Max Marks",
                "Min Marks",
                "Exam Date",
                "Exam Time",
                "Duration",
              ].map((h) => (
                <th key={h} className="p-4 text-left text-gray-300">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {subjects.map((item, index) => (
              <tr
                key={`${item.classSubjectSlug}-${item.streamSlug || "NA"}`}
                className="border-t border-gray-800"
              >
                <td className="p-4 text-gray-300">{index + 1}.</td>

                <td className="p-4 text-white">{item.subject}</td>

                <td className="p-4 text-gray-400">{item.mode}</td>

                <td className="p-4 text-gray-400">{item.stream}</td>

                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    value={item.max}
                    onChange={(event) =>
                      handleChange(item.id, "max", event.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  />
                </td>

                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    value={item.min}
                    onChange={(event) =>
                      handleChange(item.id, "min", event.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  />
                </td>

                <td className="p-3">
                  <input
                    type="date"
                    value={item.date}
                    min={formatInputDate(getStartDate(state))}
                    max={formatInputDate(getEndDate(state))}
                    onChange={(event) =>
                      handleChange(item.id, "date", event.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  />
                </td>

                <td className="p-3">
                  <input
                    type="time"
                    value={item.time}
                    onChange={(event) =>
                      handleChange(item.id, "time", event.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  />
                </td>

                <td className="p-1">
                  <select
                    value={item.duration}
                    onChange={(event) =>
                      handleChange(item.id, "duration", event.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  >
                    <option value="">Duration</option>

                    <option value="60">1 Hour</option>

                    <option value="120">2 Hours</option>

                    <option value="180">3 Hours</option>
                  </select>
                </td>
              </tr>
            ))}

            {!pageLoading && subjects.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400">
                  No subjects found for selected class
                </td>
              </tr>
            )}

            {pageLoading && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
