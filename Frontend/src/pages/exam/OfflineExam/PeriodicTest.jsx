import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, X, ChartNoAxesColumn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { usePeriodicTestStore } from "../../../store/examManager/periodicTestTimeTable/periodicTestTimeTableStore";
import { useSessionStore } from "../../../store/master/session/sessionStore";
import { useBoardStore } from "../../../store/master/board/boardStore";

import {
  createPeriodicTestSchema,
  updatePeriodicTestSchema,
} from "../../../validations/examManager/periodicTestTimeTable/periodicTestTimeTableValidation";

const initialFormData = {
  academicYear: "",
  board: "",
  testTitle: "",
  startDate: "",
  endDate: "",
};

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

const getSessionName = (item) => {
  return item.sessionName || item.session?.name || item.year || "";
};

const getBoardTitle = (item) => {
  return item.boardTitle || item.board?.title || item.board || "";
};

const getTestTitle = (item) => {
  return item.testTitle || item.title || "";
};

const getTestStatus = (item) => {
  const status = item.testStatus || "scheduled";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export default function PeriodicTest() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [selectedSession, setSelectedSession] = useState("");

  const {
    periodicTests,
    loading,
    submitLoading,
    fetchPeriodicTests,
    createPeriodicTest,
    updatePeriodicTest,
    deletePeriodicTest,
    restorePeriodicTest,
  } = usePeriodicTestStore();

  const { sessions, fetchSessions } = useSessionStore();

  const { boards, fetchBoards } = useBoardStore();

  useEffect(() => {
    fetchSessions();

    fetchBoards();
  }, [fetchSessions, fetchBoards]);

  useEffect(() => {
    fetchPeriodicTests({
      ...(selectedSession
        ? {
            session: selectedSession,
          }
        : {}),
    });
  }, [selectedSession, fetchPeriodicTests]);

  const filteredPeriodicTests = useMemo(() => {
    if (!selectedSession) {
      return periodicTests;
    }

    return periodicTests.filter(
      (item) => getSessionName(item) === selectedSession,
    );
  }, [periodicTests, selectedSession]);

  const handleCreateOpen = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEditOpen = (item) => {
    setEditData(item);
    setOpen(true);
  };

  const handleStatusChange = async (item) => {
    const isInactive = item.isActive === false || item.status === "inactive";

    if (isInactive) {
      await restorePeriodicTest(item.slug);

      return;
    }

    await deletePeriodicTest(item.slug);
  };

  const handleModalSuccess = async () => {
    setOpen(false);
    setEditData(null);

    await fetchPeriodicTests({
      ...(selectedSession
        ? {
            session: selectedSession,
          }
        : {}),
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">
          PERIODIC TEST / UNIT TEST
        </h2>

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
            onClick={handleCreateOpen}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white flex gap-2 items-center cursor-pointer"
          >
            <Plus size={18} />
            Create Test
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
                "Test Title",
                "Schedule",
                "Board",
                "Status",
                "Action",
              ].map((h) => (
                <th key={h} className="p-4 text-left text-gray-300">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredPeriodicTests.map((item, index) => {
              const isInactive =
                item.isActive === false || item.status === "inactive";

              return (
                <tr
                  key={item.slug}
                  className="border-t border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-4 text-gray-300">{index + 1}.</td>

                  <td className="p-4 text-gray-300">{getSessionName(item)}</td>

                  <td className="p-4 text-white">{getTestTitle(item)}</td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <span className="bg-green-500 text-white px-4 whitespace-nowrap text-sm font-semibold py-1 rounded-lg">
                        Start : {formatDisplayDate(item.startDate)}
                      </span>

                      <span className="bg-red-500 text-white whitespace-nowrap px-4 text-sm font-semibold py-1 rounded-lg">
                        End : {formatDisplayDate(item.endDate)}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-300">{getBoardTitle(item)}</td>

                  <td className="p-4">
                    <span className="bg-blue-500/20 text-blue-400 font-normal text-sm px-3 py-1 rounded-full">
                      {getTestStatus(item)}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditOpen(item)}
                        disabled={submitLoading}
                        title="Edit Exam"
                        className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        title="Manage Exam"
                        disabled={isInactive}
                        onClick={() =>
                          navigate(
                            "/exam/offline-exam/periodic-test/exam-info",
                            {
                              state: item,
                            },
                          )
                        }
                        className="bg-blue-500/20 p-2 rounded-lg hover:bg-blue-600/40 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChartNoAxesColumn size={17} />
                      </button>

                      <button
                        onClick={() => handleStatusChange(item)}
                        disabled={submitLoading}
                        title={isInactive ? "Restore Exam" : "Inactive Exam"}
                        className={`p-2 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          isInactive
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!loading && filteredPeriodicTests.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  No periodic tests found
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
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
        onSuccess={handleModalSuccess}
        editData={editData}
        sessions={sessions}
        boards={boards}
        submitLoading={submitLoading}
        createPeriodicTest={createPeriodicTest}
        updatePeriodicTest={updatePeriodicTest}
      />
    </div>
  );
}

function ExamModal({
  open,
  close,
  onSuccess,
  editData,
  sessions,
  boards,
  submitLoading,
  createPeriodicTest,
  updatePeriodicTest,
}) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editData) {
      setFormData({
        academicYear: getSessionName(editData),
        board: getBoardTitle(editData),
        testTitle: getTestTitle(editData),
        startDate: formatInputDate(editData.startDate),
        endDate: formatInputDate(editData.endDate),
      });

      return;
    }

    setFormData(initialFormData);
  }, [open, editData]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      session: formData.academicYear,

      board: formData.board,

      testTitle: formData.testTitle,

      startDate: formData.startDate,

      endDate: formData.endDate,

      testStatus: editData?.testStatus || "scheduled",
    };

    const schema = editData
      ? updatePeriodicTestSchema
      : createPeriodicTestSchema;

    const result = schema.safeParse(payload);

    if (!result.success) {
      toast.error(
        result.error.issues?.[0]?.message || "Please fill all required fields",
      );

      return;
    }

    let success = false;

    if (editData) {
      success = await updatePeriodicTest(editData.slug, result.data);
    } else {
      success = await createPeriodicTest(result.data);
    }

    if (success) {
      await onSuccess();
    }
  };

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
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
            >
              <option value="">Select Academic Year</option>

              {sessions?.map((session) => (
                <option key={session.slug} value={session.name}>
                  {session.name}
                </option>
              ))}
            </select>
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
              className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
            >
              <option value="">Select Board</option>

              {boards?.map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Test Title
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="testTitle"
              value={formData.testTitle}
              onChange={handleChange}
              placeholder="Exam Title"
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
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
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
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
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button
            onClick={close}
            disabled={submitLoading}
            className="bg-red-500 px-5 py-2 rounded-lg text-white hover:bg-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            className="bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading
              ? editData
                ? "Updating..."
                : "Creating..."
              : editData
                ? "Update Exam"
                : "Create Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
