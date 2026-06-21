import React, { useState } from "react";
import { FileSpreadsheet, Pencil } from "lucide-react";
import AssignRollNumberModal from "../../components/academics/rollNumberManagar/GenerateRollNumbersModal";
import EditRollNumberModal from "../../components/academics/rollNumberManagar/EditRollNumberModal";

export default function RollNumberManager() {
  const [showRollNumberManager, setShowRollNumberManager] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: 1,
      name: "AARNA B N",
      stream: "NA",
      section: "A",
      selected: false,
    },
    {
      id: 15,
      rollNo: 3,
      name: "AARNA B N",
      stream: "NA",
      section: "A",
      selected: false,
    },
    {
      id: 2,
      rollNo: 2,
      name: "AARNA B N",
      stream: "NA",
      section: "A",
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

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Roll Number Manager</h1>

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
            <option>IV</option>
          </select>

          <button
            disabled={!hasSelectedStudents}
            onClick={() =>
              hasSelectedStudents && setShowRollNumberManager(true)
            }
            className={`px-6 py-3 rounded-xl text-white transition-all
            ${
              hasSelectedStudents
                ? "bg-indigo-600 cursor-pointer hover:bg-indigo-700"
                : "bg-gray-700 opacity-50 cursor-not-allowed pointer-events-none"
            }`}
          >
            Assign Roll Number
          </button>

          <button className="flex items-center gap-2 px-5 py-3 hover:bg-emerald-700 bg-emerald-500 rounded-xl text-white cursor-pointer">
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
                <th className="p-4 text-left">
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

                <th className="p-4 text-left text-gray-300">Stream</th>

                <th className="p-4 text-left text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>Section</span>

                    <select className="bg-gray-700 border cursor-pointer border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                      <option>Select Sections</option>

                      <option>A</option>

                      <option>B</option>

                      <option>C</option>
                    </select>
                  </div>
                </th>

                <th className="p-4 text-center text-gray-300">Action</th>
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

                  <td className="p-4 text-white">{index + 1}</td>

                  <td className="p-4 text-indigo-400 font-semibold">
                    {student.rollNo}
                  </td>

                  <td className="p-4 text-white font-medium">{student.name}</td>

                  <td className="p-4 text-indigo-400">{student.stream}</td>

                  <td className="p-4 text-pink-400">{student.section}</td>

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
