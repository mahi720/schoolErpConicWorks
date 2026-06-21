import React, { useState } from "react";
import { Edit, FileText, Lock, Save } from "lucide-react";
import { Eye, Pencil } from "lucide-react";

export default function CoScholasticMarkSubmission() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selected, setSelected] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  const [topics, setTopics] = useState([
    { key: "physical", title: "PHYSICAL DEVELOPMENT" },
    { key: "socio", title: "SOCIO-EMOTIONAL & ETHICAL DEVELOPMENT" },
    { key: "cognitive", title: "COGNITIVE DEVELOPMENT" },
    { key: "language", title: "LANGUAGE & LITERACY DEVELOPMENT" },
    { key: "positive", title: "POSITIVE LEARNING HABITS" },
    { key: "aesthetic", title: "AESTHETIC & CULTURAL DEVELOPMENT" },
    { key: "self", title: "SELF ASSESSMENT" },
    { key: "peer", title: "PEER ASSESSMENT" },
    { key: "work", title: "Work Education or Pre-Vocational Education" },
    { key: "health", title: "Health & Physical Education" },
    { key: "art", title: "Art Education" },
    { key: "music", title: "Music" },
    { key: "dance", title: "Dance" },
    { key: "creativity", title: "Creativity" },
    { key: "discipline", title: "Discipline" },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      roll: "4",
      section: "A",
      name: "C V SOHAN",
      present: 220,
      totalDays: 240,
      result: "PASS",
      marks: {
        physical: "A",
        socio: "A",
        cognitive: "B",
        language: "A",
        positive: "A",
        aesthetic: "B",
        self: "A",
        peer: "A",
        work: "A",
        health: "A",
        art: "B",
        music: "A",
        dance: "A",
        creativity: "A",
        discipline: "A",
      },
      remark: {},
    },
    {
      id: 2,
      roll: "45",
      section: "B",
      name: "B H Rohan",
      present: 220,
      totalDays: 240,
      result: "PASS",
      remark: {},
      marks: {
        physical: "A",
        socio: "A",
        cognitive: "B",
        language: "A",
        positive: "A",
        aesthetic: "B",
        self: "A",
        peer: "A",
        work: "A",
        health: "A",
        art: "B",
        music: "A",
        dance: "A",
        creativity: "A",
        discipline: "A",
      },
    },
  ]);

  const [remarkModal, setRemarkModal] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  const [remarkData, setRemarkData] = useState({
    type: "",
    remark: "",
  });

  //   const [students, setStudents] = useState([
  //     {
  //       id: 1,
  //       admission: "527/16-17",
  //       roll: "4",
  //       section: "A",
  //       name: "C V SOHAN",
  //       marks: {
  //         food: 5,
  //         hygiene: 4,
  //         safety: 5,
  //       },
  //     },

  //     {
  //       id: 2,
  //       admission: "485/16-17",
  //       roll: "28",
  //       section: "A",
  //       name: "S SHRINESH",
  //       marks: {
  //         food: 4,
  //         hygiene: 3,
  //         safety: 5,
  //       },
  //     },
  //   ]);

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected(students.map((s) => s.id));
    } else {
      setSelected([]);
    }
  };

  const openRemark = (student, mode) => {
    setActiveStudent(student);

    setViewMode(mode === "view");

    setRemarkData(
      student.remark || {
        type: "",
        remark: "",
      },
    );

    setRemarkModal(true);
  };

  const saveRemark = () => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              remark: remarkData,
            }
          : s,
      ),
    );

    setRemarkModal(false);
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
        <h1 className="text-xl font-semibold text-white">
          Co-Scholastic/Personality Traits & Remark
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
                {/* <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-40 cursor-pointer">
                  <option>Select Subject</option>
                  <option>English (Theory)</option>
                  <option>Math</option>
                </select> */}

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
            <table className="w-full min-w-[1800px]">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selected.length === students.length}
                      onChange={toggleAll}
                    />
                  </th>

                  <th className="p-3 text-left text-gray-300">SN.</th>

                  <th className="p-3 text-left text-gray-300">Roll No.</th>

                  <th className="p-3 text-left text-gray-300">Section</th>

                  <th className="p-3 text-left text-gray-300">Student Name</th>

                  {topics.map((item) => (
                    <th
                      key={item.key}
                      className="p-3 text-left text-gray-300 min-w-[130px] align-bottom"
                    >
                      {item.title}
                    </th>
                  ))}

                  <th className="p-3 text-center text-gray-300">Remark</th>

                  <th className="p-3 text-center text-gray-300">
                    Present Days
                  </th>

                  <th className="p-3 text-center text-gray-300">Total Days</th>

                  <th className="p-3 text-center text-gray-300">Result</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t border-gray-800">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={() => toggleOne(s.id)}
                      />
                    </td>

                    <td className="p-3 text-gray-300">{s.id}.</td>

                    <td className="p-3 text-gray-300">{s.roll}</td>

                    <td className="p-3 text-gray-300">{s.section}</td>

                    <td className="p-3 text-white">{s.name}</td>

                    {topics.map((item) => (
                      <td key={item.key} className="p-2">
                        <input
                          value={s.marks[item.key]}
                          disabled={isLocked}
                          onChange={(e) =>
                            handleMarksChange(s.id, item.key, e.target.value)
                          }
                          className={`w-20 bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-white text-center ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
                        />
                      </td>
                    ))}

                    <td className="p-2 text-center">
                      {s.remark?.remark ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openRemark(s, "view")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => openRemark(s, "edit")}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openRemark(s, "edit")}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </td>

                    <td className="p-2 text-center text-gray-300">
                      {s.present}
                    </td>

                    <td className="p-2 text-center text-gray-300">
                      {s.totalDays}
                    </td>

                    <td className="p-2 text-green-400 font-semibold">
                      {s.result}
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

      {remarkModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[450px]">
            <h2 className="text-xl font-semibold text-white mb-5">
              {viewMode ? "View Remark" : "Add Remark"}
            </h2>

            {viewMode ? (
              <div className="space-y-4">
                <p className="text-gray-300">Type : {remarkData.type}</p>

                <p className="text-gray-300">Remark : {remarkData.remark}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <select
                  value={remarkData.type}
                  onChange={(e) =>
                    setRemarkData({ ...remarkData, type: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white"
                >
                  <option value="">Select Remark</option>

                  <option>Excellent</option>

                  <option>Good</option>

                  <option>Need Improvement</option>
                </select>

                <textarea
                  value={remarkData.remark}
                  onChange={(e) =>
                    setRemarkData({ ...remarkData, remark: e.target.value })
                  }
                  placeholder="Enter Remark"
                  className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white resize-none"
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRemarkModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg cursor-pointer"
              >
                Close
              </button>

              {!viewMode && (
                <button
                  onClick={saveRemark}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg cursor-pointer"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
