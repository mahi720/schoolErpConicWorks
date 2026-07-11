import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Layers,
  FolderTree,
  Loader2,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import AddClassModal from "../../components/classes/AddClassModal";
import UpdateTimingModal from "../../components/classes/UpdateTimingModal";
import ManageStreamModal from "../../components/classes/ManageStreamModal";
import ManageSectionModal from "../../components/classes/ManageSectionModal";
import MapStreamModal from "../../components/classes/MapStreamModal";
import MapSectionModal from "../../components/classes/MapSectionModal";
import UpdateClassTeacherModal from "../../components/classes/UpdateClassTeacherModal";

import { useClassStore } from "../../store/master/class/classStore";
import { useBoardStore } from "../../store/master/board/boardStore";
import { useSessionStore } from "../../store/master/session/sessionStore";

export default function Classes() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editClass, setEditClass] = useState(null);

  const [showTimingModal, setShowTimingModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showMapStream, setShowMapStream] = useState(false);
  const [showMapSection, setShowMapSection] = useState(false);
  const [showClassTeacherModal, setShowClassTeacherModal] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);

  const [activeBoardId, setActiveBoardId] = useState("");
  const [activeSessionId, setActiveSessionId] = useState("");

  const { classes, loading, fetchClasses, deleteClass, restoreClass } =
    useClassStore();

  const { boards, fetchBoards } = useBoardStore();
  const { sessions, fetchSessions } = useSessionStore();

  useEffect(() => {
    fetchBoards();
    fetchSessions();
  }, [fetchBoards, fetchSessions]);

  useEffect(() => {
    if (boards.length > 0 && !activeBoardId) {
      // setActiveBoardId(String(boards[0].slug));
      setActiveBoardId(String(boards[0].title));
    }
  }, [boards, activeBoardId]);

  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      const activeSession =
        sessions.find((session) => session.status === "active") || sessions[0];

      // setActiveSessionId(String(activeSession.slug));
      setActiveSessionId(String(activeSession.name));
    }
  }, [sessions, activeSessionId]);

  useEffect(() => {
    if (activeBoardId) {
      fetchClasses({
        board: activeBoardId,
        session: activeSessionId,
      });

      setSelectedRows([]);
    }
  }, [activeBoardId, activeSessionId, fetchClasses]);

  const openAddModal = () => {
    setEditClass(null);
    setShowAddModal(true);
  };

  const openEditModal = (row) => {
    setEditClass(row);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setEditClass(null);
    setShowAddModal(false);
  };

  const formatTime12Hr = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const columns = [
    {
      key: "checkbox",
      label: (
        <input
          type="checkbox"
          checked={classes.length > 0 && selectedRows.length === classes.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(classes.map((item) => item.slug));
            } else {
              setSelectedRows([]);
            }
          }}
          className="cursor-pointer"
        />
      ),
      render: (value, row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.slug)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows((prev) => [...prev, row.slug]);
            } else {
              setSelectedRows((prev) =>
                prev.filter((slug) => slug !== row.slug),
              );
            }
          }}
          className="cursor-pointer"
        />
      ),
    },
    {
      key: "sn",
      label: "SN.",
      render: (v, row, index) => index + 1,
    },
    {
      key: "classTitle",
      label: "Class",
    },
    {
      key: "classType",
      label: "Class Type",
      render: (value) => value || "-",
    },
    {
      key: "streams",
      label: "Streams",
      render: (value) => (value?.length ? value.join(", ") : "-"),
    },
    {
      key: "sections",
      label: "Sections",
      render: (value) =>
        value?.length ? (
          <div className="flex flex-wrap gap-2">
            {value.map((section) => (
              <span
                key={section}
                className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold backdrop-blur-sm"
              >
                {section}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">-</span>
        ),
    },
    {
      key: "classTeachers",
      label: "Class Teacher",
      render: (value) =>
        value?.length ? value.map((item) => item.name).join(", ") : "-",
    },
    {
      key: "timing",
      label: "Class Timing",
      render: (value, row) => {
        if (!row.startTime || !row.endTime) {
          return <span className="text-gray-500">-</span>;
        }

        return (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center w-fit px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              🟢 Start : {formatTime12Hr(row.startTime)}
            </span>

            <span className="inline-flex items-center w-fit px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              🔴 End : {formatTime12Hr(row.endTime)}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value, row) => {
        const isActive = row.isActive !== false && value !== "inactive";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              isActive
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {isActive ? "active" : "inactive"}
          </span>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      render: (value, row) => {
        const isInactive = row.isActive === false || row.status === "inactive";

        return (
          <div className="flex items-center gap-2 cursor-pointer">
            <button
              onClick={() => openEditModal(row)}
              className="p-2 rounded-lg cursor-pointer bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              title="Edit"
            >
              <Pencil size={16} />
            </button>

            <button
              // onClick={() => setShowMapStream(true)}
              onClick={() => {
                setSelectedClass(row);
                setShowMapStream(true);
              }}
              className="p-2 rounded-lg cursor-pointer bg-green-500/20 text-green-400 hover:bg-green-500/30"
              title="Manage Stream"
            >
              <Layers size={16} />
            </button>

            <button
              // onClick={() => setShowMapSection(true)}
              onClick={() => {
                setSelectedClass(row);
                setShowMapSection(true);
              }}
              className="p-2 rounded-lg cursor-pointer bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
              title="Manage Section"
            >
              <FolderTree size={16} />
            </button>

            {isInactive ? (
              <button
                onClick={async () => {
                  const confirmRestore = window.confirm(
                    `Are you sure you want to restore ${row.classTitle}?`,
                  );

                  if (!confirmRestore) return;

                  await restoreClass(row.slug);
                }}
                className="p-2 rounded-lg bg-emerald-500/20 cursor-pointer text-emerald-400 hover:bg-emerald-500/30"
                title="Restore"
              >
                <RotateCcw size={16} />
              </button>
            ) : (
              <button
                onClick={async () => {
                  const confirmDelete = window.confirm(
                    `Are you sure you want to delete ${row.classTitle}?`,
                  );

                  if (!confirmDelete) return;

                  await deleteClass(row.slug);
                }}
                className="p-2 rounded-lg bg-red-500/20 cursor-pointer text-red-400 hover:bg-red-500/30"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const activeBoard = boards.find((board) => board.title === activeBoardId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
          {boards.map((board) => (
            <button
              key={board.slug}
              onClick={() => setActiveBoardId(board.title)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                String(activeBoardId) === String(board.title)
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {board.title}
            </button>
          ))}
        </div>

        <select
          value={activeSessionId}
          onChange={(e) => setActiveSessionId(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none cursor-pointer"
        >
          {sessions.map((session) => (
            <option key={session.slug} value={session.name}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Classes</h1>
          <p className="text-gray-400 mt-1">Manage school classes</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openAddModal}
            disabled={!activeBoardId}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Add Class
          </button>

          <button
            onClick={() => setShowSectionModal(true)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition"
          >
            <Plus size={18} />
            Add Section
          </button>

          <button
            onClick={() => setShowStreamModal(true)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
          >
            <Plus size={18} />
            Add Stream
          </button>

          <button
            disabled={selectedRows.length === 0}
            onClick={() => setShowClassTeacherModal(true)}
            className={`px-4 py-2 rounded-xl ${
              selectedRows.length === 0
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 text-white cursor-pointer"
            }`}
          >
            Update Class Teacher
          </button>

          <button
            disabled={selectedRows.length !== 1}
            onClick={() => {
              const classItem = classes.find(
                (item) => item.slug === selectedRows[0],
              );
              setSelectedClass(classItem);
              setShowTimingModal(true);
            }}
            className={`px-4 py-2 rounded-xl ${
              selectedRows.length !== 1
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-rose-600 text-white cursor-pointer"
            }`}
          >
            Update Class Timing
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-300">
          <Loader2 className="animate-spin mr-2" size={22} />
          Loading classes...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={classes}
          searchFields={["classTitle", "classType"]}
          title={`Classes of ${activeBoard?.title || "Board"}`}
          rowKey="slug"
        />
      )}

      <AddClassModal
        isOpen={showAddModal}
        onClose={closeAddModal}
        editClass={editClass}
        board={activeBoardId}
      />

      <UpdateTimingModal
        isOpen={showTimingModal}
        onClose={() => setShowTimingModal(false)}
        board={activeBoardId}
        session={activeSessionId}
        classData={selectedClass}
        onSaved={() =>
          fetchClasses({
            board: activeBoardId,
            session: activeSessionId,
          })
        }
      />

      <UpdateClassTeacherModal
        isOpen={showClassTeacherModal}
        onClose={() => setShowClassTeacherModal(false)}
      />

      <ManageStreamModal
        isOpen={showStreamModal}
        onClose={() => setShowStreamModal(false)}
        board={activeBoardId}
      />

      <ManageSectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        board={activeBoardId}
      />

      <MapStreamModal
        isOpen={showMapStream}
        onClose={() => setShowMapStream(false)}
        board={activeBoardId}
        session={activeSessionId}
        classData={selectedClass}
        onSaved={() =>
          fetchClasses({
            board: activeBoardId,
            session: activeSessionId,
          })
        }
      />

      <MapSectionModal
        isOpen={showMapSection}
        onClose={() => setShowMapSection(false)}
        board={activeBoardId}
        session={activeSessionId}
        classData={selectedClass}
        onSaved={() =>
          fetchClasses({
            board: activeBoardId,
            session: activeSessionId,
          })
        }
      />
    </div>
  );
}
