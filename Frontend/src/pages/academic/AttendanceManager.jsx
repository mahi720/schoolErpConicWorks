import React, { useEffect, useMemo, useState } from "react";

import {
  Calendar,
  Save,
  LockKeyhole,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import LockAttendanceModal from "../../components/academics/LockAttendanceModal/LockAttendanceModal";

import { useSessionStore } from "../../store/master/session/sessionStore";
import { useBoardStore } from "../../store/master/board/boardStore";
import { useClassStore } from "../../store/master/class/classStore";

import { useStudentAttendanceStore } from "../../store/academic/studentAttendance/studentAttendanceStore";

import {
  attendanceStudentFilterSchema,
  ATTENDANCE_STATUS_OPTIONS,
} from "../../validations/academic/studentAttendance/studentAttendanceValidation";

const formatDateForInput = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getFormattedRollNumber = (attendanceRecord) => {
  const prefix = attendanceRecord.rollNumberPrefix || "";

  const rollNumber = attendanceRecord.rollNumber;

  if (rollNumber === null || rollNumber === undefined) {
    return "-";
  }

  return `${prefix}${rollNumber}`;
};

const getSectionTitle = (section) => {
  if (!section) {
    return "-";
  }

  if (typeof section === "string") {
    return section.trim() || "-";
  }

  return (
    section.sectionTitle?.trim() ||
    section.title?.trim() ||
    section.name?.trim() ||
    "-"
  );
};

const getStreamTitle = (stream) => {
  if (!stream) {
    return "N/A";
  }

  if (typeof stream === "string") {
    return stream.trim() || "N/A";
  }

  return (
    stream.streamTitle?.trim() ||
    stream.title?.trim() ||
    stream.name?.trim() ||
    "N/A"
  );
};

export default function AttendanceManager() {
  const navigate = useNavigate();

  const today = formatDateForInput(new Date());

  const [lockModal, setLockModal] = useState(false);

  const [selected, setSelected] = useState([]);

  const [attendanceChanges, setAttendanceChanges] = useState({});

  const [bulkAttendance, setBulkAttendance] = useState("");

  const [lockLoading, setLockLoading] = useState(false);

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { boards, loading: boardLoading, fetchBoards } = useBoardStore();

  const { classes, loading: classLoading, fetchClasses } = useClassStore();

  const {
    attendanceStudents,
    loading,
    submitLoading,

    fetchAttendanceStudents,
    markAttendance,
    lockAttendance,

    clearAttendanceStudents,
  } = useStudentAttendanceStore();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceStudentFilterSchema),

    defaultValues: {
      session: "",
      board: "",
      classTitle: "",
      sectionSlug: "",
      streamSlug: "",
      attendanceDate: today,
    },
  });

  const selectedSession = watch("session");

  const selectedBoard = watch("board");

  const selectedClass = watch("classTitle");

  const selectedSectionSlug = watch("sectionSlug");

  const selectedStreamSlug = watch("streamSlug");

  const attendanceDate = watch("attendanceDate");

  useEffect(() => {
    fetchSessions();

    fetchBoards();

    clearAttendanceStudents();

    return () => {
      clearAttendanceStudents();
    };
  }, [fetchSessions, fetchBoards, clearAttendanceStudents]);

  useEffect(() => {
    setValue("classTitle", "");

    setValue("sectionSlug", "");

    setValue("streamSlug", "");

    setSelected([]);

    setAttendanceChanges({});

    setBulkAttendance("");

    clearAttendanceStudents();

    if (!selectedSession || !selectedBoard) {
      return;
    }

    fetchClasses({
      session: selectedSession,
      board: selectedBoard,
    });
  }, [
    selectedSession,
    selectedBoard,
    fetchClasses,
    clearAttendanceStudents,
    setValue,
  ]);

  useEffect(() => {
    setValue("sectionSlug", "");

    setValue("streamSlug", "");

    setSelected([]);

    setAttendanceChanges({});

    setBulkAttendance("");

    clearAttendanceStudents();
  }, [selectedClass, clearAttendanceStudents, setValue]);

  const selectedClassData = useMemo(() => {
    return classes.find((item) => item.classTitle === selectedClass);
  }, [classes, selectedClass]);

  const sectionOptions = useMemo(() => {
    const sectionMap = new Map();

    attendanceStudents.forEach((attendanceRecord) => {
      const section = attendanceRecord.section;

      if (!section?.slug) {
        return;
      }

      sectionMap.set(section.slug, {
        slug: section.slug,
        sectionTitle: section.sectionTitle,
      });
    });

    return Array.from(sectionMap.values());
  }, [attendanceStudents]);

  const streamOptions = useMemo(() => {
    const streamMap = new Map();

    attendanceStudents.forEach((attendanceRecord) => {
      const stream = attendanceRecord.stream;

      if (!stream?.slug) {
        return;
      }

      streamMap.set(stream.slug, {
        slug: stream.slug,
        streamTitle: stream.streamTitle,
      });
    });

    return Array.from(streamMap.values());
  }, [attendanceStudents]);

  const attendanceFiltersReady = Boolean(
    selectedSession && selectedBoard && selectedClass && attendanceDate,
  );

  const loadAttendance = async () => {
    if (!attendanceFiltersReady) {
      clearAttendanceStudents();

      return false;
    }

    setSelected([]);

    setAttendanceChanges({});

    setBulkAttendance("");

    return fetchAttendanceStudents({
      session: selectedSession,

      board: selectedBoard,

      classTitle: selectedClass,

      sectionSlug: selectedSectionSlug || undefined,

      streamSlug: selectedStreamSlug || undefined,

      attendanceDate,
    });
  };

  useEffect(() => {
    if (!attendanceFiltersReady) {
      return;
    }

    loadAttendance();
  }, [selectedSession, selectedBoard, selectedClass, attendanceDate]);

  const filteredAttendanceStudents = useMemo(() => {
    return attendanceStudents.filter((attendanceRecord) => {
      const sectionMatched =
        !selectedSectionSlug ||
        attendanceRecord.section?.slug === selectedSectionSlug;

      const streamMatched =
        !selectedStreamSlug ||
        attendanceRecord.stream?.slug === selectedStreamSlug;

      return sectionMatched && streamMatched;
    });
  }, [attendanceStudents, selectedSectionSlug, selectedStreamSlug]);

  const getStudentAttendanceStatus = (attendanceRecord) => {
    const mappingSlug = attendanceRecord.academicMappingSlug;

    if (Object.prototype.hasOwnProperty.call(attendanceChanges, mappingSlug)) {
      return attendanceChanges[mappingSlug];
    }

    return attendanceRecord.attendance?.attendanceStatus || "";
  };

  const isStudentLocked = (attendanceRecord) => {
    return Boolean(attendanceRecord.attendance?.isLocked);
  };

  const selectableStudents = useMemo(() => {
    return attendanceStudents.filter((item) => !isStudentLocked(item));
  }, [attendanceStudents]);

  const allSelected =
    selectableStudents.length > 0 &&
    selectableStudents.every((item) =>
      selected.includes(item.academicMappingSlug),
    );

  const toggleSelect = (academicMappingSlug) => {
    setSelected((previous) => {
      if (previous.includes(academicMappingSlug)) {
        return previous.filter((item) => item !== academicMappingSlug);
      }

      return [...previous, academicMappingSlug];
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);

      setBulkAttendance("");

      return;
    }

    setSelected(selectableStudents.map((item) => item.academicMappingSlug));
  };

  const handleSingleAttendanceChange = (
    academicMappingSlug,
    attendanceStatus,
  ) => {
    const currentRecord = attendanceStudents.find(
      (item) => item.academicMappingSlug === academicMappingSlug,
    );

    if (!currentRecord || isStudentLocked(currentRecord)) {
      return;
    }

    setAttendanceChanges((previous) => {
      const updated = {
        ...previous,
      };

      const savedStatus = currentRecord.attendance?.attendanceStatus || "";

      if (attendanceStatus === savedStatus) {
        delete updated[academicMappingSlug];

        return updated;
      }

      updated[academicMappingSlug] = attendanceStatus;

      return updated;
    });
  };

  const handleBulkAttendance = (value) => {
    setBulkAttendance(value);

    if (!value) {
      return;
    }

    setAttendanceChanges((previous) => {
      const updated = {
        ...previous,
      };

      selected.forEach((academicMappingSlug) => {
        const currentRecord = attendanceStudents.find(
          (item) => item.academicMappingSlug === academicMappingSlug,
        );

        if (!currentRecord || isStudentLocked(currentRecord)) {
          return;
        }

        const savedStatus = currentRecord.attendance?.attendanceStatus || "";

        if (value === savedStatus) {
          delete updated[academicMappingSlug];
        } else {
          updated[academicMappingSlug] = value;
        }
      });

      return updated;
    });
  };

  const handleSaveAttendance = async () => {
    if (!attendanceFiltersReady) {
      toast.error("Please select attendance filters");

      return;
    }

    const students = Object.entries(attendanceChanges)
      .filter(([academicMappingSlug, attendanceStatus]) => {
        const attendanceRecord = attendanceStudents.find(
          (item) => item.academicMappingSlug === academicMappingSlug,
        );

        return (
          attendanceRecord &&
          !isStudentLocked(attendanceRecord) &&
          attendanceStatus
        );
      })
      .map(([academicMappingSlug, attendanceStatus]) => ({
        academicMappingSlug,
        attendanceStatus,
      }));

    if (!students.length) {
      toast.error("Please mark or change attendance first");

      return;
    }

    const success = await markAttendance({
      attendanceDate,

      students,

      remarks: "Attendance saved from attendance manager",
    });

    if (!success) {
      return;
    }

    setAttendanceChanges({});

    setSelected([]);

    setBulkAttendance("");

    await loadAttendance();
  };

  const unlockedSavedAttendances = useMemo(() => {
    return attendanceStudents.filter(
      (item) =>
        item.attendance?.daySlug &&
        !item.attendance?.isLocked &&
        item.attendance?.isActive !== false,
    );
  }, [attendanceStudents]);

  const unsavedAttendanceStudents = useMemo(() => {
    return attendanceStudents.filter((item) => !item.attendance?.daySlug);
  }, [attendanceStudents]);

  const allAttendanceLocked =
    attendanceStudents.length > 0 &&
    attendanceStudents.every(
      (item) => item.attendance?.daySlug && item.attendance?.isLocked,
    );

  const handleOpenLockModal = () => {
    if (!attendanceStudents.length) {
      toast.error("No attendance records found");

      return;
    }

    if (Object.keys(attendanceChanges).length) {
      toast.error("Please save pending attendance changes before locking");

      return;
    }

    if (unsavedAttendanceStudents.length) {
      toast.error(
        `Please save attendance for all students first. ${unsavedAttendanceStudents.length} student attendance is not saved`,
      );

      return;
    }

    if (!unlockedSavedAttendances.length) {
      toast.error("Attendance is already locked");

      return;
    }

    setLockModal(true);
  };

  const handleConfirmLock = async (remarks) => {
    if (!unlockedSavedAttendances.length) {
      toast.error("No unlocked attendance found");

      return;
    }

    try {
      setLockLoading(true);

      for (const attendanceRecord of unlockedSavedAttendances) {
        const daySlug = attendanceRecord.attendance?.daySlug;

        if (!daySlug) {
          continue;
        }

        const success = await lockAttendance(daySlug, {
          remarks: remarks || `Attendance locked for ${attendanceDate}`,
        });

        if (!success) {
          return;
        }
      }

      setLockModal(false);

      setSelected([]);

      setAttendanceChanges({});

      setBulkAttendance("");

      await loadAttendance();
    } finally {
      setLockLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white">Attendance Manager</h1>

          <p className="mt-2 text-gray-400">
            Save attendance first, then lock it to prevent further editing.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 flex-1 xl:justify-end">
          <div className="min-w-[180px]">
            <select
              {...register("session")}
              disabled={sessionLoading}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {sessionLoading ? "Loading..." : "Select Acd. Year"}
              </option>

              {sessions.map((session) => (
                <option key={session.slug} value={session.name}>
                  {session.name}
                </option>
              ))}
            </select>

            {errors.session && (
              <p className="mt-1 text-sm text-red-400">
                {errors.session.message}
              </p>
            )}
          </div>

          <div className="min-w-[180px]">
            <select
              {...register("board")}
              disabled={boardLoading}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {boardLoading ? "Loading..." : "Select Board"}
              </option>

              {boards.map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
            </select>

            {errors.board && (
              <p className="mt-1 text-sm text-red-400">
                {errors.board.message}
              </p>
            )}
          </div>

          <div className="min-w-[180px]">
            <select
              {...register("classTitle")}
              disabled={!selectedSession || !selectedBoard || classLoading}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {classLoading ? "Loading..." : "Select Class"}
              </option>

              {classes.map((classItem) => (
                <option key={classItem.slug} value={classItem.classTitle}>
                  {classItem.classTitle}
                </option>
              ))}
            </select>

            {errors.classTitle && (
              <p className="mt-1 text-sm text-red-400">
                {errors.classTitle.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/academic/attendance/daily-attendance-report")
              }
              className="px-5 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white whitespace-nowrap cursor-pointer"
            >
              Daily Report
            </button>

            <button
              type="button"
              onClick={() => navigate("/academic/attendance/attendance-report")}
              className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white whitespace-nowrap cursor-pointer"
            >
              View Report
            </button>
          </div>
        </div>
      </div>

      {Boolean(selectedSession && selectedBoard && selectedClass) && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Attendance Date
            </label>

            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="date"
                {...register("attendanceDate")}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-3 text-white cursor-pointer"
              />
            </div>

            {errors.attendanceDate && (
              <p className="mt-1 text-sm text-red-400">
                {errors.attendanceDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Bulk Attendance
            </label>

            <select
              value={bulkAttendance}
              disabled={selected.length === 0 || allAttendanceLocked}
              onChange={(event) => handleBulkAttendance(event.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Mark Attendance</option>

              {ATTENDANCE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            {/* <label className="block text-sm text-gray-400 mb-2">Stream</label> */}

            <div>
              <label className="block text-sm text-gray-400 mb-2">Stream</label>

              <select
                {...register("streamSlug")}
                disabled={!streamOptions.length}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Streams</option>

                {streamOptions.map((stream) => (
                  <option key={stream.slug} value={stream.slug}>
                    {stream.streamTitle?.trim() || "N/A"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Section</label>

            <div>
              {/* <label className="block text-sm text-gray-400 mb-2">
                Section
              </label> */}

              <select
                {...register("sectionSlug")}
                disabled={!sectionOptions.length}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Sections</option>

                {sectionOptions.map((section) => (
                  <option key={section.slug} value={section.slug}>
                    {section.sectionTitle?.trim() || "-"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={
              lockLoading ||
              loading ||
              !attendanceStudents.length ||
              allAttendanceLocked
            }
            onClick={handleOpenLockModal}
            className="mt-auto h-[50px] bg-amber-600 rounded-xl text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {lockLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : allAttendanceLocked ? (
              <CheckCircle2 size={18} />
            ) : (
              <LockKeyhole size={18} />
            )}

            {lockLoading
              ? "Locking..."
              : allAttendanceLocked
                ? "Attendance Locked"
                : "Lock Attendance"}
          </button>

          <button
            type="button"
            disabled={
              submitLoading ||
              lockLoading ||
              !Object.keys(attendanceChanges).length
            }
            onClick={handleSaveAttendance}
            className="mt-auto h-[50px] bg-green-600 rounded-xl text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {submitLoading ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 text-indigo-400">
          <Loader2 className="animate-spin" />

          <span>Loading attendance...</span>
        </div>
      )}

      {/* {attendanceStudents.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="text-gray-400">
            <span className="text-white font-semibold">
              {attendanceStudents.length}
            </span>{" "}
            students found
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-indigo-500/15 text-indigo-400">
              Pending changes: {Object.keys(attendanceChanges).length}
            </span>

            <span className="px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400">
              Locked:{" "}
              {
                attendanceStudents.filter((item) => item.attendance?.isLocked)
                  .length
              }
            </span>
          </div>
        </div>
      )} */}

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="max-h-[65vh] overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full min-w-[1150px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    disabled={!selectableStudents.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                  />
                </th>

                {[
                  "SN.",
                  "Roll",
                  "Adm No",
                  "Student",
                  "Stream",
                  "Section",
                  "Attendance",
                  "Status",
                  "Total Attendance",
                  "Total Present",
                  "Avg Attendance",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="p-4 text-gray-300 text-left whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={26} className="py-7 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-400" />

                    <p className="mt-3 text-gray-400">Loading attendance...</p>
                  </td>
                </tr>
              ) : !attendanceFiltersReady ? (
                <tr>
                  <td colSpan={26} className="py-7 text-center text-gray-400">
                    Select session, board and class to view attendance.
                  </td>
                </tr>
              ) : !attendanceStudents.length ? (
                <tr>
                  <td colSpan={26} className="py-7 text-center text-gray-400">
                    No students found for selected filters.
                  </td>
                </tr>
              ) : (
                filteredAttendanceStudents.map((attendanceRecord, index) => {
                  const attendanceStatus =
                    getStudentAttendanceStatus(attendanceRecord);

                  const isLocked = isStudentLocked(attendanceRecord);

                  const mappingSlug = attendanceRecord.academicMappingSlug;

                  return (
                    <tr
                      key={mappingSlug}
                      className={`border-t border-gray-800 ${
                        isLocked ? "bg-amber-500/5" : "hover:bg-gray-800/40"
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(mappingSlug)}
                          disabled={isLocked}
                          onChange={() => toggleSelect(mappingSlug)}
                          className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </td>

                      <td className="p-4 text-white">{index + 1}.</td>

                      <td className="p-4 text-white whitespace-nowrap">
                        {getFormattedRollNumber(attendanceRecord)}
                      </td>

                      <td className="p-4 text-white whitespace-nowrap">
                        {attendanceRecord.student?.admissionNumber || "-"}
                      </td>

                      <td className="p-4 text-white whitespace-nowrap">
                        {/* <div className="flex items-center gap-3"> */}
                        {/* {attendanceRecord.student?.profileImage ? (
                            <img
                              src={attendanceRecord.student.profileImage}
                              alt={attendanceRecord.student.studentName}
                              className="w-10 h-10 rounded-full object-cover border border-gray-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                              {attendanceRecord.student?.studentName?.[0]?.toUpperCase() ||
                                "S"}
                            </div>
                          )} */}

                        {/* <div> */}
                        <p className="font-medium">
                          {attendanceRecord.student?.studentName || "-"}
                        </p>

                        {/* <p className="text-xs text-gray-500">
                              {attendanceRecord.student?.fatherName || ""}
                            </p> */}
                        {/* </div> */}
                        {/* </div> */}
                      </td>

                      <td className="p-4 text-indigo-400 whitespace-nowrap">
                        {getStreamTitle(attendanceRecord.stream)}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {getSectionTitle(attendanceRecord.section)}
                      </td>

                      <td className="p-4">
                        <select
                          value={attendanceStatus}
                          disabled={isLocked}
                          onChange={(event) =>
                            handleSingleAttendanceChange(
                              mappingSlug,
                              event.target.value,
                            )
                          }
                          className={`min-w-[120px] border rounded-xl p-2 text-white ${
                            isLocked
                              ? "bg-gray-900 border-gray-800 opacity-60 cursor-not-allowed"
                              : "bg-gray-800 border-gray-700 cursor-pointer"
                          }`}
                        >
                          <option value="">Not Marked</option>

                          {ATTENDANCE_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-amber-500/15 text-amber-400">
                            <LockKeyhole size={13} />
                            Locked
                          </span>
                        ) : attendanceRecord.attendance?.daySlug ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs bg-green-500/15 text-green-400">
                            Saved
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs bg-gray-500/15 text-gray-400">
                            Not Saved
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {getSectionTitle(
                          attendanceRecord.student.totalWorkingDays,
                        )}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {getSectionTitle(attendanceRecord.totalPresent)}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {getSectionTitle(attendanceRecord.attendancePercentage)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {attendanceStudents.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Attendance Date</p>

            <p className="mt-1 text-white font-medium">{attendanceDate}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Pending Changes</p>

            <p className="mt-1 text-indigo-400 font-medium">
              {Object.keys(attendanceChanges).length}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Selected Students</p>

            <p className="mt-1 text-white font-medium">{selected.length}</p>
          </div>
        </div>
      )}

      <LockAttendanceModal
        open={lockModal}
        close={() => {
          if (!lockLoading) {
            setLockModal(false);
          }
        }}
        loading={lockLoading}
        attendanceDate={attendanceDate}
        attendanceCount={unlockedSavedAttendances.length}
        onConfirm={handleConfirmLock}
      />
    </div>
  );
}
