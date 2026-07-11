import React, { useEffect, useState } from "react";
import BoardTabs from "../../components/subjects/BoardTabs";
import ClassTabs from "../../components/subjects/ClassTabs";
import SubjectTable from "../../components/subjects/SubjectTable";
import AddSubjectModal from "../../components/subjects/AddSubjectModal";
import AddSubjectToClassModal from "../../components/subjects/AddSubjectToClassModal";
import ClassSubjectTable from "../../components/subjects/ClassSubjectTable";

import { useBoardStore } from "../../store/master/board/boardStore";
import { useSessionStore } from "../../store/master/session/sessionStore";
import { useClassStore } from "../../store/master/class/classStore";
import { useSubjectStore } from "../../store/master/subject/subjectStore";

export default function Subjects() {
  const [showAdd, setShowAdd] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [activeBoard, setActiveBoard] = useState("");
  const [activeSession, setActiveSession] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Subject");

  const { boards, fetchBoards } = useBoardStore();
  const { sessions, fetchSessions } = useSessionStore();
  const { classes, fetchClasses } = useClassStore();

  const { subjects, fetchSubjects } = useSubjectStore();
  const [editSubject, setEditSubject] = useState(null);

  // const { fetchSubjects } = useSubjectStore();

  useEffect(() => {
    fetchBoards();
    fetchSessions();
  }, [fetchBoards, fetchSessions]);

  useEffect(() => {
    if (activeBoard) {
      fetchSubjects({ board: activeBoard });
    }
  }, [activeBoard, fetchSubjects]);

  useEffect(() => {
    if (boards.length > 0 && !activeBoard) {
      setActiveBoard(boards[0].title);
    }
  }, [boards, activeBoard]);

  useEffect(() => {
    if (sessions.length > 0 && !activeSession) {
      const currentSession =
        sessions.find((item) => item.status === "active") || sessions[0];

      setActiveSession(currentSession.name);
    }
  }, [sessions, activeSession]);

  useEffect(() => {
    if (activeBoard && activeSession) {
      fetchClasses({
        board: activeBoard,
        session: activeSession,
      });

      setSelectedClass("All Subject");
    }
  }, [activeBoard, activeSession, fetchClasses]);

  const classTabs = [
    {
      slug: "all-subject",
      classTitle: "All Subject",
    },
    ...classes,
  ];

  const openAddSubject = () => {
    setEditSubject(null);
    setShowAdd(true);
  };

  const openEditSubject = (subject) => {
    setEditSubject(subject);
    setShowAdd(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <BoardTabs
          boards={boards}
          activeBoard={activeBoard}
          setActiveBoard={setActiveBoard}
        />

        <select
          value={activeSession}
          onChange={(e) => setActiveSession(e.target.value)}
          className="bg-gray-800 rounded-xl px-4 text-white cursor-pointer"
        >
          {sessions.map((session) => (
            <option key={session.slug} value={session.name}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      <ClassTabs
        classes={classTabs}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />

      {selectedClass === "All Subject" && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={openAddSubject}
            className="bg-sky-600 px-4 py-2 rounded-xl text-white cursor-pointer"
          >
            + Add New Subject
          </button>

          <button
            disabled={selectedSubjects.length === 0}
            onClick={() => setShowAssign(true)}
            className={`px-4 py-2 rounded-xl ${
              selectedSubjects.length === 0
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white cursor-pointer"
            }`}
          >
            Add Subject To Class
          </button>
        </div>
      )}

      {selectedClass === "All Subject" ? (
        <SubjectTable
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
          onEditSubject={openEditSubject}
        />
      ) : (
        <ClassSubjectTable
          subjects={subjects}
          board={activeBoard}
          session={activeSession}
          classTitle={selectedClass}
        />
      )}

      <AddSubjectModal
        isOpen={showAdd}
        onClose={() => {
          setShowAdd(false);
          setEditSubject(null);
        }}
        editSubject={editSubject}
        board={activeBoard}
      />

      <AddSubjectToClassModal
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
        board={activeBoard}
        session={activeSession}
        selectedSubjects={selectedSubjects}
        onSaved={() => {
          setSelectedSubjects([]);
        }}
      />
    </div>
  );
}
