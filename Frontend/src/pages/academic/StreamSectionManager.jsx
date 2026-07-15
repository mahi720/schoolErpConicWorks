import React, { useState } from "react";
import { FileSpreadsheet, Pencil } from "lucide-react";
import AssignStreamModal from "../../components/academics/stream&SectionManager/AssignStreamModal";
import AssignSectionModal from "../../components/academics/stream&SectionManager/AssignSectionModal";
import AssignRollNumberModal from "../../components/academics/rollNumberManagar/GenerateRollNumbersModal";
import EditRollNumberModal from "../../components/academics/rollNumberManagar/EditRollNumberModal";

export default function StreamSectionManager() {
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showRollNumberManager, setShowRollNumberManager] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingRollId, setEditingRollId] = useState(null);
  const [editingRollValue, setEditingRollValue] = useState("");

  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: 18,
      name: "PARTHA N",
      className: "Bal Vatika 3",
      stream: "NA",
      section: "B",
      selected: false,
    },
    {
      id: 2,
      rollNo: 19,
      name: "PAVANI B",
      className: "Bal Vatika 3",
      stream: "NA",
      section: "B",
      selected: false,
    },
    {
      id: 3,
      rollNo: 21,
      name: "PRANAVI",
      className: "Bal Vatika 3",
      stream: "NA",
      section: "A",
      selected: false,
    },
    {
      id: 4,
      rollNo: 29,
      name: "VAIESHNAVI C",
      className: "Bal Vatika 3",
      stream: "NA",
      section: "B",
      selected: false,
    },
  ]);

  const hasSelectedStudents = students.some((student) => student.selected);

  const handleSelect = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              selected: !student.selected,
            }
          : student,
      ),
    );
  };

  const handleRollNumberUpdate = (id, newRollNumber) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              rollNo: newRollNumber,
            }
          : student,
      ),
    );
  };

  const handleSelectAll = () => {
    const allSelected = students.every((item) => item.selected);

    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        selected: !allSelected,
      })),
    );
  };

  const startEditingRoll = (student) => {
    setEditingRollId(student.id);
    setEditingRollValue(student.rollNo);
  };

  const saveEditingRoll = () => {
    if (editingRollId === null) return;

    setStudents((prev) =>
      prev.map((student) =>
        student.id === editingRollId
          ? {
              ...student,
              rollNo: Number(editingRollValue),
            }
          : student,
      ),
    );

    setEditingRollId(null);
    setEditingRollValue("");
  };

  const cancelEditingRoll = () => {
    setEditingRollId(null);
    setEditingRollValue("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">
          Stream & Section Manager
        </h1>

        <div className="flex flex-wrap gap-4">
          <select className="w-40 bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Acad. Year</option>
            <option>2025-26</option>
            <option>2026-27</option>
          </select>

          <select className="w-40 bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Board</option>
            <option>CBSE</option>
            <option>BSEB</option>
          </select>

          <select className="w-40 bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Class</option>
            <option>I</option>
            <option>II</option>
            <option>III</option>
          </select>

          {/* <select className="w-40 bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select> */}

          <button
            disabled={!hasSelectedStudents}
            onClick={() => hasSelectedStudents && setShowStreamModal(true)}
            className={`px-6 py-3 rounded-xl text-white transition-all
            ${
              hasSelectedStudents
                ? "bg-indigo-600 cursor-pointer hover:bg-indigo-700"
                : "bg-gray-700 opacity-50 cursor-not-allowed pointer-events-none"
            }`}
          >
            Assign Stream
          </button>

          <button
            disabled={!hasSelectedStudents}
            onClick={() => hasSelectedStudents && setShowSectionModal(true)}
            className={`px-6 py-3 rounded-xl text-white transition-all
                ${
                  hasSelectedStudents
                    ? "bg-pink-500 cursor-pointer hover:bg-pink-600"
                    : "bg-gray-700 opacity-50 cursor-not-allowed pointer-events-none"
                }`}
          >
            Assign Section
          </button>

          <button
            disabled={!hasSelectedStudents}
            onClick={() =>
              hasSelectedStudents && setShowRollNumberManager(true)
            }
            className={`px-6 py-3 rounded-xl text-white transition-all
            ${
              hasSelectedStudents
                ? "bg-cyan-600 cursor-pointer hover:bg-cyan-700"
                : "bg-gray-700 opacity-50 cursor-not-allowed pointer-events-none"
            }`}
          >
            Assign Roll Number
          </button>

          <button className="flex items-center gap-2 px-5 py-3 bg-emerald-500 rounded-xl text-white cursor-pointer">
            <FileSpreadsheet size={18} />
            Export To Excel
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-left text-gray-300">
                  <input
                    type="checkbox"
                    checked={students.every((item) => item.selected)}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>

                <th className="p-4 text-left text-gray-300">SN.</th>

                <th className="p-4 text-left text-gray-300">Roll Number</th>

                <th className="p-4 text-left text-gray-300">Student Name</th>

                <th className="p-4 text-left text-gray-300">Class</th>

                <th className="p-4 text-left text-gray-300">Stream</th>

                <th className="p-4 text-left text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>Section</span>

                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                      <option>Select Sections</option>
                      <option>All Sections</option>
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>
                </th>

                <th className="p-4 text-left text-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-800 hover:bg-gray-800/30"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={student.selected}
                      onChange={() => handleSelect(student.id)}
                      className="w-4 h-4"
                    />
                  </td>

                  <td className="p-4 text-white">{index + 1}.</td>

                  <td
                    className="p-4 text-indigo-400 font-medium cursor-pointer"
                    onDoubleClick={() => startEditingRoll(student)}
                  >
                    {editingRollId === student.id ? (
                      <input
                        autoFocus
                        type="number"
                        value={editingRollValue}
                        onChange={(e) => setEditingRollValue(e.target.value)}
                        onBlur={saveEditingRoll}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEditingRoll();
                          }

                          if (e.key === "Escape") {
                            cancelEditingRoll();
                          }
                        }}
                        className="w-20 bg-gray-800 border border-indigo-500 rounded px-2 py-1 text-white outline-none"
                      />
                    ) : (
                      student.rollNo
                    )}
                  </td>

                  <td className="p-4 text-white font-medium">{student.name}</td>

                  <td className="p-4 text-white">{student.className}</td>

                  <td className="p-4 text-indigo-400">{student.stream}</td>

                  <td className="p-4 text-pink-400 font-medium">
                    {student.section}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowEditModal(true);
                        }}
                        className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                        title="Edit Roll Number"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AssignStreamModal
        isOpen={showStreamModal}
        onClose={() => setShowStreamModal(false)}
      />

      <AssignSectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
      />

      <AssignRollNumberModal
        isOpen={showRollNumberManager}
        onClose={() => setShowRollNumberManager(false)}
      />

      <EditRollNumberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={selectedStudent}
        onSave={handleRollNumberUpdate}
      />
    </div>
  );
}
