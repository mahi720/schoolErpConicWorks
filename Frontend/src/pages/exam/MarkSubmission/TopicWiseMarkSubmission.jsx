import React, { useState } from "react";
import { FileText, Lock, Save } from "lucide-react";

export default function TopicWiseMarkSubmission() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selected, setSelected] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  const [topics, setTopics] = useState([
    {
      key: "food",
      title:
        "Shows a liking for understanding of nutritious food and does not waste food.",
      sub: "Curriculum Goal-1 Healthy habits & safe",
    },
    {
      key: "hygiene",
      title: "Practices basic self-care and hygiene",
      sub: "Curriculum Goal-1 Healthy habits & safe",
    },
    {
      key: "safety",
      title: "Understand unsafe situations and ask for help",
      sub: "Curriculum Goal-1 Healthy habits & safe",
    },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      admission: "527/16-17",
      roll: "4",
      section: "A",
      name: "C V SOHAN",
      marks: {
        food: 5,
        hygiene: 4,
        safety: 5,
      },
    },

    {
      id: 2,
      admission: "485/16-17",
      roll: "28",
      section: "A",
      name: "S SHRINESH",
      marks: {
        food: 4,
        hygiene: 3,
        safety: 5,
      },
    },
  ]);

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected(students.map((s) => s.id));
    } else {
      setSelected([]);
    }
  };

  const handleMarksChange = (id, key, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              marks: {
                ...student.marks,
                [key]: value,
              },
            }
          : student,
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
        <h1 className="text-2xl font-semibold text-white">
          Topic Wise Mark Submission
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
            <table className="w-full min-w-[1300px]">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 text-center w-12">
                    <input
                      type="checkbox"
                      checked={selected.length === students.length}
                      onChange={toggleAll}
                    />
                  </th>

                  <th className="p-3 text-left text-gray-300">Admission No</th>

                  <th className="p-3 text-left text-gray-300">Roll No</th>

                  <th className="p-3 text-left text-gray-300">Section</th>

                  <th className="p-3 text-left text-gray-300">Student Name</th>

                  {topics.map((topic) => (
                    <th
                      key={topic.key}
                      className="p-3 text-left text-gray-300 min-w-[160px]"
                    >
                      <div>{topic.title}</div>

                      <div className="text-blue-400 mt-2">{topic.sub}</div>
                    </th>
                  ))}

                  {topics.length > 0 && (
                    <th className="p-3 text-center text-gray-300">
                      Total Marks
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {students.map((s) => {
                  let total = Object.values(s.marks).reduce(
                    (a, b) => Number(a) + Number(b),
                    0,
                  );

                  return (
                    <tr key={s.id} className="border-t border-gray-800">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(s.id)}
                          onChange={() => toggleOne(s.id)}
                        />
                      </td>

                      <td className="p-3 text-gray-300">{s.admission}</td>

                      <td className="p-3 text-gray-300">{s.roll}</td>

                      <td className="p-3 text-gray-300">{s.section}</td>

                      <td className="p-3 text-white">{s.name}</td>

                      {topics.map((topic) => (
                        <td key={topic.key} className="p-2 text-center">
                          <input
                            value={s.marks[topic.key] || ""}
                            disabled={isLocked}
                            onChange={(e) =>
                              handleMarksChange(s.id, topic.key, e.target.value)
                            }
                            className={`w-40 bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-white text-center ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
                          />
                        </td>
                      ))}

                      {topics.length > 0 && (
                        <td className="p-3 text-blue-400 text-center font-semibold">
                          {total}
                        </td>
                      )}
                    </tr>
                  );
                })}
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
