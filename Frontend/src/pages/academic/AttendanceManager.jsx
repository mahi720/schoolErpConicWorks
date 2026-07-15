import React, { useState } from "react";
import { Calendar, Save, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LockAttendanceModal from "../../components/academics/LockAttendanceModal/LockAttendanceModal";

export default function AttendanceManager() {
  const [selectedClass, setSelectedClass] = useState("");
  const navigate = useNavigate();
  const [lockModal, setLockModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [bulkAttendance, setBulkAttendance] = useState("");

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === students.length) {
      setSelected([]);
      setBulkAttendance("");
    } else {
      setSelected(students.map((s) => s.id));
    }
  };

  const handleBulkAttendance = (value) => {
    setBulkAttendance(value);

    setStudents((prev) =>
      prev.map((student) =>
        selected.includes(student.id)
          ? {
              ...student,
              today: value,
            }
          : student,
      ),
    );
  };

  const [students, setStudents] = useState([
    {
      id: 1,
      roll: 26,
      adm: "040/21-22",
      name: "RUSHEKA H",
      stream: "NA",
      section: "A",
      total: 179,
      present: 156,
      avg: "87%",
    },
    {
      id: 2,
      roll: 46,
      adm: "040/21-22",
      name: "REEMA HAL",
      stream: "NA",
      section: "A",
      total: 179,
      present: 156,
      avg: "87%",
    },
    {
      id: 3,
      roll: 26,
      adm: "040/21-22",
      name: "Rekha HAO",
      stream: "NA",
      section: "A",
      total: 179,
      present: 156,
      avg: "87%",
    },
  ]);

  return (
    <div className="space-y-8">
      {/* header */}

      <div className="flex justify-between items-center gap-6">
        <h1 className="text-3xl font-bold text-white">Attendance Manager</h1>

        {/* <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 grid grid-cols-5 gap-4"> */}
        <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
          <option>Select Acd. Year</option>
          <option>2026-27</option>
          <option>2025-26</option>
          <option>2024-25</option>
        </select>

        <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
          <option>Select Board</option>
          <option>CBSE</option>
          <option>BSEB</option>
          <option>CGBSE</option>
        </select>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer"
        >
          <option value="">Select Class</option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 3">Class 3</option>
          <option value="Class 4">Class 4</option>
        </select>
        {/* </div> */}

        <div className="flex gap-3">
          <button
            className="px-5 py-3 rounded-xl bg-pink-500 cursor-pointer hover:bg-pink-600 text-white"
            onClick={() =>
              navigate("/academic/attendance/daily-attendance-report")
            }
          >
            Daily Report
          </button>

          <button
            className="px-5 py-3 rounded-xl bg-gray-800 cursor-pointer hover:bg-gray-700 text-white"
            onClick={() => navigate("/academic/attendance/attendance-report")}
          >
            View Report
          </button>
        </div>
      </div>

      {/* filters */}

      {selectedClass && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 grid grid-cols-5 gap-4">
          <input
            type="date"
            className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer"
          />

          <select
            value={bulkAttendance}
            disabled={selected.length === 0}
            onChange={(e) => handleBulkAttendance(e.target.value)}
            className={`bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer ${
              selected.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Mark Attendance</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Half Day">Half Day</option>
            <option value="Leave">Leave</option>
            <option value="Holiday">Holiday</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
            <option>Select Stream</option>
            <option>Science</option>
            <option>Arts</option>
            <option>History</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <button
            className="bg-indigo-600 rounded-xl text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-700"
            onClick={() => setLockModal(true)}
          >
            <Save size={18} />
            Save Attendance
          </button>
        </div>
      )}

      {/* table */}

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selected.length === students.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>

              {[
                "SN.",
                "Roll",
                "Adm No",
                "Student",
                "Stream",
                "Section",
                "Today",
                "Total",
                "Present",
                "Average",
              ].map((h) => (
                <th key={h} className="p-4 text-gray-300 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr className="border-t border-gray-800">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => toggleSelect(s.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>

                <td className="p-4 text-white">{i + 1}.</td>

                <td className="p-4 text-white">{s.roll}</td>

                <td className="p-4 text-white">{s.adm}</td>

                <td className="p-4 text-white">{s.name}</td>

                <td className="p-4 text-indigo-400">{s.stream}</td>

                <td className="p-4 text-gray-300">{s.section}</td>

                <td className="p-4 text-gray-300">
                  <select
                    value={s.today}
                    onChange={(e) => {
                      setStudents((prev) =>
                        prev.map((student) =>
                          student.id === s.id
                            ? {
                                ...student,
                                today: e.target.value,
                              }
                            : student,
                        ),
                      );
                    }}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer"
                  >
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Half Day</option>
                    <option>Leave</option>
                    <option>Holiday</option>
                  </select>
                </td>

                <td className="p-4 text-gray-300">{s.total}</td>

                <td className="p-4 text-gray-300">{s.present}</td>

                <td className="p-4 text-green-400">{s.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LockAttendanceModal open={lockModal} close={() => setLockModal(false)} />
    </div>
  );
}
