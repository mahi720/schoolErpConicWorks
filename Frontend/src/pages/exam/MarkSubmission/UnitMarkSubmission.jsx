import React, { useState } from "react";
import { FileText, Lock, Save } from "lucide-react";

export default function UnitMarkSubmission() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selected, setSelected] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  const [students, setStudents] = useState([
    {
      id: 1,
      roll: "1",
      section: "A",
      name: "AARNA B N",
      marks: 0,
    },
    {
      id: 2,
      roll: "2",
      section: "A",
      name: "RAHUL K",
      marks: 0,
    },
  ]);

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected(students.map((s) => s.id));
    } else {
      setSelected([]);
    }
  };

  const handleMarksChange = (id, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, marks: value } : student,
      ),
    );
  };

  const saveResult = () => {
    console.log("Saved Data:", students);

    alert("Result Saved Successfully");
  };

  const lockMarks = () => {
    setShowLockModal(true);
  };

  const confirmLockMarks = () => {
    setIsLocked(true);
    setShowLockModal(false);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">
          Periodic / Unit Test Mark Submission
        </h1>

        <div className="flex gap-3">
          <select className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-40 cursor-pointer">
            <option>Select Acad. Year</option>
            <option>2025-26</option>
            <option>2024-25</option>
            <option>2023-24</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-40 cursor-pointer">
            <option>Select Board</option>
            <samp></samp>
            <option>CBSE</option>
            <option>CGBSE</option>
            <option>BSEB</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-44 cursor-pointer">
            <option>Select Exam</option>
            <option>PERIODIC TEST 1</option>
            <option>TERM 1</option>
            <option>TERM 2</option>
            <option>TERM 3</option>
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white w-40 cursor-pointer"
          >
            <option value="">Select Class</option>
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
          </select>
        </div>
      </div>

      {/* show after class selected */}

      {!selectedClass ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10">
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <FileText size={55} className="text-gray-600 mb-4" />

            <h2 className="text-xl font-semibold text-white">
              Select Class To View Students
            </h2>

            <p className="text-gray-400 mt-2">
              Please select academic year, board, exam and class to load student
              marks list.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl text-white mb-4">All Students</h2>

              <div className="flex gap-4">
                <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-40 cursor-pointer">
                  <option>Select Subject</option>
                  <option>English (Theory)</option>
                  <option>Math</option>
                </select>

                <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-40 cursor-pointer">
                  <option>Select Section</option>
                  <option>A</option>
                  <option>B</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                disabled={isLocked}
                onClick={saveResult}
                className={`px-8 py-3 rounded-xl text-white flex gap-2 ${
                  isLocked
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 cursor-pointer"
                }`}
              >
                <Save size={18} className="mt-1" />
                Save Result
              </button>

              <button className="bg-red-500 px-5 py-3 rounded-xl cursor-pointer hover:bg-red-600 text-white flex gap-2">
                <FileText size={18} className="mt-1" />
                PDF
              </button>

              <button className="bg-yellow-500 px-5 py-3 rounded-xl cursor-pointer hover:bg-yellow-600 text-white">
                Teacher Wise
              </button>

              <button
                onClick={lockMarks}
                className="bg-gray-800 hover:bg-gray-700 cursor-pointer px-5 py-3 rounded-xl text-white flex gap-2"
              >
                <Lock size={18} />
                Lock Marks
              </button>
            </div>
          </div>

          {/* table */}

          <div className="overflow-auto custom-scrollbar">
            <table className="w-full min-w-[900px] table-fixed">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-4 w-16 text-center">
                    <input
                      type="checkbox"
                      checked={selected.length === students.length}
                      onChange={toggleAll}
                    />
                  </th>

                  <th className="p-4 text-left text-gray-300">SN.</th>

                  <th className="p-4 text-left text-gray-300">Roll No</th>

                  <th className="p-4 text-left text-gray-300">Section</th>

                  <th className="p-4 text-left text-gray-300">Student Name</th>

                  <th className="p-4 text-center text-gray-300">Marks</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s, index) => (
                  <tr key={s.id} className="border-t border-gray-800">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={() => toggleOne(s.id)}
                      />
                    </td>

                    <td className="p-4 text-gray-300">{index + 1}.</td>

                    <td className="p-4 text-gray-300">{s.roll}</td>

                    <td className="p-4 text-gray-300">{s.section}</td>

                    <td className="p-4 text-white">{s.name}</td>

                    <td className="p-4 text-center">
                      <input
                        value={s.marks}
                        disabled={isLocked}
                        onChange={(e) =>
                          handleMarksChange(s.id, e.target.value)
                        }
                        className={`border rounded-lg px-4 py-2 text-white w-28 text-center
                        ${isLocked ? "bg-gray-700 cursor-not-allowed" : "bg-gray-800 border-gray-700"}
                        `}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[420px] shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500/20 p-4 rounded-full">
                <Lock size={40} className="text-yellow-500" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white text-center">
              Lock Marks?
            </h2>

            <p className="text-gray-400 text-center mt-3">
              Are you sure you want to lock marks? After locking, marks cannot
              be edited again.
            </p>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowLockModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmLockMarks}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl cursor-pointer"
              >
                Yes, Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
