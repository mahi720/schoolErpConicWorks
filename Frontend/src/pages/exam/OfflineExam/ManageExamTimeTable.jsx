import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, FileText, Save } from "lucide-react";
import toast from "react-hot-toast";

import { useTermExamTimeTableStore } from "../../../store/examManager/termExamTimeTable/termExamTimeTableStore";
import { useClassStore } from "../../../store/master/class/classStore";
import { useClassSubjectStore } from "../../../store/master/addSubjectToClass/classSubjectStore";

import { saveTermExamTimeTableSchema } from "../../../validations/examManager/termExamTimeTable/termExamTimeTableValidation";

const formatDisplayDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB");
};

const formatInputDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
};

const getTermExamSession = (termExam) => {
  return (
    termExam?.sessionName || termExam?.session?.name || termExam?.year || ""
  );
};

const getTermExamBoard = (termExam) => {
  return (
    termExam?.boardTitle || termExam?.board?.title || termExam?.board || ""
  );
};

const getTermExamTitle = (termExam) => {
  return termExam?.examTitle || termExam?.title || "";
};

const getTermExamStartDate = (termExam) => {
  return termExam?.startDate || termExam?.start || null;
};

const getTermExamEndDate = (termExam) => {
  return termExam?.endDate || termExam?.end || null;
};

const getTermExamStatus = (termExam) => {
  const examStatus = termExam?.examStatus || termExam?.exam_status || "";

  if (!examStatus) {
    return "-";
  }

  return examStatus
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const normalizeClassSubjects = (classSubjects = []) => {
  if (!Array.isArray(classSubjects)) {
    return [];
  }

  return classSubjects.map((item) => ({
    id: item.slug,

    slug: item.slug,

    classSubjectSlug: item.classSubjectSlug || item.slug,

    subjectSlug: item.subjectSlug || item.subject?.slug || "",

    subject:
      item.subjectTitle || item.subject?.subjectTitle || item.subject || "-",

    mode:
      item.studyType ||
      item.studyMode ||
      item.subjectType ||
      item.subject?.subjectType ||
      "-",

    streamSlug: item.streamSlug || item.stream?.slug || null,

    stream:
      typeof item.stream === "string"
        ? item.stream
        : item.stream?.streamTitle ||
          item.stream?.title ||
          item.streamTitle ||
          "NA",

    max: "",

    min: "",

    date: "",

    time: "",

    duration: "",

    questionPaper: null,
  }));
};

const mergeSavedTimeTable = (classSubjects = [], savedSubjects = []) => {
  const normalizedSubjects = normalizeClassSubjects(classSubjects);

  if (!Array.isArray(savedSubjects) || savedSubjects.length === 0) {
    return normalizedSubjects;
  }

  return normalizedSubjects.map((item) => {
    const savedSubject = savedSubjects.find(
      (savedItem) =>
        savedItem.classSubjectSlug === item.classSubjectSlug &&
        (savedItem.streamSlug || null) === (item.streamSlug || null),
    );

    if (!savedSubject) {
      return item;
    }

    return {
      ...item,

      slug: savedSubject.slug || item.slug,

      subject: savedSubject.subjectTitle || item.subject,

      mode: savedSubject.studyMode || savedSubject.studyType || item.mode,

      streamSlug: savedSubject.streamSlug || item.streamSlug || null,

      stream:
        savedSubject.streamTitle ||
        (typeof savedSubject.stream === "string"
          ? savedSubject.stream
          : savedSubject.stream?.streamTitle || savedSubject.stream?.title) ||
        item.stream ||
        "NA",

      max: savedSubject.maxMarks ?? "",

      min: savedSubject.minMarks ?? "",

      date: formatInputDate(savedSubject.examDate),

      time: savedSubject.examTime || "",

      duration: savedSubject.duration ? String(savedSubject.duration) : "",

      questionPaper: savedSubject.questionPaper || null,
    };
  });
};

export default function ManageExamTimeTable() {
  const { state } = useLocation();

  const [activeClass, setActiveClass] = useState("");
  const [activeClassSlug, setActiveClassSlug] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [publishResult, setPublishResult] = useState("");

  const {
    configuration,
    loading,
    submitLoading,
    fetchTermExamTimeTable,
    saveTermExamTimeTable,
  } = useTermExamTimeTableStore();

  const { classes, fetchClasses } = useClassStore();

  const { classSubjects, fetchClassSubjects } = useClassSubjectStore();

  const termExamSlug = state?.slug || "";

  const session = getTermExamSession(state);

  const board = getTermExamBoard(state);

  useEffect(() => {
    if (!session || !board) {
      return;
    }

    fetchClasses({
      session,
      board,
    });
  }, [session, board, fetchClasses]);

  useEffect(() => {
    if (!Array.isArray(classes) || classes.length === 0) {
      setActiveClass("");
      setActiveClassSlug("");

      return;
    }

    const selectedClassExists = classes.some(
      (item) => item.slug === activeClassSlug,
    );

    if (selectedClassExists) {
      return;
    }

    const firstClass = classes[0];

    setActiveClass(firstClass.classTitle);

    setActiveClassSlug(firstClass.slug);
  }, [classes, activeClassSlug]);

  useEffect(() => {
    if (!activeClassSlug || !session || !board) {
      setSubjects([]);

      return;
    }

    fetchClassSubjects({
      session,
      board,
      classTitle: activeClass,
      classSlug: activeClassSlug,
    });
  }, [activeClassSlug, activeClass, session, board, fetchClassSubjects]);

  useEffect(() => {
    if (!termExamSlug || !activeClassSlug) {
      return;
    }

    fetchTermExamTimeTable(termExamSlug, activeClassSlug);
  }, [termExamSlug, activeClassSlug, fetchTermExamTimeTable]);

  useEffect(() => {
    const savedSubjects =
      configuration?.subjects || configuration?.timeTables || [];

    const mergedSubjects = mergeSavedTimeTable(classSubjects, savedSubjects);

    setSubjects(mergedSubjects);

    if (configuration) {
      setPublishResult(configuration.publishResult ? "Yes" : "No");
    } else {
      setPublishResult("");
    }
  }, [classSubjects, configuration]);

  const handleClassChange = (classItem) => {
    setActiveClass(classItem.classTitle);

    setActiveClassSlug(classItem.slug);

    setSubjects([]);
    setPublishResult("");
  };

  const handleChange = (id, name, value) => {
    setSubjects((previous) =>
      previous.map((item) =>
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
    if (!termExamSlug) {
      toast.error("Term exam information not found");

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

    const filledSubjects = subjects.filter(
      (item) =>
        item.max ||
        item.min ||
        item.date ||
        item.time ||
        item.duration ||
        item.questionPaper,
    );

    if (filledSubjects.length === 0) {
      toast.error("Please fill timetable details for at least one subject");

      return;
    }

    const incompleteSubject = filledSubjects.find(
      (item) =>
        !item.max ||
        item.min === "" ||
        !item.date ||
        !item.time ||
        !item.duration,
    );

    if (incompleteSubject) {
      toast.error(
        `Please complete timetable details for ${
          incompleteSubject.subject || "selected subject"
        }`,
      );

      return;
    }

    const payload = {
      termExamSlug,

      classSlug: activeClassSlug,

      publishResult: publishResult === "Yes",

      subjects: filledSubjects.map((item) => ({
        classSubjectSlug: item.classSubjectSlug,

        streamSlug: item.streamSlug || null,

        maxMarks: Number(item.max),

        minMarks: Number(item.min),

        examDate: item.date,

        examTime: item.time,

        duration: Number(item.duration),

        questionPaper: item.questionPaper || null,
      })),
    };

    const result = saveTermExamTimeTableSchema.safeParse(payload);

    if (!result.success) {
      const firstError = result.error.issues?.[0];

      toast.error(
        firstError?.message || "Please complete the selected subject details",
      );

      return;
    }

    await saveTermExamTimeTable(result.data);
  };

  const handleQuestionPaper = (item) => {
    console.log("Question paper subject:", item);
  };

  const downloadTimeTable = () => {
    window.print();
  };

  return (
    <div className="space-y-6 overflow-auto w-full">
      {/* Exam Info */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex justify-between">
        <div>
          <h2 className="text-xl text-white font-semibold">
            {getTermExamTitle(state)}
          </h2>

          <p className="text-gray-400 mt-3">Academic Year : {session}</p>

          <p className="text-gray-400">Board : {board}</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="bg-green-500 px-3 py-2 rounded-lg text-white">
              Start : {formatDisplayDate(getTermExamStartDate(state))}
            </span>

            <span className="bg-red-500 px-3 py-2 rounded-lg text-white">
              End : {formatDisplayDate(getTermExamEndDate(state))}
            </span>
          </div>

          <p className="text-gray-300">Status : {getTermExamStatus(state)}</p>
        </div>
      </div>

      {/* Classes */}

      <div className="bg-gray-900 border whitespace-nowrap border-gray-800 rounded-xl p-3 flex gap-4 overflow-auto custom-scrollbar">
        {classes?.map((classItem) => (
          <button
            key={classItem.slug}
            onClick={() => handleClassChange(classItem)}
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
          Time Table for {board} ({activeClass})
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
            disabled={submitLoading || loading || !activeClassSlug}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />

            {submitLoading ? "Saving..." : `Save Time Table For ${activeClass}`}
          </button>

          <button
            onClick={downloadTimeTable}
            className="bg-green-600 px-5 py-3 hover:bg-green-700 rounded-xl text-white flex items-center gap-2 cursor-pointer"
          >
            <Download size={18} />
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
                "Action",
              ].map((heading) => (
                <th key={heading} className="p-4 text-left text-gray-300">
                  {heading}
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
                    min="1"
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

                <td className="p-4">
                  <button
                    onClick={() => handleQuestionPaper(item)}
                    className="bg-blue-500 px-2 py-2 rounded-lg text-white hover:bg-blue-600 cursor-pointer"
                  >
                    <FileText size={17} />
                  </button>
                </td>
              </tr>
            ))}

            {!loading && subjects.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-400">
                  No subjects found for {activeClass || "selected class"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
