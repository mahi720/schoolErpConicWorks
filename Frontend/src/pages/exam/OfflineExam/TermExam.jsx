import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  ChartNoAxesColumn,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useTermExamTimeTableStore } from "../../../store/examManager/termExamTimeTable/termExamTimeTableStore";
import { useSessionStore } from "../../../store/master/session/sessionStore";
import { useBoardStore } from "../../../store/master/board/boardStore";
import { useExamTypeStore } from "../../../store/examManager/examType/examTypeStore";

import {
  createTermExamSchema,
  updateTermExamSchema,
} from "../../../validations/examManager/termExamTimeTable/termExamTimeTableValidation";

const initialFormData = {
  session: "",
  board: "",
  examTitle: "",
  startDate: "",
  endDate: "",
  examType: "",
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB");
};

const formatDateForInput = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
};

const getValidationErrors = (issues = []) => {
  return issues.reduce((errors, issue) => {
    const field = issue.path?.[0];

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }

    return errors;
  }, {});
};

export default function TermExam() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedSession, setSelectedSession] = useState("");

  const {
    termExams,
    loading,
    submitLoading,
    fetchTermExams,
    deleteTermExam,
    restoreTermExam,
  } = useTermExamTimeTableStore();

  const { sessions, fetchSessions } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    const params = {};

    if (selectedSession) {
      params.session = selectedSession;
    }

    fetchTermExams(params);
  }, [selectedSession, fetchTermExams]);

  const handleCreate = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setOpen(true);
  };

  const handleDeleteOrRestore = async (item) => {
    if (!item?.slug) return;

    if (item.isActive === false || item.status === "inactive") {
      await restoreTermExam(item.slug);

      return;
    }

    await deleteTermExam(item.slug);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Term Exams</h1>

        <div className="flex gap-4">
          <select
            value={selectedSession}
            onChange={(event) => setSelectedSession(event.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white cursor-pointer"
          >
            <option value="">Select Academic Year</option>

            {sessions?.map((session) => (
              <option key={session.slug} value={session.name}>
                {session.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white flex gap-2 items-center cursor-pointer"
          >
            <Plus size={18} />
            Create Exam
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SN.",
                "Academic Year",
                "Exam Title",
                "Schedule",
                // "Publish Result",
                "Board",
                "Type",
                "Status",
                "Action",
              ].map((heading) => (
                <th key={heading} className="p-4 text-left text-gray-300">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="p-10">
                  <div className="flex items-center justify-center gap-3 text-gray-300">
                    <Loader2 size={22} className="animate-spin" />
                    Loading term exams...
                  </div>
                </td>
              </tr>
            ) : termExams?.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-10 text-center text-gray-400">
                  No term exams found
                </td>
              </tr>
            ) : (
              termExams.map((item, index) => {
                const isInactive =
                  item.isActive === false || item.status === "inactive";

                return (
                  <tr
                    key={item.slug}
                    className="border-t border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="p-4 text-gray-300">{index + 1}.</td>

                    <td className="p-4 text-gray-300">
                      {item.sessionName || item.session?.name || "-"}
                    </td>

                    <td className="p-4 text-white">{item.examTitle || "-"}</td>

                    <td className="p-4">
                      <div className="flex gap-3">
                        <span className="bg-green-500 text-white px-4 whitespace-nowrap text-sm font-semibold py-1 rounded-lg">
                          Start : {formatDate(item.startDate)}
                        </span>

                        <span className="bg-red-500 text-white whitespace-nowrap px-4 text-sm font-semibold py-1 rounded-lg">
                          End : {formatDate(item.endDate)}
                        </span>
                      </div>
                    </td>

                    {/* <td className="p-4 text-gray-300">
                      {item.publishResult ? "Yes" : "No"}
                    </td> */}

                    <td className="p-4 text-gray-300">
                      {item.boardTitle || item.board?.title || "-"}
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {item.examTypeTitle || item.examType?.examType || "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-normal text-sm px-3 py-1 rounded-full ${
                          isInactive
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {isInactive ? "Inactive" : "Active"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit Exam"
                          disabled={isInactive || submitLoading}
                          className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          title="Manage Exam"
                          disabled={isInactive}
                          onClick={() =>
                            navigate("/exam/offline-exam/term-exam/exam-info", {
                              state: item,
                            })
                          }
                          className="bg-blue-500/20 p-2 rounded-lg hover:bg-blue-600/40 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChartNoAxesColumn size={17} />
                        </button>

                        <button
                          type="button"
                          title={isInactive ? "Restore Exam" : "Inactive Exam"}
                          disabled={submitLoading}
                          onClick={() => handleDeleteOrRestore(item)}
                          className="bg-red-500 p-2 rounded-lg hover:bg-red-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitLoading ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ExamModal
        open={open}
        close={() => {
          setOpen(false);
          setEditData(null);
        }}
        editData={editData}
      />
    </div>
  );
}

function ExamModal({ open, close, editData }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const { createTermExam, updateTermExam, submitLoading } =
    useTermExamTimeTableStore();

  const { sessions, fetchSessions } = useSessionStore();

  const { boards, fetchBoards } = useBoardStore();

  const { examTypes, fetchExamTypes } = useExamTypeStore();

  useEffect(() => {
    if (!open) return;

    fetchSessions();
    fetchBoards();
    fetchExamTypes();
  }, [open, fetchSessions, fetchBoards, fetchExamTypes]);

  useEffect(() => {
    if (!open) return;

    if (editData) {
      setFormData({
        session: editData.sessionName || editData.session?.name || "",

        board: editData.boardTitle || editData.board?.title || "",

        examTitle: editData.examTitle || "",

        startDate: formatDateForInput(editData.startDate),

        endDate: formatDateForInput(editData.endDate),

        examType: editData.examTypeTitle || editData.examType?.examType || "",
      });
    } else {
      setFormData(initialFormData);
    }

    setErrors({});
  }, [open, editData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    const schema = editData ? updateTermExamSchema : createTermExamSchema;

    const result = schema.safeParse(formData);

    if (!result.success) {
      const validationErrors = getValidationErrors(result.error.issues);

      setErrors(validationErrors);

      toast.error(
        result.error.issues?.[0]?.message || "Please fill all required fields",
      );

      return;
    }

    const payload = {
      session: result.data.session,
      board: result.data.board,
      examTitle: result.data.examTitle,
      startDate: result.data.startDate,
      endDate: result.data.endDate,
      examType: result.data.examType,
    };

    let success = false;

    if (editData?.slug) {
      success = await updateTermExam(editData.slug, payload);
    } else {
      success = await createTermExam(payload);
    }

    if (success) {
      setFormData(initialFormData);
      setErrors({});
      close();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-[90%] max-w-2xl">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {editData ? "Edit Exam" : "Create Exam"}
          </h2>

          <X
            onClick={submitLoading ? undefined : close}
            className={`text-gray-400 ${
              submitLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          />
        </div>

        {/* Body */}

        <div className="p-5 grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Academic Year
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              className={`bg-gray-800 border cursor-pointer rounded-xl p-3 text-white ${
                errors.session ? "border-red-500" : "border-gray-700"
              }`}
            >
              <option value="">Select Academic Year</option>

              {sessions?.map((session) => (
                <option key={session.slug} value={session.name}>
                  {session.name}
                </option>
              ))}
            </select>

            {errors.session && (
              <span className="text-red-400 text-sm">{errors.session}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Board
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="board"
              value={formData.board}
              onChange={handleChange}
              className={`bg-gray-800 border cursor-pointer rounded-xl p-3 text-white ${
                errors.board ? "border-red-500" : "border-gray-700"
              }`}
            >
              <option value="">Select Board</option>

              {boards?.map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
            </select>

            {errors.board && (
              <span className="text-red-400 text-sm">{errors.board}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Exam Title
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="examTitle"
              value={formData.examTitle}
              onChange={handleChange}
              placeholder="Exam Title"
              className={`bg-gray-800 border rounded-xl p-3 text-white ${
                errors.examTitle ? "border-red-500" : "border-gray-700"
              }`}
            />

            {errors.examTitle && (
              <span className="text-red-400 text-sm">{errors.examTitle}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Start Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`bg-gray-800 border rounded-xl p-3 text-white ${
                errors.startDate ? "border-red-500" : "border-gray-700"
              }`}
            />

            {errors.startDate && (
              <span className="text-red-400 text-sm">{errors.startDate}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              End Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`bg-gray-800 border rounded-xl p-3 text-white ${
                errors.endDate ? "border-red-500" : "border-gray-700"
              }`}
            />

            {errors.endDate && (
              <span className="text-red-400 text-sm">{errors.endDate}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Exam Type
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className={`bg-gray-800 cursor-pointer border rounded-xl p-3 text-white col-span-2 ${
                errors.examType ? "border-red-500" : "border-gray-700"
              }`}
            >
              <option value="">Select Exam Type</option>

              {examTypes?.map((examType) => (
                <option key={examType.slug} value={examType.examType}>
                  {examType.examType}
                </option>
              ))}
            </select>

            {errors.examType && (
              <span className="text-red-400 text-sm">{errors.examType}</span>
            )}
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={submitLoading}
            className="bg-red-500 px-5 py-2 rounded-lg text-white hover:bg-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading}
            className="bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600 text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading && <Loader2 size={18} className="animate-spin" />}

            {editData ? "Update Exam" : "Create Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}
