import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { boards, classes, years } from "../../data/subjectData";
import BoardTabs from "../../components/subjects/BoardTabs";
import ClassTabs from "../../components/subjects/ClassTabs";
import SubjectTable from "../../components/subjects/SubjectTable";
import AddSubjectModal from "../../components/subjects/AddSubjectModal";
import AddSubjectToClassModal from "../../components/subjects/AddSubjectToClassModal";
import ClassSubjectTable from "../../components/subjects/ClassSubjectTable";

export default function Subjects() {
  const { selectedClass, selectedYear, setSelectedYear } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <BoardTabs boards={boards} />

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-800 rounded-xl px-4 text-white cursor-pointer"
        >
          {years.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </div>

      <ClassTabs classes={classes} />

      {selectedClass === "All Subject" && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-sky-600 px-4 py-2 rounded-xl text-white cursor-pointer"
          >
            + Add New Subject
          </button>

          <button
            disabled={selectedSubjects.length === 0}
            onClick={() => setShowAssign(true)}
            className={`px-4 py-2 rounded-xl

          ${
            selectedSubjects.length === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white cursor-pointer"
          }
            `}
          >
            Add Subject To Class
          </button>
        </div>
      )}

      {selectedClass === "All Subject" ? (
        <SubjectTable
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
        />
      ) : (
        <ClassSubjectTable />
      )}

      <AddSubjectModal isOpen={showAdd} onClose={() => setShowAdd(false)} />

      <AddSubjectToClassModal
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
      />
    </div>
  );
}
